import "./styles.css";

import PartySocket from "partysocket";

declare const PARTYKIT_HOST: string;

let pingInterval: ReturnType<typeof setInterval>;

// Let's append all the messages we get into this DOM element
const output = document.getElementById("app") as HTMLDivElement;

// Helper function to add a new line to the DOM
function add(text: string) {
  output.appendChild(document.createTextNode(text));
  output.appendChild(document.createElement("br"));
}

// A PartySocket is like a WebSocket, except it's a bit more magical.
// It handles reconnection logic, buffering messages while it's offline, and more.
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get("sessionId") || "default-session";
const conn = new PartySocket({
  host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
  room: `therapy-session-${sessionId}`,
});

let isTherapist = false; // We'll set this based on the user's role

let peerConnection: RTCPeerConnection | null = null;
let localStream: MediaStream | null = null;

async function startSession(sessionId: string) {
  conn.send(JSON.stringify({ type: "start_session", sessionId }));
}

async function acceptSession(sessionId: string) {
  conn.send(JSON.stringify({ type: "accept_session", sessionId }));
  await initializeVideoCall(sessionId);
}

async function initializeVideoCall(sessionId: string) {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  const localVideoElement = document.getElementById(
    "localVideo"
  ) as HTMLVideoElement;
  localVideoElement.srcObject = localStream;

  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  localStream.getTracks().forEach((track) => {
    peerConnection!.addTrack(track, localStream!);
  });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      conn.send(
        JSON.stringify({
          type: "new_ice_candidate",
          candidate: event.candidate,
          sessionId,
        })
      );
    }
  };

  peerConnection.ontrack = (event) => {
    const remoteVideoElement = document.getElementById(
      "remoteVideo"
    ) as HTMLVideoElement;
    if (remoteVideoElement.srcObject !== event.streams[0]) {
      remoteVideoElement.srcObject = event.streams[0];
    }
  };

  conn.send(JSON.stringify({ type: "ready_for_call", sessionId, isTherapist }));
}

async function createOffer(sessionId: string) {
  const offer = await peerConnection!.createOffer();
  await peerConnection!.setLocalDescription(offer);
  conn.send(
    JSON.stringify({
      type: "video_offer",
      offer: offer,
      sessionId: sessionId,
    })
  );
}

conn.addEventListener("message", async (event) => {
  const data = JSON.parse(event.data);
  console.log("Received message:", data);
  switch (data.type) {
    case "set_role":
      isTherapist = data.isTherapist;
      console.log(`Role set: ${isTherapist ? "Therapist" : "User"}`);
      break;
    case "session_request":
      if (isTherapist) {
        console.log("Received session request");
        const accept = confirm("User wants to start a session. Do you accept?");
        if (accept) {
          await acceptSession(data.sessionId);
        }
      }
      break;
    case "session_started":
      console.log("Session started");
      add("Session started! Initializing video call...");
      await initializeVideoCall(data.sessionId);
      break;
    case "session_accepted":
      console.log("Session accepted");
      add("Session accepted! Initializing video call...");
      await initializeVideoCall(data.sessionId);
      updateUIForVideoCall();
      break;
    case "ready_for_call":
      console.log("Ready for call");
      if (isTherapist && data.isTherapist === false) {
        await createOffer(data.sessionId);
      }
      break;
    case "video_offer":
      console.log("Received video offer");
      await handleVideoOffer(data);
      break;
    case "video_answer":
      console.log("Received video answer");
      await handleVideoAnswer(data);
      break;
    case "new_ice_candidate":
      console.log("Received new ICE candidate");
      await handleNewICECandidate(data);
      break;
    case "session_ended":
      console.log("Session ended");
      add("Session ended.");
      endVideoCall();
      break;
    default:
      console.log("Unknown message type:", data.type);
  }
});

async function handleVideoOffer(data: any) {
  if (!peerConnection) {
    await initializeVideoCall(data.sessionId);
  }
  await peerConnection!.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );
  const answer = await peerConnection!.createAnswer();
  await peerConnection!.setLocalDescription(answer);
  conn.send(
    JSON.stringify({
      type: "video_answer",
      answer: answer,
      sessionId: data.sessionId,
    })
  );
}

async function handleVideoAnswer(data: any) {
  await peerConnection!.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );
}

async function handleNewICECandidate(data: any) {
  if (peerConnection) {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (e) {
      console.error("Error adding received ice candidate", e);
    }
  }
}

function endVideoCall() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
  const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
  const remoteVideo = document.getElementById(
    "remoteVideo"
  ) as HTMLVideoElement;
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
}

// Example button to start the session
const startSessionButton = document.getElementById("start-session-button");
if (startSessionButton) {
  startSessionButton.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("sessionId");
    if (sessionId) {
      startSession(sessionId);
    } else {
      console.error("No sessionId found in URL");
    }
  });
}

// You can even start sending messages before the connection is open!
conn.addEventListener("message", (event) => {
  add(`Received -> ${event.data}`);
});

// Add this to the therapist's client code
conn.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "session_request") {
    const accept = confirm("User wants to start a session. Do you accept?");
    if (accept) {
      acceptSession(data.sessionId);
    }
  }
});

// Let's listen for when the connection opens
// And send a ping every 2 seconds right after
conn.addEventListener("open", () => {
  add("Connected!");
  add("Sending a ping every 2 seconds...");
  // TODO: make this more interesting / nice
  clearInterval(pingInterval);
  pingInterval = setInterval(() => {
    conn.send("ping");
  }, 1000);
});

conn.addEventListener("open", () => {
  console.log("Connected to PartyKit server");
});

conn.addEventListener("error", (error) => {
  console.error("PartyKit connection error:", error);
});

conn.addEventListener("close", (event) => {
  console.log("PartyKit connection closed:", event);
});

function updateUIForVideoCall() {
  const waitingMessage = document.getElementById("waiting-message");
  const videoCallContainer = document.getElementById("video-call-container");
  if (waitingMessage) waitingMessage.style.display = "none";
  if (videoCallContainer) videoCallContainer.style.display = "block";
  add("Video call interface ready. Connecting...");
}

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import PartySocket from "partysocket";
import styles from "./Session.module.css";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
}

export default function TherapySession() {
  const router = useRouter();
  const { sessionId, isTherapist } = router.query;
  const [status, setStatus] = useState("Waiting for session to start...");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [sessionStatus, setSessionStatus] = useState("waiting");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [userName, setUserName] = useState("User");
  const [therapistName, setTherapistName] = useState("Therapist");
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const partySocket = useRef<PartySocket | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const isTherapistRef = useRef(isTherapist === "true");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionId) {
      console.log(
        `Initializing session. IsTherapist: ${isTherapist}, SessionId: ${sessionId}`
      );
      const connectSocket = () => {
        partySocket.current = new PartySocket({
          host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
          room: `therapy-session-${sessionId}`,
        });

        partySocket.current.addEventListener("open", () => {
          console.log("PartySocket connection opened");
          const joinMessage = {
            type: "join_session",
            sessionId,
            role: isTherapist === "true" ? "therapist" : "user",
            name: isTherapist === "true" ? therapistName : userName,
          };
          console.log("Sending join message:", joinMessage);
          partySocket.current?.send(JSON.stringify(joinMessage));
        });

        partySocket.current.addEventListener("message", handleMessage);
        partySocket.current.addEventListener("close", () => {
          console.log(
            "PartySocket connection closed. Attempting to reconnect..."
          );
          setTimeout(connectSocket, 3000);
        });
      };

      connectSocket();

      return () => {
        console.log("Cleaning up TherapySession component");
        if (partySocket.current) {
          partySocket.current.removeEventListener("message", handleMessage);
          partySocket.current.close();
        }
        endVideoCall();
      };
    }
  }, [sessionId, isTherapist, therapistName, userName]);

  const handleMessage = async (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log("Received message:", data);
    switch (data.type) {
      case "participant_joined":
        console.log(`Participant joined: ${data.role} - ${data.name}`);
        if (data.role === "user") {
          setUserName(data.name);
          if (isTherapist === "true") {
            setStatus(
              `User ${data.name} has joined. Waiting to start session...`
            );
          }
        }
        if (data.role === "therapist") {
          setTherapistName(data.name);
          if (isTherapist === "false") {
            setStatus(
              `Therapist ${data.name} has joined. Waiting to start session...`
            );
          }
        }
        break;
      case "current_participants":
        console.log("Current participants:", data.participants);
        updateParticipants(data.participants);
        break;
      case "session_started":
        console.log("Session started, initializing video call");
        setSessionStatus("started");
        setStatus("Session has started. Initializing video call...");
        initializeVideoCall();
        break;
      case "ready_for_call":
        if (isTherapist === "true" && peerConnection.current) {
          console.log("Creating offer as therapist");
          await createOffer();
        }
        break;
      case "video_offer":
        console.log("Received video offer");
        await handleVideoOffer(data.offer);
        break;
      case "video_answer":
        console.log("Received video answer");
        await handleVideoAnswer(data.answer);
        break;
      case "new_ice_candidate":
        console.log("Received new ICE candidate");
        await handleNewICECandidate(data.candidate);
        break;
      case "chat":
        handleChatMessage(data);
        break;
      case "connected":
        console.log("Connected to therapy session room");
        break;
      case "session_ended":
        handleSessionEnded();
        break;
      case "session_accepted":
        console.log("Session accepted by therapist");
        setStatus("Session accepted! Initializing video call...");
        setSessionStatus("started");
        initializeVideoCall();
        break;
      case "session_rejected":
        console.log("Session rejected by therapist");
        setStatus("Session request was rejected by the therapist.");
        setTimeout(() => {
          router.push("/Talknow");
        }, 3000);
        break;
      default:
        console.log("Unknown message type:", data.type);
    }
  };

  const updateParticipants = (participants: any[]) => {
    console.log("Updating participants:", participants);
    const isUserPresent = participants.some((p) => p.role === "user");
    const isTherapistPresent = participants.some((p) => p.role === "therapist");

    if (isUserPresent && isTherapistPresent) {
      console.log("Both participants present, waiting for session to start");
      setStatus(
        "Both participants have joined. Waiting for session to start..."
      );
      // Trigger session start
      sendMessage({
        type: "start_session",
        sessionId: sessionId as string,
      });
    } else if (isUserPresent && isTherapist === "true") {
      setStatus("User has joined. Waiting to start session...");
    } else if (isTherapistPresent && isTherapist === "false") {
      setStatus("Therapist has joined. Waiting to start session...");
    }
  };

  const initializeLocalStream = async () => {
    try {
      console.log("Initializing local stream");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("Local stream obtained:", stream);
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("Local video element updated");
      } else {
        console.error("Local video ref is null");
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const initializeVideoCall = async () => {
    console.log("Initializing video call");
    try {
      await initializeLocalStream();

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerConnection.current.onicecandidate = handleICECandidate;
      peerConnection.current.ontrack = handleTrack;
      peerConnection.current.oniceconnectionstatechange = () => {
        console.log(
          "ICE connection state:",
          peerConnection.current?.iceConnectionState
        );
      };

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peerConnection.current?.addTrack(track, localStream);
        });
      }

      if (isTherapist === "true") {
        console.log("Creating offer as therapist");
        await createOffer();
      } else {
        console.log("Sending ready_for_call as user");
        sendMessage({
          type: "ready_for_call",
          sessionId: sessionId as string,
          isTherapist: false,
        });
      }
    } catch (error) {
      console.error("Error initializing video call:", error);
    }
  };

  const handleICECandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      console.log("New ICE candidate:", event.candidate);
      sendMessage({
        type: "new_ice_candidate",
        candidate: event.candidate,
        sessionId: sessionId as string,
      });
    }
  };

  const handleTrack = (event: RTCTrackEvent) => {
    console.log("Received remote track", event.streams[0]);
    setRemoteStream(event.streams[0]);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0];
      console.log("Remote video source set");
    } else {
      console.error("Remote video ref is null");
    }
  };

  const createOffer = async () => {
    if (peerConnection.current) {
      try {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        sendMessage({
          type: "video_offer",
          offer: offer,
          sessionId: sessionId as string,
        });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    }
  };

  const handleVideoOffer = async (offer: RTCSessionDescriptionInit) => {
    if (peerConnection.current) {
      try {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        sendMessage({
          type: "video_answer",
          answer: answer,
          sessionId: sessionId as string,
        });
      } catch (error) {
        console.error("Error handling video offer:", error);
      }
    }
  };

  const handleVideoAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (peerConnection.current) {
      try {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.error("Error handling video answer:", error);
      }
    }
  };

  const handleNewICECandidate = async (candidate: RTCIceCandidateInit) => {
    if (peerConnection.current && peerConnection.current.remoteDescription) {
      try {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (error) {
        console.error("Error adding received ice candidate:", error);
      }
    } else {
      console.log(
        "Received ICE candidate before remote description, storing for later"
      );
      // Store the candidate to add later when the remote description is set
    }
  };

  const sendMessage = (message: any) => {
    if (partySocket.current) {
      partySocket.current.send(JSON.stringify(message));
    }
  };

  const endVideoCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setRemoteStream(null);
  };

  const handleEndCall = () => {
    endVideoCall();
    partySocket.current?.send(
      JSON.stringify({
        type: "end_session",
        sessionId: sessionId,
      })
    );
    router.push("/Talknow");
  };

  const handleSessionEnded = () => {
    endVideoCall();
    setStatus("Session ended by the other participant.");
    setTimeout(() => {
      router.push("/Talknow");
    }, 3000); // Redirect after 3 seconds
  };

  const handleChatMessage = (data: { sender: string; message: string }) => {
    const newMessage: ChatMessage = {
      sender: data.sender,
      message: data.message,
      timestamp: Date.now(),
    };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const sendChatMessage = () => {
    if (chatInput.trim() && partySocket.current) {
      partySocket.current.send(
        JSON.stringify({
          type: "chat",
          message: chatInput.trim(),
          sender: isTherapist === "true" ? therapistName : userName,
        })
      );
      setChatInput("");
    }
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const startSession = () => {
    console.log("Starting session");
    sendMessage({
      type: "start_session",
      sessionId: sessionId as string,
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Therapy Session</h1>
        <p>{status}</p>
      </header>

      <main className={styles.main}>
        <div className={styles.videoContainer}>
          <div className={styles.localVideo}>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={styles.video}
            />
          </div>
          <div className={styles.remoteVideo}>
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={styles.video}
              />
            ) : (
              <div className={styles.waitingMessage}>
                {sessionStatus === "started"
                  ? "Connecting..."
                  : "Waiting for the other participant..."}
              </div>
            )}
          </div>
        </div>

        <div className={styles.chatContainer}>
          <div className={styles.chatMessages} ref={chatMessagesRef}>
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.chatMessage} ${
                  msg.sender ===
                  (isTherapist === "true" ? therapistName : userName)
                    ? styles.chatMessageSelf
                    : styles.chatMessageOther
                }`}
              >
                <strong>{msg.sender}: </strong>
                {msg.message}
              </div>
            ))}
          </div>
          <div className={styles.chatInput}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
              placeholder="Type a message..."
              className={styles.chatInputField}
            />
            <button onClick={sendChatMessage} className={styles.chatSendButton}>
              Send
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <button className={styles.endCallButton} onClick={handleEndCall}>
          End Call
        </button>
      </footer>
    </div>
  );
}

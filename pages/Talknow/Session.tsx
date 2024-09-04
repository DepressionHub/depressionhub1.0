import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import PartySocket from "partysocket";
import axios from "axios";
import { getSession } from "next-auth/react"; // Add this import

// Add this type definition at the top of your file
type TherapySessionRequest = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  // Add other properties as needed
};

const Session = () => {
  const router = useRouter();
  const { therapistId, sessionId } = router.query;
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<PartySocket | null>(null);
  const [sessionRequest, setSessionRequest] =
    useState<TherapySessionRequest | null>(null);

  useEffect(() => {
    if (therapistId && sessionId) {
      checkSessionStatus();
    }
  }, [therapistId, sessionId]);

  const checkSessionStatus = async () => {
    try {
      const session = await getSession();
      const response = await axios.get<TherapySessionRequest>(
        `/api/therapy-session-requests/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (response.data.status === "ACCEPTED") {
        startSession();
      } else if (response.data.status === "REJECTED") {
        alert("The therapist has rejected the session request.");
        router.push("/Talknow");
      } else {
        // If still pending, check again after a delay
        setTimeout(checkSessionStatus, 5000);
      }
    } catch (error) {
      console.error("Error checking session status:", error);
    }
  };

  const startSession = async () => {
    try {
      await setupMediaStream();
      await setupWebRTC();
      setSessionStarted(true);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const setupMediaStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const setupWebRTC = () => {
    peerConnectionRef.current = new RTCPeerConnection();

    if (stream) {
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, stream);
      });
    }

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.send(
          JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
        );
      }
    };
  };

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case "offer":
        handleOffer(data.offer);
        break;
      case "answer":
        handleAnswer(data.answer);
        break;
      case "ice-candidate":
        handleIceCandidate(data.candidate);
        break;
      case "chat":
        setMessages((prev) => [...prev, `${data.sender}: ${data.message}`]);
        break;
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    await peerConnectionRef.current?.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnectionRef.current?.createAnswer();
    await peerConnectionRef.current?.setLocalDescription(answer);
    socket.current?.send(JSON.stringify({ type: "answer", answer }));
  };

  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    peerConnectionRef.current?.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleIceCandidate = (candidate: RTCIceCandidateInit) => {
    peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const startCall = async () => {
    const offer = await peerConnectionRef.current?.createOffer();
    await peerConnectionRef.current?.setLocalDescription(offer);
    socket.current?.send(JSON.stringify({ type: "offer", offer }));
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.current?.send(JSON.stringify({ type: "chat", message: input }));
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <div>
      <h1>Therapy Session</h1>
      {!sessionStarted && <p>Waiting for therapist to accept the session...</p>}
      {sessionStarted && (
        <>
          <video ref={localVideoRef} autoPlay muted playsInline />
          <video ref={remoteVideoRef} autoPlay playsInline />
          <div>
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
          <button onClick={startCall}>Start Call</button>
        </>
      )}
    </div>
  );
};

export default Session;

import type * as Party from "partykit/server";

interface SessionParticipant {
  id: string;
  role: "user" | "therapist";
  name: string;
}

export default class Server implements Party.Server {
  sessionParticipants: Map<string, SessionParticipant[]> = new Map();

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(`Connected: id: ${conn.id}, room: ${this.room.id}`);
    conn.send(
      JSON.stringify({
        type: "connected",
        message: "Connected to therapy session room",
      })
    );
  }

  onClose(conn: Party.Connection) {
    console.log(`Disconnected: id: ${conn.id}`);
    this.removeParticipant(conn.id);
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);
    console.log(`connection ${sender.id} sent message:`, data);
    switch (data.type) {
      case "join_session":
        this.handleJoinSession(data, sender);
        break;
      case "start_session":
        this.handleStartSession(data);
        break;
      case "video_offer":
      case "video_answer":
      case "new_ice_candidate":
        console.log(`Relaying ${data.type} message`);
        this.room.broadcast(message, [sender.id]);
        break;
      case "chat":
        this.room.broadcast(
          JSON.stringify({
            type: "chat",
            sender: sender.id,
            message: data.message,
          })
        );
        break;
      case "accept_session":
        this.handleAcceptSession(data);
        break;
      case "reject_session":
        this.handleRejectSession(data);
        break;
      default:
        console.log(`Unknown message type: ${data.type}`);
    }
  }

  handleJoinSession(data: any, sender: Party.Connection) {
    const { sessionId, role, name } = data;
    console.log(`Handling join session: ${sessionId}, ${role}, ${name}`);

    let participants = this.sessionParticipants.get(sessionId) || [];

    // Remove any existing participant with the same role
    participants = participants.filter((p) => p.role !== role);

    // Add the new participant
    participants.push({ id: sender.id, role, name });
    this.sessionParticipants.set(sessionId, participants);

    // Notify all participants about the new join
    this.room.broadcast(
      JSON.stringify({
        type: "participant_joined",
        sessionId,
        participantId: sender.id,
        role,
        name,
      })
    );

    // Send current participants to the newly joined user
    sender.send(
      JSON.stringify({
        type: "current_participants",
        sessionId,
        participants,
      })
    );

    console.log(`Current participants for session ${sessionId}:`, participants);

    // If both user and therapist have joined, start the session
    if (
      participants.length === 2 &&
      participants.some((p) => p.role === "user") &&
      participants.some((p) => p.role === "therapist")
    ) {
      this.handleStartSession({ sessionId });
    }
  }

  handleStartSession(data: any) {
    const { sessionId } = data;
    const participants = this.sessionParticipants.get(sessionId) || [];

    console.log(
      `Starting session ${sessionId} with participants:`,
      participants
    );

    if (
      participants.length === 2 &&
      participants.some((p) => p.role === "user") &&
      participants.some((p) => p.role === "therapist")
    ) {
      this.room.broadcast(
        JSON.stringify({
          type: "session_started",
          sessionId,
          participants,
        })
      );
      console.log(`Session ${sessionId} started successfully`);
    } else {
      console.log(
        `Cannot start session ${sessionId}, not enough participants or missing roles`
      );
    }
  }

  handleAcceptSession(data: any) {
    const { sessionId } = data;
    this.room.broadcast(
      JSON.stringify({
        type: "session_accepted",
        sessionId,
      })
    );
  }

  handleRejectSession(data: any) {
    const { sessionId } = data;
    this.room.broadcast(
      JSON.stringify({
        type: "session_rejected",
        sessionId,
      })
    );
  }

  removeParticipant(connectionId: string) {
    for (const [
      sessionId,
      participants,
    ] of this.sessionParticipants.entries()) {
      const updatedParticipants = participants.filter(
        (p) => p.id !== connectionId
      );
      if (updatedParticipants.length !== participants.length) {
        this.sessionParticipants.set(sessionId, updatedParticipants);
        this.room.broadcast(
          JSON.stringify({
            type: "participant_left",
            sessionId,
            participantId: connectionId,
          })
        );
        console.log(
          `Participant ${connectionId} removed from session ${sessionId}`
        );
        break;
      }
    }
  }
}

Server satisfies Party.Worker;

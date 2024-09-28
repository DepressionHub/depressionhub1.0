import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(`Connected: id: ${conn.id}, room: ${this.room.id}`);
    conn.send(
      JSON.stringify({
        type: "chat",
        sender: "Server",
        message: "Welcome to the session!",
      })
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);
    console.log(`connection ${sender.id} sent message:`, data);

    switch (data.type) {
      case "chat":
        this.room.broadcast(
          JSON.stringify({
            type: "chat",
            sender: sender.id,
            message: data.message,
          }),
          [sender.id]
        );
        break;
      case "offer":
      case "answer":
      case "ice-candidate":
        // Broadcast to all other connections
        this.room.broadcast(message, [sender.id]);
        break;
    }
  }
}

Server satisfies Party.Worker;

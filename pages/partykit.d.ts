declare module "partykit/client" {
  export class PartyKitClient {
    constructor(partyId: string);
    on(event: string, callback: (message: any) => void): void;
    send(event: string, message: any): void;
    disconnect(): void;
  }
}

import { Random } from "./random";

export enum OutgoingRequestType {
  Add = "add",
  Action = "action",
  Poke = "poke",
}

export enum OutGoingRequestStatus {
  NotSend,
  Success,
  Failed,
}

export interface SearchParam {
  name: string;
  value: string;
}

export class OutgoingRequest {
  public readonly id: string;

  constructor(
    public readonly type: OutgoingRequestType,
    public readonly data: SearchParam[],
    public readonly comment?: string,
    public readonly detail?: string,
    idLenght: number = 5,
  ) {
    this.id = Random.readableId(idLenght);
  }

  public static addConnection() {
    return new OutgoingRequest(
      OutgoingRequestType.Add,
      [],
      "Connection creation confirmation requested",
    );
  }

  public static poke() {
    return new OutgoingRequest(OutgoingRequestType.Poke, [], "Poke");
  }
}

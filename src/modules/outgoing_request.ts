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
  private _errorMessage?: string;
  private _status: OutGoingRequestStatus = OutGoingRequestStatus.NotSend;

  constructor(
    public readonly type: OutgoingRequestType,
    public readonly data: SearchParam[],
    public readonly detail?: string,
    idLenght?: number,
  ) {
    this.id = Random.readableId(idLenght);
  }

  success() {
    this._status = OutGoingRequestStatus.Success;
  }

  fail(message: string) {
    this._status = OutGoingRequestStatus.Failed;
    this._errorMessage = message;
  }

  get status() {
    return this._status;
  }

  get successful() {
    return this._status === OutGoingRequestStatus.Success;
  }

  get errorMessage() {
    if (!this._errorMessage)
      throw new Error("Cannot get error message on Request that did not fail.");
    return this._errorMessage;
  }
}

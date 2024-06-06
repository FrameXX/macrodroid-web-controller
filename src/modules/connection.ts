import {
  connectionIdParamName,
  macrodroidWebhookDomain,
  webhookPairRequestId,
  webhookRequestIdPrefix,
} from "./const";
import { Random } from "./random";

export interface SearchParam {
  name: string;
  value: string;
}

export class Connection {
  public readonly id: string;

  constructor(
    public readonly name: string,
    public readonly webhookId: string,
  ) {
    this.id = Random.readableId();
  }

  public webhookURL(requestId: string, params?: SearchParam[]) {
    const webhookURL = new URL(
      `https://${macrodroidWebhookDomain}/${this.webhookId}/${webhookRequestIdPrefix}-${requestId}`,
    );
    if (!params) return webhookURL;
    for (const param of params) {
      webhookURL.searchParams.append(param.name, param.value);
    }
    return webhookURL;
  }

  public async pairRequest() {
    const webhookURL = this.webhookURL(webhookPairRequestId, [
      { name: connectionIdParamName, value: this.id },
    ]);
    fetch(webhookURL);
  }
}

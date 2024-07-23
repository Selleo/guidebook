import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailAdapter } from "../adapters/email.adapter";
import { NodemailerAdapter } from "../adapters/nodemailer.adapter";
import { LocalAdapter } from "../adapters/local.adapter";
import { match, P } from "ts-pattern";
import { EmailConfigSchema } from "src/common/configuration/email";

type AdapterType = EmailConfigSchema["EMAIL_ADAPTER"];

@Injectable()
export class EmailAdapterFactory {
  constructor(
    private configService: ConfigService,
    private localAdapter: LocalAdapter,
    private nodemailerAdapter: NodemailerAdapter,
  ) {}

  createAdapter(): EmailAdapter {
    const adapterType = this.configService.get<AdapterType>("EMAIL_ADAPTER");

    return match(adapterType)
      .with("mailhog", () => this.localAdapter)
      .with("smtp", () => this.nodemailerAdapter)
      .with(P.nullish, () => {
        throw new Error("EMAIL_ADAPTER is not defined in configuration");
      })
      .otherwise((type) => {
        throw new Error(`Unknown email adapter type: ${type}`);
      });
  }
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailConfigSchema } from "src/common/configuration/email";
import { EmailTestingAdapter } from "test/helpers/test-email.adapter";
import { match, P } from "ts-pattern";
import { EmailAdapter } from "../adapters/email.adapter";
import { LocalAdapter } from "../adapters/local.adapter";
import { SmtpAdapter } from "../adapters/smtp.adapter";
import { AWSSESAdapter } from "../adapters/ses.adapter";

type AdapterType = EmailConfigSchema["EMAIL_ADAPTER"];

@Injectable()
export class EmailAdapterFactory {
  constructor(
    private configService: ConfigService,
    private localAdapter: LocalAdapter,
    private smtpAdapter: SmtpAdapter,
    private awsSesAdapter: AWSSESAdapter,
    private emailTestAdapter: EmailTestingAdapter,
  ) {}

  createAdapter(): EmailAdapter {
    const adapterType = this.configService.get<AdapterType>("EMAIL_ADAPTER");
    const env = this.configService.get<string>("NODE_ENV");

    if (env === "test") {
      return this.emailTestAdapter;
    }

    return match(adapterType)
      .with("mailhog", () => this.localAdapter)
      .with("smtp", () => this.smtpAdapter)
      .with("ses", () => this.awsSesAdapter)
      .with(P.nullish, () => {
        throw new Error("EMAIL_ADAPTER is not defined in configuration");
      })
      .otherwise((type) => {
        throw new Error(`Unknown email adapter type: ${type}`);
      });
  }
}

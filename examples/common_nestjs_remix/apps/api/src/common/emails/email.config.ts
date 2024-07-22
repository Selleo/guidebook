import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailConfig {
  constructor(private configService: ConfigService) {}

  getNodemailerOptions() {
    const useMailhog = this.configService.get<boolean>("email.USE_MAILHOG");

    if (useMailhog) {
      return {
        host: "localhost",
        port: 1025,
        ignoreTLS: true,
      };
    }

    return {
      host: this.configService.get<string>("email.SMTP_HOST"),
      port: this.configService.get<number>("email.SMTP_PORT"),
      secure: true,
      auth: {
        user: this.configService.get<string>("email.SMTP_USER"),
        pass: this.configService.get<string>("email.SMTP_PASSWORD"),
      },
    };
  }
}

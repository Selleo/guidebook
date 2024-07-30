import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Email } from "../email.interface";
import { EmailAdapter } from "./email.adapter";

@Injectable()
export class SmtpAdapter extends EmailAdapter {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    super();
    this.transporter = nodemailer.createTransport(this.getNodemailerOptions());
  }

  async sendMail(email: Email): Promise<void> {
    await this.transporter.sendMail(email);
  }

  private getNodemailerOptions() {
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

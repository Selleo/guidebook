import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { Email } from "../email.interface";
import { EmailAdapter } from "./email.adapter";
import { EmailConfig } from "../email.config";

@Injectable()
export class NodemailerAdapter extends EmailAdapter {
  private transporter: nodemailer.Transporter;

  constructor(private config: EmailConfig) {
    super();
    this.transporter = nodemailer.createTransport(
      this.config.getNodemailerOptions(),
    );
  }

  async sendMail(email: Email): Promise<void> {
    await this.transporter.sendMail(email);
  }
}

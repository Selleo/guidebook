import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "./emails.service";
import { EmailConfig } from "./email.config";
import { NodemailerAdapter } from "./adapters/nodemailer.adapter";
import { EmailAdapter } from "./adapters/email.adapter";

@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    EmailConfig,
    {
      provide: EmailAdapter,
      useClass: NodemailerAdapter,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}

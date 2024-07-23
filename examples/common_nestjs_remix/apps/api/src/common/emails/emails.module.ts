import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailAdapter } from "./adapters/email.adapter";
import { NodemailerAdapter } from "./adapters/nodemailer.adapter";
import { LocalAdapter } from "./adapters/local.adapter";
import { EmailAdapterFactory } from "./factory/email-adapters.factory";
import { EmailService } from "./emails.service";
import { AWSSESAdapter } from "./adapters/ses.adapter";

@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    NodemailerAdapter,
    LocalAdapter,
    AWSSESAdapter,
    EmailAdapterFactory,
    {
      provide: EmailAdapter,
      useFactory: (factory: EmailAdapterFactory) => factory.createAdapter(),
      inject: [EmailAdapterFactory],
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}

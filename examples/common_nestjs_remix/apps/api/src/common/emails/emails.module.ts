import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailAdapter } from "./adapters/email.adapter";
import { NodemailerAdapter } from "./adapters/nodemailer.adapter";
import { LocalAdapter } from "./adapters/local.adapter";
import { EmailAdapterFactory } from "./factory/EmailAdaptersFactory";
import { EmailService } from "./emails.service";

@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    NodemailerAdapter,
    LocalAdapter,
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

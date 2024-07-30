import { EmailAdapter } from "../../src/common/emails/adapters/email.adapter";
import { Email } from "../../src/common/emails/email.interface";
import { last } from "lodash";

export class EmailTestingAdapter extends EmailAdapter {
  private sentEmails: Email[] = [];
  private emailOverride: Partial<Email> | null = null;

  async sendMail(email: Email): Promise<void> {
    const finalEmail = this.emailOverride
      ? { ...email, ...this.emailOverride }
      : email;
    this.sentEmails.push(finalEmail);
  }

  setEmailOverride(override: Partial<Email>): void {
    this.emailOverride = override;
  }

  getAllEmails(): Email[] {
    return this.sentEmails;
  }

  getLastEmail(): Email | undefined {
    return last(this.sentEmails);
  }

  clearEmails(): void {
    this.sentEmails = [];
  }
}

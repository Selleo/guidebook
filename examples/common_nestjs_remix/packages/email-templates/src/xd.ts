import { render } from "@react-email/components";
import { WelcomeEmail as WelcomeEmailTemplate } from "./templates/WelcomeEmail";

export interface EmailContent {
  text: string;
  html: string;
}

// export function emailTemplateFactory<T extends unknown[]>(
//   template: (...args: T) => Parameters<typeof render>[0],
// ): (...args: T) => EmailContent {
//   return (...args: T) => {
//     return {
//       text: render(template(...args), { plainText: true }),
//       html: render(template(...args)),
//     };
//   };
// }
//
// export const WelcomeEmail = emailTemplateFactory(WelcomeEmailTemplate);
// WelcomeEmail({ email: "xd", name: "xd" }).text;
//
export function emailTemplateFactory<T extends unknown[]>(
  template: (...args: T) => Parameters<typeof render>[0],
): new (...args: T) => EmailContent {
  return class implements EmailContent {
    private readonly args: T;

    constructor(...args: T) {
      this.args = args;
    }

    get props(): T {
      return this.args;
    }

    get text(): string {
      return render(template(...this.props), { plainText: true });
    }

    get html(): string {
      return render(template(...this.props));
    }
  };
}

export const WelcomeEmail = emailTemplateFactory(WelcomeEmailTemplate);
new WelcomeEmail({ email: "xd", name: "xd" });

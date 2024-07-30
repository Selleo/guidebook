interface BaseEmail {
  to: string;
  from: string;
  subject: string;
}

type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type Email = RequireAtLeastOne<{ text: string; html: string }> &
  BaseEmail;

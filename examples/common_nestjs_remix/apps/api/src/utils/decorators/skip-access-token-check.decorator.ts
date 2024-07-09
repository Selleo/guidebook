import { SetMetadata } from "@nestjs/common";

export const SKIP_ACCESS_TOKEN_CHECK_KEY = "skipAccessTokenCheck";
export const SkipAccessTokenCheck = () =>
  SetMetadata(SKIP_ACCESS_TOKEN_CHECK_KEY, true);

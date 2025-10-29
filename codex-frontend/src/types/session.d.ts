import type { UserInfoDto } from "./api/auth.d.ts";

export type SessionPayload = {
  user: UserInfoDto;
  accessToken: string;
  expiresAt: string;
};

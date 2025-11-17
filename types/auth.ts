import { ServerResponse } from "./global";
import { User } from "./user";

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export type ILoginUserResponse = ServerResponse<User>;
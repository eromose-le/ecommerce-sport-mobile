import { ServerResponse } from "../../types/global";
import { User } from "../user/user.types";

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export type ILoginUserResponse = ServerResponse<User>;

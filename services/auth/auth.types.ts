import { ServerResponse } from "../../types/global";
import { User } from "../user/user.types";

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export type ILoginUserResponse = ServerResponse<User>;

export interface ICreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

export type ICreateUserResponse = ServerResponse<User>;

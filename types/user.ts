import { ServerResponse } from "./global";

export type User = Partial<{
  token: string;
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  isVerified: boolean;
  googleId: string | null;
  avatar: string | null;
  bio: string | null;
  freeGift: any[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}>;

export type IUserResponse = ServerResponse<User>;
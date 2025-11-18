import { ServerResponse } from "@/types/global";

export type User = Partial<{
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  unreadNotifications: number;
  isVerified: boolean;
  googleId: string | null;
  avatar: string | null;
  bio: string | null;
  freeGift?: any[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
  token: string;
}>;

export type IUserResponse = ServerResponse<User>;

export type IUpdateUserPayload = Partial<{
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  location: string;
}>;

export type IUpdateUserParams = {
  id: string | number;
};

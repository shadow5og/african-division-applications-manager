import { Access } from "payload/config";
import { User } from "payload/generated-types";

export const admins: Access<any, User> = ({ req: { user } }) =>
  user.role === "admin";

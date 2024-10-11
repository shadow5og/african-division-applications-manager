import { Access, User } from "payload";


export const admins: Access<any> = ({ req: { user } }) =>
  user?.role === "admin";

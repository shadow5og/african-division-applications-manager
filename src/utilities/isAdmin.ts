import { User } from "payload/generated-types";

export const isAdmin = (user: User) => user.role === "admin";

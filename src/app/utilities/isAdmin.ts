import { User } from "@/payload-types";


export const isAdmin = (user: User) => user?.role === "admin";

import { Access } from "payload";
import { isAdmin } from "../../../utilities/isAdmin";
import { User } from "@/payload-types";

export const adminsAndApplicant: Access<any> = async ({
  req: { user },
  id,
}) => {
  if (isAdmin(user as User)) return true;
  else if (!user) return false;

  return {
    id: {
      equals: user.id ?? 0,
    },
  };
};

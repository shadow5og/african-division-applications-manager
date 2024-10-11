import { isAdmin } from "@/app/utilities/isAdmin";
import { Access } from "payload";
import { User } from "@/payload-types";


export const adminsAndApplicant: Access<any> = async ({
  req: { user },
}) => {
  if (isAdmin(user as User)) return true;
  else if (!user) return false;

  return {
    user: {
      equals: user.id,
    },
  };
};

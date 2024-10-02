import { isAdmin } from "../../../utilities/isAdmin";
import { Access } from "payload/config";
import { User } from "payload/generated-types";

export const adminsAndApplicant: Access<any, User> = async ({
  req: { user },
}) => {
  if (isAdmin(user)) return true;

  return {
    user: {
      equals: user.id,
    },
  };
};

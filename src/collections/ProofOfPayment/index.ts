import { CollectionConfig } from "payload/types";
import { adminsAndApplicant } from "../CampApplications/access/adminsAndApplicant";
import { assignToApplicant } from "./hooks/assignToApplicant";
import { user } from "../../fields/user";

export const ProofOfPayment: CollectionConfig = {
  slug: "proofOfPayment",
  upload: {
    adminThumbnail: "thumbnail",
    staticDir: "media",
  },
  access: {
    create: adminsAndApplicant,
    read: adminsAndApplicant,
    update: adminsAndApplicant,
    delete: adminsAndApplicant,
  },
  hooks: { beforeChange: [assignToApplicant] },
  fields: [
    {
      name: "alt",
      type: "text",
    },
    user,
  ],
};

import { CollectionConfig } from "payload/types";
import { adminsAndApplicant } from "../Users/access/adminsAndApplicant";

export const ProofOfPayment: CollectionConfig = {
  slug: "proofOfPayment",
  upload: {
    adminThumbnail: "thumbnail",
    staticDir: "media",
  },access: {
    create: adminsAndApplicant,
    read: adminsAndApplicant,
    update: adminsAndApplicant,
    delete: adminsAndApplicant,
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
    { name: "user", type: "relationship", relationTo: "users", admin: {position: "sidebar"} },
  ],
};

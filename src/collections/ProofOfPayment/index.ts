import { CollectionConfig } from "payload/types";

export const ProofOfPayment: CollectionConfig = {
  slug: "proofOfPayment",
  upload: {
    adminThumbnail: "thumbnail",
    staticDir: "media",
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
    { name: "user", type: "relationship", relationTo: "users" },
  ],
};

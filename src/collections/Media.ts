import { CollectionConfig } from "payload/types";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    adminThumbnail: "thumbnail",
    staticDir: "media",
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
};

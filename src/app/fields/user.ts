import { Field } from "payload";

export const user: Field = {
  name: "user",
  type: "relationship",
  relationTo: "users",
  index: true,
  required: true,
  admin: { position: "sidebar" },
};

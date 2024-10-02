import { CollectionConfig } from "payload/types";
import { adminsAndApplicant } from "./access/adminsAndApplicant";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "fullName",
  },
  access: {
    create: () => false,
    read: adminsAndApplicant,
    update: adminsAndApplicant,
    delete: () => false,
  },
  fields: [
    { name: "fullName", type: "text", required: true },
    {
      name: "role",
      type: "radio",
      options: ["admin", "user"],
      defaultValue: "user",
    },
    { name: "phoneNumber", type: "text", required: true },
    {
      name: "gender",
      type: "select",
      required: true,
      defaultValue: "male",
      options: [
        { label: "Female", value: "female" },
        { label: "Male", value: "male" },
      ],
    },
    {
      name: "application",
      type: "relationship",
      relationTo: "campApplications",
      admin: { position: "sidebar" },
    },
  ],
};

export default Users;

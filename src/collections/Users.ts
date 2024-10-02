import { admins } from "../access/admins";
import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "fullName",
  },
  access: {
    create: () => false,
    read: admins,
    update: admins,
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

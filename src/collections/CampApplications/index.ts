import { CollectionConfig } from "payload/types";
import { nationality } from "../../fields/nationality";
import { proofOfPayment } from "../../fields/proof-of-payment";
import { admins } from "../../access";
import { adminsAndApplicant } from "../Users/access/adminsAndApplicant";

export const CampApplications: CollectionConfig = {
  slug: "campApplications",
  access: {
    create: admins,
    read: adminsAndApplicant,
    update: adminsAndApplicant,
    delete: () => false,
  },
  fields: [
    {
      name: "targetGroup",
      type: "select",
      required: true,
      defaultValue: "26-35",
      options: ["child", "12-25", "26-35", "36-45", "46-55", "56-65", "65+"],
    },
    nationality,
    { name: "churchOrganisationName", type: "text", required: true },
    { name: "churchLocation", type: "text", required: true },
    { name: "otherDenomination", type: "text", required: true },
    {
      name: "howDidYouLearnAboutUs",
      type: "radio",
      required: true,
      defaultValue: "referral",
      options: [
        { label: "Referral from others", value: "referral" },
        { label: "Social media", value: "social media" },
        { label: "Church announcements", value: "church announcements" },
      ],
    },
    { name: "expetationsFromConference", type: "textarea", required: true },
    { name: "additionalInformation", type: "textarea", required: true },
    {
      name: "arrivalDate",
      type: "date",
      required: true,
      label: "Expected date of arrival at the meeting venue.",
      index: true,
    },
    {
      name: "departureDate",
      type: "date",
      required: true,
      label: "Expected date of departure from the meeting venue.",
      index: true,
    },
    {
      name: "participatesInSinging",
      label: "Would you like to participate in singing? / Any performance?",
      type: "radio",
      required: true,
      defaultValue: "No",
      options: ["Yes", "No"],
    },
    {
      name: "typeOfGroup",
      label: "Is it a solo or group performance?",
      type: "select",
      defaultValue: "Solo performance",
      options: ["Solo performance", "Group performance"],
    },
    {
      name: "preferredComunication",
      label:
        "How would you like to receive additional information about the event?",
      type: "radio",
      defaultValue: "WhatsApp",
      options: ["WhatsApp", "Email"],
    },
    proofOfPayment,
    { name: "validAppication", type: "checkbox", defaultValue: "false" },
    { name: "invalidApplicationReason", type: "textarea" },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
    },
  ],
};

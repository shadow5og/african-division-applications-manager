import { Field } from "payload/types";

export const proofOfPayment: Field = {
  name: "proofOfPayment",
  type: "relationship",
  relationTo: "proofOfPayment",
};

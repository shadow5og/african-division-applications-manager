import { Field } from "payload/types";

export const proofOfPayment: Field = {
  name: "proofPayment",
  type: "relationship",
  relationTo: "proofOfPayment",
};

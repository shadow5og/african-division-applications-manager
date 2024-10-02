import { ProofOfPayment } from "payload/generated-types";
import { CollectionBeforeChangeHook } from "payload/types";
import { slugify } from "../../../utilities/string";

export const assignToApplicant: CollectionBeforeChangeHook<
  ProofOfPayment
> = async ({
  data, // incoming data to update or create with
  req: { user, payload }, // full express request
  operation, // name of the operation ie. 'create', 'update'
}) => {
  const newData = { ...data };
  let changed = false;

  if (
    operation === "create" &&
    !data.filename.includes("/")
  ) {
    await payload.delete({
      collection: "proofOfPayment",
      where: {
        or: [
          { filename: { equals: data.filename } },
          { user: { equals: data.id } },
        ],
      },
    });

    const { email } = await payload.findByID({
      collection: "users",
      id: data.id,
      depth: 0,
    });

    newData.filename = `${slugify(email)}/${newData.filename}`;
    changed = true;
  }

  return changed ? newData : data; // Return data to either create or update a document with
};

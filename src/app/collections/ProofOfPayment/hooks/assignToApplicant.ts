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

  if (operation === "create" && !data.filename.includes("/")) {
    const { fullName } = await payload.findByID({
      collection: "users",
      id: data.user as number,
      depth: 0,
      user,
    });

    const sluggifiedName = slugify(fullName);

    await payload.delete({
      collection: "proofOfPayment",
      where: {
        filename: { contains: sluggifiedName },
      },
      depth: 0,
    });

    newData.filename = `${sluggifiedName}-${newData.filename}`;
    changed = true;
  }

  console.log(newData);

  return changed ? newData : data; // Return data to either create or update a document with
};

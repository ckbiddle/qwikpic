import { Table } from "sst/constructs";

export function StorageStack({ stack, app }) {

  // Create the DynamoDB tables
  const tblPictures = new Table(stack, "Pictures", {
    fields: {
      userId: "string",
      pictureId: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "pictureId" },
  });

  const tblCategories = new Table(stack, "Categories", {
    fields: {
      userId: "string",
      categoryId: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "categoryId" },
  });

  const tblPictureCategoryAssociations = new Table(stack, "PictureCategoryAssociations", {
    fields: {
      userId: "string",
      associationId: "string",
      categoryId: "string",
      pictureId: "string"
    },
    primaryIndex: { partitionKey: "userId", sortKey: "associationId" },
  });

  return {
    tblPictures,
    tblCategories,
    tblPictureCategoryAssociations
  };
}
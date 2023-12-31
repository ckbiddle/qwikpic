import { Bucket, Table } from "sst/constructs";

export function StorageStack({ stack, app }) {

  // Create an S3 bucket
  const bucket = new Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });

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
      categoryId: "string",
      pictureId: "string",
      associationId: "string",
    },
    primaryIndex: { partitionKey: "categoryId", sortKey: "associationId" },
  });

  return {
    bucket,
    tblPictures,
    tblCategories,
    tblPictureCategoryAssociations,
  };
}
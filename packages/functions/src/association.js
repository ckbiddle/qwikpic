import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@qwikpic/core/handler";
import dynamoDb from "@qwikpic/core/dynamodb";

export const create = handler(async (event) => {
  let data = {
    categoryId: "",
    pictureId: "",
  };

  if (event.body) {
    data = JSON.parse(event.body);
  }

  // Get the image file name from the pictures table (i.e. pictures.imageFile)
  // and add it as a field in the associations table. This will denormalize
  // the structure, but will prevent a need to "join" to the pictures
  // table to get all the image file names when querying by category. I don't
  // like denormalizing, but I guess it's a common practice with NoSQL databases.

  var imageFile = "";

  const params1 = {
    TableName: Table.Pictures.tableName,
    Key: {
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      pictureId: data.pictureId, // The id of the picture from the path
    },
  };

  const result = await dynamoDb.get(params1);

  if (result.Item)
  {
    if (result.Item.imageFile)
    {
      imageFile = result.Item.imageFile;
    }
    else
    {
      console.log( "imageFile not found" );
    }
  }
  else
  {
    // throw new Error("Item not found.");
    console.log( "Item not found." );
  }

  const params2 = {
    TableName: Table.PictureCategoryAssociations.tableName,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      associationId: uuid.v1(), // A unique uuid
      categoryId: data.categoryId, // Parse from request body
      pictureId: data.pictureId, // Parsed from request body
      imageFile: imageFile,
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params2);

  return JSON.stringify(params2.Item);
});
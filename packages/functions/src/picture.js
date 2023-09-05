import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@qwikpic/core/handler";
import dynamoDb from "@qwikpic/core/dynamodb";

export const create = handler(async (event) => {

  let data = {
    description: "",
    imageFile: "",
  };

  if (event.body) {
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Table.Pictures.tableName,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      pictureId: uuid.v1(), // A unique uuid
      description: data.description, // Parsed from request body
      imageFile: data.imageFile, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});

export const get = handler(async (event) => {

  const params = {
    TableName: Table.Pictures.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    Key: {
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      pictureId: event.pathParameters.id, // The id of the picture from the path
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return result.Item;
});

export const list = handler(async (event) => {

  const params = {
    TableName: Table.PictureCategoryAssociations.tableName,
    KeyConditionExpression: "categoryId = :categoryId",
    ExpressionAttributeValues: {
      ":categoryId": event.pathParameters.categoryId,
    },
  };

  const result = await dynamoDb.query(params);

  // Return the matching list of items in response body
  return result.Items;
});
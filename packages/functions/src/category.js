import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@qwikpic/core/handler";
import dynamoDb from "@qwikpic/core/dynamodb";

export const create = handler(async (event) => {

  let data = {
    parentCategoryId: "",
    description: "",
  };

  if (event.body) {
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Table.Categories.tableName,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      categoryId: uuid.v1(), // A unique uuid
      parentCategoryId: data.parentCategoryId,
      description: data.description, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});

export const list = handler(async (event) => {

  // console.log( "category.list: event = " );
  // console.log( event );

  // console.log( "identityId = " + 
  //   JSON.stringify(
  //     event.requestContext.authorizer.iam.cognitoIdentity.identityId
  //   )
  // ); 

  const params = {
    TableName: Table.Categories.tableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.iam.cognitoIdentity.identityId,
    },
  };

  const result = await dynamoDb.query(params);

  // Return the matching list of items in response body
  return result.Items;
});
import AWS from "aws-sdk";
import * as uuid from "uuid";

import { Table } from "sst/node/table";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function create(event) {
  let data, params;

  // Request body is passed in as a JSON encoded string in 'event.body'
  if (event.body) {
    data = JSON.parse(event.body);
    params = {
      TableName: Table.PictureCategoryAssociations.tableName,
      Item: {
        // The attributes of the item to be created
        userId: "123", // The id of the author
        associationId: uuid.v1(), // A unique uuid
        categoryId: data.categoryId, // Parse from request body
        pictureId: data.pictureId, // Parsed from request body
        createdAt: Date.now(), // Current Unix timestamp
      },
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: true }),
    };
  }

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    };
  }
}
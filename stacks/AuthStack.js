import * as iam from "aws-cdk-lib/aws-iam";
import { ApiStack } from "./ApiStack";
import { StorageStack } from "./StorageStack";
import { Cognito, use } from "sst/constructs";

export function AuthStack({ stack, app }) {
  const { apiPictures, apiCategories, apiPictureCategoryAssociations } = use(ApiStack);
  const { bucket } = use(StorageStack);

  // Create a Cognito User Pool and Identity Pool
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  auth.attachPermissionsForAuthUsers(stack, [
    // Allow access to the API
    apiPictures,
    apiCategories,
    apiPictureCategoryAssociations,
    // Policy granting access to a specific folder in the bucket
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  // Show the auth resources in the output
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
  });

  // Return the auth resource
  return {
    auth,
  };
}
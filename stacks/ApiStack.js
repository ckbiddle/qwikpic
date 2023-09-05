import { Api, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }){
  const { tblPictures } = use(StorageStack);
  const { tblCategories } = use(StorageStack);
  const { tblPictureCategoryAssociations } = use(StorageStack);

  // Create the APIs
  const apiPictures = new Api(stack, "ApiPictures", {
    defaults: {
      authorizer: "iam",
      function: {
        bind: [tblPictures, tblPictureCategoryAssociations],
      },
    },
    routes: {
      "POST /picture": "packages/functions/src/picture.create",
      "GET /picture/{id}": "packages/functions/src/picture.get",
      "GET /pictures/{categoryId}": "packages/functions/src/picture.list",
    },
  });

  const apiCategories = new Api(stack, "ApiCategories", {
    defaults: {
      authorizer: "iam",
      function: {
        bind: [tblCategories],
      },
    },
    routes: {
      "POST /category": "packages/functions/src/category.create",
    },
  });

  const apiPictureCategoryAssociations = new Api(stack, "ApiPictureCategoryAssociations", {
    defaults: {
      authorizer: "iam",
      function: {
        bind: [tblPictureCategoryAssociations, tblPictures],
      },
    },
    routes: {
      "POST /association": "packages/functions/src/association.create",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiPicturesEndpoint: apiPictures.url,
    ApiCategoriesEndpoint: apiCategories.url,
    ApiAssociationsEndpoint: apiPictureCategoryAssociations.url,
  });

  // Return the API resource
  return {
    apiPictures,
    apiCategories,
    apiPictureCategoryAssociations,
  };

}
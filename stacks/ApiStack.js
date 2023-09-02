import { Api, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
  const { tblPictures } = use(StorageStack);
  const { tblCategories } = use(StorageStack);
  const { tblPictureCategoryAssociations } = use(StorageStack);

  // Create the APIs
  const apiPictures = new Api(stack, "ApiPictures", {
    defaults: {
      function: {
        bind: [tblPictures],
      },
    },
    routes: {
      "POST /pictures": "packages/functions/src/picture.create",
    },
  });

  const apiCategories = new Api(stack, "ApiCategories", {
    defaults: {
      function: {
        bind: [tblCategories],
      },
    },
    routes: {
      "POST /categories": "packages/functions/src/category.create",
    },
  });

  const apiPictureCategoryAssociations = new Api(stack, "ApiPictureCategoryAssociations", {
    defaults: {
      function: {
        bind: [tblPictureCategoryAssociations],
      },
    },
    routes: {
      "POST /associations": "packages/functions/src/association.create",
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
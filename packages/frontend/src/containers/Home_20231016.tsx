import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { onError } from "../lib/errorLib";
import "./Home.css";

export default function Home()
{
  const [categories, setCategories] = useState<Array>([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  let { selectedCategoryId } = useParams();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try
      {
        const categories = await loadCategories();
        setCategories(categories);

      } catch (e) {

        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadCategories()
  {
    return API.get("categories", "/categories", {});
  }

  function loadThumbnails( pSelectedCategoryId )
  {
    return API.get( "pictures", "/pictures/" + pSelectedCategoryId, {} );

    // Uncomment for testing.
    // return { greeting: "hello" };
  }

  function formatDate(str: undefined | string)
  {
    return !str ? "" : new Date(str).toLocaleString();
  }

  function renderCategoriesList(categories)
  {
    // const [thumbnails, setThumbnails] = useState<Array>([]);
    // let { selectedCategoryId } = useParams();

    // API.get() in loadThumbnails() IS getting called when
    // I click on a category, but the returned result is not
    // getting assigned to the variable "thumbnails". Why?

    var thumbnails = loadThumbnails( selectedCategoryId );
    console.log( "thumbnails = " + JSON.stringify( thumbnails ));

    return (
      <>
        <div className="ContainerMain">
          <div className="CategoryList">
            <div>Categories</div>
            {categories.map(({ categoryId, description, createdAt }) => (
              <LinkContainer key={categoryId} to={`/${categoryId}`}>
                <ListGroup.Item>
                  <span>{description}</span>
                </ListGroup.Item>
              </LinkContainer>
            ))}
          </div>
          <div className="PictureThumbnails">
            <div>Image Thumbnails</div>
            <div>
            {
              selectedCategoryId ?
                 selectedCategoryId
              :
                "No category selected"
            }
            </div>
          </div>
          <div className="PictureMain">
            <div>Main Picture</div>
          </div>
        </div>
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>QwikPic</h1>
        <p className="text-muted">A simple picture organizer</p>
      </div>
    );
  }

  function renderCategories() {

    return (
      <div className="categories">
        <ListGroup>{!isLoading && renderCategoriesList(categories)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderCategories() : renderLander()}
    </div>
  );
}
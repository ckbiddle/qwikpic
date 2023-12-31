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
  const [thumbnails, setThumbnails] = useState<Array>([]);
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

  useEffect(() => {

    async function onLoadThumbnails() {
      if (!isAuthenticated) {
        return;
      }

      try
      {
        const tn = await loadThumbnails( selectedCategoryId );
        setThumbnails(tn);

      } catch (e) {

        onError(e);
      }

    }

    // This "if" is needed to stop repeated refresh attempts when
    // there is no selectedCategoryId.
    if ( selectedCategoryId )
    {
      onLoadThumbnails();
    }

  }, selectedCategoryId );

  function loadCategories()
  {
    return API.get("categories", "/categories", {});
  }

  function loadThumbnails( pSelectedCategoryId )
  {
    return API.get( "pictures", "/pictures/" + pSelectedCategoryId, {} );
  }

  function formatDate(str: undefined | string)
  {
    return !str ? "" : new Date(str).toLocaleString();
  }

  function renderCategoriesList(categories)
  {
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
            {thumbnails.map(({ imageFile }) => (
               <div>{imageFile}</div> 
            ))}
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
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { NoteType } from "../types/note";
import { onError } from "../lib/errorLib";
import "./Home.css";

export default function Home()
{
  const [categories, setCategories] = useState<Array<CategoryType>>([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {

        const categories = await loadCategories();
        setCategories(categories);

      } catch (e) {

        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadCategories() {

    return API.get("categories", "/categories", {});

  }

  function formatDate(str: undefined | string) {
    return !str ? "" : new Date(str).toLocaleString();
  }

  function renderCategoriesList(categories: CategoryType[]) {

    return (
      <>
        {categories.map(({ categoryId, description, createdAt }) => (

          <ListGroup.Item>
            <span>{description}</span>
          </ListGroup.Item>

        ))}
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
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Categories</h2>
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
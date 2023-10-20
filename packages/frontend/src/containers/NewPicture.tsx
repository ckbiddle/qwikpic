import { API } from "aws-amplify";
import React, {useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import {useNavigate} from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewPicture.css";
import { PictureType } from "../types/Picture";
import { onError } from "../lib/errorLib";
import { s3Upload } from "../lib/awsLib";

export default function NewPicture() {
  const file = useRef<null | File>(null);
  const nav = useNavigate();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return description.length > 0;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if ( event.currentTarget.files === null ) return
    file.current = event.currentTarget.files[0];
  }

  function createPicture( picture: PictureType )
  {
    return API.post( "pictures", "/picture", {
      body: picture,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const imageFile = file.current ? await s3Upload(file.current) : null;
      await createPicture({description, imageFile });
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }

  }

  return (
    <div className="NewPicture">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="description">
          <Form.Control
            value={description}
            as="textarea"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-2" controlId="file">
          <Form.Label>Picture Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          size="lg"
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}

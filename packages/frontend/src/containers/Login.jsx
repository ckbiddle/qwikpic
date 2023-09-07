import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { Auth } from "aws-amplify";
// import { useAppContext } from "../lib/contextLib";
import "./Login.css";

export default function Login() {
  // const { userHasAuthenticated } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  // Chris Biddle, 09/06/2023
  // The tutorial says to do this, but including "React.FormEvent ..." was
  // causing an error and just looks out of place. So I deleted it.
  // function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await Auth.signIn(email, password);
      alert( 'Logged in' );
    } catch (error) {
      // Prints the full error
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Stack gap={3}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              size="lg"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button size="lg" type="submit" disabled={!validateForm()}>
            Login
          </Button>
        </Stack>
      </Form>
    </div>
  );
}
import { Layout } from "@/components/layout";
import { Todo } from "@/lib/todo";
import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import styles from "./index.module.css";
import useSWR, { Fetcher } from "swr";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const [text, setText] = useState("");
  const { user, isLoading: isUserLoading } = useUser();

  const {
    data: todos,
    isLoading,
    error,
    mutate,
  } = useSWR("/api/todos", fetcher);

  if (user == undefined) {
    return (
      <>
        <Layout>
          ログインしてください
          <a href="/api/auth/login">Login</a>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Layout>
        <main>
          <div>
            <a href="/api/auth/logout">Logout</a>
            <Form className={styles.formContainer}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      onChange={(e) => {
                        setText(e.target.value);
                      }}
                      value={text}
                    />
                  </Form.Group>
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={async () => {
                      if (text.length == 0) {
                        return;
                      }
                      await postTodo(text);
                      mutate();
                      setText("");
                    }}
                    type="button"
                  >
                    追加
                  </Button>
                </Col>
              </Row>
            </Form>
            {isLoading ? (
              <Container className={styles.spinnerContainer}>
                <Spinner animation="grow" />
              </Container>
            ) : (
              <ListGroup>
                {todos &&
                  todos.map((todo, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col className="d-flex align-items-center">
                          {todo.title}
                        </Col>
                        <Col xs={"auto"}>
                          <Button variant="danger" size="sm">
                            delete
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            )}
          </div>
        </main>
      </Layout>
    </>
  );
}

const fetcher: Fetcher<Todo[]> = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("network response was not ok.");
  }

  const content = (await response.json())["todos"] as Todo[];
  return content;
};

const postTodo = async (title: string) => {
  const response = await fetch("/api/todo/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
    }),
  });
  if (!response.ok) {
    throw Error("something went wrong");
  }
};

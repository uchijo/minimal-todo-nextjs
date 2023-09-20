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
  Toast,
  ToastContainer,
} from "react-bootstrap";
import styles from "./index.module.css";
import useSWR, { Fetcher } from "swr";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function Home() {
  const [text, setText] = useState("");
  const { user } = useUser();
  const [toastOn, setToastOn] = useState(false);
  const showError = async () => {
    setToastOn(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setToastOn(false);
  };

  const { data: todos, isLoading, mutate } = useSWR("/api/todos", fetcher);

  if (user == undefined) {
    return (
      <>
        <Layout>
          <div className={styles.loggedOutContainer}>
            <span>ログインしてください</span>
            <br />
            <Link href="/api/auth/login">Login</Link>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Layout>
        <main>
          <div>
            <ToastContainer position="bottom-center">
              <Toast className={styles.toast} bg="danger" show={toastOn}>
                <Toast.Body className="text-white">
                  エラーが発生しました
                </Toast.Body>
              </Toast>
            </ToastContainer>
            <Link href="/api/auth/logout">Logout</Link>
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
                      try {
                        if (text.length == 0) {
                          return;
                        }
                        await postTodo(text);
                        mutate();
                        setText("");
                      } catch (_) {
                        showError();
                      }
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
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={async () => {
                              try {
                                await deleteTodo(todo.id);
                                await mutate();
                              } catch (_) {
                                showError();
                              }
                            }}
                          >
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

const deleteTodo = async (todoId: number) => {
  const response = await fetch("/api/todo/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: todoId,
    }),
  });
  if (!response.ok) {
    throw Error("something went wrong");
  }
};

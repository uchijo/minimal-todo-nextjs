import { Layout } from "@/components/layout";
import { SimpleModal } from "@/components/simpleModal";
import { Todo } from "@/lib/todo";
import { useState } from "react";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import styles from "./index.module.css";

type props = {
  todos: Todo[];
};

export const getServerSideProps = (): { props: props } => {
  return {
    props: {
      todos: [],
    },
  };
};

export default function Home({ todos: initialTodos }: props) {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  return (
    <>
      <Layout>
        <main>
          <div>
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
                    onClick={() => {
                      if (text.length == 0) {
                        setIsWarningModalOpen(true);
                        return;
                      }
                      setTodos([
                        ...todos,
                        { title: text, id: 100, completed: false },
                      ]);
                      setText("");
                    }}
                    type="button"
                  >
                    追加
                  </Button>
                </Col>
              </Row>
            </Form>
            <ListGroup>
              {todos.map((todo, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col className="d-flex align-items-center">
                      {todo.title}
                    </Col>
                    <Col xs={"auto"}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const filteredTodo = todos.filter((_, i) => {
                            return i != index;
                          });
                          setTodos(filteredTodo);
                        }}
                      >
                        delete
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <SimpleModal
              isOpen={isWarningModalOpen}
              setIsOpen={setIsWarningModalOpen}
            >
              <p>空白のtodoを追加することはできません</p>
            </SimpleModal>
          </div>
        </main>
      </Layout>
    </>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { firebaseSlugBase } from "../../utils/firebase";
import { child, set, remove, update } from "@firebase/database";
import { Props, localParticipantToDo } from "./ToDoList.types";

function ToDoList({ localParticipant, localParticipantToDoList }: Props) {
  useEffect(() => {
    console.log(localParticipantToDoList);
  }, [localParticipantToDoList]);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const [editToDo, setEditToDo] = useState({ status: false, id: -1 });

  const addToDo = () => {
    if (inputRef.current && inputRef.current.value.trim().length === 0) {
      return;
    }

    const newToDo = {
      id: crypto.randomUUID(),
      content: inputRef.current?.value,
      complete: false,
    };

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    const base = firebaseSlugBase();

    if (localParticipant) {
      set(child(base, `to_do/${localParticipant.id}/${newToDo.id}`), newToDo);
    }
  };

  const deleteToDo = (id: number) => {
    const base = firebaseSlugBase();

    remove(child(base, `to_do/${localParticipant.id}/${id}`)).catch((err) => {
      console.error(err);
    });
  };

  const editTodo = (id: number) => {
    const base = firebaseSlugBase();

    if (
      editInputRef.current &&
      editInputRef.current.value.trim().length === 0
    ) {
      setEditToDo({ status: false, id: -1 });
      return;
    }

    update(child(base, `to_do/${localParticipant.id}/${id}`), {
      content: editInputRef.current?.value,
    })
      .then(() => {
        setEditToDo({ status: false, id: -1 });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const toggleToDoStatus = ({
    id,
    complete,
  }: {
    id: number;
    complete: boolean;
  }) => {
    const base = firebaseSlugBase();

    update(child(base, `to_do/${localParticipant.id}/${id}`), {
      complete: !complete,
    }).catch((err) => {
      console.error(err);
    });
  };

  return (
    <section style={{ width: "50%", height: "100%" }}>
      <div style={{ height: "22%", marginBottom: "8px" }}>
        <h3 style={{ marginBottom: "10px" }}>Todo List</h3>
        <form
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <input
            style={{
              width: "90%",
              borderRadius: "5px",
              height: "20px",
              border: "none",
            }}
            ref={inputRef}
            placeholder="Add Todo"
          ></input>
          <button
            style={{
              backgroundColor: "#B4D388",
              boxSizing: "content-box",
              borderRadius: "5px",
              border: "none",
              height: "20px",
              marginLeft: "4px",
            }}
            onClick={(event) => {
              event.preventDefault();
              addToDo();
            }}
          >
            Add
          </button>
        </form>
      </div>
      <div
        style={{
          height: "calc(78% - 8px)",

          marginBottom: "8px",
          overflowY: "scroll",
        }}
      >
        {localParticipantToDoList
          .sort((a: localParticipantToDo, b: localParticipantToDo) => {
            return Number(a.complete) - Number(b.complete);
          })
          .map((todo) => {
            return (
              <div
                title="Click on text to edit!"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: `${
                    editToDo ? "space-between" : "space-between"
                  }`,
                  height: "30px",
                  textOverflow: "ellipsis",
                }}
                key={todo.id}
              >
                {editToDo.id === todo.id ? (
                  <>
                    <form
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        ref={editInputRef}
                        style={{
                          color: "black",
                          width: "165px",
                          borderRadius: "5px",
                          border: "none",
                        }}
                        placeholder={todo.content}
                        autoFocus
                      />
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          editTodo(todo.id);
                        }}
                        style={{
                          backgroundColor: "#B4D388",
                          borderRadius: "5px",
                          border: "none",
                        }}
                      >
                        Update
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      style={{
                        padding: "0px",
                        transform: "scale(1.5)",
                      }}
                      defaultChecked={todo.complete}
                      onChange={() => {
                        toggleToDoStatus({
                          id: todo.id,
                          complete: todo.complete,
                        });
                      }}
                    />
                    <h5
                      style={{
                        fontSize: "15px",
                        width: "100%",
                        textAlign: "left",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        marginLeft: "20px",
                        textDecoration: `${
                          todo.complete ? "line-through" : ""
                        }`,
                        opacity: `${todo.complete ? "0.5" : "1"}`,
                      }}
                      onClick={() => {
                        setEditToDo({ status: true, id: todo.id });
                      }}
                    >
                      {todo.content}
                    </h5>
                    <button
                      style={{
                        fontSize: "10px",
                        height: "20px",
                        marginLeft: "20px",
                        width: "35px",

                        backgroundColor: "#D5202C",
                        borderRadius: "5px",
                        border: "none",
                        color: "white",
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        deleteToDo(todo.id);
                      }}
                    >
                      X
                    </button>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
}

export default ToDoList;

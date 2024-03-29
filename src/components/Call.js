import DailyIframe from "@daily-co/daily-js";
import { child, onValue, set } from "@firebase/database";
import { useEffect, useRef, useState } from "react";
import {
  dailyParticipantInfo,
  makeParticipantUpdateHandler,
} from "../utils/daily";
import ToDoList from "./ToDoList/ToDoList";
import { firebaseSlugBase } from "../utils/firebase";
import { getRoomUrl } from "../utils/room";
import "./Call.css";

function Call({ firebaseApp }) {
  const [localParticipantToDoList, setLocalParticipantToDoList] = useState([]);
  const [allParticipantsToDo, setAllParticipantsToDo] = useState({});

  const callWrapperEl = useRef(null);
  const [participants, setParticipants] = useState({});
  const localParticipant = Object.values(participants).find(
    (participant) => participant.isLocal
  );

  useEffect(() => {
    if (localParticipant && allParticipantsToDo[localParticipant.id]) {
      const toDoObjectsArray =
        allParticipantsToDo[localParticipant.id] !== undefined
          ? Object.entries(allParticipantsToDo[localParticipant.id])
          : [];

      const toDoArray = [];

      for (let counter = 0; counter < toDoObjectsArray.length; counter++) {
        toDoArray.push(toDoObjectsArray[counter][1]);
      }

      setLocalParticipantToDoList(toDoArray);
    } else {
      setLocalParticipantToDoList([]);
    }
  }, [localParticipant, allParticipantsToDo]);

  useEffect(() => {
    const base = firebaseSlugBase();

    const toDoRef = child(base, "to_do");

    onValue(toDoRef, (snapshot) => {
      if (snapshot.val()) {
        setAllParticipantsToDo(snapshot.val());
      }
    });
  }, [localParticipant]);

  const callFrame = useRef(null);
  useEffect(() => {
    const roomUrl = getRoomUrl();
    const frame = DailyIframe.createFrame(callWrapperEl.current, {
      url: roomUrl,
    });

    callFrame.current = frame;
    frame.join().then((frameParticipants) => {
      let newParticipants = {};
      for (const [id, participant] of Object.entries(frameParticipants)) {
        newParticipants[id] = dailyParticipantInfo(participant);
      }
      setParticipants(newParticipants);
    });

    frame.on(
      "participant-joined",

      makeParticipantUpdateHandler(setParticipants)
    );

    frame.on(
      "participant-updated",
      makeParticipantUpdateHandler(setParticipants)
    );
    frame.on("participant-left", makeParticipantUpdateHandler(setParticipants));

    return () => {
      callFrame.current.leave();
      callFrame.current.destroy();
    };
  }, []);

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [userStatuses, setUserStatuses] = useState({});

  useEffect(() => {
    const base = firebaseSlugBase();

    const statusesRef = child(base, "user_statuses");
    onValue(statusesRef, (snapshot) => {
      if (snapshot.val()) {
        setUserStatuses(snapshot.val());
      }
    });
  }, []);

  const finishEditing = () => {
    const base = firebaseSlugBase();
    setIsEditingStatus(false);
    if (localParticipant) {
      set(child(base, `user_statuses/${localParticipant.id}`), currentStatus);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        minWidth: "100vh",
        display: "flex",
        maxHeight: "100vh",
        backgroundColor: "#2b3f56",
        color: "white",
      }}
    >
      <div
        id="call"
        ref={callWrapperEl}
        style={{ height: "100%", width: "70%" }}
      />

      <div
        style={{
          height: "100%",
          width: "30%",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        {localParticipant ? (
          <h2
            style={{
              height: "2%",
              margin: "0px",
              marginTop: "3%",
              marginBottom: "3%",
            }}
          >
            {localParticipant?.name}
          </h2>
        ) : (
          <h2
            style={{
              height: "2%",
              margin: "0px",
              marginTop: "3%",
              marginBottom: "3%",
            }}
          >{`Loading`}</h2>
        )}
        <section
          style={{
            width: "100%",
            display: "flex",
            height: "27%",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
            }}
          >
            {isEditingStatus ? (
              <>
                <h3
                  style={{
                    marginBottom: "5px",
                  }}
                >
                  My Status
                </h3>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    flexDirection: "column",
                    overflowY: "scroll",
                    alignItems: "center",
                  }}
                >
                  <textarea
                    autoFocus
                    rows={4}
                    onChange={(ev) => setCurrentStatus(ev.target.value)}
                    onBlur={() => finishEditing()}
                    value={currentStatus}
                    style={{
                      width: "80%",
                      maxWidth: "189px",
                      boxSizing: "border-box",
                      borderRadius: "5px",
                    }}
                  />
                  <button
                    onBlur={() => finishEditing()}
                    style={{
                      width: "80%",
                      maxWidth: "189px",
                      backgroundColor: "#B4D388",
                      borderRadius: "5px",
                    }}
                    className="cursor-pointer"
                  >
                    ✔️
                  </button>
                </div>
              </>
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => setIsEditingStatus(true)}
              >
                <h3 style={{ marginBottom: "0px" }}>My Status</h3>
                {currentStatus ? (
                  currentStatus.split("\n").map((v, i) => {
                    return (
                      <p key={v + i}>
                        {/* {i === 0 && "✏️"} */}
                        {v}
                      </p>
                    );
                  })
                ) : (
                  <p style={{ marginTop: "13px" }}>&lt;click to edit&gt;</p>
                )}
              </div>
            )}
          </div>

          <ToDoList
            localParticipantToDoList={localParticipantToDoList}
            localParticipant={localParticipant}
            setAllParticipantsToDo={setAllParticipantsToDo}
          />
        </section>
        <section
          style={{
            display: "flex",
            overflowY: "scroll",
            height: "calc(67% - 20px)",
            flexDirection: "column",
          }}
        >
          {Object.entries(participants).filter(([_, info]) => {
            return info.id !== localParticipant?.id;
          }).length !== 0
            ? localParticipant?.joinedAt && (
                <header style={{ display: "flex" }}>
                  <h3 style={{ width: "50%" }}>Other Statuses </h3>
                  <h3 style={{ width: "50%" }}>Other Todos</h3>
                </header>
              )
            : localParticipant?.joinedAt && <h3>No Other Users In Session</h3>}
          <div>
            {Object.entries(participants)
              .filter(([_, info]) => info.id !== localParticipant?.id)
              .map(([id, info], index, array) => {
                return (
                  <div
                    key={id}
                    style={{
                      border: "1px solid gray",
                      borderBottom: `${
                        index === array.length - 1 ? "1px solid gray" : "none"
                      }`,
                      borderTopLeftRadius: `${index === 0 ? "5px" : "0px"}`,
                      borderTopRightRadius: `${index === 0 ? "5px" : "0px"}`,
                      borderBottomLeftRadius: `${
                        index === array.length - 1 ? "5px" : "0px"
                      }`,
                      borderBottomRightRadius: `${
                        index === array.length - 1 ? "5px" : "0px"
                      }`,
                      display: "flex",
                    }}
                  >
                    <div
                      style={{ width: "50%", borderRight: "1px solid grey" }}
                    >
                      <p>
                        <strong>name:</strong> {info.name}
                      </p>

                      {id in userStatuses ? (
                        userStatuses[id].split("\n").map((v, i) => {
                          return <p key={v + i}>{v}</p>;
                        })
                      ) : (
                        <p>No Status</p>
                      )}
                    </div>
                    <div
                      style={{
                        width: "50%",
                        height: "100px",
                        overflowY: "scroll",
                      }}
                    >
                      {id in allParticipantsToDo ? (
                        <ul>
                          {Object.entries(allParticipantsToDo[id])
                            .sort((a, b) => {
                              return a[1].complete - b[1].complete;
                            })
                            .map((item) => {
                              return (
                                <li
                                  style={{
                                    textAlign: "left",
                                    textDecoration: `${
                                      item[1].complete ? "line-through" : ""
                                    }`,
                                    opacity: `${
                                      item[1].complete ? "0.5" : "1"
                                    }`,
                                  }}
                                >
                                  {item[1].content}
                                </li>
                              );
                            })}
                        </ul>
                      ) : (
                        <p>&lt;empty&gt;</p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          {/* </div> */}
        </section>
      </div>
    </div>
  );
}

export default Call;

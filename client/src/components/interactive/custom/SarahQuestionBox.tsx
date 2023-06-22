/**
 * Write a component that renders a question box with the following features:
 * - Syncs questions with the servers
 * - Lets users add a question with an input
 */
import { Unsubscribe } from "firebase/firestore";
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  acceptQuestion,
  addQuestionToSarahQuestions,
  deleteQuestion,
  syncQuestions,
} from "../../../lib/firestore/custom/sarahQuestions";
import { useRoomStore } from "../../../stores/roomStore";
import { useUserStore } from "../../../stores/userStore";
import classNames from "classnames";
import Draggable from "react-draggable";

const QuestionBox: React.FC = () => {
  const [questions, setQuestions] = useState<{ [key: string]: SarahQuestion }>({});
  let unsubRef = useRef<Unsubscribe>();
  let boxRef = createRef<HTMLDivElement>();
  const currentRoomID = useRoomStore(useCallback((s) => s.currentRoomID, []));
  const adminForIDs = useUserStore(useCallback((s) => s.adminFor, []));
  const isAdmin = useMemo(() => {
    if (adminForIDs && currentRoomID && adminForIDs.includes(currentRoomID)) {
      console.log("is admin");
      return true;
    }
    console.log("NOT ADMIN", adminForIDs);
    return undefined;
  }, [adminForIDs, currentRoomID]);

  const questionComponent = useCallback(
    (question: string, id: string, accepted: boolean) => {
      return (
        <div key={id} className={classNames("padded:s-1 relative", { contrastFill: accepted, grayFill: !accepted })}>
          {question}
          {isAdmin && (
            <div className="absoluteEnd horizontal-stack:s-2  whiteFill">
              <div className="opacity:hover clickable" onClick={() => deleteQuestion(id)}>
                ❌
              </div>
              {!accepted && (
                <div className="opacity:hover clickable" onClick={() => acceptQuestion(id)}>
                  ✅
                </div>
              )}
            </div>
          )}
        </div>
      );
    },
    [isAdmin]
  );
  const questionWasUpdated = useCallback(
    (cID, question, status) => {
      setQuestions((pc) => {
        let npc = { ...pc };
        npc[cID].status = status;
        return npc;
      });
    },
    [setQuestions]
  );

  const questionWasAdded = useCallback(
    (cID, chat) => {
      setQuestions((pc) => {
        let npc = { ...pc };
        npc[cID] = { question: chat };
        return npc;
      });
    },
    [setQuestions]
  );
  const questionWasRemoved = useCallback(
    (cID) =>
      setQuestions((pc) => {
        let npc = { ...pc };
        delete npc[cID];
        return npc;
      }),
    [setQuestions]
  );
  useEffect(() => {
    async function setupDB() {
      console.log("Setting up chat sync");
      if (unsubRef.current) {
        setQuestions({});
        unsubRef.current();
      }
      unsubRef.current = await syncQuestions(questionWasAdded, questionWasRemoved, questionWasUpdated);
    }
    setupDB();
    return () => {
      console.log("Destroying chat sync");
      if (unsubRef.current) unsubRef.current();
    };
  }, [questionWasAdded, questionWasRemoved, questionWasUpdated]);

  return (
    <Draggable handle=".handle" nodeRef={boxRef} defaultPosition={{ x: 10, y: 10 }}>
      <div className="stack:noGap absoluteOrigin high whiteFill white">
        <div className="handle" style={{ minHeight: "var(--sp0)", height: "var(--sp0)", background: "lightFill" }}>
          ...
        </div>
        <div className="stack padded:s-2">
          <QuestionInput onSubmit={addQuestionToSarahQuestions} />
          <div className="stack:s-2">
            <div className="caption">Accepted</div>
            {Object.entries(questions)
              .filter(([_, q]) => q.status == "ACCEPTED")
              .map(([id, q]) => questionComponent(q.question, id, true))}
          </div>
          <div className="stack:s-2">
            <div className="caption">Pending</div>
            {Object.entries(questions)
              .filter(([_, q]) => q.status != "ACCEPTED")
              .map(([id, q]) => questionComponent(q.question, id, false))}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

const QuestionInput: React.FC<{ onSubmit: (question: string) => void }> = ({ onSubmit }) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const submitMessage = useCallback(() => {
    if (currentMessage) {
      onSubmit(currentMessage);
    }
    setCurrentMessage("");
  }, [currentMessage, onSubmit]);

  return (
    <div className="fullWidth horizontal-stack align-middle">
      <input
        value={currentMessage}
        className="flex-1 padded:s-2"
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key == "Enter") {
            submitMessage();
          }
        }}
      />
      <div onClick={submitMessage} className="clickable contrastColor:hover">
        send
      </div>
    </div>
  );
};

export default QuestionBox;

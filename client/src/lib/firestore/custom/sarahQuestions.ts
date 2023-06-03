import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { sarahQuestionsCollection } from "../locations";

export function addQuestionToSarahQuestions(question: string) {
  return addDoc(sarahQuestionsCollection(), { question: question });
}

export function acceptQuestion(id: string) {
  const questionInstance = doc(sarahQuestionsCollection(), id);
  setDoc(questionInstance, { status: "ACCEPTED" }, { merge: true });
}

export function deleteQuestion(id: string) {
  const questionInstance = doc(sarahQuestionsCollection(), id);
  deleteDoc(questionInstance);
}

export function syncQuestions(
  questionAdded: (id: string, question: string) => void,
  questionRemoved: (id: string) => void,
  questionUpdated: (id: string, question: string, status: string) => void
) {
  const unsub = onSnapshot(sarahQuestionsCollection(), (docs) => {
    docs.docChanges().forEach((change) => {
      let question = change.doc;
      if (change.type === "added") {
        questionAdded(question.id, question.data().question);
      }
      if (change.type === "removed") {
        questionRemoved(question.id);
      }
      if (change.type === "modified") {
        questionUpdated(question.id, question.data().question, question.data().status);
      }
    });
  });
  return unsub;
}

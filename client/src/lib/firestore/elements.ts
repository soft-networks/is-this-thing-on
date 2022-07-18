import { addDoc, onSnapshot, query, where } from "firebase/firestore";
import { sanitizeElementForDB, sanitizeElementFromDB, validateRoomName } from "./converters";
import { elementCollection, roomDoc } from "./locations";

export function syncInteractiveElements(
  roomName: string,
  behaviorType: string,
  addInteractiveElement: (id: string, element: InteractiveElement) => void,
  removeInteractiveElement: (id: string) => void
) {
  if (!validateRoomName(roomName)) {
    return;
  }
  const elements = elementCollection(roomDoc(roomName));
  const q = query(elements, where("behavior_type", "==", behaviorType));

  const unsub = onSnapshot(q, (docs) => {
    docs.docChanges().forEach((change) => {
      let element = change.doc;
      if (change.type === "added") {
        const sanitizedElement =  sanitizeElementFromDB(change.doc.data());
        console.log("eyyy element" , sanitizedElement);
        addInteractiveElement(element.id, sanitizedElement);
      }
      if (change.type === "modified") {
      }
      if (change.type === "removed") {
        removeInteractiveElement(element.id);
      }
    });
  });
  return unsub;
}

export async function addInteractiveElement(roomName: string, element: InteractiveElement) {
  const chats = elementCollection(roomDoc(roomName));
  await addDoc(chats, sanitizeElementForDB(element));
}

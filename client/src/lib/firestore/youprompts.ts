import { doc, onSnapshot } from "firebase/firestore";
import { statsCollection } from "./locations";

export function syncYouPrompts(callback: (prompts: string[]) => void) {
    const youPrompts = doc(statsCollection(), "you_prompts");
    const unsubscribe = onSnapshot(youPrompts, (doc) => {
        const data = doc.data();
        if (data && typeof data === 'object') {
            // If prompts is an object/dictionary, get just the values
            const prompts = Object.values(data);
            callback(prompts as string[]);
        } else {
            callback([]);
        }
    });
    return unsubscribe;
}   
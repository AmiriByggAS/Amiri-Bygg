import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper to save a media key-value pair to Firestore
export const saveGlobalMediaSetting = async (key: string, value: string | null) => {
  try {
    const docRef = doc(db, "amiri_settings", key);
    if (value === null) {
      await setDoc(docRef, { value: null });
    } else {
      await setDoc(docRef, { value });
    }
    console.log(`Successfully saved ${key} to global Firestore database.`);
  } catch (err) {
    console.error("Error saving global setting:", err);
    throw err;
  }
};

// Helper to fetch all global media settings and sync to localStorage
export const syncGlobalMediaToLocal = async (): Promise<Record<string, string>> => {
  const result: Record<string, string> = {};
  try {
    const colRef = collection(db, "amiri_settings");
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const key = docSnap.id;
      if (key === "media") {
        // Backwards compatibility with legacy combined 'media' doc
        Object.entries(data).forEach(([mKey, mVal]) => {
          if (typeof mVal === "string") {
            localStorage.setItem(mKey, mVal);
            result[mKey] = mVal;
          }
        });
      } else if (data && typeof data.value === "string") {
        localStorage.setItem(key, data.value);
        result[key] = data.value;
      } else if (data && data.value === null) {
        localStorage.removeItem(key);
      }
    });
  } catch (err) {
    console.error("Error syncing global media settings:", err);
  }
  return result;
};

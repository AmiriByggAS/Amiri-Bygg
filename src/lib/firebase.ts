import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper to save a media key-value pair to Firestore
export const saveGlobalMediaSetting = async (key: string, value: string | null) => {
  try {
    const docRef = doc(db, "amiri_settings", "media");
    // Get existing doc to merge
    let currentData: Record<string, any> = {};
    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        currentData = snap.data();
      }
    } catch (e) {
      console.warn("Failed to read settings doc, creating fresh:", e);
    }

    if (value === null) {
      delete currentData[key];
    } else {
      currentData[key] = value;
    }

    await setDoc(docRef, currentData);
    console.log(`Successfully saved ${key} to global Firestore database.`);
  } catch (err) {
    console.error("Error saving global setting:", err);
  }
};

// Helper to fetch all global media settings and sync to localStorage
export const syncGlobalMediaToLocal = async (): Promise<Record<string, string>> => {
  try {
    const docRef = doc(db, "amiri_settings", "media");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      Object.entries(data).forEach(([key, val]) => {
        if (typeof val === "string") {
          localStorage.setItem(key, val);
        }
      });
      return data as Record<string, string>;
    }
  } catch (err) {
    console.error("Error syncing global media settings:", err);
  }
  return {};
};

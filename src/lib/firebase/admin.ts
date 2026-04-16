import {
  cert,
  getApps,
  initializeApp,
  applicationDefault,
} from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import {
  getFirestore as getAdminFirestore,
  FieldValue,
} from "firebase-admin/firestore";
import { getStorage as getAdminStorage } from "firebase-admin/storage";
function init() {
  if (getApps().length) return getApps()[0];
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey && privateKey.includes("\\n"))
    privateKey = privateKey.replace(/\\n/g, "\n");
  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  return initializeApp({
    credential: applicationDefault(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}
const app = init();
export const adminAuth = getAdminAuth(app);
export const adminDb = Object.assign(getAdminFirestore(app), { FieldValue });
export const adminStorage = getAdminStorage(app);

import {
  cert,
  getApps,
  initializeApp,
  applicationDefault,
  type App,
} from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import {
  getFirestore as getAdminFirestore,
  FieldValue,
} from "firebase-admin/firestore";
import { getStorage as getAdminStorage } from "firebase-admin/storage";

function init(): App {
  if (getApps().length) return getApps()[0];
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey && privateKey.includes("\\n"))
    privateKey = privateKey.replace(/\\n/g, "\n");
  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch {
      // Fall through to applicationDefault
    }
  }
  return initializeApp({
    credential: applicationDefault(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

// Lazy singleton — only initialised on first actual use, not at import time
let _app: App | undefined;
function getApp(): App {
  if (!_app) _app = init();
  return _app;
}

export const adminAuth = new Proxy({} as ReturnType<typeof getAdminAuth>, {
  get(_, prop) {
    return (getAdminAuth(getApp()) as any)[prop];
  },
});
export const adminDb = new Proxy(
  Object.assign({}, { FieldValue }) as ReturnType<typeof getAdminFirestore> & { FieldValue: typeof FieldValue },
  {
    get(_, prop) {
      if (prop === "FieldValue") return FieldValue;
      return (getAdminFirestore(getApp()) as any)[prop];
    },
  }
);
export const adminStorage = new Proxy({} as ReturnType<typeof getAdminStorage>, {
  get(_, prop) {
    return (getAdminStorage(getApp()) as any)[prop];
  },
});

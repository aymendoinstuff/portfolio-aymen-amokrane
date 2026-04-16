/* eslint-disable @typescript-eslint/no-explicit-any */
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
const [, , email] = process.argv;
if (!email) {
  console.error(
    "Provide an email: ts-node scripts/setAdminClaim.ts email@example.com"
  );
  process.exit(1);
}
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  } as any),
});
(async () => {
  const auth = getAuth(app);
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { admin: true, allowlisted: true });
  console.log("Set admin claims for", email);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

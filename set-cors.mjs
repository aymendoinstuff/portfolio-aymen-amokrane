import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: "portfolio-aymen-amokrane",
  credentials: {
    client_email: "firebase-adminsdk-fbsvc@portfolio-aymen-amokrane.iam.gserviceaccount.com",
    private_key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDX2cdVpw51CXu2
i4JWWE7ZDD2jSePJn91kimHJuhymLAVNBc0h6LdmCb+tyAzPXW66jsDoa5Rb8JS+
FqoAP2tPak8L2Ze9/sI4cFBFZqyQX+NVBbQ9AG3wihEDtB3E1QSG3Qf0K8Ce90WI
yu+s2yV5al1QIeuWj+jkZAmNIcXrRBoBTXCSlzTKnk00zTO5gLd2hWb9eyj9IcHb
D3d6vXIy7TWz5RH7T70Sanxb9agJHVZJlLyxZ4cmVPYvc+QRHWaSbLn+vYIdd53j
rA4JeyOHISzdkuRhNlSZYtQDe1uBaVlEmLyGKuJ47JU307yO2pE6OT3FBNXznpk4
YgdGXJerAgMBAAECggEABPA5mRV4xWeEvUXVCVt9ELnKXmyeJoqR/e8TxhHyl9nh
lF2+nLj+gS1V6+7r906TuvbxjB++xcyFfd5DRqNgAotT6NlLzHZoqr8YrXQ06U5L
g2V3AzJGuAsgnboTa3s7Xq6HgQ5pml/dgMyyNEoE26tGtg+gnGtvqgU6TR1QGIE5
AtYvHCe0D2FBPhal75/uRjFYxJLUArD/aItsw19uiUzz6UDcbs9ZTdcVTO1P50ym
7TOSVVvB1n+vpHR7y6c14UCE74nwbR/5Wd4eJbp+or/arpm/QmopMAlnIV0eZkuL
YPy04eRcQXui7SFdvdCjOoOkvaUCAAsRkDbXYKig2QKBgQDuI6Tl1mKyDwiCpFx8
7AUJTPzboIjx0pieMRyHexXlQDm+0uVXFKjhyLixgnU21IC2Mn5JHTtqfppLul7M
Sy+pgb4tapukKqNUJSBmXvwk/5SFV4I23WgcIeQlcgQfH9zCw3qMMMWDpdO5b4oY
/qsOH7dA4T3O9zreAUlsbBWZZQKBgQDoCi/XZ9NcIedu0ihi9ZgtGYPN/1mUxtv2
f0swZnjRoRMS7frDmKnGFZ9c9n2I1VCtkbFadWPxYaNr+nkiik6XQPdAC5mO4yfd
72XrghfO4wxKXIDXJYWxJITvufSp/ZOKkImr8ihTEhUiimXDhyyi5xHxMkpH20FY
G0P5FM3jzwKBgG+/5ke8vP/VsiasPoKYtxxQNnBR+zGPo/LIFR02k2XLJ832ZYzh
swaRDKqwD5U1T1kwhLaGszUcSAe1Y3r25Vzj93yUhIkbQR3hdjzT4fryvJ1+HSrl
508cUFWKFYkNiKkU1lMnJ+jJTnu8bc+g4mB0XahiioCu378CV5Q7fD9JAoGBANgu
dXgYcSCLLdVf0uSvr4GFHflUB5/GzbQP0HtdXP7hNKYUNeb5WmMETh8MPtS2+J1c
+YEvkVeYAetdxnHZrXLZwgFXTU+EbuYkXi5WW9wSSKcXG6pWeQIa5gd6lmmxqD4W
f01FJTCPzkUJ79mFHJ8A7QRsOCxOJ8jwThnHujKdAoGBALaKyxh93xkcNaRsNV9O
VBLe2Ed7dCjqLiNoW3/KC3R83MdbFmeQ1y3yhpd0viHKsLWU7OQE+88iZrBkV7qQ
POyB2Zekam53wKbKyPDtDDY0j4qI1o3EThquz79g/YyQ01761DPnkAF68cYsYISB
PXLqx/cOosBN9p9YEnoWc12u
-----END PRIVATE KEY-----
`,
  },
});

const corsConfig = [
  {
    origin: ["*"],
    method: ["GET", "POST", "PUT", "DELETE", "HEAD"],
    maxAgeSeconds: 3600,
    responseHeader: ["Content-Type", "Content-Disposition", "Authorization"],
  },
];

async function setCors() {
  try {
    // Try new Firebase Storage bucket format first, fallback to old
    const buckets = [
      "portfolio-aymen-amokrane.firebasestorage.app",
      "portfolio-aymen-amokrane.appspot.com",
    ];
    for (const name of buckets) {
      try {
        await storage.bucket(name).setCorsConfiguration(corsConfig);
        console.log(`✅ CORS set successfully on bucket: ${name}`);
        return;
      } catch (e) {
        console.log(`⚠️  Skipping ${name}: ${e.message}`);
      }
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

setCors();

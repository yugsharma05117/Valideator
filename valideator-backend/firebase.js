const admin = require("firebase-admin");

let serviceAccount;

// In production (Render), use the FIREBASE_SERVICE_ACCOUNT env variable
// In development, use the local serviceAccountKey.json file
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require("./serviceAccountKey.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;
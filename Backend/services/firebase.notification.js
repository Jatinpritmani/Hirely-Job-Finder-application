const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
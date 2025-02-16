const admin = require("firebase-admin");
// const serviceAccount = JSON.parse(process.env.FIREBASE);
const serviceAccount = require("./firebase-admin.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
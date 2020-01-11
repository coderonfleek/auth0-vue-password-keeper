import firebase from "firebase/app";
import "firebase/firestore";
import { project_id, db_url } from "../firebase_auth.json";

// Get a Firestore instance
const db = firebase
  .initializeApp({ projectId: project_id, databaseURL: db_url })
  .firestore();

export default db;

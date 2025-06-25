import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

let currentUser = null;

const $ = (sel) => document.querySelector(sel);

$("#login").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    currentUser = result.user;
    alert(`Signed in as ${currentUser.displayName}`);
  } catch (err) {
    console.error(err);
    alert("Sign-in failed :(");
  }
});

$("#uploadBtn").addEventListener("click", async () => {
  if (!currentUser) return alert("Please sign in first");
  const file = $("#fileInput").files[0];
  if (!file) return alert("Choose a file");

  if (file.size > 10 * 1024 * 1024) return alert("File exceeds 10 MB");

  const storageRef = ref(storage, `uploads/${currentUser.uid}/${file.name}`);
  try {
    await uploadBytes(storageRef, file);
    alert("Upload complete!");
  } catch (err) {
    console.error(err);
    alert("Upload failed :( Check console for details.");
  }
});

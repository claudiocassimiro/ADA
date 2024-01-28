import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Chatbot from "./components/Chatbot";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import "//unpkg.com/mathlive";
import { MathfieldElement } from "mathlive";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzNJYKiXdpcm4l5305ucLqR-orScV0RSQ",
  authDomain: "childbot-learner.firebaseapp.com",
  projectId: "childbot-learner",
  storageBucket: "childbot-learner.appspot.com",
  messagingSenderId: "154897393195",
  appId: "1:154897393195:web:0d9f624e6242880a4cec6e",
  measurementId: "G-NMYTY4XDPK",
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >;
    }
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [value, setValue] = useState<string>("");
  const mf = useRef<any>();

  // Customize the mathfield when it is created
  useEffect(() => {
    mf.current.mathVirtualKeyboardPolicy = "manual";
    mf.current.addEventListener("focusin", (evt: any) => {
      window.mathVirtualKeyboard.show();
      window.mathVirtualKeyboard.layouts = ["compact"];
    });
    mf.current.addEventListener("focusout", (evt: any) =>
      window.mathVirtualKeyboard.hide()
    );
  }, [mf]);

  return (
    <div className="App">
      <Chatbot value={value} />
      <math-field
        ref={mf}
        onInput={(evt: React.ChangeEvent<MathfieldElement>) =>
          setValue(evt.target.value)
        }
      >
        {value}
      </math-field>
    </div>
  );
}

export default App;

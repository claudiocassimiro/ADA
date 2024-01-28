import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Chatbot from "./components/Chatbot";

import "//unpkg.com/mathlive";
import { MathfieldElement } from "mathlive";

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

function App() {
  const [value, setValue] = useState<string>("");
  const mf = useRef<any>();

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

import PTAL from "../ptal";
import Renderer from "./renderer";

import { useState, useEffect } from "react";

import Div from "../tags/div";

let val: React.ReactElement

function App() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const secondsInterval = setInterval(() => setTime(new Date()), 1_000);
    return () => clearInterval(secondsInterval);
  }, []);
  return (
    <div
      style={{
        backgroundColor: [210, 30, 30],
        width: [100, "%"],
        height: [100, "%"],
      }}
    >
      It is currently {time.toLocaleString()}
      <div
        style={{
          backgroundColor: [10, 30, 230],
          width: [10, "w"],
          height: [10, "h"],
        }}
      >
        Oh hey! I have yet to work on the margins and paddings<br />
        and the overflow<br />
        and text backgroundColor as well<br />
        actually
      </div>
    </div>
  );
}

Renderer.render(<App />, new PTAL());

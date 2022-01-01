import PTAL from "../ptal";
import Renderer from "./renderer";

import { useState, useEffect } from "react";

function App() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const secondsInterval = setInterval(() => setSeconds(seconds + 1), 1_000);
    return () => clearInterval(secondsInterval);
  });
  return (
    <div style={{ backgroundColor: [255, 0, 0], width: [100, '%'], height: [100, '%']  }}>
      errrrr wait hold on {seconds}
    </div>
  );
}

Renderer.render(<App />, new PTAL());

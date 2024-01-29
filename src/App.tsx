import { AmbientClock } from "./AmbientClock";

function App() {
  return (
    <div
      style={{
        display: "flex",
        gap: "3rem",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <AmbientClock />
    </div>
  );
}

export default App;

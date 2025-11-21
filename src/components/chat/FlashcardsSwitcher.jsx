import { useState } from "react";

const { default: StageCard } = require("./StageCard");
const { default: StageFlashcards } = require("./StageFlashcards");

export default function FlashcardsSwitcher() {
  const [mode, setMode] = useState("list");
  if (mode === "view") {
    return <StageFlashcards onBack={() => setMode("list")} title="الدرس الأول" total={18} index={1} />;
  }
  return (
    <div className="mt-4 space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <StageCard key={i} title={`القسم ${i + 1}`} stagesCount={5} progress={89} onOpen={() => setMode("view")} />
      ))}
    </div>
  );
}


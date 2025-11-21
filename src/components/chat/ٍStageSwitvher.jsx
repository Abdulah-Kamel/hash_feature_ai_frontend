import { useState } from "react";
import StageDetail from "./StageDetail";
import StageCard from "./StageCard";
import StageLearn from "./StageLearn";

export default function StageSwitcher() {
  const [mode, setMode] = useState("list");
  if (mode === "detail") {
    return <StageDetail onBack={() => setMode("list")} onLearn={() => setMode("learn")} title="القسم الأول" />;
  }
  if (mode === "learn") {
    return <StageLearn onBack={() => setMode("detail")} title="القسم الأول - المرحلة الأولى: الذكاء الاصطناعي" />;
  }
  return (
    <div className="space-y-4">
      <StageCard title="القسم الأول + القسم الثاني" stagesCount={5} progress={89} onOpen={() => setMode("detail")} />
      <StageCard title="القسم الأول" stagesCount={5} progress={89} onOpen={() => setMode("detail")} />
    </div>
  );
}
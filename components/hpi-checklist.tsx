import { hpiQuestions } from "@/lib/mock-data";

export function HpiChecklist({ completed = 7 }: { completed?: number }) {
  return (
    <div className="hpi-list">
      {hpiQuestions.map((item, index) => (
        <div className={index < completed ? "card success" : "card"} key={item.field}>
          <span className="status info">{index + 1} / 7</span>
          <strong>{item.label}</strong>
          <p>{item.question}</p>
          <p>{index < completed ? item.answer : "Waiting for response"}</p>
        </div>
      ))}
    </div>
  );
}

import React from "react";
import "./TaskList.css";

const TaskList = ({ section, handleAnswer, answers, results }) => {
  return (
    <div className="task-list">
      {section.tasks?.map((task) => {
        const options = Array.isArray(task.options)
          ? task.options
          : JSON.parse(task.options || "[]");

        return (
          <div key={task.id} className="task-card">
            <p>{task.question}</p>

            <div className="task-options">
              {options.map((opt, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`task-${task.id}`}
                    checked={answers?.[task.id] === i}
                    onChange={() => handleAnswer(task.id, i)}
                    disabled={!!results?.[section.id]}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;

import React from "react";
import "./TaskList.css";

const TaskList = ({ section, handleAnswer }) => {
  return (
    <div className="task-list">
      {section.tasks?.map((task) => (
        <div className="task-card" key={task.id}>
          <div className="task-question">{task.question}</div>

          <div className="task-options">
            {task.answer !== undefined ? (
              <>
                <label className="task-option">
                  <input
                    type="radio"
                    name={task.id}
                    onChange={() => handleAnswer(task.id, true)}
                  />
                  True
                </label>

                <label className="task-option">
                  <input
                    type="radio"
                    name={task.id}
                    onChange={() => handleAnswer(task.id, false)}
                  />
                  False
                </label>
              </>
            ) : (
              task.options?.map((opt, i) => (
                <label className="task-option" key={i}>
                  <input
                    type="radio"
                    name={task.id}
                    onChange={() => handleAnswer(task.id, i)}
                  />
                  {opt}
                </label>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
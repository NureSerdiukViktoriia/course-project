import React from "react";
import "./TaskList.css";
import pencilIcon from "../../assets/pencil.png";
import deleteIcon from "../../assets/delete.png";

const TaskList = ({
  section,
  handleAnswer,
  answers,
  results,
  isAdmin,
  openCreateTask,
  openEditTask,
  deleteTask,
}) => {
  if (!section) return null;

  const tasks = Array.isArray(section.tasks) ? section.tasks : [];

  return (
      <div className="task-list">
      {tasks.length === 0 && <p style={{ opacity: 0.6 }}>Немає завдань</p>}

      {tasks.map((task) => {
        if (!task) return null;

        let options = [];

        try {
          options = Array.isArray(task.options)
            ? task.options
            : JSON.parse(task.options || "[]");
        } catch (e) {
          console.error("Invalid options JSON:", task.options);
          options = [];
        }

        return (
          <div key={task.id} className="task-card">
            {isAdmin && (
              <div className="admin-actions-task">
                <button
                  className="edit-button"
                  onClick={() => {
                    if (typeof openEditTask === "function") {
                      openEditTask(task);
                    } else {
                      console.error("openEditTask is not a function");
                    }
                  }}
                >
                  <img src={pencilIcon} alt="Edit" />
                </button>

                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id, section.id)}
                >
                  <img src={deleteIcon} alt="Delete" />
                </button>
              </div>
            )}

            <p>{task.question || "No question"}</p>

            <div className="task-options">
              {options.length === 0 && (
                <p style={{ opacity: 0.5 }}>Немає варіантів</p>
              )}

              {options.map((opt, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`task-${task.id}`}
                    checked={answers?.[task.id] === i}
                    onChange={() => {
                      if (typeof handleAnswer === "function") {
                        handleAnswer(task.id, i);
                      }
                    }}
                    disabled={!!results?.[section.id]}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        );
      })}
      {isAdmin && section?.id && (
        <button
          className="open-admin-btn"
          onClick={() => openCreateTask(section.id)}
        >
          Додати завдання
        </button>
      )}
    </div>
  );
};

export default TaskList;

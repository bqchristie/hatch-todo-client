import React from "react";
import { Task } from "./Task";

export function Lane({
  query,
  tasks,
  status,
  activeTaskForm,
  handleChangeTaskStatus,
  handleDeleteTask,
  onClick,
  onSubmit,
}) {
  const visibleTasksMessage = () => {
    const completedTasks = tasks.filter((task) => task.status === "DONE");
    return completedTasks.length > 10
      ? `Showing 1-10 of ${completedTasks.length}`
      : "";
  };

  const filteredTasks = tasks
    .filter((task, idx) => {
      const isCurrentStatus = task.status === status;
      const isNotPastMax = task.status === "DONE" ? idx < 10 : true;
      const isMatch = !query ? true : task?.description.includes(query);
      console.log(isMatch, query, task?.description);
      return isCurrentStatus && isNotPastMax && isMatch;
    })
    .sort((taskA, taskB) => taskA.description.localeCompare(taskB.description));

  return (
    <div
      className={"lane"}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("task-id");
        handleChangeTaskStatus(taskId, status);
      }}
    >
      <h2>{status.toLowerCase()}</h2>
      {filteredTasks &&
        filteredTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDragStart={(ev, id) => {
              const taskId = ev.target.attributes["data-id"].value;
              ev.dataTransfer.setData("task-id", taskId);
            }}
            onClick={() => handleDeleteTask(task.id)}
          />
        ))}
      {status === "DONE" && filteredTasks.length > 10 && (
        <div className={"visible-task-message"}>{visibleTasksMessage()}</div>
      )}
      {filteredTasks.length === 0 && (
        <div className={"visible-task-message"}>
          {"This list has no tasks."}
        </div>
      )}

      <div>
        <div
          class={`add-task-toggle  ${
            status === activeTaskForm ? "hidden" : ""
          }`}
          onClick={onClick}
        >
          <span className={`material-symbols-outlined`}>add</span>
          Add a new task
        </div>
        <form
          name={"taskForm"}
          onSubmit={onSubmit}
          className={`task ${status === activeTaskForm ? "active" : ""}`}
        >
          <textarea
            type="text"
            name="taskText"
            rows="6"
            placeholder="Enter a new task"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                document.getElementById(`submit-button-${status}`).click();
              }
            }}
          />
          <button type="submit" id={`submit-button-${status}`}>
            <span className="material-symbols-outlined">add</span>Add Task
          </button>
        </form>
      </div>
    </div>
  );
}

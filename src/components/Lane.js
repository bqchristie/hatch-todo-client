import React from "react";
import { Task } from "./Task";

export function Lane(props) {
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
        props.handleChangeTaskStatus(taskId, props.status);
      }}
    >
      <h2>{props.status}</h2>
      {props.tasks &&
        props.tasks
          .filter((task, idx) => {
            const isCurrentStatus = task.status === props.status;
            const isNotPastMax = task.status === "DONE" ? idx < 10 : true;
            return isCurrentStatus && isNotPastMax;
          })
          .sort((taskA, taskB) =>
            taskA.description.localeCompare(taskB.description),
          )
          .map((task) => (
            <Task
              key={task.id}
              task={task}
              onDragStart={(ev, id) => {
                const taskId = ev.target.attributes["data-id"].value;
                ev.dataTransfer.setData("task-id", taskId);
              }}
              onClick={() => props.handleDeleteTask(task.id)}
            />
          ))}
      <div>
        <div
          class={`add-task-toggle  ${
            props.status === props.activeTaskForm ? "hidden" : ""
          }`}
          onClick={props.onClick}
        >
          <span className={`material-symbols-outlined`}>add</span>
          Add a new task
        </div>
        <form
          onSubmit={props.onSubmit}
          className={props.status === props.activeTaskForm ? "active" : ""}
        >
          <textarea
            type="text"
            name="taskText"
            rows="6"
            placeholder="Enter a new task"
          />
          <button type="submit">
            <span className="material-symbols-outlined">add</span>Add Task
          </button>
        </form>
      </div>
    </div>
  );
}

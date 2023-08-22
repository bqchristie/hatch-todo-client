import React from "react";

export function Task(props) {
  return (
    <div
      data-id={props.task.id}
      draggable={true}
      className={"task"}
      onDragStart={props.onDragStart}
    >
      {props.task.description}
      <span className="material-symbols-outlined" onClick={props.onClick}>
        delete
      </span>
    </div>
  );
}

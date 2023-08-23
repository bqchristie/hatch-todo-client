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
      <div>
        <span
          className="material-symbols-outlined"
          onClick={props.handleDuplicate}
          title={"duplicate"}
        >
          content_copy
        </span>
        <span
          className="material-symbols-outlined"
          onClick={props.handleDelete}
          title={"delete"}
        >
          delete
        </span>
      </div>
    </div>
  );
}

import React from "react";

export function TopControls({
  setQuery,
  handleDeleteAllTasks,
  handleGenerateTasks,
}) {
  return (
    <div className={"top-controls"}>
      <div className="search">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </div>
      <div class={"actions"}>
        <button onClick={() => handleGenerateTasks()} className={"action"}>
          <span className="material-symbols-outlined">bolt</span> Generate Data
        </button>
        <button onClick={() => handleDeleteAllTasks()}>
          <span className="material-symbols-outlined">warning</span> Clear All
          Tasks
        </button>
      </div>
    </div>
  );
}

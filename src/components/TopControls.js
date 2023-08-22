import React from "react";

export function TopControls({ setQuery, handleDeleteAllTasks }) {
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
      <div>
        <button onClick={() => handleDeleteAllTasks()}>
          <span className="material-symbols-outlined">warning</span> Clear All
          Tasks
        </button>
      </div>
    </div>
  );
}

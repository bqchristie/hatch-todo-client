import React from "react";

export function TopControls({ setQuery, handleDeleteTask }) {
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
        <a href={"#"} onClick={() => handleDeleteTask("truncate")}>
          Clear All Tasks
        </a>
      </div>
    </div>
  );
}

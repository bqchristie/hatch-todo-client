import React from "react";

export function TopControls() {
  return (
    <div className={"top-controls"}>
      <div className="search">
        <span className="material-symbols-outlined">search</span>
        <input type="text" placeholder="Search" />
      </div>
      <div>
        <a href={"#"}>Clear All Tasks</a>|<a href={"#"}>Generate Sample Data</a>
      </div>
    </div>
  );
}

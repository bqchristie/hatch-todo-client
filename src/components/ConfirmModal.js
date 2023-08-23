import React from "react";

export function ConfirmModal({
  setShowConfirmationModal,
  handleDeleteAllTasks,
}) {
  return (
    <div className="modal">
      <span
        onClick={() => setShowConfirmationModal(false)}
        className="close"
        title="Close Modal"
      >
        &times;
      </span>
      <form className="modal-content">
        <div className="container">
          <h1>Delete All Tasks</h1>
          <p>Are you sure you want to clear all tasks?</p>

          <div className="buttons">
            <button
              type="button"
              className="cancelbtn"
              onClick={() => setShowConfirmationModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="deletebtn"
              onClick={() => handleDeleteAllTasks()}
            >
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

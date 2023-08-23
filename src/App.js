import React, { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { Lane } from "./components/Lane";
import { TopControls } from "./components/TopControls";
import { ConfirmModal } from "./components/ConfirmModal";

const API_URL = process.env.REACT_APP_API_BASE_URL + "/task";
const fetchTasks = async () => {
  const response = await fetch(API_URL); // Replace with your API endpoint
  const data = await response.json();
  return data;
};

const addTask = async (task) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  return data;
};

const updateTask = async (updatedTask) => {
  const response = await fetch(`${API_URL}/${updatedTask.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  });
  const data = await response.json();
  return data;
};

const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

const App = () => {
  // adding a general window listener for the escape key which will close any open forms or modals
  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setActiveTaskForm(null);
        setNewListName(null);
        setCreateListActive(false);
      }
    });
  }, []);

  //TODO: ok i am starting to get a lot of useState variables here.
  // probably makes sense to introduce a local state management object to consolidate all of these (or redux)

  const [query, setQuery] = useState("");
  const [createListActive, setCreateListActive] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [newListName, setNewListName] = useState(null);
  const [activeTaskForm, setActiveTaskForm] = useState("null");
  const [showConfirmationModal, setShowConfirmationModal] = useState(true);

  const queryClient = useQueryClient();
  const { data: tasks, error, isLoading } = useQuery("tasks", fetchTasks);

  const addList = (listName) => {
    // In the absence of list sorting (TODO), we'll just add the new list to the end of the array but before the DONE list.
    let updatedStatuses = [...statuses];
    const done = updatedStatuses.pop();
    updatedStatuses.push(listName.toUpperCase());
    updatedStatuses.push(done);
    setStatuses(updatedStatuses);
  };

  // Make sure we do a refresh every minute, so we don't get show stale data. can tune as required.
  setTimeout(() => {
    queryClient.invalidateQueries("tasks");
  }, 60000);

  // OK this is a work-around while we are not persisting new statuses and their order.
  // We can derive the statuses from the tasks themselves.  But this does not account
  // status order. So ok for demo but not for production. Know issue.
  useEffect(() => {
    if (tasks && statuses.length === 0) {
      const statuses = tasks.reduce(
        (acc, task) => {
          if (!acc.includes(task.status)) {
            acc.push(task.status);
          }
          return acc;
        },
        ["NEW", "IN PROGRESS", "DONE"],
      );
      setStatuses(statuses);
    }
  }, [tasks]);

  // This effect will run every time the query changes but is deboucned by 500ms so
  // we don't spam the console with every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("Query:", query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const addTodoMutation = useMutation(addTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  const updateTaskMutation = useMutation(updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  const deleteTaskMutation = useMutation(deleteTask, {
    onSettled: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  const handleChangeTaskStatus = async (taskId, status) => {
    const task = tasks.find((task) => task.id === Number(taskId));
    const updatedTask = { ...task, status: status };
    updateTaskMutation.mutate(updatedTask);
  };

  const handleDeleteTask = async (taskId) => {
    deleteTaskMutation.mutate(taskId);
  };

  /**
   * Deletes all tasks.
   * @returns {Promise<void>}
   */
  const handleDeleteAllTasks = async () => {
    deleteTaskMutation.mutate(-1);
    setShowConfirmationModal(false);
    setStatuses([]);
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    const task = {
      description: e.target.elements.taskText.value,
      status: status,
    };
    addTodoMutation.mutate(task);
    setActiveTaskForm(null);
    e.target.reset();
  };

  const handleGenerateTasks = async () => {
    const task = {
      status: "NEW",
      description: "GENERATE",
    };
    addTodoMutation.mutate(task);
    setStatuses([]);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Marvelous 2.0</h1>
      <TopControls
        {...{ setQuery, setShowConfirmationModal, handleGenerateTasks }}
      />
      {/* TODO: refactor into lane component.  Maybe introduce context so we arent; passing around props*/}
      <div className={"lanes"}>
        {statuses.map((status) => {
          const props = {
            status,
            tasks,
            query,
            activeTaskForm,
            handleChangeTaskStatus,
            handleDeleteTask,
            onClick: () => {
              setActiveTaskForm(status);
            },
            onSubmit: (event) => handleSubmit(event, status),
          };
          return <Lane key={status} {...props} />;
        })}
        <div className={`lane new-list ${createListActive ? "active" : ""}`}>
          <h2
            // onClick={addList}
            onClick={() => {
              setNewListName(null);
              setCreateListActive(true);
              document.getElementById("list-name").value = "";
            }}
          >
            <span className="material-symbols-outlined">add</span>
            Add another list
          </h2>
          <form>
            <input
              type="text"
              id={"list-name"}
              placeholder={"Enter list name"}
              onChange={(e) => {
                setNewListName(e.target.value.toUpperCase());
              }}
            />
            <button
              disabled={!newListName || statuses.includes(newListName)}
              type="submit"
              onClick={(e) => {
                addList(newListName);
                setCreateListActive(false);
              }}
            >
              Add List
            </button>
          </form>
        </div>
      </div>
      {showConfirmationModal && (
        <ConfirmModal {...{ setShowConfirmationModal, handleDeleteAllTasks }} />
      )}
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { Lane } from "./components/Lane";
import { TopControls } from "./components/TopControls";

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
  const [query, setQuery] = useState("");

  const [statuses, setStatuses] = useState(["NEW", "DONE"]);
  const [activeTaskForm, setActiveTaskForm] = useState();
  const queryClient = useQueryClient();
  const { data: tasks, error, isLoading } = useQuery("tasks", fetchTasks);

  const addList = () => {
    const updatedStatuses = [...statuses, "IN PROGRESS"];
    setStatuses(updatedStatuses);
  };

  setTimeout(() => {
    queryClient.invalidateQueries("tasks");
  }, 60000);

  useEffect(() => {}, [tasks]);

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
    onSuccess: () => {
      debugger;
      queryClient.invalidateQueries("tasks");
    },
  });

  const handleChangeTaskStatus = async (taskId, status) => {
    const task = tasks.find((task) => task.id == taskId);
    const updatedTask = { ...task, status: status };
    updateTaskMutation.mutate(updatedTask);
  };

  const handleDeleteTask = async (taskId) => {
    // const task = tasks.find((task) => task.id == taskId);
    deleteTaskMutation.mutate(taskId);
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Marvelous 2.0</h1>
      <TopControls {...{ setQuery, handleDeleteTask }} />
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
        <div className={"lane new-list"}>
          <h2 onClick={addList}>Add another list</h2>
        </div>
      </div>
    </div>
  );
};

export default App;

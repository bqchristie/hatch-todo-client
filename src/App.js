import React, {useEffect, useState} from 'react';

import {useQuery, useMutation, useQueryClient} from 'react-query';

const fetchTasks = async () => {
    const response = await fetch('http://localhost:3000' + '/api/v1/task'); // Replace with your API endpoint
    const data = await response.json();
    return data;
};


const addTask = async (task) => {
    const response = await fetch('http://localhost:3000' + '/api/v1/task', {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(task),
    });
    const data = await response.json();
    return data;
};

const updateTask = async (updatedTask) => {
    const response = await fetch('http://localhost:3000' + `/api/v1/task/${updatedTask.id}`, {
        method: 'PUT', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(updatedTask),
    });
    const data = await response.json();
    return data;
};

const deleteTask = async (updatedTask) => {
    const response = await fetch('http://localhost:3000' + `/api/v1/task/${updatedTask.id}`, {
        method: 'DELETE', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(updatedTask),
    });
    const data = await response.json();
    return data;
};

const App = () => {
    const [statuses, setStatuses] = useState(["NEW","DONE"])
    const [activeTaskForm, setActiveTaskForm] = useState()
    const queryClient = useQueryClient();
    const {data: tasks, error, isLoading} = useQuery('tasks', fetchTasks);

    const addList = () => {
      const updatedStatuses = [...statuses, "IN PROGRESS"]
        setStatuses(updatedStatuses)
    }

    useEffect(() => {

    }, [tasks])

    const addTodoMutation = useMutation(addTask, {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });

    const updateTaskMutation = useMutation(updateTask, {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });

    const deleteTaskMutation = useMutation(deleteTask, {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        }
    });

    const handleChangeTaskStatus = async (taskId, status) => {
        const task = tasks.find(task => task.id == taskId);
        const updatedTask = {...task, status: status}
        updateTaskMutation.mutate(updatedTask);
    };

   const handleDeleteTask = async (taskId) => {
        const task = tasks.find(task => task.id == taskId);
        deleteTaskMutation.mutate(task);
    };




    const handleSubmit = async (e, status) => {
        e.preventDefault();
        const task = {
            description: e.target.elements.taskText.value, status: status,
        };
        addTodoMutation.mutate(task);
        setActiveTaskForm(null)
        e.target.reset();
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (<div>
            <h1>Marvelous 2.0 {activeTaskForm}</h1>
            <div className={"lanes"}>
                {statuses.map((status) => {
                    return (<div className={"lane"} key={status}
                                 onDragOver={(e) => {
                                     // this.onDragOver(e)
                                     e.preventDefault();
                                     e.dataTransfer.dropEffect = "move";
                                 }}
                                 onDrop={(e) => {
                                     e.preventDefault();
                                     const taskId = e.dataTransfer.getData("task-id");
                                     console.log(taskId, status)
                                     handleChangeTaskStatus(taskId, status)
                                 }}
                    >
                        <h2>{status}</h2>
                        {tasks.filter(task => task.status === status).map((task) => (<div key={task.id}
                                                                                          data-id={task.id}
                                                                                          draggable={true}
                                                                                          className={"task"}
                                                                                          onDragStart={(ev, id) => {
                                                                                              console.log('drag start')
                                                                                              const taskId = ev.target.attributes['data-id'].value
                                                                                              ev.dataTransfer.setData("task-id", taskId);
                                                                                          }}
                            >
                                {task.description}
                                <span className="material-symbols-outlined" onClick={()=>handleDeleteTask(task.id)}>delete</span>
                            </div>))}
                        <div>
                            <div class={`add-task-toggle  ${status === activeTaskForm ? 'hidden' : ''}`} onClick={() => {
                                setActiveTaskForm(status)
                            }}>
                                        <span className={`material-symbols-outlined`}>
                                              add
                            </span>
                            Add a new task
                        </div>
                        <form onSubmit={(event) => handleSubmit(event, status)}
                              className={status === activeTaskForm ? 'active' : ''}>
                            <textarea type="text" name="taskText" rows="6" placeholder="Enter a new task"/>
                            <button type="submit"><span className="material-symbols-outlined">
add
</span>Add Task
                            </button>
                        </form>
                    </div>
                </div>
                )
                })}
                <div className={"lane new-list"}>
                    <h2 onClick={addList}>Add another list</h2>
                </div>
            </div>
        </div>);
};

export default App;

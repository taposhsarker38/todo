'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createTask, deleteTask, fetchTasks, updateTask } from '@/store/slices/taskSlice';

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tasks, loading } = useAppSelector(state => state.tasks);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      dispatch(fetchTasks());
    }
  }, [dispatch, isAuthenticated, router]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createTask(newTask));
    setNewTask({ title: '', description: '' });
  };

  const handleToggle = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      dispatch(updateTask({ id, task: { completed: !task.completed } }));
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTask(id));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div>
      <h1>Your Tasks</h1>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e)=> setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Task description"
          value={newTask.description}
          onChange={(e)=> setNewTask({ ...newTask, description: e.target.value })}
        />
        <button type="submit">Add Task</button>
      </form>
      {loading && <p>Loading tasks...</p>}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </h3>
            <p>{task.description}</p>
            <button onClick={()=> handleToggle(task.id)}>
              {task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
            </button>
            <button onClick={()=> handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

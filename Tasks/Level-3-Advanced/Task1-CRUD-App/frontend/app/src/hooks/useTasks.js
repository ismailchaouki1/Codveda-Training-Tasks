import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Use full URL instead of relative path
const API = 'http://localhost:5000/api/tasks';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      console.log('Fetching tasks from:', API, { params }); // Debug log
      const { data } = await axios.get(API, { params });
      console.log('Tasks fetched:', data); // Debug log
      setTasks(data.data);
      setStats(data.stats);
    } catch (err) {
      console.error('Fetch error details:', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    try {
      console.log('Creating task:', taskData); // Debug log
      const { data } = await axios.post(API, taskData);
      console.log('Task created:', data); // Debug log
      await fetchTasks();
      return data.data;
    } catch (err) {
      console.error('Create task error:', err.response?.data || err.message);
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    const { data } = await axios.put(`${API}/${id}`, taskData);
    await fetchTasks();
    return data.data;
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${API}/${id}/status`, { status });
    await fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    await fetchTasks();
  };

  const clearDone = async () => {
    await axios.delete(API);
    await fetchTasks();
  };

  return {
    tasks,
    stats,
    loading,
    error,
    filters,
    setFilters,
    createTask,
    updateTask,
    updateStatus,
    deleteTask,
    clearDone,
    refetch: fetchTasks,
  };
}

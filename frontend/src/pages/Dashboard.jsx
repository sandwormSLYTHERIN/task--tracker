import { useState, useEffect } from 'react';
import api from '../api/axios';
import TaskModal from '../components/TaskModal';
import { Plus, Search, Filter, Trash2, Edit2, ChevronLeft, ChevronRight, BarChart2, CheckSquare } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks', {
        params: { page, limit: 6, search, status: statusFilter, priority: priorityFilter, sortby: sortBy }
      });
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setTotalTasks(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/tasks/analytics');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [page, search, statusFilter, priorityFilter, sortBy]);

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
      }
      setIsModalOpen(false);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const openNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const map = { 'Pending': 'badge-pending', 'In Progress': 'badge-progress', 'Completed': 'badge-completed' };
    return <span className={`badge ${map[status]}`}>{status}</span>;
  };

  const getStatCount = (statusName) => {
    const stat = stats.find(s => s._id === statusName);
    return stat ? stat.count : 0;
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      
      {/* Analytics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem', marginTop: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary-color)' }}>
            <BarChart2 size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Total Tasks</p>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{totalTasks}</h2>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
            <div style={{ width: 24, height: 24, borderRadius:'50%', border:'3px solid currentColor', borderTopColor:'transparent', transform:'rotate(45deg)'}}></div>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Pending</p>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{getStatCount('Pending')}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Completed</p>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{getStatCount('Completed')}</h2>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', flex: '1 1 250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="form-input" placeholder="Search tasks..." value={search} onChange={e => {setSearch(e.target.value); setPage(1);}} style={{ paddingLeft: '2.5rem', marginBottom: 0 }} />
          </div>
          
          <select className="form-input" style={{ width: 'auto', marginBottom: 0 }} value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setPage(1);}}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          
          <select className="form-input" style={{ width: 'auto', marginBottom: 0 }} value={priorityFilter} onChange={e => {setPriorityFilter(e.target.value); setPage(1);}}>
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          
          <select className="form-input" style={{ width: 'auto', marginBottom: 0 }} value={sortBy} onChange={e => {setSortBy(e.target.value); setPage(1);}}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        
        <button className="btn btn-primary" onClick={openNewTask}>
          <Plus size={20} /> New Task
        </button>
      </div>

      {/* Task Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {tasks.map(task => (
          <div key={task._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', border: '1px solid var(--border-color)' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {getStatusBadge(task.status)}
                {task.priority === 'High' && <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>High</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEditTask(task)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--primary-color)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}>
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(task._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--danger-color)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>{task.title}</h3>
            <p style={{ fontSize: '0.95rem', flex: 1, marginBottom: '1.5rem' }}>{task.description}</p>
            
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
              <span>Priority: {task.priority}</span>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <CheckSquare size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
          <h3>No tasks found</h3>
          <p>Try adjusting your search or filters, or create a new task.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
          <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.5rem' }}>
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: '0.95rem' }}>Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
          <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.5rem' }}>
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveTask} initialData={editingTask} />
    </div>
  );
}

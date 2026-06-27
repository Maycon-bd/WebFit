import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const PlannerWidget: React.FC = () => {
  const { plannerTasks, addPlannerTask, togglePlannerTask } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date('2026-06-19'));
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  const formatDateStr = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getDayName = (date: Date): string => {
    const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    return days[date.getDay()];
  };

  const getMonthName = (date: Date): string => {
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return months[date.getMonth()];
  };

  const displayDateText = (): string => {
    return `${getDayName(currentDate)}, ${currentDate.getDate()} de ${getMonthName(currentDate)} de ${currentDate.getFullYear()}`;
  };

  const shiftDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const activeDateStr = formatDateStr(currentDate);
  const activeTasks = plannerTasks.filter(t => t.date === activeDateStr);

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;
    addPlannerTask(newTaskText, activeDateStr);
    setNewTaskText('');
    setIsAdding(false);
  };

  return (
    <div className="card">
      <div className="widget-header">
        <h2>
          Seu planner
          <span className="info-icon" title="Agenda administrativa diária do profissional">?</span>
        </h2>
        <div className="links-top">
          <a href="#settings" onClick={(e) => { e.preventDefault(); alert('Configurações do Planner: Altere lembretes e horários.'); }}>Ajustes</a>
        </div>
      </div>

      <button className="btn-teal" onClick={() => setIsAdding(!isAdding)} style={{ marginBottom: '16px' }}>
        + adicionar tarefa
      </button>

      {isAdding && (
        <form onSubmit={handleAddTask} style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Nova tarefa..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-teal" style={{ width: 'auto', padding: '0 16px' }}>+</button>
          <button
            type="button"
            className="btn-teal"
            style={{ width: 'auto', padding: '0 16px', backgroundColor: 'var(--bg-card-hover)', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => setIsAdding(false)}
          >X</button>
        </form>
      )}

      <div className="date-selector-bar">
        <button className="date-selector-btn" onClick={() => shiftDate(-1)} aria-label="Previous day">◀</button>
        <span className="date-label">{displayDateText()}</span>
        <button className="date-selector-btn" onClick={() => shiftDate(1)} aria-label="Next day">▶</button>
      </div>

      <div className="tasks-list">
        {activeTasks.length === 0 ? (
          <div className="planner-empty-state">
            <div className="empty-title">Nenhuma tarefa pendente</div>
            <div className="empty-desc">Você concluiu todas suas tarefas ou ainda não cadastrou tarefas em seu planner.</div>
          </div>
        ) : (
          activeTasks.map(task => (
            <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
              <div
                className={`task-checkbox ${task.done ? 'checked' : ''}`}
                onClick={() => togglePlannerTask(task.id)}
              >
                {task.done && '✓'}
              </div>
              <span className="task-text">{task.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlannerWidget;

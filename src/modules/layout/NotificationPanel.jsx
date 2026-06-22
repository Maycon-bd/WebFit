import React, { useEffect, useRef, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, setActivePage, setSelectedPatientId } = useContext(AppContext);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = (noti) => {
    markNotificationRead(noti.id);
    setSelectedPatientId(noti.patientId);
    setActivePage('diario');
    onClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-panel" ref={panelRef}>
      <div className="notifications-header">
        <h3>Notificações</h3>
        {unreadCount > 0 && (
          <span style={{ fontSize: '12px', color: 'var(--text-teal)', fontWeight: '600' }}>
            {unreadCount} pendente(s)
          </span>
        )}
      </div>
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="noti-empty">Nenhuma notificação recente.</div>
        ) : (
          notifications.map((noti) => (
            <div
              key={noti.id}
              className={`notification-card ${!noti.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(noti)}
            >
              <div className="noti-content">
                <span className="noti-time">{noti.timestamp}</span>
                <p className="noti-text">
                  <strong>{noti.patientName}</strong> {noti.action}
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                    {noti.mealName}
                  </span>
                </p>
              </div>
              {noti.mealPhoto && (
                <div className="noti-thumb">
                  <img src={noti.mealPhoto} alt="Refeição" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;

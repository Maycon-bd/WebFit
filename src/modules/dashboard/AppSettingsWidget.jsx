import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const AppSettingsWidget = () => {
  const { appSettings, setAppSettings } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (key) => {
    setAppSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleIntervalChange = (e) => {
    setAppSettings(prev => ({
      ...prev,
      diarioReminderInterval: e.target.value
    }));
  };

  return (
    <div className="accordion-widget">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <h2>
          Ajustes do app do paciente
          <span className="info-icon" title="Configure as permissões e notificações do aplicativo complementar do paciente">?</span>
        </h2>
        <div className={`accordion-arrow ${isOpen ? 'open' : ''}`}></div>
      </div>
      
      {isOpen && (
        <div className="accordion-content">
          <div className="setting-toggle-item">
            <span className="setting-toggle-label">Permitir fotos no diário</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={appSettings.allowDiarioPhotos} 
                onChange={() => handleToggle('allowDiarioPhotos')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-toggle-item">
            <span className="setting-toggle-label">Acompanhar ingestão de água</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={appSettings.allowWaterTracking} 
                onChange={() => handleToggle('allowWaterTracking')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-toggle-item">
            <span className="setting-toggle-label">Permitir registro de peso</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={appSettings.allowWeightLogging} 
                onChange={() => handleToggle('allowWeightLogging')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="form-group" style={{ marginBottom: 0, padding: '10px 0' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>Lembrete diário alimentar</label>
            <select 
              className="form-control" 
              value={appSettings.diarioReminderInterval}
              onChange={handleIntervalChange}
              style={{ padding: '6px 10px', height: '34px' }}
            >
              <option value="2">A cada 2 horas</option>
              <option value="3">A cada 3 horas</option>
              <option value="4">A cada 4 horas</option>
              <option value="6">A cada 6 horas</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSettingsWidget;

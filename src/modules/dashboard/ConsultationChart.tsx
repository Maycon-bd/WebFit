import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

interface MonthEntry {
  label: string;
  month: number;
  year: number;
}

interface ChartDataEntry extends MonthEntry {
  count: number;
}

const ConsultationChart: React.FC = () => {
  const { appointments, setActivePage } = useContext(AppContext);

  const getMonthsList = (): MonthEntry[] => {
    const list: MonthEntry[] = [];
    const monthsNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    let startYear = 2025;
    let startMonthIdx = 5; // June (0-indexed)

    for (let i = 0; i < 13; i++) {
      list.push({
        label: `${monthsNames[startMonthIdx]}/${startYear.toString().slice(-2)}`,
        month: startMonthIdx + 1,
        year: startYear,
      });

      startMonthIdx++;
      if (startMonthIdx > 11) {
        startMonthIdx = 0;
        startYear++;
      }
    }
    return list;
  };

  const months = getMonthsList();

  const chartData: ChartDataEntry[] = months.map(m => {
    const count = appointments.filter(ap => {
      if (ap.status !== 'Realizada' && ap.status !== 'Confirmada') return false;
      const apDate = new Date(ap.date);
      const apMonth = apDate.getMonth() + 1;
      const apYear = apDate.getFullYear();
      return apMonth === m.month && apYear === m.year;
    }).length;

    return { ...m, count };
  });

  // SVG Chart Geometry
  const chartWidth = 780;
  const chartHeight = 180;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  const maxY = 8;
  const referenceLineYValue = 2;

  const barSpacing = graphWidth / chartData.length;
  const barWidth = barSpacing * 0.45;

  const getYCoordinate = (val: number): number => {
    const ratio = val / maxY;
    return chartHeight - paddingBottom - (ratio * graphHeight);
  };

  const referenceY = getYCoordinate(referenceLineYValue);

  return (
    <div className="card">
      <div className="widget-header">
        <h2>
          Histórico de consultas
          <span className="info-icon" title="Estatísticas comparativas de atendimentos realizados nos últimos 13 meses">?</span>
        </h2>
        <div className="links-top">
          <a href="#stats" onClick={(e) => { e.preventDefault(); setActivePage('ferramentas'); }}>Abrir estatísticas</a>
        </div>
      </div>

      <div className="chart-container" style={{ overflowX: 'auto', width: '100%' }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ width: '100%', minWidth: '600px', height: 'auto' }}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(val => {
            const y = getYCoordinate(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="var(--text-secondary)"
                  fontSize="10"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Reference line */}
          <line
            x1={paddingLeft}
            y1={referenceY}
            x2={chartWidth - paddingRight}
            y2={referenceY}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Bars */}
          {chartData.map((data, idx) => {
            const x = paddingLeft + (idx * barSpacing) + (barSpacing - barWidth) / 2;
            const barHeight = (data.count / maxY) * graphHeight;
            const y = chartHeight - paddingBottom - barHeight;

            return (
              <g key={idx}>
                {data.count > 0 && (
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="var(--primary-teal)"
                    rx="2"
                    style={{ transition: 'all 0.5s ease' }}
                  />
                )}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 4}
                  fill="var(--text-secondary)"
                  fontSize="9.5"
                  textAnchor="middle"
                >
                  {data.label}
                </text>
                {data.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 4}
                    fill="var(--text-primary)"
                    fontSize="9.5"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {data.count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ConsultationChart;

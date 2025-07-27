import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register radar chart elements once
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface PerformanceRadarProps {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

const PerformanceRadar: React.FC<PerformanceRadarProps> = ({ scores }) => {
  const data = {
    labels: ['Performance', 'Accessibility', 'Best Practices', 'SEO'],
    datasets: [
      {
        label: 'Scores',
        data: [
          scores.performance,
          scores.accessibility,
          scores.bestPractices,
          scores.seo,
        ],
        backgroundColor: 'rgba(33, 20, 95, 0.2)',
        borderColor: 'rgba(33, 20, 95, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(33, 20, 95, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          color: '#64748b', // slate-500
        },
        grid: {
          color: '#e2e8f0', // gray-200
        },
        angleLines: {
          color: '#e2e8f0',
        },
        pointLabels: {
          color: '#1e293b', // slate-800
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-64 md:h-80">
      <Radar data={data} options={options} />
    </div>
  );
};

export default PerformanceRadar; 
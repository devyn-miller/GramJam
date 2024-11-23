import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { TimeLimit, PerformanceData } from '../types/game';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PerformanceGraphProps {
  performanceData: PerformanceData[];
  isDarkMode: boolean;
  timeLimit: TimeLimit;
}

export function PerformanceGraph({ performanceData, isDarkMode, timeLimit }: PerformanceGraphProps) {
  const startTime = performanceData.length > 0 ? performanceData[0].timestamp : Date.now();
  const endTime = timeLimit === 'untimed' 
    ? (performanceData.length > 0 ? performanceData[performanceData.length - 1].timestamp : startTime + 120000)
    : startTime + (Number(timeLimit) * 1000);
  
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animations for better performance
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'second' as const,
          displayFormats: {
            second: 's\'s\'',
          },
          tooltipFormat: 'ss\'s\'',
        },
        min: startTime,
        max: endTime,
        title: {
          display: true,
          text: 'Time',
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
          callback: (value: any) => `${Math.floor((value - startTime) / 1000)}s`,
        },
        grid: {
          color: isDarkMode ? 'rgba(229, 231, 235, 0.1)' : 'rgba(31, 41, 55, 0.1)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
        },
        grid: {
          color: isDarkMode ? 'rgba(229, 231, 235, 0.1)' : 'rgba(31, 41, 55, 0.1)',
        },
      },
    },
  };

  const scoreData = {
    datasets: [
      {
        label: 'Score',
        data: performanceData.map(entry => ({
          x: entry.timestamp,
          y: entry.score,
        })),
        borderColor: isDarkMode ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)', // Indigo
        backgroundColor: isDarkMode ? 'rgba(129, 140, 248, 0.5)' : 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const wordsData = {
    datasets: [
      {
        label: 'Words Found',
        data: performanceData.map(entry => ({
          x: entry.timestamp,
          y: entry.wordsFound,
        })),
        borderColor: isDarkMode ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)', // Red
        backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const scoreOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: 'Score Progress',
        color: isDarkMode ? '#e5e7eb' : '#1f2937',
      },
    },
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        title: {
          ...commonOptions.scales.y.title,
          text: 'Score',
        },
      },
    },
  };

  const wordsOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: 'Words Found',
        color: isDarkMode ? '#e5e7eb' : '#1f2937',
      },
    },
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        title: {
          ...commonOptions.scales.y.title,
          text: 'Words',
        },
        ticks: {
          ...commonOptions.scales.y.ticks,
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="performance-graphs space-y-8">
      <div className="w-full h-64">
        <Line data={scoreData} options={scoreOptions} />
      </div>
      <div className="w-full h-64">
        <Line data={wordsData} options={wordsOptions} />
      </div>
    </div>
  );
}

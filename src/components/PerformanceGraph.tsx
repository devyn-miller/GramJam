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
  scoreHistory: Array<{ timestamp: number; score: number }>;
  isDarkMode: boolean;
  timeLimit: number;
}

export function PerformanceGraph({ scoreHistory, isDarkMode, timeLimit }: PerformanceGraphProps) {
  const startTime = scoreHistory.length > 0 ? scoreHistory[0].timestamp : Date.now();
  
  const scoreData = {
    datasets: [
      {
        label: 'Score',
        data: scoreHistory.map(entry => ({
          x: entry.timestamp,
          y: entry.score,
        })),
        borderColor: isDarkMode ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)',
        backgroundColor: isDarkMode ? 'rgba(129, 140, 248, 0.5)' : 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const wordsData = {
    datasets: [
      {
        label: 'Words Found',
        data: scoreHistory.map((_, index) => ({
          x: scoreHistory[index].timestamp,
          y: index + 1,
        })),
        borderColor: isDarkMode ? 'rgb(248, 129, 140)' : 'rgb(241, 99, 102)',
        backgroundColor: isDarkMode ? 'rgba(248, 129, 140, 0.5)' : 'rgba(241, 99, 102, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
            second: 'ss"s"',
          },
        },
        min: startTime,
        max: startTime + (timeLimit * 1000),
        title: {
          display: true,
          text: 'Time (seconds)',
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
        },
        grid: {
          color: isDarkMode ? 'rgba(229, 231, 235, 0.1)' : 'rgba(31, 41, 55, 0.1)',
        },
      },
      y: {
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
          text: 'Number of Words',
        },
        ticks: {
          ...commonOptions.scales.y.ticks,
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="w-full h-64">
        <Line data={scoreData} options={scoreOptions} />
      </div>
      <div className="w-full h-64">
        <Line data={wordsData} options={wordsOptions} />
      </div>
    </div>
  );
}

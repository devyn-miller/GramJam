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
import { TimeLimit, GamePerformanceHistory } from '../types/game';

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
  performanceData: GamePerformanceHistory;
  isDarkMode: boolean;
  timeLimit: TimeLimit;
}

function generateTimeIntervals(startTime: number, timeLimit: TimeLimit): number[] {
  const duration = timeLimit === 'untimed' ? 120 : Number(timeLimit);
  const interval = duration / 6;
  return Array.from({ length: 7 }, (_, i) => startTime + (i * interval * 1000));
}

export function PerformanceGraph({ performanceData, isDarkMode, timeLimit }: PerformanceGraphProps) {
  // Calculate cumulative values
  const cumulativeData = performanceData.reduce((acc, curr, index) => {
    const prevScore = index > 0 ? acc[index - 1].cumulativeScore : 0;
    const prevWords = index > 0 ? acc[index - 1].cumulativeWords : 0;
    
    acc.push({
      timestamp: curr.timestamp,
      cumulativeScore: prevScore + curr.score,
      cumulativeWords: prevWords + 1
    });
    
    return acc;
  }, [] as Array<{
    timestamp: number;
    cumulativeScore: number;
    cumulativeWords: number;
  }>);

  const startTime = performanceData.length > 0 ? performanceData[0].timestamp : Date.now();
  const endTime = timeLimit === 'untimed' 
    ? (performanceData.length > 0 ? performanceData[performanceData.length - 1].timestamp : startTime + 120000)
    : startTime + (Number(timeLimit) * 1000);
  
  const timeIntervals = generateTimeIntervals(startTime, timeLimit);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
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
          source: 'auto',
          autoSkip: false,
          maxTicksLimit: 7,
          includeBounds: true,
        },
        grid: {
          color: isDarkMode ? 'rgba(229, 231, 235, 0.1)' : 'rgba(31, 41, 55, 0.1)',
          tickLength: 10,
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
        data: cumulativeData.map(entry => ({
          x: entry.timestamp,
          y: entry.cumulativeScore,
        })),
        borderColor: isDarkMode ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)', // Indigo
        backgroundColor: isDarkMode ? 'rgba(129, 140, 248, 0.5)' : 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
        pointRadius: 2,
        fill: true,
      },
    ],
  };

  const wordsData = {
    datasets: [
      {
        label: 'Words Found',
        data: cumulativeData.map(entry => ({
          x: entry.timestamp,
          y: entry.cumulativeWords,
        })),
        borderColor: isDarkMode ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)', // Red
        backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
        pointRadius: 2,
        fill: true,
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
          text: 'Cumulative Score',
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
          text: 'Cumulative Words',
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

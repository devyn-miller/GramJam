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
  Filler,
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
  TimeScale,
  Filler
);

interface PerformanceGraphProps {
  performanceData: GamePerformanceHistory;
  isDarkMode: boolean;
  timeLimit: TimeLimit;
  currentTime: number;
}

export function PerformanceGraph({ performanceData, isDarkMode, timeLimit, currentTime }: PerformanceGraphProps) {
  const gameStartTime = Date.now() - (currentTime * 1000);
  
  // Create data points with proper timestamps
  const cumulativeData = performanceData.reduce((acc, curr) => {
    const prevScore = acc.length > 0 ? acc[acc.length - 1].cumulativeScore : 0;
    const prevWords = acc.length > 0 ? acc[acc.length - 1].cumulativeWords : 0;
    
    // Calculate time from game start in seconds
    const timeFromStart = (curr.timestamp - gameStartTime) / 1000;
    
    acc.push({
      timestamp: gameStartTime + (timeFromStart * 1000),
      cumulativeScore: prevScore + curr.score,
      cumulativeWords: prevWords + 1,
      timeFromStart
    });
    
    return acc;
  }, [
    // Add initial (0,0) point
    {
      timestamp: gameStartTime,
      cumulativeScore: 0,
      cumulativeWords: 0,
      timeFromStart: 0
    }
  ]);

  const endTime = timeLimit === 'untimed' 
    ? (performanceData.length > 0 ? gameStartTime + (Math.ceil(Number(timeLimit) / 10) * 10 * 1000) : gameStartTime + 120000)
    : gameStartTime + (Number(timeLimit) * 1000);

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
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const timestamp = context[0].parsed.x;
            return `${((timestamp - gameStartTime) / 1000).toFixed(1)}s`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'second' as const,
          stepSize: timeLimit === 'untimed' ? 20 : Math.ceil(Number(timeLimit) / 6),
          displayFormats: {
            second: 's\'s\''
          }
        },
        min: gameStartTime,
        max: endTime,
        title: {
          display: true,
          text: 'Time (seconds)',
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
          callback: (value: number) => `${Math.floor((value - gameStartTime) / 1000)}s`,
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
        data: cumulativeData.map(entry => ({
          x: entry.timestamp,
          y: entry.cumulativeScore,
        })),
        borderColor: isDarkMode ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)',
        backgroundColor: isDarkMode ? 'rgba(129, 140, 248, 0.5)' : 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
        pointRadius: 3,
        fill: true,
        stepped: 'after' as const,
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
        borderColor: isDarkMode ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)',
        backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
        pointRadius: 3,
        fill: true,
        stepped: 'after' as const,
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

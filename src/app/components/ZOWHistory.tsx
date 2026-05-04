import { useState } from "react";
import { Calendar, Filter } from "lucide-react";

interface HistoryEntry {
  date: string;
  time: string;
  score: number;
  dayOfWeek: string;
  triggers?: string[];
}

interface ZOWHistoryProps {
  onBack: () => void;
}

export function ZOWHistory({ onBack }: ZOWHistoryProps) {
  const [selectedRange, setSelectedRange] = useState<'7days' | '14days' | '30days' | '90days' | 'all'>('30days');

  // Mock comprehensive history data - past 90 days
  const generateHistoryData = (): HistoryEntry[] => {
    const data: HistoryEntry[] = [];
    const today = new Date('2026-04-27');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const numCheckins = Math.floor(Math.random() * 3) + 1; // 1-3 check-ins per day

      for (let j = 0; j < numCheckins; j++) {
        const hour = 8 + Math.floor((j / numCheckins) * 12);
        const minute = Math.floor(Math.random() * 60);
        const score = Math.floor(Math.random() * 7) + 1;
        const hasTrigger = Math.random() < 0.15; // 15% chance of trigger

        data.push({
          date: date.toISOString().split('T')[0],
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          score,
          dayOfWeek: days[date.getDay()],
          triggers: hasTrigger ? ['work stress', 'poor sleep', 'anxiety', 'conflict'][Math.floor(Math.random() * 4)] : undefined
        });
      }
    }

    return data;
  };

  const historyData = generateHistoryData();

  // Filter data based on selected range
  const getFilteredData = () => {
    const today = new Date('2026-04-27');
    let daysToShow = 30;

    switch (selectedRange) {
      case '7days':
        daysToShow = 7;
        break;
      case '14days':
        daysToShow = 14;
        break;
      case '30days':
        daysToShow = 30;
        break;
      case '90days':
        daysToShow = 90;
        break;
      case 'all':
        return historyData;
    }

    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - daysToShow);

    return historyData.filter(entry => new Date(entry.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  const getColorForScore = (score: number): string => {
    if (score >= 6) return '#10B981';
    if (score >= 4) return '#34D399';
    if (score >= 3) return '#FBBF24';
    if (score >= 2) return '#FB923C';
    return '#F87171';
  };


  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-4 flex items-center justify-between border-b" style={{ borderColor: '#E5E7EB' }}>
        <button
          onClick={onBack}
          className="text-base"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#8B5CF6',
            fontWeight: 600
          }}
        >
          ← Back
        </button>
        <h2
          className="text-xl"
          style={{
            fontFamily: 'Lora, serif',
            fontWeight: 500,
            color: '#15113C'
          }}
        >
          ZOW Details
        </h2>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-4xl mx-auto py-6">
          {/* Date Range Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" style={{ color: '#8B5CF6' }} />
              <p
                className="text-sm"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#6B7280',
                  fontWeight: 600
                }}
              >
                Select Date Range
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: '7days', label: 'Last 7 Days' },
                { value: '14days', label: 'Last 14 Days' },
                { value: '30days', label: 'Last 30 Days' },
                { value: '90days', label: 'Last 90 Days' },
                { value: 'all', label: 'All Time' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedRange(range.value as any)}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: selectedRange === range.value
                      ? 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)'
                      : 'white',
                    color: selectedRange === range.value ? 'white' : '#6B7280',
                    border: `2px solid ${selectedRange === range.value ? '#8B5CF6' : '#E5E7EB'}`,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div
            className="px-4 py-3 rounded-2xl mb-6"
            style={{
              background: 'rgba(196, 181, 253, 0.15)',
              border: '1px solid #C4B5FD'
            }}
          >
            <p
              className="text-xs leading-relaxed"
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#6B21A8',
                fontStyle: 'italic'
              }}
            >
              💡 Each dot represents a wellness check-in, colored by your wellness zone. Multiple check-ins per day show how your wellbeing changes throughout the day.
            </p>
          </div>

          {/* Wellness Journey Visualization */}
          <div
            className="p-6 rounded-3xl mb-6 overflow-x-auto"
            style={{
              background: 'white',
              border: '2px solid #E5E7EB'
            }}
          >
            <svg
              viewBox="0 0 600 700"
              className="w-full"
              style={{ minHeight: '500px' }}
            >
              {/* Background zones with grids */}
              <rect x={40} y={50} width={186.67} height={620} fill="#FEE2E2" opacity="0.3" />
              <rect x={226.67} y={50} width={186.67} height={620} fill="#FEF3C7" opacity="0.3" />
              <rect x={413.33} y={50} width={186.67} height={620} fill="#D1FAE5" opacity="0.3" />

              {/* Vertical grid lines */}
              <line x1={226.67} y1={50} x2={226.67} y2={670} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
              <line x1={413.33} y1={50} x2={413.33} y2={670} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />

              {/* Horizontal grid lines */}
              {[150, 250, 350, 450, 550].map((y, i) => (
                <line key={i} x1={40} y1={y} x2={600} y2={y} stroke="#D1D5DB" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />
              ))}

              {/* Y-axis label */}
              <text x={15} y={360} textAnchor="middle" fontSize="9" fill="#6B7280" fontFamily="Inter, sans-serif" transform="rotate(-90, 15, 360)" letterSpacing="0.1em">
                TIME
              </text>


              {/* X-axis labels */}
              <text x={133.33} y={690} textAnchor="middle" fontSize="9" fill="#6B7280" fontFamily="Inter, sans-serif">
                LOW (1-2)
              </text>
              <text x={320} y={690} textAnchor="middle" fontSize="9" fill="#6B7280" fontFamily="Inter, sans-serif">
                MODERATE (3-5)
              </text>
              <text x={506.67} y={690} textAnchor="middle" fontSize="9" fill="#6B7280" fontFamily="Inter, sans-serif">
                HIGH (6-7)
              </text>

              {/* Snake flow with connecting lines */}
              {(() => {
                const positions = filteredData.map((entry, index) => {
                  const x = 40 + ((entry.score - 1) / 6) * 560;
                  const y = 60 + (index / Math.max(1, filteredData.length - 1)) * 600;
                  return { x, y, entry };
                });

                // Generate smooth path
                let snakePath = positions.length > 0 ? `M ${positions[0].x} ${positions[0].y}` : '';
                for (let i = 1; i < positions.length; i++) {
                  const prev = positions[i - 1];
                  const curr = positions[i];
                  const midY = (prev.y + curr.y) / 2;
                  snakePath += ` Q ${prev.x} ${midY}, ${curr.x} ${curr.y}`;
                }

                return (
                  <>
                    {/* Connecting path */}
                    {positions.length > 1 && (
                      <path d={snakePath} fill="none" stroke="#A78BFA" strokeWidth="3" opacity="0.5" />
                    )}

                    {/* Dots */}
                    {positions.map((pos, index) => (
                      <g key={index}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={8}
                          fill={getColorForScore(pos.entry.score)}
                          stroke="white"
                          strokeWidth="3"
                        />
                        {pos.entry.triggers && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={14}
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="2"
                          />
                        )}
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>


          {/* Stats Summary */}
          <div
            className="p-6 rounded-3xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #EDE9FE 0%, #E0E7FF 100%)',
              border: '2px solid #C4B5FD'
            }}
          >
            <h3
              className="text-base mb-4"
              style={{
                fontFamily: 'Lora, serif',
                fontWeight: 500,
                color: '#15113C'
              }}
            >
              Summary for Selected Period
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl mb-1" style={{ fontFamily: 'Lora, serif', fontWeight: 600, color: '#15113C' }}>
                  {filteredData.length}
                </p>
                <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280' }}>
                  Check-ins
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1" style={{ fontFamily: 'Lora, serif', fontWeight: 600, color: '#15113C' }}>
                  {filteredData.length > 0 ? (filteredData.reduce((sum, e) => sum + e.score, 0) / filteredData.length).toFixed(1) : '0.0'}
                </p>
                <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280' }}>
                  Average
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1" style={{ fontFamily: 'Lora, serif', fontWeight: 600, color: '#15113C' }}>
                  {filteredData.filter(e => e.triggers).length}
                </p>
                <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280' }}>
                  Triggers
                </p>
              </div>
            </div>
          </div>

          {/* All Triggers List */}
          {filteredData.filter(e => e.triggers).length > 0 && (
            <div
              className="p-6 rounded-3xl"
              style={{
                background: 'white',
                border: '2px solid #E5E7EB'
              }}
            >
              <h3
                className="text-base mb-4"
                style={{
                  fontFamily: 'Lora, serif',
                  fontWeight: 500,
                  color: '#15113C'
                }}
              >
                All Triggers
              </h3>

              <div className="space-y-2">
                {filteredData
                  .filter(e => e.triggers)
                  .slice(0, 20)
                  .map((entry, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl flex items-center justify-between"
                      style={{
                        background: 'rgba(254, 226, 226, 0.5)',
                        border: '1px solid #FCA5A5'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: getColorForScore(entry.score) }}
                        >
                          <span
                            className="text-xs"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 700,
                              color: 'white'
                            }}
                          >
                            {entry.score}
                          </span>
                        </div>
                        <span
                          className="text-sm"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            color: '#15113C',
                            fontWeight: 600
                          }}
                        >
                          {entry.triggers}
                        </span>
                      </div>
                      <span
                        className="text-xs"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          color: '#9CA3AF'
                        }}
                      >
                        {entry.dayOfWeek}, {entry.date} {entry.time}
                      </span>
                    </div>
                  ))}
              </div>

              {filteredData.filter(e => e.triggers).length > 20 && (
                <p
                  className="text-xs mt-3 text-center"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#9CA3AF',
                    fontStyle: 'italic'
                  }}
                >
                  Showing first 20 triggers
                </p>
              )}
            </div>
          )}

          <div className="pb-24" />
        </div>
      </div>
    </div>
  );
}

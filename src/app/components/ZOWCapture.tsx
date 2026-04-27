import { useState, useRef } from "react";

interface ZOWCaptureProps {
  userName: string;
  onComplete: (zowLevel: number) => void;
}

interface TapPoint {
  x: number;
  y: number;
  score: number;
  color: string;
}

export function ZOWCapture({ userName, onComplete }: ZOWCaptureProps) {
  const [tapPoint, setTapPoint] = useState<TapPoint | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getScoreFromPosition = (x: number, canvasWidth: number): number => {
    // Divide canvas into 7 zones (1-7)
    const scoreFloat = (x / canvasWidth) * 7;
    return Math.max(1, Math.min(7, Math.ceil(scoreFloat)));
  };

  const getColorForScore = (score: number): string => {
    if (score >= 6) return '#10B981'; // Excellent/High
    if (score >= 4) return '#34D399'; // Good
    if (score >= 3) return '#FBBF24'; // Moderate
    if (score >= 2) return '#FB923C'; // Low
    return '#F87171'; // Very Low
  };

  const getCurrentTimePosition = (): number => {
    // Get current time and calculate position (0-100%)
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Map 0-1440 minutes (24 hours) to 0-100%
    return (totalMinutes / 1440) * 100;
  };

  const handleCanvasTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let clientX: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const x = clientX - rect.left;
    const score = getScoreFromPosition(x, rect.width);
    const color = getColorForScore(score);

    setTapPoint({
      x: (x / rect.width) * 100, // Convert to percentage
      y: getCurrentTimePosition(), // Auto-map to current time
      score,
      color
    });
  };

  const handleSubmit = () => {
    if (tapPoint) {
      onComplete(tapPoint.score);
    }
  };

  const getZoneLabel = (score: number): string => {
    if (score >= 6) return 'Zone of Wellbeing';
    if (score >= 3) return 'Zone of Well Being';
    return 'Zone of Ill Being';
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-2xl mx-auto py-6">
          {/* Question */}
          <div className="mb-8 text-center">
            <h2
              className="text-2xl mb-2"
              style={{
                fontFamily: 'Lora, serif',
                fontWeight: 500,
                color: '#15113C'
              }}
            >
              Welcome back, {userName}
            </h2>
            <p
              className="text-base mb-2"
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#6B7280'
              }}
            >
              How are you feeling in your Zone of Wellbeing today?
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#9CA3AF',
                fontStyle: 'italic'
              }}
            >
              Tap anywhere on the canvas to register your wellness at{' '}
              <span style={{ color: '#8B5CF6', fontWeight: 600 }}>
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            </p>
          </div>

          {/* Interactive Canvas */}
          <div className="mb-6">
            <div className="flex items-start">
              {/* Y-axis Label */}
              <div
                className="mr-2 text-xs pt-2"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#6B7280',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  width: '16px',
                  textAlign: 'center',
                  letterSpacing: '0.1em'
                }}
              >
                TODAY
              </div>

              <div className="flex-1">
                {/* Canvas */}
                <div
                  ref={canvasRef}
                  onClick={handleCanvasTap}
                  onTouchStart={handleCanvasTap}
                  className="relative rounded-3xl cursor-pointer border-2 overflow-hidden"
                  style={{
                    height: '400px',
                    background: 'linear-gradient(to right, #FEE2E2 0%, #FEF3C7 20%, #FEF3C7 35%, #D1FAE5 50%, #D1FAE5 100%)',
                    borderColor: '#E5E7EB'
                  }}
                >
                  {/* Subtle Grid Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }}>
                    {/* Vertical zone dividers (wellness zones) */}
                    <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4,4" />

                    {/* Horizontal time grids (every 6 hours: Night->Morning->Afternoon->Evening) */}
                    <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3,3" />
                  </svg>

                  {/* Time Labels on the left edge */}
                  <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none">
                    <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', fontWeight: 600 }}>
                      00:00
                    </span>
                    <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#8B5CF6', fontWeight: 600 }}>
                      06:00
                    </span>
                    <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#8B5CF6', fontWeight: 600 }}>
                      12:00
                    </span>
                    <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#8B5CF6', fontWeight: 600 }}>
                      18:00
                    </span>
                    <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', fontWeight: 600 }}>
                      24:00
                    </span>
                  </div>

                  {/* Zone Labels - positioned at center vertically */}
                  <div className="absolute inset-0 flex items-center justify-between px-12 pointer-events-none">
                    <div
                      className="text-xs text-center"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#DC2626',
                        fontWeight: 600
                      }}
                    >
                      Zone of<br />Ill Being
                    </div>
                    <div
                      className="text-xs text-center"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#D97706',
                        fontWeight: 600
                      }}
                    >
                      Zone of<br />Well Being
                    </div>
                    <div
                      className="text-xs text-center"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#059669',
                        fontWeight: 600
                      }}
                    >
                      Zone of<br />Wellbeing
                    </div>
                  </div>

                  {/* Current Time Indicator Line */}
                  <div
                    className="absolute left-12 right-0 h-0.5 pointer-events-none"
                    style={{
                      top: `${getCurrentTimePosition()}%`,
                      background: 'linear-gradient(to right, transparent 0%, #8B5CF6 50%, transparent 100%)',
                      opacity: 0.4
                    }}
                  />

                  {/* Tap Point */}
                  {tapPoint && (
                    <div
                      className="absolute w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-300 animate-pulse"
                      style={{
                        left: `${tapPoint.x}%`,
                        top: `${tapPoint.y}%`,
                        transform: 'translate(-50%, -50%)',
                        background: tapPoint.color
                      }}
                    />
                  )}
                </div>

                {/* X-axis Labels */}
                <div className="flex items-center justify-between mt-2 px-2">
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#6B7280'
                    }}
                  >
                    LOW (1-2)
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#6B7280'
                    }}
                  >
                    MODERATE (3-5)
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#6B7280'
                    }}
                  >
                    HIGH (6-7)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Score Display */}
          {tapPoint && (
            <div
              className="p-6 rounded-3xl mb-6 text-center"
              style={{
                background: 'white',
                border: '2px solid #E5E7EB'
              }}
            >
              <p
                className="text-sm mb-2"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#9CA3AF'
                }}
              >
                Your Wellness Score
              </p>
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ background: tapPoint.color }}
              >
                <span
                  className="text-3xl"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    color: 'white'
                  }}
                >
                  {tapPoint.score}
                </span>
              </div>
              <p
                className="text-base mb-2"
                style={{
                  fontFamily: 'Lora, serif',
                  fontWeight: 500,
                  color: '#15113C'
                }}
              >
                {getZoneLabel(tapPoint.score)}
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#8B5CF6',
                  fontWeight: 600
                }}
              >
                Recorded at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          )}

          <div className="pb-24" />
        </div>
      </div>

      {/* Sticky Continue Button */}
      <div
        className="flex-shrink-0 px-4 py-4"
        style={{
          background: 'linear-gradient(180deg, rgba(250, 245, 255, 0.8) 0%, rgba(250, 245, 255, 1) 100%)',
          borderTop: '1px solid rgba(229, 231, 235, 0.3)'
        }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!tapPoint}
            className="w-full py-4 rounded-full transition-all disabled:opacity-40"
            style={{
              background: tapPoint
                ? 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)'
                : '#E5E7EB',
              color: 'white',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              border: tapPoint ? 'none' : '2px solid #D1D5DB'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
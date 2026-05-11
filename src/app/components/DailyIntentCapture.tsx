import { useState } from "react";
import { AnimatedLogo } from "./AnimatedLogo";
import { Target, Plus, X, ChevronRight } from "lucide-react";

interface Intent {
  id: string;
  text: string;
  category: 'daily' | 'personal' | 'spiritual' | 'creative';
}

interface DailyIntentCaptureProps {
  userName: string;
  onComplete: (intents: Intent[]) => void;
}

export function DailyIntentCapture({ userName, onComplete }: DailyIntentCaptureProps) {
  const [selectedIntents, setSelectedIntents] = useState<Intent[]>([]);
  const [customIntent, setCustomIntent] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Suggested intents categorized by pillar
  const suggestedIntents = {
    daily: [
      "Be more productive",
      "Build better habits",
      "Improve sleep quality",
      "Practice meditation",
      "Manage stress better"
    ],
    personal: [
      "Build confidence",
      "Make better decisions",
      "Develop self-awareness",
      "Work on shadow aspects",
      "Strengthen willpower"
    ],
    spiritual: [
      "Find inner peace",
      "Experience more love",
      "Reduce anxiety",
      "Deepen spiritual practice",
      "Gain deeper insights"
    ],
    creative: [
      "Boost imagination",
      "Think more creatively",
      "Improve focus",
      "Express artistically",
      "Develop intuition"
    ]
  };

  const handleToggleIntent = (text: string, category: 'daily' | 'personal' | 'spiritual' | 'creative') => {
    const existing = selectedIntents.find(i => i.text === text);
    if (existing) {
      setSelectedIntents(selectedIntents.filter(i => i.id !== existing.id));
    } else {
      setSelectedIntents([
        ...selectedIntents,
        {
          id: Date.now().toString(),
          text,
          category
        }
      ]);
    }
  };

  const handleAddCustomIntent = () => {
    if (customIntent.trim()) {
      // Auto-detect category based on keywords (simple heuristic)
      let category: 'daily' | 'personal' | 'spiritual' | 'creative' = 'personal';
      const lowerText = customIntent.toLowerCase();

      if (lowerText.includes('habit') || lowerText.includes('routine') || lowerText.includes('daily')) {
        category = 'daily';
      } else if (lowerText.includes('spirit') || lowerText.includes('peace') || lowerText.includes('meditat')) {
        category = 'spiritual';
      } else if (lowerText.includes('creat') || lowerText.includes('art') || lowerText.includes('imaginat')) {
        category = 'creative';
      }

      setSelectedIntents([
        ...selectedIntents,
        {
          id: Date.now().toString(),
          text: customIntent.trim(),
          category
        }
      ]);
      setCustomIntent("");
      setShowCustomInput(false);
    }
  };

  const handleRemoveIntent = (id: string) => {
    setSelectedIntents(selectedIntents.filter(i => i.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return '#F59E0B';
      case 'personal': return '#3B82F6';
      case 'spiritual': return '#10B981';
      case 'creative': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'daily': return 'Daily Ritual';
      case 'personal': return 'Personal Development';
      case 'spiritual': return 'Spiritual Development';
      case 'creative': return 'Creative Development';
      default: return 'General';
    }
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 50%, #EBF8FF 100%)'
      }}
    >
      {/* Logo Header */}
      <div className="pt-8 pb-4 flex justify-center px-4">
        <AnimatedLogo size={48} animate={false} />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto px-4">
          <div className="max-w-2xl mx-auto py-6">
            {/* Header */}
            <div className="mb-8 text-center">
              <h2
                className="text-2xl mb-2"
                style={{
                  fontFamily: 'Lora, serif',
                  fontWeight: 500,
                  color: '#15113C'
                }}
              >
                Good morning, {userName}
              </h2>
              <p
                className="text-base"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#6B7280'
                }}
              >
                What do you wish to accomplish today?
              </p>
            </div>

            {/* Selected Intents */}
            {selectedIntents.length > 0 && (
              <div className="mb-6">
                <p
                  className="text-sm mb-3"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#6B7280',
                    fontWeight: 600
                  }}
                >
                  Your Intentions ({selectedIntents.length})
                </p>
                <div className="space-y-2">
                  {selectedIntents.map((intent) => (
                    <div
                      key={intent.id}
                      className="p-4 rounded-2xl flex items-center justify-between"
                      style={{
                        background: 'white',
                        border: `2px solid ${getCategoryColor(intent.category)}`
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Target className="w-5 h-5" style={{ color: getCategoryColor(intent.category) }} />
                        <div className="flex-1">
                          <p
                            className="text-base mb-1"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 600,
                              color: '#15113C'
                            }}
                          >
                            {intent.text}
                          </p>
                          <p
                            className="text-xs"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              color: getCategoryColor(intent.category),
                              fontWeight: 600
                            }}
                          >
                            {getCategoryLabel(intent.category)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveIntent(intent.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{ background: '#FEE2E2' }}
                      >
                        <X className="w-4 h-4" style={{ color: '#EF4444' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Intents */}
            <div className="mb-6">
              <p
                className="text-sm mb-3"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#6B7280',
                  fontWeight: 600
                }}
              >
                Suggestions
              </p>

              {Object.entries(suggestedIntents).map(([category, intents]) => (
                <div key={category} className="mb-4">
                  <p
                    className="text-xs mb-2"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: getCategoryColor(category),
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {getCategoryLabel(category)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {intents.map((intent) => {
                      const isSelected = selectedIntents.some(i => i.text === intent);
                      return (
                        <button
                          key={intent}
                          onClick={() => handleToggleIntent(intent, category as any)}
                          className="px-4 py-2 rounded-full text-sm transition-all"
                          style={{
                            background: isSelected ? getCategoryColor(category) : 'white',
                            color: isSelected ? 'white' : '#6B7280',
                            border: `2px solid ${isSelected ? getCategoryColor(category) : '#E5E7EB'}`,
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600
                          }}
                        >
                          {intent}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Intent Input */}
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full p-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 transition-all"
                style={{
                  borderColor: '#C4B5FD',
                  background: 'rgba(237, 233, 254, 0.3)'
                }}
              >
                <Plus className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                <span
                  className="text-base"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    color: '#8B5CF6'
                  }}
                >
                  Add Custom Intention
                </span>
              </button>
            ) : (
              <div
                className="p-4 rounded-2xl"
                style={{
                  background: 'white',
                  border: '2px solid #8B5CF6'
                }}
              >
                <input
                  type="text"
                  value={customIntent}
                  onChange={(e) => setCustomIntent(e.target.value)}
                  placeholder="Type your intention..."
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none mb-3"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    borderColor: '#E5E7EB',
                    background: '#F9FAFB'
                  }}
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddCustomIntent();
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCustomIntent}
                    className="flex-1 py-2 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                      color: 'white',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomIntent("");
                    }}
                    className="px-6 py-2 rounded-xl"
                    style={{
                      background: '#F3F4F6',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
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
              onClick={() => onComplete(selectedIntents)}
              disabled={selectedIntents.length === 0}
              className="w-full py-4 rounded-full transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              style={{
                background: selectedIntents.length > 0
                  ? 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)'
                  : '#E5E7EB',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                border: selectedIntents.length > 0 ? 'none' : '2px solid #D1D5DB'
              }}
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

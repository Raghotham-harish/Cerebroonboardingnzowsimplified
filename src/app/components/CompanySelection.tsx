import { useState } from "react";
import { Search, Building2, Plus, Check } from "lucide-react";
import { AnimatedLogo } from "./AnimatedLogo";

interface Company {
  id: string;
  name: string;
  industry?: string;
  onboarded: boolean;
}

interface CompanySelectionProps {
  userName: string;
  onComplete: (companyName: string, companyEmail: string, companyId?: string) => void;
}

export function CompanySelection({ userName, onComplete }: CompanySelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualCompanyName, setManualCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  // Mock data - admin-onboarded companies
  const onboardedCompanies: Company[] = [
    { id: "1", name: "Google", industry: "Technology", onboarded: true },
    { id: "2", name: "Microsoft", industry: "Technology", onboarded: true },
    { id: "3", name: "Apple Inc.", industry: "Technology", onboarded: true },
    { id: "4", name: "Amazon", industry: "E-commerce", onboarded: true },
    { id: "5", name: "Meta Platforms", industry: "Technology", onboarded: true },
    { id: "6", name: "Tesla", industry: "Automotive", onboarded: true },
    { id: "7", name: "Netflix", industry: "Entertainment", onboarded: true },
    { id: "8", name: "Goldman Sachs", industry: "Finance", onboarded: true },
    { id: "9", name: "McKinsey & Company", industry: "Consulting", onboarded: true },
    { id: "10", name: "Deloitte", industry: "Consulting", onboarded: true },
  ];

  const filteredCompanies = searchQuery
    ? onboardedCompanies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsManualEntry(false);
    setManualCompanyName("");
  };

  const handleManualEntry = () => {
    setIsManualEntry(true);
    setSelectedCompany(null);
  };

  const handleContinue = () => {
    if (isManualEntry && manualCompanyName.trim() && companyEmail.trim()) {
      onComplete(manualCompanyName.trim(), companyEmail.trim());
    } else if (selectedCompany && companyEmail.trim()) {
      onComplete(selectedCompany.name, companyEmail.trim(), selectedCompany.id);
    }
  };

  const canContinue = ((isManualEntry && manualCompanyName.trim()) || selectedCompany) && companyEmail.trim();

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
                Welcome, {userName}
              </h2>
              <p
                className="text-base"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#6B7280'
                }}
              >
                Which company are you associated with?
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: '#9CA3AF' }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your company..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    borderColor: searchQuery ? '#8B5CF6' : '#E5E7EB',
                    background: 'white'
                  }}
                />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery && filteredCompanies.length > 0 && (
              <div
                className="mb-6 rounded-2xl overflow-hidden"
                style={{
                  background: 'white',
                  border: '2px solid #E5E7EB',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}
              >
                {filteredCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => handleSelectCompany(company)}
                    className="w-full p-4 text-left transition-all border-b hover:bg-purple-50"
                    style={{
                      borderColor: '#F3F4F6',
                      background: selectedCompany?.id === company.id ? '#F3E8FF' : 'white'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: '#EDE9FE' }}
                        >
                          <Building2 className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                        </div>
                        <div>
                          <p
                            className="text-base mb-1"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 600,
                              color: '#15113C'
                            }}
                          >
                            {company.name}
                          </p>
                          {company.industry && (
                            <p
                              className="text-sm"
                              style={{
                                fontFamily: 'Inter, sans-serif',
                                color: '#9CA3AF'
                              }}
                            >
                              {company.industry}
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedCompany?.id === company.id && (
                        <Check className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {searchQuery && filteredCompanies.length === 0 && (
              <div
                className="mb-6 p-6 rounded-2xl text-center"
                style={{
                  background: 'white',
                  border: '2px solid #E5E7EB'
                }}
              >
                <p
                  className="text-base mb-2"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#6B7280'
                  }}
                >
                  No companies found matching "{searchQuery}"
                </p>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#9CA3AF'
                  }}
                >
                  You can add it manually below
                </p>
              </div>
            )}

            {/* Manual Entry Option */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
                <span
                  className="px-4 text-sm"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#9CA3AF'
                  }}
                >
                  OR
                </span>
                <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
              </div>

              {!isManualEntry ? (
                <button
                  onClick={handleManualEntry}
                  className="w-full p-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2"
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
                    Add Company Manually
                  </span>
                </button>
              ) : (
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background: 'white',
                    border: '2px solid #8B5CF6'
                  }}
                >
                  <label
                    className="block text-sm mb-2"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#6B7280',
                      fontWeight: 600
                    }}
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={manualCompanyName}
                    onChange={(e) => setManualCompanyName(e.target.value)}
                    placeholder="Enter your company name..."
                    className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '16px',
                      borderColor: '#E5E7EB',
                      background: '#F9FAFB'
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsManualEntry(false);
                      setManualCompanyName("");
                    }}
                    className="mt-3 text-sm"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#8B5CF6',
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Selected Company Display */}
            {selectedCompany && !isManualEntry && (
              <div
                className="p-6 rounded-2xl mb-6"
                style={{
                  background: 'linear-gradient(135deg, #EDE9FE 0%, #E0E7FF 100%)',
                  border: '2px solid #C4B5FD'
                }}
              >
                <p
                  className="text-sm mb-2"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#8B5CF6',
                    fontWeight: 600
                  }}
                >
                  Selected Company
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'white' }}
                  >
                    <Building2 className="w-6 h-6" style={{ color: '#8B5CF6' }} />
                  </div>
                  <div>
                    <p
                      className="text-base"
                      style={{
                        fontFamily: 'Lora, serif',
                        fontWeight: 600,
                        color: '#15113C'
                      }}
                    >
                      {selectedCompany.name}
                    </p>
                    {selectedCompany.industry && (
                      <p
                        className="text-sm"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          color: '#6B7280'
                        }}
                      >
                        {selectedCompany.industry}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Company Email Input */}
            {(selectedCompany || (isManualEntry && manualCompanyName.trim())) && (
              <div
                className="p-6 rounded-2xl mb-6"
                style={{
                  background: 'white',
                  border: '2px solid #E5E7EB'
                }}
              >
                <label
                  className="block text-sm mb-2"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#6B7280',
                    fontWeight: 600
                  }}
                >
                  Company Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    borderColor: companyEmail ? '#8B5CF6' : '#E5E7EB',
                    background: '#F9FAFB'
                  }}
                />
                <p
                  className="text-xs mt-2"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#9CA3AF',
                    fontStyle: 'italic'
                  }}
                >
                  Add your work email to verify company association
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
              onClick={handleContinue}
              disabled={!canContinue}
              className="w-full py-4 rounded-full transition-all disabled:opacity-40"
              style={{
                background: canContinue
                  ? 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)'
                  : '#E5E7EB',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                border: canContinue ? 'none' : '2px solid #D1D5DB'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

interface AnalysisData {
  symbol: string;
  analysis_date: string;
  timestamp: string;
  status: string;
  final_recommendation: string;
  confidence: number;
  progress?: {
    analyst_team: Record<string, { status: string; progress: number }>;
    research_team: Record<string, { status: string; progress: number }>;
    research_manager: { status: string; progress: number };
  };
  messages_and_tools?: Array<{
    time: string;
    type: string;
    content: string;
  }>;
  current_report?: {
    title: string;
    type: string;
    overview: string;
    indicators_selected?: any;
    trend_analysis?: any;
  };
  portfolio_management_decision?: {
    final_recommendation: string;
    summary_of_key_arguments: {
      risky_analyst: { stance: string; key_points: string[] };
      safe_analyst: { stance: string; key_points: string[] };
      neutral_analyst: { stance: string; key_points: string[] };
    };
    rationale_and_decision_justification: string;
  };
  tool_calls?: number;
  llm_calls?: number;
  analysis_duration?: string;
  cost_estimate?: string;
}

interface TradingAnalysisPanelProps {
  selectedSymbol: string;
}

const TradingAnalysisPanel: React.FC<TradingAnalysisPanelProps> = ({ selectedSymbol }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'report' | 'decision'>('overview');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/analysis?symbol=${selectedSymbol}`);
        const result = await response.json();
        
        if (result.success) {
          setAnalysisData(result.data);
        } else {
          setError(result.message || 'Failed to load analysis');
        }
      } catch (err) {
        setError('Network error occurred');
        console.error('Error fetching analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedSymbol) {
      fetchAnalysis();
    }
  }, [selectedSymbol]);

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY': return '#22c55e';
      case 'SELL': return '#ef4444';
      case 'HOLD': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="trading-analysis-panel">
        <div className="panel-header">
          <h3>Trading Analysis</h3>
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Loading analysis...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="trading-analysis-panel">
        <div className="panel-header">
          <h3>Trading Analysis</h3>
          <div className="error-indicator">
            <span>⚠️ {error || 'No analysis data available'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trading-analysis-panel">
      <div className="panel-header">
        <div className="header-left">
          <h3>Trading Analysis - {analysisData.symbol}</h3>
          <div className="analysis-meta">
            <span className="analysis-date">{analysisData.analysis_date}</span>
            <span className="analysis-status" style={{ color: getStatusColor(analysisData.status) }}>
              {analysisData.status}
            </span>
          </div>
        </div>
        <div className="header-right">
          <div className="recommendation-badge" style={{ backgroundColor: getRecommendationColor(analysisData.final_recommendation) }}>
            {analysisData.final_recommendation}
          </div>
          <div className="confidence-score">
            {analysisData.confidence}% confidence
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Progress
        </button>
        <button 
          className={`tab-button ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          Report
        </button>
        <button 
          className={`tab-button ${activeTab === 'decision' ? 'active' : ''}`}
          onClick={() => setActiveTab('decision')}
        >
          Decision
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {analysisData.current_report && (
              <div className="report-summary">
                <h4>{analysisData.current_report.title}</h4>
                <p className="report-type">{analysisData.current_report.type}</p>
                <p className="report-overview">{analysisData.current_report.overview}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && analysisData.progress && (
          <div className="progress-tab">
            <div className="team-section">
              <h4>Analyst Team</h4>
              <div className="team-members">
                {Object.entries(analysisData.progress.analyst_team).map(([role, data]) => (
                  <div key={role} className="member-progress">
                    <div className="member-info">
                      <span className="member-role">{role.replace('_', ' ')}</span>
                      <span className="member-status" style={{ color: getStatusColor(data.status) }}>
                        {data.status}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${data.progress}%`, backgroundColor: getStatusColor(data.status) }}
                      ></div>
                    </div>
                    <span className="progress-percentage">{data.progress}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="team-section">
              <h4>Research Team</h4>
              <div className="team-members">
                {Object.entries(analysisData.progress.research_team).map(([role, data]) => (
                  <div key={role} className="member-progress">
                    <div className="member-info">
                      <span className="member-role">{role.replace('_', ' ')}</span>
                      <span className="member-status" style={{ color: getStatusColor(data.status) }}>
                        {data.status}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${data.progress}%`, backgroundColor: getStatusColor(data.status) }}
                      ></div>
                    </div>
                    <span className="progress-percentage">{data.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && analysisData.current_report && (
          <div className="report-tab">
            <div className="report-content">
              <h4>{analysisData.current_report.title}</h4>
              <p className="report-overview">{analysisData.current_report.overview}</p>
              
              {analysisData.current_report.indicators_selected && (
                <div className="indicators-section">
                  <h5>Technical Indicators</h5>
                  <p>{analysisData.current_report.indicators_selected.description}</p>
                  <div className="indicators-list">
                    {analysisData.current_report.indicators_selected.indicators?.map((indicator: any, index: number) => (
                      <div key={index} className="indicator-item">
                        <strong>{indicator.name}</strong>: {indicator.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysisData.current_report.trend_analysis && (
                <div className="trend-analysis-section">
                  <h5>Trend Analysis</h5>
                  {Object.entries(analysisData.current_report.trend_analysis).map(([key, value]: [string, any]) => (
                    <div key={key} className="trend-item">
                      <h6>{key.toUpperCase()}</h6>
                      <p><strong>Value:</strong> {value.current_value}</p>
                      {value.date && <p><strong>Date:</strong> {value.date}</p>}
                      <p>{value.analysis}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'decision' && analysisData.portfolio_management_decision && (
          <div className="decision-tab">
            <div className="decision-summary">
              <div className="final-recommendation">
                <h4>Final Recommendation: 
                  <span style={{ color: getRecommendationColor(analysisData.portfolio_management_decision.final_recommendation) }}>
                    {analysisData.portfolio_management_decision.final_recommendation}
                  </span>
                </h4>
              </div>
              
              <div className="analyst-arguments">
                {Object.entries(analysisData.portfolio_management_decision.summary_of_key_arguments).map(([analyst, data]: [string, any]) => (
                  <div key={analyst} className="analyst-section">
                    <h5>{analyst.replace('_', ' ').toUpperCase()} ({data.stance})</h5>
                    <ul>
                      {data.key_points.map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="rationale">
                <h5>Rationale & Decision Justification</h5>
                <p>{analysisData.portfolio_management_decision.rationale_and_decision_justification}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingAnalysisPanel; 
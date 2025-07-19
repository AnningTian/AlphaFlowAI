import React from 'react';

interface HomeProps {
  onNavigate?: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Trade Like Wall Street
            <span className="gradient-text"> with AlphaFlow AI</span>
          </h1>
          <p className="hero-subtitle">
            Institutional-grade multi-agent AI system developed by top-tier quantitative analysts, 
            professional traders, and leading AI researchers. Experience hedge fund-level intelligence 
            in cryptocurrency trading.
          </p>
          <div className="hero-actions">
            <button className="cta-primary" onClick={() => handleNavigation('dashboard')}>
              Access Elite Intelligence
              <span className="arrow">→</span>
            </button>
            <button className="cta-secondary" onClick={() => {
              const featuresSection = document.getElementById('features');
              featuresSection?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Discover Our Edge
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="analysis-card">
              <div className="card-header">
                <div className="status-indicator active"></div>
                <span>Elite Analysis Engine</span>
              </div>
              <div className="card-content">
                <div className="crypto-info">
                  <span className="crypto-symbol">BTC</span>
                  <span className="crypto-price">$118,246</span>
                </div>
                <div className="recommendation">
                  <span className="rec-label">Institutional Signal</span>
                  <span className="rec-value buy">STRONG BUY</span>
                  <span className="confidence">96% conviction</span>
                </div>
              </div>
            </div>
            <div className="agents-card">
              <div className="card-header">
                <span>Expert AI Consortium</span>
              </div>
              <div className="agents-list">
                <div className="agent-item">
                  <div className="agent-icon">📊</div>
                  <span>Quant Strategist</span>
                  <div className="progress-dot completed"></div>
                </div>
                <div className="agent-item">
                  <div className="agent-icon">💼</div>
                  <span>Macro Analyst</span>
                  <div className="progress-dot active"></div>
                </div>
                <div className="agent-item">
                  <div className="agent-icon">🎯</div>
                  <span>Risk Specialist</span>
                  <div className="progress-dot pending"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Institutional-Grade AI Intelligence</h2>
          <p>Powered by proprietary algorithms from Goldman Sachs veterans, Renaissance Technologies quants, and DeepMind researchers</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Elite Multi-Agent Orchestra</h3>
            <p>
              Our AI consortium mirrors top hedge funds' research teams: quantitative strategists, 
              macro economists, and risk specialists working in perfect harmony. Each agent embodies 
              decades of Wall Street expertise.
            </p>
            <div className="feature-tags">
              <span className="tag">Quant Strategist</span>
              <span className="tag">Macro Economist</span>
              <span className="tag">Risk Specialist</span>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Proprietary Signal Processing</h3>
            <p>
              Millisecond-precision market intelligence using advanced neural networks and 
              proprietary indicators developed by former Renaissance Technologies researchers. 
              See market moves before they happen.
            </p>
            <div className="feature-tags">
              <span className="tag">Neural Networks</span>
              <span className="tag">Proprietary Alpha</span>
              <span className="tag">Predictive Models</span>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Institutional Decision Engine</h3>
            <p>
              AI-powered conviction scoring system modeled after top-tier investment committees. 
              Every recommendation carries the weight of collective institutional wisdom with 
              transparent risk-adjusted rationale.
            </p>
            <div className="feature-tags">
              <span className="tag">Conviction Scoring</span>
              <span className="tag">Risk-Adjusted</span>
              <span className="tag">Committee Logic</span>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏛️</div>
            <h3>Hedge Fund Arsenal</h3>
            <p>
              Access to 100+ proprietary technical indicators, alternative data sources, and 
              quantitative models typically reserved for billion-dollar funds. Level the 
              playing field with institutional-grade tools.
            </p>
            <div className="feature-tags">
              <span className="tag">100+ Indicators</span>
              <span className="tag">Alternative Data</span>
              <span className="tag">Quant Models</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">20+</div>
            <div className="stat-label">Years Combined Wall Street Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">$50B+</div>
            <div className="stat-label">Assets Under Management (Team Legacy)</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Proprietary Alpha Signals</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0.1s</div>
            <div className="stat-label">Signal Processing Latency</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>Elite Decision Architecture</h2>
          <p>Our proprietary investment committee process, now powered by cutting-edge AI</p>
        </div>
        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Alternative Data Fusion</h3>
              <p>Proprietary data streams: satellite imagery, social sentiment, options flow, and macro indicators processed in real-time</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Expert AI Deliberation</h3>
              <p>Multi-agent debate system replicating elite investment committee dynamics with quantitative precision and institutional rigor</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Conviction-Weighted Signals</h3>
              <p>Risk-adjusted recommendations with institutional-grade conviction scoring and transparent decision audit trails</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Trade Like the Elite?</h2>
          <p>Join the exclusive circle of traders with access to institutional-grade AI intelligence</p>
          <button className="cta-primary large" onClick={() => handleNavigation('dashboard')}>
            Access Elite Dashboard
            <span className="arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home; 
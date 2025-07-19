import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About AlphaFlow AI</h1>
        <p>Where Wall Street expertise meets cutting-edge artificial intelligence</p>
      </section>
      
      <section className="origin-story">
        <h2>Our Genesis</h2>
        <p>
          AlphaFlow AI was born from a simple yet powerful vision: what if the world's most 
          sophisticated trading minds could work 24/7, processing infinite data streams with 
          perfect precision? Our founding team—veterans from Goldman Sachs, Renaissance Technologies, 
          and DeepMind—united to democratize institutional-grade trading intelligence.
        </p>
        <p>
          After collectively managing over $50 billion in assets and pioneering breakthrough 
          AI research, we recognized that the future of trading lies in the perfect synthesis 
          of human expertise and artificial intelligence.
        </p>
      </section>

      <section className="team-expertise">
        <h2>Elite Founding Consortium</h2>
        <div className="expertise-grid">
          <div className="expertise-card">
            <div className="expertise-icon">🏛️</div>
            <h3>Wall Street Veterans</h3>
            <p>
              Former Goldman Sachs Managing Directors, JP Morgan quantitative strategists, 
              and Citadel portfolio managers with 20+ years of institutional trading experience. 
              Our team has navigated every major market cycle and crisis.
            </p>
            <div className="credentials">
              <span className="credential">Goldman Sachs MD</span>
              <span className="credential">Citadel PM</span>
              <span className="credential">Renaissance Quant</span>
            </div>
          </div>
          <div className="expertise-card">
            <div className="expertise-icon">🧠</div>
            <h3>AI Research Pioneers</h3>
            <p>
              Former DeepMind researchers, MIT AI Lab alumni, and Google Brain veterans 
              who've published 100+ papers in top-tier journals. Our AI team has pioneered 
              breakthrough algorithms in reinforcement learning and neural networks.
            </p>
            <div className="credentials">
              <span className="credential">DeepMind Alumni</span>
              <span className="credential">MIT AI Lab</span>
              <span className="credential">Google Brain</span>
            </div>
          </div>
          <div className="expertise-card">
            <div className="expertise-icon">📊</div>
            <h3>Quantitative Strategists</h3>
            <p>
              PhD-level mathematicians and physicists from Two Sigma, D.E. Shaw, and 
              AQR who've developed proprietary alpha-generating models. Our quants have 
              consistently delivered market-beating returns across all asset classes.
            </p>
            <div className="credentials">
              <span className="credential">Two Sigma PhD</span>
              <span className="credential">D.E. Shaw Quant</span>
              <span className="credential">AQR Researcher</span>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          To bridge the gap between institutional-grade trading intelligence and individual 
          investors. We believe that sophisticated AI-driven analysis, previously exclusive 
          to billion-dollar hedge funds, should be accessible to every serious trader. 
          Our mission is to level the playing field through democratized artificial intelligence.
        </p>
      </section>
      
      <section className="vision">
        <h2>Our Vision</h2>
        <p>
          A future where every trader has access to the same caliber of AI intelligence 
          that powers the world's most successful hedge funds. We envision a marketplace 
          where success is determined by discipline and strategy, not by access to 
          proprietary technology and exclusive data feeds.
        </p>
      </section>
      
      <section className="values">
        <h2>Our Institutional Principles</h2>
        <div className="values-grid">
          <div className="value">
            <div className="value-icon">🔒</div>
            <h3>Institutional Rigor</h3>
            <p>Every algorithm undergoes the same rigorous backtesting and risk management protocols used by top-tier hedge funds.</p>
          </div>
          <div className="value">
            <div className="value-icon">🎯</div>
            <h3>Alpha Generation</h3>
            <p>Relentless focus on generating genuine alpha through proprietary research and cutting-edge AI methodologies.</p>
          </div>
          <div className="value">
            <div className="value-icon">🛡️</div>
            <h3>Risk-First Approach</h3>
            <p>Institutional-grade risk management with real-time portfolio monitoring and dynamic hedging strategies.</p>
          </div>
        </div>
      </section>

      <section className="technology-edge">
        <h2>Our Technological Edge</h2>
        <div className="tech-highlights">
          <div className="tech-item">
            <h4>Proprietary Neural Networks</h4>
            <p>Custom-built transformer architectures optimized for financial time series analysis and pattern recognition.</p>
          </div>
          <div className="tech-item">
            <h4>Alternative Data Integration</h4>
            <p>Satellite imagery, social sentiment, options flow, and macro indicators processed through advanced NLP models.</p>
          </div>
          <div className="tech-item">
            <h4>Multi-Agent Architecture</h4>
            <p>Sophisticated AI agents that debate and deliberate like a world-class investment committee.</p>
          </div>
        </div>
      </section>

      <section className="commitment">
        <h2>Our Commitment</h2>
        <p>
          We're committed to maintaining the highest standards of institutional excellence 
          while making sophisticated trading intelligence accessible to all. Every line of 
          code, every algorithm, and every recommendation carries the weight of our collective 
          Wall Street experience and AI research breakthroughs.
        </p>
        <p>
          <strong>AlphaFlow AI isn't just another trading platform—it's your gateway to 
          institutional-grade intelligence.</strong>
        </p>
      </section>
    </div>
  );
};

export default About; 
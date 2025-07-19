import React from 'react';

const Team: React.FC = () => {
  return (
    <div className="team-page">
      <div className="team-hero">
        <h1>Our Team</h1>
        <p>Meet the experts behind Trading Dashboard</p>
      </div>

      <div className="team-members">
        <div className="team-member">
          <div className="member-avatar">
            <div className="avatar-placeholder">JD</div>
          </div>
          <div className="member-info">
            <h3>John Doe</h3>
            <div className="member-title">Lead Developer</div>
            <p className="member-bio">
              Full-stack developer with 8+ years of experience in financial technology and trading systems.
            </p>
          </div>
        </div>

        <div className="team-member">
          <div className="member-avatar">
            <div className="avatar-placeholder">JS</div>
          </div>
          <div className="member-info">
            <h3>Jane Smith</h3>
            <div className="member-title">Financial Analyst</div>
            <p className="member-bio">
              Former Wall Street analyst with expertise in cryptocurrency markets and quantitative analysis.
            </p>
          </div>
        </div>

        <div className="team-member">
          <div className="member-avatar">
            <div className="avatar-placeholder">MB</div>
          </div>
          <div className="member-info">
            <h3>Mike Brown</h3>
            <div className="member-title">UI/UX Designer</div>
            <p className="member-bio">
              Creative designer focused on building intuitive and beautiful trading interfaces.
            </p>
          </div>
        </div>

        <div className="team-member">
          <div className="member-avatar">
            <div className="avatar-placeholder">SW</div>
          </div>
          <div className="member-info">
            <h3>Sarah Wilson</h3>
            <div className="member-title">Data Scientist</div>
            <p className="member-bio">
              PhD in Statistics with specialization in machine learning and market prediction models.
            </p>
          </div>
        </div>
      </div>
      
      <section className="join-team">
        <h2>Join Our Team</h2>
        <p>We're always looking for talented individuals to join our mission</p>
        <button>View Open Positions</button>
      </section>
    </div>
  );
};

export default Team; 
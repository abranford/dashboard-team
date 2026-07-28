import React, { useState, useEffect } from 'react';

const AdvancedStrategicDashboard = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = 2026;
  
  const aiUseCases = [
    'Process Automation',
    'Data Analysis',
    'Predictive Modeling',
    'Document Processing',
    'Natural Language',
    'Computer Vision',
    'Forecasting',
    'Anomaly Detection',
    'Recommendation Engine',
    'Sentiment Analysis'
  ];

  const teams = ['L2O Implementation', 'Brazil Migration', 'RECBIL', 'E-Invoicing', 'Infrastructure', 'Security', 'Data', 'Compliance'];

  const [initiatives, setInitiatives] = useState([
    {
      id: '1',
      name: 'L2O Phase 1A - Pilot',
      owner: 'Jose Sanchez',
      team: 'L2O Implementation',
      startMonth: 'Jun',
      startYear: 2026,
      endMonth: 'Oct',
      endYear: 2026,
      status: 'on-track',
      progress: 60,
      aiUseCases: ['Process Automation', 'Data Analysis'],
      tasks: [
        { id: '1-1', name: 'Design Phase', status: 'in-progress', pct: 60 },
        { id: '1-2', name: 'TDA Sign-off', status: 'pending', pct: 0 },
        { id: '1-3', name: 'Build & Config', status: 'pending', pct: 0 },
        { id: '1-4', name: 'UAT', status: 'pending', pct: 0 }
      ],
      archived: false
    },
    {
      id: '2',
      name: 'Brazil BR10 Migration',
      owner: 'Implementation Team',
      team: 'Brazil Migration',
      startMonth: 'Jun',
      startYear: 2026,
      endMonth: 'Jan',
      endYear: 2027,
      status: 'on-track',
      progress: 35,
      aiUseCases: ['Predictive Modeling', 'Data Analysis'],
      tasks: [
        { id: '2-1', name: 'Planning Phase', status: 'in-progress', pct: 35 },
        { id: '2-2', name: 'Design', status: 'pending', pct: 0 },
        { id: '2-3', name: 'Build', status: 'pending', pct: 0 },
        { id: '2-4', name: 'Go Live', status: 'pending', pct: 0 }
      ],
      archived: false
    },
    {
      id: '3',
      name: 'France E-Invoicing',
      owner: 'Compliance Lead',
      team: 'E-Invoicing',
      startMonth: 'Sep',
      startYear: 2026,
      endMonth: 'Sep',
      endYear: 2026,
      status: 'at-risk',
      progress: 45,
      aiUseCases: ['Document Processing', 'Anomaly Detection'],
      tasks: [
        { id: '3-1', name: 'Pagero Analysis', status: 'in-progress', pct: 45 },
        { id: '3-2', name: 'Integration', status: 'pending', pct: 0 },
        { id: '3-3', name: 'Testing', status: 'pending', pct: 0 }
      ],
      archived: false
    }
  ]);

  const [view, setView] = useState('dashboard');
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    localStorage.setItem('initiatives', JSON.stringify(initiatives));
  }, [initiatives]);

  const addInitiative = () => {
    const name = prompt('Initiative name:');
    const owner = prompt('Owner:');
    const team = prompt('Team:');
    if (!name || !owner || !team) return;

    const initiative = {
      id: Date.now().toString(),
      name,
      owner,
      team,
      startMonth: 'Jan',
      startYear: 2026,
      endMonth: 'Dec',
      endYear: 2026,
      status: 'on-track',
      progress: 0,
      aiUseCases: [],
      tasks: [
        { id: `${Date.now()}-1`, name: 'Planning', status: 'pending', pct: 0 },
        { id: `${Date.now()}-2`, name: 'Execution', status: 'pending', pct: 0 },
        { id: `${Date.now()}-3`, name: 'Testing', status: 'pending', pct: 0 }
      ],
      archived: false
    };

    setInitiatives([...initiatives, initiative]);
  };

  const updateInitiative = (id, updates) => {
    setInitiatives(initiatives.map(init => 
      init.id === id ? { ...init, ...updates } : init
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return '#009100';
      case 'at-risk': return '#ba7517';
      case 'completed': return '#008300';
      default: return '#999';
    }
  };

  const activeInitiatives = initiatives.filter(i => !i.archived);
  const filteredInitiatives = activeInitiatives.filter(i => {
    if (filterTeam !== 'all' && i.team !== filterTeam) return false;
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    return true;
  });

  const metrics = {
    total: activeInitiatives.length,
    onTrack: activeInitiatives.filter(i => i.status === 'on-track').length,
    atRisk: activeInitiatives.filter(i => i.status === 'at-risk').length,
    avgProgress: Math.round(activeInitiatives.reduce((sum, i) => sum + i.progress, 0) / (activeInitiatives.length || 1))
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 500 }}>Strategic Initiative Dashboard</h1>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '14px', color: '#666' }}>Full portfolio management with AI use case tracking</p>
          </div>
          <button
            onClick={addInitiative}
            style={{
              padding: '10px 20px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            + New Initiative
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Total</div>
            <div style={{ fontSize: '28px', fontWeight: 500 }}>{metrics.total}</div>
          </div>
          <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>On Track</div>
            <div style={{ fontSize: '28px', fontWeight: 500, color: '#009100' }}>{metrics.onTrack}</div>
          </div>
          <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>At Risk</div>
            <div style={{ fontSize: '28px', fontWeight: 500, color: '#ba7517' }}>{metrics.atRisk}</div>
          </div>
          <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Avg Progress</div>
            <div style={{ fontSize: '28px', fontWeight: 500 }}>{metrics.avgProgress}%</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
          >
            <option value="all">All Teams</option>
            {teams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
          >
            <option value="all">All Status</option>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredInitiatives.map(init => (
            <div
              key={init.id}
              style={{
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedInitiative(init)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{init.name}</h3>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '0.5rem', fontSize: '13px', color: '#666' }}>
                    <span>Owner: {init.owner}</span>
                    <span>Team: {init.team}</span>
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  background: init.status === 'on-track' ? '#E8F5E8' : init.status === 'at-risk' ? '#FFF5E1' : '#E8F5E8',
                  color: getStatusColor(init.status),
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  {init.status === 'on-track' ? '● On Track' : init.status === 'at-risk' ? '● At Risk' : '● Completed'}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span>Progress</span>
                  <span style={{ fontWeight: 500 }}>{init.progress}%</span>
                </div>
                <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${init.progress}%`, background: getStatusColor(init.status) }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#666' }}>
                <div>
                  {init.aiUseCases.length > 0 && (
                    <div>AI: {init.aiUseCases.join(', ')}</div>
                  )}
                </div>
                <div>
                  {init.startMonth} {init.startYear} → {init.endMonth} {init.endYear}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedInitiative && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '100%', maxHeight: '80vh', borderRadius: '16px 16px 0 0', padding: '2rem', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 500 }}>{selectedInitiative.name}</h2>
              <button
                onClick={() => setSelectedInitiative(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px' }}>Owner</label>
                <input
                  type="text"
                  value={selectedInitiative.owner}
                  onChange={(e) => updateInitiative(selectedInitiative.id, { owner: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px' }}>Team</label>
                <select
                  value={selectedInitiative.team}
                  onChange={(e) => updateInitiative(selectedInitiative.id, { team: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                >
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px' }}>Status</label>
                <select
                  value={selectedInitiative.status}
                  onChange={(e) => updateInitiative(selectedInitiative.id, { status: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                >
                  <option value="on-track">On Track</option>
                  <option value="at-risk">At Risk</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px' }}>Progress %</label>
                <input
                  type="number"
                  value={selectedInitiative.progress}
                  onChange={(e) => updateInitiative(selectedInitiative.id, { progress: parseInt(e.target.value) || 0 })}
                  min="0"
                  max="100"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedStrategicDashboard;

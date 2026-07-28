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
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newInitiative, setNewInitiative] = useState({
    name: '',
    owner: '',
    team: '',
    startMonth: 'Jan',
    startYear: 2026,
    endMonth: 'Dec',
    endYear: 2026,
    status: 'on-track',
    aiUseCases: []
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('initiatives', JSON.stringify(initiatives));
  }, [initiatives]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('initiatives');
    if (saved) {
      try {
        setInitiatives(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load initiatives:', e);
      }
    }
  }, []);

  const addInitiative = () => {
    if (!newInitiative.name || !newInitiative.owner || !newInitiative.team) {
      alert('Please fill in all required fields');
      return;
    }

    const initiative = {
      id: Date.now().toString(),
      ...newInitiative,
      progress: 0,
      tasks: [
        { id: `${Date.now()}-1`, name: 'Planning', status: 'pending', pct: 0 },
        { id: `${Date.now()}-2`, name: 'Execution', status: 'pending', pct: 0 },
        { id: `${Date.now()}-3`, name: 'Testing', status: 'pending', pct: 0 }
      ],
      archived: false
    };

    setInitiatives([...initiatives, initiative]);
    setNewInitiative({
      name: '',
      owner: '',
      team: '',
      startMonth: 'Jan',
      startYear: 2026,
      endMonth: 'Dec',
      endYear: 2026,
      status: 'on-track',
      aiUseCases: []
    });
    setShowAddModal(false);
  };

  const updateInitiative = (id, updates) => {
    setInitiatives(initiatives.map(init => 
      init.id === id ? { ...init, ...updates } : init
    ));
  };

  const archiveInitiative = (id) => {
    if (window.confirm('Archive this initiative? It will be removed from active view.')) {
      updateInitiative(id, { archived: true });
      setSelectedInitiative(null);
    }
  };

  const deleteInitiative = (id) => {
    if (window.confirm('Delete this initiative permanently?')) {
      setInitiatives(initiatives.filter(i => i.id !== id));
      setSelectedInitiative(null);
    }
  };

  const updateTask = (initiativeId, taskId, updates) => {
    setInitiatives(initiatives.map(init => 
      init.id === initiativeId 
        ? {
            ...init,
            tasks: init.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
            progress: Math.round(
              init.tasks.reduce((sum, t) => {
                const isUpdating = t.id === taskId;
                const pct = isUpdating ? (updates.pct !== undefined ? updates.pct : t.pct) : t.pct;
                return sum + pct;
              }, 0) / init.tasks.length
            )
          }
        : init
    ));
  };

  const toggleAIUseCase = (initiativeId, useCase) => {
    setInitiatives(initiatives.map(init =>
      init.id === initiativeId
        ? {
            ...init,
            aiUseCases: init.aiUseCases.includes(useCase)
              ? init.aiUseCases.filter(u => u !== useCase)
              : [...init.aiUseCases, useCase]
          }
        : init
    ));
  };

  // Filters
  const activeInitiatives = initiatives.filter(i => !i.archived);
  const filteredInitiatives = activeInitiatives.filter(i => {
    if (filterTeam !== 'all' && i.team !== filterTeam) return false;
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    return true;
  });

  // Metrics
  const metrics = {
    total: activeInitiatives.length,
    onTrack: activeInitiatives.filter(i => i.status === 'on-track').length,
    atRisk: activeInitiatives.filter(i => i.status === 'at-risk').length,
    completed: activeInitiatives.filter(i => i.status === 'completed').length,
    avgProgress: Math.round(activeInitiatives.reduce((sum, i) => sum + i.progress, 0) / (activeInitiatives.length || 1)),
    aiUseCaseCount: new Set(activeInitiatives.flatMap(i => i.aiUseCases)).size
  };

  // Team KPIs
  const teamKPIs = teams.map(team => {
    const teamInits = activeInitiatives.filter(i => i.team === team);
    return {
      team,
      count: teamInits.length,
      onTrack: teamInits.filter(i => i.status === 'on-track').length,
      atRisk: teamInits.filter(i => i.status === 'at-risk').length,
      avgProgress: teamInits.length > 0 ? Math.round(teamInits.reduce((sum, i) => sum + i.progress, 0) / teamInits.length) : 0,
      aiUseCases: new Set(teamInits.flatMap(i => i.aiUseCases)).size
    };
  }).filter(kpi => kpi.count > 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return '#009100';
      case 'at-risk': return '#ba7517';
      case 'completed': return '#008300';
      default: return '#999';
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'var(--font-sans)', backgroundColor: 'var(--surface-0)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 500 }}>Strategic Initiative Dashboard</h1>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Full portfolio management with AI use case tracking and team KPIs
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '10px 20px',
              background: 'var(--fill-accent)',
              color: 'var(--on-accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            + New Initiative
          </button>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
          {['dashboard', 'timeline', 'teams', 'ai-tracking', 'archived'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '8px 16px',
                background: view === v ? 'var(--bg-accent)' : 'transparent',
                color: view === v ? 'var(--text-accent)' : 'var(--text-secondary)',
                border: view === v ? '2px solid var(--border-accent)' : '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                textTransform: 'capitalize'
              }}
            >
              {v.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Total</div>
            <div style={{ fontSize: '28px', fontWeight: 500 }}>{metrics.total}</div>
          </div>
          <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>On Track</div>
            <div style={{ fontSize: '28px', fontWeight: 500, color: '#009100' }}>{metrics.onTrack}</div>
          </div>
          <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>At Risk</div>
            <div style={{ fontSize: '28px', fontWeight: 500, color: '#ba7517' }}>{metrics.atRisk}</div>
          </div>
          <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Avg Progress</div>
            <div style={{ fontSize: '28px', fontWeight: 500 }}>{metrics.avgProgress}%</div>
          </div>
          <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>AI Use Cases</div>
            <div style={{ fontSize: '28px', fontWeight: 500 }}>{metrics.aiUseCaseCount}</div>
          </div>
          <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Completed</div>
            <div style={{ fontSize: '28px', fontWeight: 500, color: '#008300' }}>{metrics.completed}</div>
          </div>
        </div>
      </div>

      {/* Dashboard View */}
      {view === 'dashboard' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              style={{ padding: '8px 12px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
            >
              <option value="all">All Teams</option>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '8px 12px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
            >
              <option value="all">All Status</option>
              <option value="on-track">On Track</option>
              <option value="at-risk">At Risk</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Initiatives List */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredInitiatives.map(init => (
              <div
                key={init.id}
                style={{
                  background: 'var(--surface-1)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedInitiative(init)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{init.name}</h3>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '0.5rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span>Owner: {init.owner}</span>
                      <span>Team: {init.team}</span>
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    background: init.status === 'on-track' ? '#E8F5E8' : init.status === 'at-risk' ? '#FFF5E1' : '#E8F5E8',
                    color: getStatusColor(init.status),
                    borderRadius: 'var(--radius)',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {init.status === 'on-track' ? '● On Track' : init.status === 'at-risk' ? '● At Risk' : '● Completed'}
                  </div>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span>Progress</span>
                    <span style={{ fontWeight: 500 }}>{init.progress}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--surface-0)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${init.progress}%`, background: getStatusColor(init.status) }}></div>
                  </div>
                </div>

                {/* AI Use Cases & Timeline */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
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
      )}

      {/* Timeline View */}
      {view === 'timeline' && (
        <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem', overflowX: 'auto' }}>
          <div style={{ minWidth: '1200px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>Initiative</div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <div key={m} style={{ width: '50px', fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'center' }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {filteredInitiatives.map(init => {
              const monthIndex = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
              const start = monthIndex[init.startMonth];
              const end = monthIndex[init.endMonth];

              return (
                <div key={init.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer' }} onClick={() => setSelectedInitiative(init)}>
                    {init.name}
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {months.map((m, i) => (
                      <div key={i} style={{ width: '50px', height: '28px', background: 'var(--surface-0)', borderRadius: '4px', position: 'relative' }}>
                        {i >= start && i <= end && (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              background: getStatusColor(init.status),
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              fontWeight: 500,
                              color: 'white',
                              cursor: 'pointer',
                              opacity: 0.85
                            }}
                            onClick={() => setSelectedInitiative(init)}
                          >
                            {init.progress > 0 && `${init.progress}%`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team KPIs View */}
      {view === 'teams' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {teamKPIs.map(kpi => (
            <div key={kpi.team} style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', fontWeight: 500 }}>{kpi.team}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'var(--surface-0)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Initiatives</div>
                  <div style={{ fontSize: '24px', fontWeight: 500, marginTop: '6px' }}>{kpi.count}</div>
                </div>
                <div style={{ background: 'var(--surface-0)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>On Track</div>
                  <div style={{ fontSize: '24px', fontWeight: 500, marginTop: '6px', color: '#009100' }}>{kpi.onTrack}</div>
                </div>
                <div style={{ background: 'var(--surface-0)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>At Risk</div>
                  <div style={{ fontSize: '24px', fontWeight: 500, marginTop: '6px', color: '#ba7517' }}>{kpi.atRisk}</div>
                </div>
                <div style={{ background: 'var(--surface-0)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Avg Progress</div>
                  <div style={{ fontSize: '24px', fontWeight: 500, marginTop: '6px' }}>{kpi.avgProgress}%</div>
                </div>
                <div style={{ background: 'var(--surface-0)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>AI Use Cases</div>
                  <div style={{ fontSize: '24px', fontWeight: 500, marginTop: '6px' }}>{kpi.aiUseCases}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Tracking View */}
      {view === 'ai-tracking' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {aiUseCases.map(useCase => {
            const count = filteredInitiatives.filter(i => i.aiUseCases.includes(useCase)).length;
            const initiatives = filteredInitiatives.filter(i => i.aiUseCases.includes(useCase));
            return (
              <div key={useCase} style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{useCase}</h3>
                  <span style={{ fontSize: '14px', fontWeight: 500, background: 'var(--bg-accent)', color: 'var(--text-accent)', padding: '6px 12px', borderRadius: 'var(--radius)' }}>
                    {count} initiatives
                  </span>
                </div>
                {initiatives.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {initiatives.map(init => (
                      <span
                        key={init.id}
                        style={{
                          padding: '6px 12px',
                          background: 'var(--surface-0)',
                          borderRadius: 'var(--radius)',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedInitiative(init)}
                      >
                        {init.name} ({init.team})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Archived View */}
      {view === 'archived' && (
        <div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {initiatives.filter(i => i.archived).length} archived initiatives
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {initiatives.filter(i => i.archived).map(init => (
              <div key={init.id} style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem', opacity: 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{init.name}</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{init.team}</div>
                  </div>
                  <button
                    onClick={() => updateInitiative(init.id, { archived: false })}
                    style={{ padding: '6px 12px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', background: 'transparent', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {selectedInitiative && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface-2)', width: '100%', maxHeight: '80vh', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', padding: '2rem', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 500 }}>{selectedInitiative.name}</h2>
              <button
                onClick={() => setSelectedInitiative(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Owner</label>
                <input
                  type="text"
                  value={selectedInitiative.owner}
                  onChange={(e) => updateInitiative(selectedInitiative.id, { owner: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Team</label>
                <select
                  value={selectedInitiative.team}
                  onChange={(e) => updateInitiative(selectedInitiative.id, { team: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                >
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Status</label>
                <select
                  value={selectedInitiative.status}
                  onChange={(e) => updateInitiative(selectedInitiative.id, { status: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                >
                  <option value="on-track">On Track</option>
                  <option value="at-risk">At Risk</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Start</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px' }}>
                  <select
                    value={selectedInitiative.startMonth}
                    onChange={(e) => updateInitiative(selectedInitiative.id, { startMonth: e.target.value })}
                    style={{ padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                  >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <input
                    type="number"
                    value={selectedInitiative.startYear}
                    onChange={(e) => updateInitiative(selectedInitiative.id, { startYear: parseInt(e.target.value) })}
                    style={{ width: '60px', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>End</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px' }}>
                  <select
                    value={selectedInitiative.endMonth}
                    onChange={(e) => updateInitiative(selectedInitiative.id, { endMonth: e.target.value })}
                    style={{ padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                  >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <input
                    type="number"
                    value={selectedInitiative.endYear}
                    onChange={(e) => updateInitiative(selectedInitiative.id, { endYear: parseInt(e.target.value) })}
                    style={{ width: '60px', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>

            {/* AI Use Cases */}
            <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '0.5px solid var(--border)' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '12px' }}>AI Use Cases</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {aiUseCases.map(useCase => (
                  <button
                    key={useCase}
                    onClick={() => toggleAIUseCase(selectedInitiative.id, useCase)}
                    style={{
                      padding: '8px 12px',
                      background: selectedInitiative.aiUseCases.includes(useCase) ? 'var(--fill-accent)' : 'var(--surface-0)',
                      color: selectedInitiative.aiUseCases.includes(useCase) ? 'var(--on-accent)' : 'var(--text-primary)',
                      border: selectedInitiative.aiUseCases.includes(useCase) ? 'none' : '0.5px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    {useCase}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', fontWeight: 500 }}>Tasks & Milestones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedInitiative.tasks.map(task => (
                  <div key={task.id} style={{ background: 'var(--surface-1)', padding: '12px', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '12px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) => updateTask(selectedInitiative.id, task.id, { name: e.target.value })}
                        style={{ padding: '6px', border: '0.5px solid var(--border)', borderRadius: '4px', fontSize: '12px' }}
                      />
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(selectedInitiative.id, task.id, { status: e.target.value })}
                        style={{ padding: '6px', border: '0.5px solid var(--border)', borderRadius: '4px', fontSize: '12px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <input
                        type="number"
                        value={task.pct}
                        onChange={(e) => updateTask(selectedInitiative.id, task.id, { pct: parseInt(e.target.value) || 0 })}
                        min="0"
                        max="100"
                        style={{ width: '60px', padding: '6px', border: '0.5px solid var(--border)', borderRadius: '4px', fontSize: '12px' }}
                      />
                      <span style={{ fontSize: '12px' }}>%</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--surface-0)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${task.pct}%`, background: getStatusColor(task.status === 'completed' ? 'completed' : task.status === 'in-progress' ? 'on-track' : 'at-risk') }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => archiveInitiative(selectedInitiative.id)}
                style={{ padding: '8px 16px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', background: 'transparent', cursor: 'pointer', fontSize: '13px' }}
              >
                Archive
              </button>
              <button
                onClick={() => deleteInitiative(selectedInitiative.id)}
                style={{ padding: '8px 16px', border: '0.5px solid var(--border-danger)', borderRadius: 'var(--radius)', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: 'var(--text-danger)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
          <div style={{ background: 'var(--surface-2)', borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '22px', fontWeight: 500 }}>New Initiative</h2>

            <div style={{ display: 'grid', gap: '12px', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Initiative Name *</label>
                <input
                  type="text"
                  value={newInitiative.name}
                  onChange={(e) => setNewInitiative({ ...newInitiative, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                  placeholder="e.g., L2O Phase 2A"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Owner *</label>
                <input
                  type="text"
                  value={newInitiative.owner}
                  onChange={(e) => setNewInitiative({ ...newInitiative, owner: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                  placeholder="e.g., John Smith"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Team *</label>
                <select
                  value={newInitiative.team}
                  onChange={(e) => setNewInitiative({ ...newInitiative, team: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                >
                  <option value="">Select a team</option>
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Start Month</label>
                  <select
                    value={newInitiative.startMonth}
                    onChange={(e) => setNewInitiative({ ...newInitiative, startMonth: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                  >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Year</label>
                  <input
                    type="number"
                    value={newInitiative.startYear}
                    onChange={(e) => setNewInitiative({ ...newInitiative, startYear: parseInt(e.target.value) })}
                    style={{ width: '70px', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>End Month</label>
                  <select
                    value={newInitiative.endMonth}
                    onChange={(e) => setNewInitiative({ ...newInitiative, endMonth: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                  >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Year</label>
                  <input
                    type="number"
                    value={newInitiative.endYear}
                    onChange={(e) => setNewInitiative({ ...newInitiative, endYear: parseInt(e.target.value) })}
                    style={{ width: '70px', padding: '8px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ padding: '10px 20px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', background: 'transparent', cursor: 'pointer', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                onClick={addInitiative}
                style={{ padding: '10px 20px', background: 'var(--fill-accent)', color: 'var(--on-accent)', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
              >
                Create Initiative
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedStrategicDashboard;

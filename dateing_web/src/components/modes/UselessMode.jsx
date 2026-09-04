import { useState } from 'react'
import { supabase, updateProfile } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import MatchResult from './MatchResult'
import toast from 'react-hot-toast'

const FRIDGE_OPTIONS = ['Never', '1-3 times', '4-10 times', 'I live there', 'Fridge is my therapist']
const ALARM_OPTIONS = ['0 (I am a myth)', '1-3 alarms', '4-7 alarms', '8-15 alarms', '16+ (Pure Chaos)']
const UNREAD_OPTIONS = ['0-50 msgs', '51-500 msgs', '501-9999 msgs', '10k+ msgs', 'Stopped counting']

const ANALYZING_STEPS = [
  'Calculating your chaos coefficient... 🧠',
  'Measuring snooze-to-productivity ratio...',
  'Scanning fridge-staring frequency data...',
  'Cross-referencing your unread messages...',
  'Generating your Uselessness Score™...',
  'Matching you with a fellow hopeless disaster...',
]

const WASTE_MESSAGES = [
  "Combined, you two have 47 unfinished projects.",
  "Your uselessness scores are mathematically compatible. Almost romantic.",
  "You've both definitely opened the fridge for no reason today.",
  "Two chaotic forces. One inexplicable connection.",
  "The algorithm says yes. The algorithm is also useless.",
]

export default function UselessMode({ navigate }) {
  const { session, refreshProfile } = useAuth()
  const [phase, setPhase] = useState('questions') // questions | analyzing | result | no-users
  const [alarms, setAlarms] = useState(null)
  const [fridge, setFridge] = useState(null)
  const [unread, setUnread] = useState(null)
  const [analyzeStep, setAnalyzeStep] = useState(0)
  const [calcProgress, setCalcProgress] = useState(0)
  const [matchedUser, setMatchedUser] = useState(null)
  const [uselessScore, setUselessScore] = useState(0)
  const [waste, setWaste] = useState('')

  function computeScore() {
    let score = 0
    const alarmMap = { '0 (I am a myth)': 5, '1-3 alarms': 20, '4-7 alarms': 45, '8-15 alarms': 70, '16+ (Pure Chaos)': 95 }
    const fridgeMap = { 'Never': 5, '1-3 times': 20, '4-10 times': 50, 'I live there': 75, 'Fridge is my therapist': 98 }
    const unreadMap = { '0-50 msgs': 5, '51-500 msgs': 30, '501-9999 msgs': 60, '10k+ msgs': 85, 'Stopped counting': 100 }
    score += alarmMap[alarms] || 30
    score += fridgeMap[fridge] || 30
    score += unreadMap[unread] || 30
    return Math.min(Math.round(score / 3), 100)
  }

  async function handleQSubmit() {
    const score = computeScore()
    setUselessScore(score)
    setPhase('analyzing')
    setAnalyzeStep(0)
    setCalcProgress(0)

    const totalSteps = ANALYZING_STEPS.length
    const stepDuration = 2200 // ~13s engaging calculation

    for (let i = 0; i < totalSteps; i++) {
      setAnalyzeStep(i)
      const startTime = Date.now()
      while (Date.now() - startTime < stepDuration) {
        await new Promise(r => setTimeout(r, 60))
        const elapsed = Date.now() - startTime
        const currentOverall = ((i + elapsed / stepDuration) / totalSteps) * 100
        setCalcProgress(Math.min(99, Math.round(currentOverall)))
      }
    }

    setCalcProgress(100)
    await new Promise(r => setTimeout(r, 500))

    // Save uselessness data to profile
    if (session?.user?.id) {
      const alarmNums = { '0 (I am a myth)': 0, '1-3 alarms': 2, '4-7 alarms': 5, '8-15 alarms': 10, '16+ (Pure Chaos)': 20 }
      const unreadNums = { '0-50 msgs': 25, '51-500 msgs': 275, '501-9999 msgs': 5000, '10k+ msgs': 10000, 'Stopped counting': 99999 }
      try {
        await updateProfile(session.user.id, {
          uselessness_score: score,
          alarms_per_morning: alarmNums[alarms] || 0,
          unread_messages: unreadNums[unread] || 0,
        })
        await refreshProfile()
      } catch (_) {}
    }

    // Find match by closest uselessness score
    try {
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', session?.user?.id || '')

      if (!allUsers || allUsers.length === 0) {
        setPhase('no-users')
        return
      }

      const scored = allUsers.map(u => ({
        ...u,
        scoreDiff: Math.abs((u.uselessness_score || 0) - score),
      }))
      scored.sort((a, b) => a.scoreDiff - b.scoreDiff)

      setMatchedUser(scored[0])
      setWaste(WASTE_MESSAGES[Math.floor(Math.random() * WASTE_MESSAGES.length)])
      setPhase('result')
    } catch (err) {
      toast.error('Matching failed: ' + err.message)
      setPhase('questions')
    }
  }

  function reset() {
    setPhase('questions')
    setAlarms(null)
    setFridge(null)
    setUnread(null)
    setAnalyzeStep(0)
    setCalcProgress(0)
    setMatchedUser(null)
    setUselessScore(0)
  }

  const qAnswered = alarms && fridge && unread

  return (
    <div className="mode-page">
      <div className="mode-card" style={{ maxWidth: '660px' }}>
        {/* Header */}
        <div>
          <div className="badge badge-pink" style={{ display: 'inline-flex', marginBottom: '0.4rem' }}>
            🤡 USELESSNESS MATRIX
          </div>
          <h1 className="mode-heading">USELESSNESS MATCH</h1>
          <p className="mode-subtitle">
            Answer these completely irrelevant questions to calculate your Uselessness Score™ and pair with an equally chaotic soul.
          </p>
        </div>

        {/* QUESTIONS PHASE WITH CLEAN PILL OPTION BUTTONS */}
        {phase === 'questions' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.4rem' }}>
            {/* Question 1: Alarms */}
            <div style={{
              width: '100%', background: 'rgba(255, 240, 243, 0.65)', border: '1px solid rgba(255, 179, 193, 0.5)',
              borderRadius: '20px', padding: '1.2rem 1.4rem', textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#C9184A', marginBottom: '0.75rem' }}>
                1. How many morning alarms do you snooze?
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                {ALARM_OPTIONS.map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setAlarms(opt)}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: '9999px',
                      border: alarms === opt ? '2px solid #FF4D6D' : '1px solid rgba(255, 179, 193, 0.5)',
                      background: alarms === opt ? 'rgba(255, 77, 109, 0.14)' : '#FFFFFF',
                      color: alarms === opt ? '#C9184A' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Fridge */}
            <div style={{
              width: '100%', background: 'rgba(255, 240, 243, 0.65)', border: '1px solid rgba(255, 179, 193, 0.5)',
              borderRadius: '20px', padding: '1.2rem 1.4rem', textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#C9184A', marginBottom: '0.75rem' }}>
                2. How often do you open the fridge randomly?
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                {FRIDGE_OPTIONS.map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFridge(opt)}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: '9999px',
                      border: fridge === opt ? '2px solid #FF4D6D' : '1px solid rgba(255, 179, 193, 0.5)',
                      background: fridge === opt ? 'rgba(255, 77, 109, 0.14)' : '#FFFFFF',
                      color: fridge === opt ? '#C9184A' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Unread */}
            <div style={{
              width: '100%', background: 'rgba(255, 240, 243, 0.65)', border: '1px solid rgba(255, 179, 193, 0.5)',
              borderRadius: '20px', padding: '1.2rem 1.4rem', textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#C9184A', marginBottom: '0.75rem' }}>
                3. How many unread messages are in your inbox?
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                {UNREAD_OPTIONS.map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setUnread(opt)}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: '9999px',
                      border: unread === opt ? '2px solid #FF4D6D' : '1px solid rgba(255, 179, 193, 0.5)',
                      background: unread === opt ? 'rgba(255, 77, 109, 0.14)' : '#FFFFFF',
                      color: unread === opt ? '#C9184A' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              className="btn btn-primary btn-full btn-lg pulse-click"
              disabled={!qAnswered}
              onClick={handleQSubmit}
              style={{ marginTop: '0.5rem' }}
            >
              {qAnswered ? 'CALCULATE MY USELESSNESS →' : 'Answer all 3 questions'}
            </button>
          </div>
        )}

        {/* ENGAGING & MEANINGFUL CALCULATION PHASE */}
        {phase === 'analyzing' && (
          <div className="slow-waiting-box">
            {/* Glowing Ring */}
            <div className="slow-progress-ring-container">
              <div className="slow-breath-circle" />
              <div className="slow-percentage-text">
                {calcProgress}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="slow-bar-wrapper">
              <div className="slow-bar-fill" style={{ width: `${calcProgress}%` }} />
            </div>

            {/* Rotating Reflections */}
            <div className="poetic-reflection-card">
              "{ANALYZING_STEPS[analyzeStep]}"
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Uselessness Algorithm Running...
            </div>
          </div>
        )}

        {/* RESULT PHASE */}
        {phase === 'result' && matchedUser && (
          <div style={{ width: '100%' }}>
            <MatchResult
              user={matchedUser}
              compatibilityLabel={`Your Uselessness Score: ${uselessScore}% 💀`}
              wasteMessage={waste}
              extra={`Their uselessness score: ${matchedUser.uselessness_score || Math.min(100, uselessScore + 4)}%. A match made in chaotic harmony.`}
              onReset={reset}
              navigate={navigate}
            />
          </div>
        )}

        {/* NO USERS FALLBACK */}
        {phase === 'no-users' && (
          <div className="no-users-card" style={{ padding: '2rem 0' }}>
            <div style={{ fontSize: '3.5rem' }}>🤡</div>
            <p style={{ fontFamily: 'var(--font)', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
              Your uselessness score: <strong style={{ color: '#C9184A' }}>{uselessScore}%</strong><br />
              Please seed the database to find your chaotic soulmate!
            </p>
            <button className="btn btn-ghost" onClick={reset} style={{ marginTop: '1rem' }}>
              Try Again
            </button>
          </div>
        )}

        {/* Back Button */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('fate')}
          style={{ marginTop: '1.8rem', borderRadius: '9999px' }}
        >
          ← Back to Fate
        </button>
      </div>
    </div>
  )
}

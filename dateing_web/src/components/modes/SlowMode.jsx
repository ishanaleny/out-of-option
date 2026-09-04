import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import MatchResult from './MatchResult'
import toast from 'react-hot-toast'

const SLOW_STEPS = [
  { text: 'Decelerating your heart rate... Take a slow deep breath 🌸' },
  { text: 'In a world of fast swipes, patience is the ultimate flex ✨' },
  { text: 'True connection isn\'t built in 5 seconds. Savoring the delay...' },
  { text: 'Filtering out instant impulse... searching for deep energy harmony 💖' },
  { text: 'Patience verified. Unlocking your slow match...' },
]

export default function SlowMode({ navigate }) {
  const { session } = useAuth()
  const [phase, setPhase] = useState('intro') // intro | waiting | result | no-users
  const [currentStep, setCurrentStep] = useState(0)
  const [matchedUser, setMatchedUser] = useState(null)
  const [progress, setProgress] = useState(0)

  async function startSlowProcess() {
    setPhase('waiting')
    setCurrentStep(0)
    setProgress(0)

    const totalSteps = SLOW_STEPS.length
    const stepDuration = 3200 // 3.2s per step = ~16s meaningful countdown

    for (let i = 0; i < totalSteps; i++) {
      setCurrentStep(i)
      const startTime = Date.now()
      
      while (Date.now() - startTime < stepDuration) {
        await new Promise(r => setTimeout(r, 80))
        const elapsed = Date.now() - startTime
        const currentOverall = ((i + elapsed / stepDuration) / totalSteps) * 100
        setProgress(Math.min(99, Math.round(currentOverall)))
      }
    }

    setProgress(100)
    await new Promise(r => setTimeout(r, 600))

    try {
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', session?.user?.id || '')

      if (!allUsers || allUsers.length === 0) {
        setPhase('no-users')
        return
      }

      const match = allUsers[Math.floor(Math.random() * allUsers.length)]
      setMatchedUser(match)
      setPhase('result')
    } catch (err) {
      toast.error('Slow matching error: ' + err.message)
      setPhase('intro')
    }
  }

  return (
    <div className="mode-page">
      <div className="mode-card">
        {/* Top Tag */}
        <div>
          <div className="badge badge-pink" style={{ display: 'inline-flex', marginBottom: '0.5rem' }}>
            🐢 SLOW ROMANCE
          </div>
          <h1 className="mode-heading">SLOW DATING</h1>
          <p className="mode-subtitle">
            Because rushing into bad relationships has gotten you nowhere.<br />
            Take a deep breath and savor the anticipation.
          </p>
        </div>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', width: '100%' }}>
            <div style={{
              fontSize: '4.5rem',
              filter: 'drop-shadow(0 8px 20px rgba(255, 77, 109, 0.3))',
              animation: 'floatMedium 5s ease-in-out infinite'
            }}>
              🐢
            </div>

            <div className="poetic-reflection-card">
              "Patience is the highest form of romantic intention. The best connections take time to bloom."
            </div>

            <button
              className="btn btn-primary btn-lg pulse-click"
              onClick={startSlowProcess}
              style={{ marginTop: '0.5rem' }}
            >
              BEGIN SLOW MATCHING →
            </button>
          </div>
        )}

        {/* WAITING PHASE (MEANINGFUL ENGAGING COUNTDOWN) */}
        {phase === 'waiting' && (
          <div className="slow-waiting-box">
            {/* Glowing Breath Ring with Percentage */}
            <div className="slow-progress-ring-container">
              <div className="slow-breath-circle" />
              <div className="slow-percentage-text">
                {progress}%
              </div>
            </div>

            {/* Glowing Linear Progress Bar */}
            <div className="slow-bar-wrapper">
              <div className="slow-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Cycling Poetic Reflections */}
            <div className="poetic-reflection-card">
              "{SLOW_STEPS[currentStep]?.text}"
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Snail Pace Active — Breathe in, breathe out...
            </div>
          </div>
        )}

        {/* RESULT PHASE */}
        {phase === 'result' && matchedUser && (
          <div style={{ width: '100%' }}>
            <MatchResult
              user={matchedUser}
              compatibilityLabel="Patience Verified: 100%"
              wasteMessage="You waited patiently and honored your time. Here is your intentional match."
              extra="You both have mastered the art of not rushing into terrible decisions immediately."
              onReset={() => setPhase('intro')}
              navigate={navigate}
            />
          </div>
        )}

        {/* NO USERS FALLBACK */}
        {phase === 'no-users' && (
          <div className="no-users-card" style={{ padding: '2rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🌸</div>
            <p style={{ fontFamily: 'var(--font)', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
              You waited so patiently! Please seed the database to reveal your slow romance match.
            </p>
            <button className="btn btn-ghost" onClick={() => setPhase('intro')} style={{ marginTop: '1rem' }}>
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

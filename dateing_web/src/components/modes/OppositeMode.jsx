import { useState } from 'react'
import { supabase, updateProfile } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const QUESTIONS = [
  {
    id: 'personality',
    title: '1. Your Personality',
    field: 'personality',
    options: ['Introvert', 'Extrovert', 'Calm', 'Chaotic'],
    opposites: { Introvert: 'Extrovert', Extrovert: 'Introvert', Calm: 'Chaotic', Chaotic: 'Calm' },
  },
  {
    id: 'communication',
    title: '2. How do you communicate?',
    field: 'communication',
    options: ['Text constantly', 'Replies late', 'Calls randomly', 'Sends memes'],
  },
  {
    id: 'weekend',
    title: '3. Weekend plans?',
    field: 'weekend',
    options: ['Stay home', 'Go out', 'Netflix + nothing', 'Impulsive decisions'],
  },
  {
    id: 'vibe',
    title: '4. Your overall vibe',
    field: 'vibe',
    options: ['Overthinker', 'Chill', 'Chaotic good', 'Mystery box'],
  },
]

function RadioGroup({ question, value, onChange }) {
  return (
    <div className="q-group" style={{ marginBottom: '1.2rem', width: '100%' }}>
      <div className="q-title" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.6rem' }}>
        {question.title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
        {question.options.map(opt => (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '9999px',
              border: value === opt ? '2px solid #FF4D6D' : '1px solid rgba(255, 179, 193, 0.5)',
              background: value === opt ? 'rgba(255, 77, 109, 0.12)' : 'rgba(255, 255, 255, 0.8)',
              color: value === opt ? '#C9184A' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

const ANALYZING_STEPS = [
  'Processing your vibe...',
  'Analyzing energy frequencies...',
  'Cross-referencing personality matrix...',
  'Running Vibe Harmonizer™...',
  'Generating complementary profile deck...',
]

export default function OppositeMode({ navigate }) {
  const { session, refreshProfile } = useAuth()
  const [answers, setAnswers] = useState({})
  const [phase, setPhase] = useState('quiz') // quiz | analyzing | deck | no-users
  const [analyzeStep, setAnalyzeStep] = useState(0)
  const [userList, setUserList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState('') // 'left' | 'right'

  function setAnswer(id, val) {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id])

  async function handleSubmit() {
    setPhase('analyzing')
    setAnalyzeStep(0)

    for (let i = 1; i < ANALYZING_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 600))
      setAnalyzeStep(i)
    }
    await new Promise(r => setTimeout(r, 500))

    if (session?.user?.id && answers.personality) {
      try {
        await updateProfile(session.user.id, {
          personality: answers.personality,
          interests: answers.weekend,
        })
        await refreshProfile()
      } catch (_) {}
    }

    try {
      const myPersonality = answers.personality
      const firstQ = QUESTIONS[0]
      const oppositePersonality = firstQ.opposites[myPersonality]

      let query = supabase.from('profiles').select('*').neq('id', session?.user?.id || '')
      let matchProfiles = []

      if (oppositePersonality) {
        const { data: exactMatches } = await query.eq('personality', oppositePersonality)
        if (exactMatches && exactMatches.length > 0) {
          matchProfiles = exactMatches
        }
      }

      // If exact matches are few, append remaining profiles for a rich swipe deck!
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', session?.user?.id || '')

      if (allUsers && allUsers.length > 0) {
        const ids = new Set(matchProfiles.map(u => u.id))
        const remaining = allUsers.filter(u => !ids.has(u.id))
        // Combine exact opposite matches first, followed by general complementary profiles
        matchProfiles = [...matchProfiles, ...remaining]
      }

      if (matchProfiles.length > 0) {
        setUserList(matchProfiles)
        setCurrentIndex(0)
        setPhase('deck')
      } else {
        setPhase('no-users')
      }
    } catch (err) {
      toast.error('Matching failed: ' + err.message)
      setPhase('quiz')
    }
  }

  function handleSwipe(direction) {
    if (swipeDirection) return
    setSwipeDirection(direction)

    const currentUser = userList[currentIndex]
    if (direction === 'right') {
      toast.success(`💖 Vibe Connection made with ${currentUser.name || currentUser.username || 'your match'}!`)
    }

    setTimeout(() => {
      setSwipeDirection('')
      setCurrentIndex(prev => prev + 1)
    }, 350)
  }

  function reset() {
    setAnswers({})
    setPhase('quiz')
    setUserList([])
    setCurrentIndex(0)
  }

  const currentUser = userList[currentIndex]
  const isDeckFinished = currentIndex >= userList.length

  return (
    <div className="mode-page">
      <div className="mode-card">
        {/* Top Tag */}
        <div>
          <div className="badge badge-pink" style={{ display: 'inline-flex', marginBottom: '0.4rem' }}>
            ✨ VIBE HARMONY
          </div>
          <h1 className="mode-heading">COMPLEMENTARY VIBE MATCH</h1>
          <p className="mode-subtitle">
            Find your natural balance. Swipe through profiles whose energy complements yours.
          </p>
        </div>

        {/* QUIZ PHASE */}
        {phase === 'quiz' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '480px', marginBottom: '1rem' }}>
              {QUESTIONS.map(q => (
                <RadioGroup key={q.id} question={q} value={answers[q.id]} onChange={v => setAnswer(q.id, v)} />
              ))}
            </div>
            <button
              className="btn btn-primary btn-full btn-lg pulse-click"
              onClick={handleSubmit}
              disabled={!allAnswered}
              style={{ maxWidth: '420px' }}
            >
              {allAnswered ? 'SWIPE MY COMPLEMENTARY MATCHES →' : `Answer all ${QUESTIONS.length} questions`}
            </button>
          </div>
        )}

        {/* ANALYZING PHASE */}
        {phase === 'analyzing' && (
          <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
            <div className="spinner" />
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#C9184A', fontWeight: 700 }}>
              {ANALYZING_STEPS[analyzeStep]}
            </div>
          </div>
        )}

        {/* TINDER-STYLE SWIPE DECK PHASE */}
        {phase === 'deck' && !isDeckFinished && currentUser && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Card Counter Badge */}
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
              Profile {currentIndex + 1} of {userList.length}
            </div>

            {/* Swipeable Card */}
            <div
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '460px',
                padding: '2rem 1.6rem',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 179, 193, 0.6)',
                boxShadow: '0 20px 45px rgba(255, 77, 109, 0.18)',
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
                transform: swipeDirection === 'left'
                  ? 'translateX(-120px) rotate(-12deg)'
                  : swipeDirection === 'right'
                  ? 'translateX(120px) rotate(12deg)'
                  : 'none',
                opacity: swipeDirection ? 0 : 1
              }}
            >
              {/* Profile Photo */}
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden',
                margin: '0 auto 1rem auto', border: '4px solid #FF4D6D',
                boxShadow: '0 0 25px rgba(255, 77, 109, 0.4)', background: '#FFF0F3',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'
              }}>
                {currentUser.profile_photo ? (
                  <img src={currentUser.profile_photo} alt={currentUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '💖'}
              </div>

              {/* Name & Age */}
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#2B0912', marginBottom: '0.2rem' }}>
                {currentUser.name || currentUser.username}
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem' }}>
                {[currentUser.age && `${currentUser.age}yo`, currentUser.gender, currentUser.location].filter(Boolean).join(' · ')}
              </div>

              {/* Vibe Match Badge */}
              <div style={{
                display: 'inline-flex', padding: '4px 14px', borderRadius: '9999px',
                background: 'rgba(255, 77, 109, 0.12)', border: '1px solid rgba(255, 77, 109, 0.3)',
                color: '#C9184A', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.2rem'
              }}>
                ✨ {currentUser.personality === QUESTIONS[0].opposites[answers.personality] ? '100% Exact Opposite Vibe Match' : 'Complementary Energy Match'}
              </div>

              {currentUser.bio && (
                <div style={{
                  background: 'rgba(255, 240, 243, 0.75)', padding: '0.9rem 1.1rem', borderRadius: '14px',
                  fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: '1.2rem'
                }}>
                  "{currentUser.bio}"
                </div>
              )}

              {/* Trait Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                {currentUser.personality && <span className="trait-pill"><span className="trait-pill-label">Vibe:</span> {currentUser.personality}</span>}
                {currentUser.red_flag && <span className="trait-pill"><span className="trait-pill-label">Red Flag:</span> {currentUser.red_flag}</span>}
                {currentUser.green_flag && <span className="trait-pill"><span className="trait-pill-label">Green Flag:</span> {currentUser.green_flag}</span>}
              </div>
            </div>

            {/* Action Buttons (Pass vs Vibe Match) */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.8rem', alignItems: 'center' }}>
              <button
                className="btn pulse-click"
                onClick={() => handleSwipe('left')}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: '#FFFFFF',
                  border: '2px solid rgba(255, 179, 193, 0.8)', fontSize: '1.5rem', cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
                }}
                title="Pass"
              >
                ❌
              </button>

              <button
                className="btn btn-primary pulse-click"
                onClick={() => handleSwipe('right')}
                style={{
                  padding: '1rem 2.2rem', borderRadius: '9999px', fontSize: '1.05rem'
                }}
              >
                💖 VIBE CONNECT
              </button>
            </div>
          </div>
        )}

        {/* FINISHED DECK PHASE */}
        {phase === 'deck' && isDeckFinished && (
          <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '3.5rem' }}>✨</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#2B0912' }}>
              You've Swiped Through All Vibe Matches!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Re-shuffle the deck or re-take the vibe test to find more complementary profiles.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setCurrentIndex(0)}>🔄 Re-Shuffle Deck</button>
              <button className="btn btn-ghost" onClick={reset}>Re-Take Quiz</button>
            </div>
          </div>
        )}

        {/* NO USERS FALLBACK */}
        {phase === 'no-users' && (
          <div className="no-users-card" style={{ padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem' }}>✨</div>
            <p style={{ fontFamily: 'var(--font)', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              No other profiles found in the database.<br />
              Please seed the database to reveal your complementary matches!
            </p>
            <button className="btn btn-ghost" onClick={reset} style={{ marginTop: '1rem' }}>Try Again</button>
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

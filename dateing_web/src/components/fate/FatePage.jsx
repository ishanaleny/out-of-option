import { useState, useMemo } from 'react'
import { updateProfile } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const ALL_NUMBERS = [7, 11, 23, 27, 42, 52, 67, 88, 99]

const MODES_POOL = [
  { mode: 'opposite',  label: 'COMPLEMENTARY VIBE MATCH', emoji: '✨', color: '#FF4D6D', desc: 'Matches you with your energetic complement' },
  { mode: 'slow',      label: 'SLOW DATING',               emoji: '🐢', color: '#10B981', desc: '1 message per 24 hours. Forced patience.' },
  { mode: 'useless',   label: 'USELESSNESS MATCH',         emoji: '🤡', color: '#F59E0B', desc: 'Ranked and matched by uselessness score.' },
  { mode: 'antiswipe', label: 'ANTI-SWIPE PROTOCOL',       emoji: '🙅', color: '#EC4899', desc: 'Zero choices. You get who you get.' },
  { mode: 'terrible',  label: 'TERRIBLE DECISIONS',        emoji: '💀', color: '#FF758F', desc: 'Wheel of questionable romantic choices.' },
  { mode: 'fatewheel', label: 'DESTINY WHEEL',             emoji: '🎡', color: '#C9184A', desc: '100% cosmic RNG. Surrender control.' },
]

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function FatePage({ navigate }) {
  const { session, refreshProfile } = useAuth()
  const [chosen, setChosen] = useState(null)
  const [locked, setLocked] = useState(false)

  // Every time FatePage is mounted/refreshed, shuffle numbers and assign random modes!
  const numberAssignments = useMemo(() => {
    const shuffledNums = shuffle(ALL_NUMBERS).slice(0, 6)
    const shuffledModes = shuffle(MODES_POOL)

    const map = {}
    shuffledNums.forEach((num, idx) => {
      map[num] = shuffledModes[idx % shuffledModes.length]
    })
    return { list: shuffledNums, map }
  }, [])

  async function handleNumber(n) {
    if (locked) return
    setChosen(n)
    setLocked(true)
    if (session?.user?.id) {
      try {
        await updateProfile(session.user.id, { favorite_number: n })
        await refreshProfile()
      } catch (_) {}
    }

    const info = numberAssignments.map[n]
    setTimeout(() => {
      navigate(info.mode)
    }, 900)
  }

  const chosenInfo = chosen ? numberAssignments.map[chosen] : null

  return (
    <div className="fate-page">
      <div className="fate-hero">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 179, 193, 0.3)',
          border: '1px solid rgba(255, 77, 109, 0.35)',
          padding: '6px 18px',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#C9184A',
          marginBottom: '1rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 15px rgba(255, 77, 109, 0.15)'
        }}>
          💖 FATE QUESTION
        </div>

        <h1 className="fate-title">
          Choose Your Floating Number
        </h1>

        <p className="fate-subtitle">
          Each number drifts with a hidden romantic algorithm. Trust your instinct and unlock your digital intimacy match.
        </p>
      </div>

      <div className="number-grid">
        {numberAssignments.list.map((n, idx) => {
          const info = numberAssignments.map[n]
          const isChosen = chosen === n
          const isOther = chosen && chosen !== n
          return (
            <div
              key={n}
              className={`number-card ${isChosen ? 'chosen' : ''}`}
              onClick={() => handleNumber(n)}
              style={{
                opacity: isOther ? 0.35 : 1,
                transform: isChosen ? 'translateY(-12px) scale(1.05)' : undefined,
                borderColor: isChosen ? '#FF4D6D' : undefined,
                boxShadow: isChosen ? '0 25px 55px rgba(255, 77, 109, 0.4), 0 0 30px rgba(255, 179, 193, 0.8)' : undefined,
                pointerEvents: locked ? 'none' : 'auto'
              }}
            >
              <div className="number-card-digit">{n}</div>
              <div className="number-card-label">Portal #{idx + 1}</div>
              <div className="number-card-desc">Tap to reveal your match fate</div>
            </div>
          )
        })}
      </div>

      {chosenInfo && (
        <div className="alert alert-info" style={{
          marginTop: '2.5rem',
          padding: '1.2rem 1.8rem',
          borderRadius: '9999px',
          fontSize: '1.05rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#FF4D6D',
          color: '#C9184A',
          fontWeight: 700,
          boxShadow: '0 15px 40px rgba(255, 77, 109, 0.35)',
          animation: 'pulseSoft 0.8s ease-in-out infinite'
        }}>
          {chosenInfo.emoji} &nbsp;Fate Locked: {chosenInfo.label}... Navigating to your match
        </div>
      )}

      {!chosen && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginTop: '2.5rem',
          fontWeight: 600
        }}>
          ✨ Floating destiny numbers are randomly shuffled for your session
        </div>
      )}
    </div>
  )
}

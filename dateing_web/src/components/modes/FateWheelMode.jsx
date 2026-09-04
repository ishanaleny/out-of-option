import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import MatchResult from './MatchResult'
import toast from 'react-hot-toast'

export default function FateWheelMode({ navigate }) {
  const { session } = useAuth()
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [phase, setPhase] = useState('wheel') // wheel | result | no-users
  const [matchedUser, setMatchedUser] = useState(null)

  function spinFateWheel() {
    if (spinning) return
    setSpinning(true)

    const randomDegrees = 2160 + Math.floor(Math.random() * 360)
    const finalRot = rotation + randomDegrees
    setRotation(finalRot)

    setTimeout(async () => {
      setSpinning(false)
      toast.success('Fate has locked in your target! 🎡')

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
        toast.error('Fate wheel error: ' + err.message)
      }
    }, 4200)
  }

  return (
    <div className="mode-page">
      <div className="glass-card mode-card">
        <div className="badge badge-pink" style={{ display: 'inline-flex' }}>🎡 NUMBER 52</div>
        <h1 className="mode-heading gradient-text">THE FATE WHEEL</h1>
        <p className="mode-subtitle">
          Pure, unadulterated cosmic RNG. Spin the wheel to surrender all control to the universe.
        </p>

        {phase === 'wheel' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            {/* Wheel graphic */}
            <div style={{ position: 'relative', width: 260, height: 260 }}>
              <div style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '20px solid var(--amber)',
                zIndex: 10,
                filter: 'drop-shadow(0 2px 6px rgba(255,183,3,0.6))'
              }} />

              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '4px solid rgba(255,255,255,0.25)',
                boxShadow: '0 0 35px rgba(255,183,3,0.25)',
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 4.2s cubic-bezier(0.12, 0.8, 0.1, 1)' : 'none',
                background: 'conic-gradient(#ff2d60 0deg 45deg, #00f2fe 45deg 90deg, #ffb703 90deg 135deg, #a855f7 135deg 180deg, #2ecc71 180deg 225deg, #ff527b 225deg 270deg, #3b82f6 270deg 315deg, #f59e0b 315deg 360deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: 65,
                  height: 65,
                  borderRadius: '50%',
                  background: 'var(--bg-1)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  boxShadow: '0 0 20px rgba(0,0,0,0.9)'
                }}>
                  🎡
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              disabled={spinning}
              onClick={spinFateWheel}
              style={{ background: 'linear-gradient(135deg, var(--amber), #f59e0b)', color: '#090a0f' }}
            >
              {spinning ? 'CONSULTING THE COSMOS...' : 'SPIN THE FATE WHEEL'}
            </button>
          </div>
        )}

        {phase === 'result' && matchedUser && (
          <MatchResult
            user={matchedUser}
            compatibilityLabel="Ordained by the Wheel of Fate"
            wasteMessage="You spun the wheel and the universe handed you this person. Don't blame us, blame astronomy."
            extra="Probability of success: Undetermined. Probability of chaos: 99.8%."
            onReset={() => setPhase('wheel')}
            navigate={navigate}
          />
        )}

        {phase === 'no-users' && (
          <div className="no-users-card">
            <div style={{ fontSize: '3rem' }}>🎡</div>
            <p style={{ fontFamily: 'var(--mono)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              The wheel spun, but there are no users in the database to receive this destiny.
            </p>
            <button className="btn btn-ghost" onClick={() => setPhase('wheel')}>Spin Again</button>
          </div>
        )}

        <button className="btn btn-ghost btn-sm" onClick={() => navigate('fate')} style={{ marginTop: 'auto' }}>
          ← Back to Fate
        </button>
      </div>
    </div>
  )
}

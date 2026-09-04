import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import MatchResult from './MatchResult'
import toast from 'react-hot-toast'

const MATCH_OPENERS = [
  "So… this is happening.",
  "The algorithm made this choice, not me.",
  "Let’s regret this together.",
  "Hey… so we’re doing this now?",
  "I didn’t choose you. The algorithm did.",
]

const BUTTON_LABELS = [
  "Nope",
  "Try harder",
  "Don't do this",
  "Are you sure?",
  "Not today",
  "Denied",
]

export default function TerribleMode({ navigate }) {
  const { session } = useAuth()
  const [phase, setPhase] = useState('anonymous') // anonymous | screaming | revealed | no-users
  const [matchedUser, setMatchedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMsg, setInputMsg] = useState('')
  const [screamingText, setScreamingText] = useState('')
  
  // Escaping Send Button State & Attempt Counter
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 })
  const [btnLabel, setBtnLabel] = useState('Send')
  const [attemptCount, setAttemptCount] = useState(0)
  const [isStable, setIsStable] = useState(false)
  
  const chatEndRef = useRef(null)
  const containerRef = useRef(null)

  // Initialize match and auto-send opening message
  useEffect(() => {
    async function initAnonymousMatch() {
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

        const opener = MATCH_OPENERS[Math.floor(Math.random() * MATCH_OPENERS.length)]
        // Auto message on match
        setMessages([
          { sender: 'them', text: opener, time: 'Just now' }
        ])
      } catch (err) {
        toast.error('Error starting anonymous mode: ' + err.message)
      }
    }

    initAnonymousMatch()
  }, [session])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Escaping button move logic with 5 attempt limit
  function moveButton() {
    if (isStable) return

    const newAttempts = attemptCount + 1
    setAttemptCount(newAttempts)

    if (newAttempts >= 5) {
      // After 5 attempts, stop moving, become stable!
      setIsStable(true)
      setButtonPos({ x: 0, y: 0 })
      setBtnLabel('Fine. Send it.')
      toast.success('The button gave up running! You can send now.', { icon: '✋' })
      return
    }

    // Shift button position randomly
    const maxX = 110
    const maxY = 40
    const rx = (Math.random() - 0.5) * maxX * 2
    const ry = (Math.random() - 0.5) * maxY * 2

    setButtonPos({ x: rx, y: ry })
    const randomText = BUTTON_LABELS[Math.floor(Math.random() * BUTTON_LABELS.length)]
    setBtnLabel(randomText)

    // After 3 failed attempts: Show system message
    if (newAttempts === 3) {
      setMessages(m => [
        ...m,
        { sender: 'system', text: "🤖 SYSTEM: This is why conversations don’t start.", time: 'Just now' }
      ])
    }
  }

  function handleSendAttempt(e) {
    e.preventDefault()
    if (!inputMsg.trim()) return

    // If stable (after 5 attempts), send normally
    if (isStable) {
      sendActualMessage()
      return
    }

    // Before 5 attempts: 15% random success chance
    const success = Math.random() < 0.15

    if (success) {
      sendActualMessage()
    } else {
      moveButton()
      toast.error('The Send button escaped!', { icon: '🏃' })
    }
  }

  function sendActualMessage() {
    const userText = inputMsg.trim()
    setMessages(prev => [...prev, { sender: 'me', text: userText, time: 'Just now' }])
    setInputMsg('')
    setButtonPos({ x: 0, y: 0 })
    setBtnLabel('Send')
    setIsStable(false)
    setAttemptCount(0)

    // Auto-reply when message sends: "Wow. You actually tried."
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'them', text: "Wow. You actually tried.", time: 'Just now' }])
    }, 1000)
  }

  async function handleScreamReveal() {
    setPhase('screaming')
    setScreamingText('😱 AAAAAAAHHHHHHH!!!!!')

    toast('😱 SCREAM DETECTED! UN-MASKING IDENTITY...', { duration: 2500, icon: '💥' })

    await new Promise(r => setTimeout(r, 600))
    setScreamingText('😱 AAAAAAAAAAAAAAAAAAHHHHHHHHHHH!!!!!!')
    await new Promise(r => setTimeout(r, 900))
    setScreamingText('✨ IDENTITY UNLOCKED! ✨')
    await new Promise(r => setTimeout(r, 700))

    setPhase('revealed')
  }

  function reset() {
    setPhase('anonymous')
    setMessages([])
    setInputMsg('')
    setMatchedUser(null)
    setAttemptCount(0)
    setIsStable(false)
    setButtonPos({ x: 0, y: 0 })
    setBtnLabel('Send')
  }

  return (
    <div className="mode-page">
      <div className="mode-card" style={{ maxWidth: '640px' }}>
        {/* Header Tag */}
        <div>
          <div className="badge badge-pink" style={{ display: 'inline-flex', marginBottom: '0.4rem' }}>
            😱 ANONYMOUS SCREAM PROTOCOL
          </div>
          <h1 className="mode-heading">ANONYMOUS CHAT & REVEAL</h1>
          <p className="mode-subtitle">
            Username, age, gender, and photo are 100% hidden. Chat freely in the void.<br />
            <strong>Want to see who they are? You must SCREAM!</strong>
          </p>
        </div>

        {/* ANONYMOUS CHAT PHASE */}
        {phase === 'anonymous' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Masked User Profile Banner */}
            <div className="glass-card" style={{
              width: '100%', padding: '1.2rem 1.5rem', borderRadius: '20px',
              marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem',
              background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(255, 77, 109, 0.4)',
              boxShadow: '0 10px 30px rgba(255, 77, 109, 0.12)'
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', background: '#FFF0F3',
                border: '2px solid #FF4D6D', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 0 15px rgba(255, 77, 109, 0.3)'
              }}>
                🎭
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: '#C9184A' }}>
                  Anonymous Soul #{matchedUser?.id ? matchedUser.id.substring(0, 4) : '7741'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  🔒 Name, Age, Gender & Photo Hidden
                </div>
              </div>
            </div>

            {/* Chat Messages Box */}
            <div style={{
              width: '100%', height: '240px', overflowY: 'auto', background: 'rgba(255, 240, 243, 0.65)',
              borderRadius: '20px', border: '1px solid rgba(255, 179, 193, 0.5)', padding: '1.2rem',
              display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem'
            }}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.sender === 'me' ? 'flex-end' : m.sender === 'system' ? 'center' : 'flex-start',
                    maxWidth: m.sender === 'system' ? '90%' : '82%',
                    background: m.sender === 'me'
                      ? 'linear-gradient(135deg, #FF4D6D, #C9184A)'
                      : m.sender === 'system'
                      ? 'rgba(239, 68, 68, 0.12)'
                      : '#FFFFFF',
                    color: m.sender === 'me' ? '#FFFFFF' : m.sender === 'system' ? '#DC2626' : 'var(--text-dark)',
                    border: m.sender === 'system' ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                    padding: '0.85rem 1.1rem',
                    borderRadius: m.sender === 'me' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    boxShadow: '0 4px 15px rgba(255, 77, 109, 0.1)',
                    fontSize: '0.92rem',
                    lineHeight: 1.45,
                    textAlign: m.sender === 'system' ? 'center' : 'left',
                    fontWeight: m.sender === 'system' ? 700 : 400
                  }}
                >
                  {m.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar with Escaping Send Button */}
            <form
              ref={containerRef}
              onSubmit={handleSendAttempt}
              style={{
                width: '100%', display: 'flex', gap: '0.6rem', marginBottom: '1.5rem',
                position: 'relative', overflow: 'visible'
              }}
            >
              <input
                className="form-input"
                type="text"
                placeholder="Type an anonymous message..."
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                style={{ borderRadius: '9999px', padding: '0.85rem 1.2rem', flex: 1 }}
              />
              
              {/* Escaping Send Button */}
              <button
                className="btn btn-primary"
                type="submit"
                onMouseEnter={moveButton}
                onClick={handleSendAttempt}
                style={{
                  borderRadius: '9999px',
                  padding: '0 1.6rem',
                  whiteSpace: 'nowrap',
                  transform: `translate(${buttonPos.x}px, ${buttonPos.y}px)`,
                  transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease',
                  background: isStable
                    ? '#10B981'
                    : buttonPos.x !== 0
                    ? '#EF4444'
                    : 'linear-gradient(135deg, #FF4D6D, #C9184A)',
                  boxShadow: '0 8px 20px rgba(255, 77, 109, 0.35)'
                }}
              >
                {btnLabel}
              </button>
            </form>

            {/* THE SCREAM REVEAL CTA BUTTON */}
            <button
              className="btn btn-primary btn-full btn-lg pulse-click"
              onClick={handleScreamReveal}
              style={{
                fontSize: '1.15rem',
                background: 'linear-gradient(135deg, #FF4D6D 0%, #C9184A 100%)',
                boxShadow: '0 15px 40px rgba(255, 77, 109, 0.5), 0 0 25px rgba(255, 179, 193, 0.8)',
                animation: 'haloPulse 3s ease-in-out infinite'
              }}
            >
              😱 SCREAM TO REVEAL PROFILE!
            </button>
          </div>
        )}

        {/* SCREAMING ANIMATION PHASE */}
        {phase === 'screaming' && (
          <div style={{
            padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
            animation: 'pulseSoft 0.4s ease-in-out infinite'
          }}>
            <div style={{ fontSize: '5rem', animation: 'floatFast 0.3s ease-in-out infinite' }}>😱</div>
            <div style={{
              fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 900,
              color: '#C9184A', textShadow: '0 0 25px rgba(255, 77, 109, 0.8)', textAlign: 'center'
            }}>
              {screamingText}
            </div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
              Scream intensity verified. Un-masking true identity...
            </p>
          </div>
        )}

        {/* REVEALED PROFILE PHASE */}
        {phase === 'revealed' && matchedUser && (
          <div style={{ width: '100%' }}>
            <div className="alert alert-success" style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 700 }}>
              💥 SCREAM VERIFIED! PROFILE UN-MASKED!
            </div>

            <MatchResult
              user={matchedUser}
              compatibilityLabel="Scream Un-masked Match 😱"
              wasteMessage="You screamed into the void and unlocked their actual identity."
              extra="Now you know exactly who you were chatting with!"
              onReset={reset}
              navigate={navigate}
            />
          </div>
        )}

        {/* NO USERS FALLBACK */}
        {phase === 'no-users' && (
          <div className="no-users-card" style={{ padding: '2rem 0' }}>
            <div style={{ fontSize: '3.5rem' }}>🎭</div>
            <p style={{ fontFamily: 'var(--font)', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
              No other anonymous souls in the void right now.<br />
              Please seed the database to reveal anonymous profiles!
            </p>
            <button className="btn btn-ghost" onClick={() => navigate('fate')} style={{ marginTop: '1rem' }}>
              Back to Fate
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



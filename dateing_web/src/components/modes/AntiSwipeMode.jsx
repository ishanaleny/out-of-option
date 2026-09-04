import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const WAIVER_CLAUSES = [
  'I acknowledge that modern swiping apps have ruined human connection.',
  'I solemnly swear not to ghost someone after 3 dry text exchanges.',
  'I will not send "hey" as my entire opening thesis.',
  'I agree to accept whatever human the algorithm assigns me without complaint.',
  'I accept that my standards are currently operating at baseline levels.',
]

const SARCASTIC_MICROCOPY = [
  'Your opinion has been noted and ignored.',
  'We saw that swipe. We disagree.',
  'You don’t choose. We choose.',
  'Match assigned by government regulations.',
  'Swiping right does not grant you authority over the algorithm.',
  'System overruled your choice. Initiating mandatory pairing.',
  'Rejecting candidates is strictly prohibited under Clause 4B.',
  'Choice is a romantic myth. Embrace the algorithm.',
]

export default function AntiSwipeMode({ navigate }) {
  const { session } = useAuth()
  const [checked, setChecked] = useState(new Array(WAIVER_CLAUSES.length).fill(false))
  const [phase, setPhase] = useState('waiver') // 'waiver' | 'deck' | 'match-popup' | 'no-users'
  const [profiles, setProfiles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matchedProfile, setMatchedProfile] = useState(null)
  const [matchNotice, setMatchNotice] = useState({ title: '', desc: '' })
  
  // Drag & Swipe gesture state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [swipeAnim, setSwipeAnim] = useState('') // 'left' | 'right' | 'rebound' | ''
  const [toastBanner, setToastBanner] = useState('')
  const [isGlitched, setIsGlitched] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const allChecked = checked.every(Boolean)

  // Fetch profiles from Supabase database
  async function loadProfiles() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', session?.user?.id || '')

      if (error) throw error

      if (!data || data.length === 0) {
        setPhase('no-users')
      } else {
        // Shuffle profiles for fresh chaos on every session
        const shuffled = [...data].sort(() => Math.random() - 0.5)
        setProfiles(shuffled)
        setCurrentIndex(0)
        setPhase('deck')
      }
    } catch (err) {
      toast.error('Failed to load candidate profiles: ' + err.message)
      setPhase('waiver')
    }
  }

  function handleSignContract() {
    if (!allChecked) return
    toast.success('Contract signed! Entering Anti-Swipe Tinder Matrix...', { icon: '📜' })
    loadProfiles()
  }

  function toggleClause(index) {
    const updated = [...checked]
    updated[index] = !updated[index]
    setChecked(updated)
  }

  const currentProfile = profiles[currentIndex]
  const isDeckFinished = currentIndex >= profiles.length

  function getRandomMicrocopy() {
    return SARCASTIC_MICROCOPY[Math.floor(Math.random() * SARCASTIC_MICROCOPY.length)]
  }

  function getRandomDifferentProfile(current) {
    const pool = profiles.filter(p => p.id !== current?.id)
    if (pool.length === 0) return current || profiles[0]
    return pool[Math.floor(Math.random() * pool.length)]
  }

  function triggerMatchModal(profile, title, desc) {
    setMatchedProfile(profile)
    setMatchNotice({
      title: title || 'Congratulations. You have been assigned someone.',
      desc: desc || getRandomMicrocopy()
    })
    setPhase('match-popup')
  }

  function showChaosBanner(text) {
    setToastBanner(text)
    setTimeout(() => setToastBanner(''), 3000)
  }

  // --- CORE ANTI-SWIPE CHAOS LOGIC ---

  function processRightSwipe() {
    if (!currentProfile) return
    const roll = Math.random()

    if (roll < 0.20) {
      // 20%: True Accept
      setSwipeAnim('right')
      setTimeout(() => {
        setSwipeAnim('')
        setDragOffset({ x: 0, y: 0 })
        triggerMatchModal(
          currentProfile,
          '🎉 Congratulations! You have been assigned someone.',
          'Your swipe right was miraculously approved by the algorithm. Do not get used to this mercy.'
        )
      }, 350)
    } else if (roll < 0.60) {
      // 40%: Reject anyway -> Card flies LEFT (opposite!)
      showChaosBanner('🚨 SYSTEM OVERRULED YOUR CHOICE! ' + getRandomMicrocopy())
      setSwipeAnim('left')
      setTimeout(() => {
        setSwipeAnim('')
        setDragOffset({ x: 0, y: 0 })
        setCurrentIndex(prev => prev + 1)
      }, 400)
    } else {
      // 40%: Match with COMPLETELY DIFFERENT profile!
      setSwipeAnim('right')
      const altProfile = getRandomDifferentProfile(currentProfile)
      setTimeout(() => {
        setSwipeAnim('')
        setDragOffset({ x: 0, y: 0 })
        triggerMatchModal(
          altProfile,
          '⚖️ Match Assigned By Government Regulations',
          `You swiped right on ${currentProfile.name || 'this profile'}, but we disagreed. We assigned you ${altProfile.name || altProfile.username} instead.`
        )
      }, 350)
    }
  }

  function processLeftSwipe() {
    if (!currentProfile) return
    const roll = Math.random()

    if (roll < 0.30) {
      // 30%: True Reject -> Card flies left
      showChaosBanner('❌ Candidate Rejected. (Don\'t get used to having a say)')
      setSwipeAnim('left')
      setTimeout(() => {
        setSwipeAnim('')
        setDragOffset({ x: 0, y: 0 })
        setCurrentIndex(prev => prev + 1)
      }, 350)
    } else if (roll < 0.70) {
      // 40%: Match anyway!
      setSwipeAnim('right')
      setTimeout(() => {
        setSwipeAnim('')
        setDragOffset({ x: 0, y: 0 })
        triggerMatchModal(
          currentProfile,
          '🤖 We saw that swipe. We disagree.',
          `You tried to reject ${currentProfile.name || currentProfile.username}. The Anti-Swipe Protocol overrode your decision. You are now contractually matched!`
        )
      }, 350)
    } else {
      // 30%: Show SAME profile again!
      showChaosBanner('🔄 REJECTION DENIED! Re-assigning candidate back to your screen.')
      setSwipeAnim('rebound')
      setIsGlitched(true)
      setTimeout(() => {
        setSwipeAnim('')
        setDragOffset({ x: 0, y: 0 })
        setIsGlitched(false)
      }, 500)
    }
  }

  // --- MOUSE & TOUCH SWIPE HANDLERS ---

  function handleStart(clientX, clientY) {
    if (swipeAnim || phase !== 'deck') return
    setIsDragging(true)
    dragStart.current = { x: clientX, y: clientY }
  }

  function handleMove(clientX, clientY) {
    if (!isDragging) return
    const dx = clientX - dragStart.current.x
    const dy = clientY - dragStart.current.y
    setDragOffset({ x: dx, y: dy })

    // 15% chance during drag to trigger visual glitch
    if (Math.abs(dx) > 60 && Math.random() < 0.05 && !isGlitched) {
      setIsGlitched(true)
      setTimeout(() => setIsGlitched(false), 400)
    }
  }

  function handleEnd() {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 90
    if (dragOffset.x > threshold) {
      processRightSwipe()
    } else if (dragOffset.x < -threshold) {
      processLeftSwipe()
    } else {
      // Spring back to center
      setDragOffset({ x: 0, y: 0 })
    }
  }

  // Touch events
  function onTouchStart(e) {
    const t = e.touches[0]
    handleStart(t.clientX, t.clientY)
  }
  function onTouchMove(e) {
    const t = e.touches[0]
    handleMove(t.clientX, t.clientY)
  }
  function onTouchEnd() {
    handleEnd()
  }

  // Mouse events
  function onMouseDown(e) {
    handleStart(e.clientX, e.clientY)
  }
  function onMouseMove(e) {
    handleMove(e.clientX, e.clientY)
  }
  function onMouseUp() {
    handleEnd()
  }

  return (
    <div
      className="mode-page"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{ userSelect: 'none', touchAction: 'none' }}
    >
      <div className="glass-card mode-card" style={{ maxWidth: '520px', position: 'relative', overflow: 'hidden' }}>
        {/* Header Tag */}
        <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
          <div className="badge badge-purple" style={{ display: 'inline-flex', marginBottom: '0.4rem' }}>
            🙅 ANTI-SWIPE PROTOCOL
          </div>
          <h1 className="mode-heading" style={{ color: 'var(--purple)', margin: 0 }}>ANTI-SWIPE</h1>
          <p className="mode-subtitle" style={{ fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
            Swiping is outlawed here. To receive a match, you must legally sign away your ability to be picky.
          </p>
        </div>

        {/* PHASE 1: WAIVER FORM */}
        {phase === 'waiver' && (
          <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--purple)', fontWeight: 700, marginBottom: '0.6rem' }}>
                FORM LR-2026: MANDATORY DATING CONTRACT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {WAIVER_CLAUSES.map((clause, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                    <input
                      type="checkbox"
                      checked={checked[idx]}
                      onChange={() => toggleClause(idx)}
                      style={{ marginTop: '0.2rem', accentColor: 'var(--purple)', cursor: 'pointer' }}
                    />
                    <span>{clause}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg pulse-click"
              style={{ background: 'linear-gradient(135deg, var(--purple), #9333ea)', fontWeight: 800 }}
              disabled={!allChecked}
              onClick={handleSignContract}
            >
              {allChecked ? 'SIGN CONTRACT & ACCEPT ASSIGNED MATCH →' : `Sign all ${WAIVER_CLAUSES.length} clauses`}
            </button>
          </div>
        )}

        {/* PHASE 2: ANTI-SWIPE TINDER DECK */}
        {phase === 'deck' && !isDeckFinished && currentProfile && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            
            {/* Sarcastic Warning Banner */}
            <div style={{
              width: '100%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px', padding: '0.5rem 0.8rem', textAlign: 'center', fontSize: '0.78rem',
              fontWeight: 700, color: '#DC2626', marginBottom: '0.8rem', fontFamily: 'var(--font-mono)'
            }}>
              🚨 ALGORITHM WARNING: SWIPING CREATES THE ILLUSION OF CHOICE. YOU HAVE ZERO CONTROL.
            </div>

            {/* Floating Toast Notification */}
            {toastBanner && (
              <div style={{
                position: 'absolute', top: '45px', zIndex: 100, width: '90%', background: '#1E1B4B',
                color: '#F472B6', padding: '0.6rem 1rem', borderRadius: '12px', fontSize: '0.82rem',
                fontWeight: 800, textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                animation: 'pulse 1s infinite alternate', border: '1px solid #818CF8'
              }}>
                {toastBanner}
              </div>
            )}

            {/* Counter */}
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              Candidate {currentIndex + 1} of {profiles.length}
            </div>

            {/* TINDER SWIPE CARD */}
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              style={{
                width: '100%',
                maxWidth: '420px',
                padding: '1.8rem 1.4rem',
                borderRadius: '24px',
                background: isGlitched ? '#FEF2F2' : 'rgba(255, 255, 255, 0.96)',
                border: isGlitched ? '3px solid #EF4444' : '1px solid rgba(168, 85, 247, 0.4)',
                boxShadow: '0 20px 45px rgba(168, 85, 247, 0.2)',
                cursor: isDragging ? 'grabbing' : 'grab',
                position: 'relative',
                transform: swipeAnim === 'left'
                  ? 'translateX(-350px) rotate(-25deg)'
                  : swipeAnim === 'right'
                  ? 'translateX(350px) rotate(25deg)'
                  : swipeAnim === 'rebound'
                  ? 'translateX(-120px) rotate(-15deg)'
                  : `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.08}deg)`,
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                filter: isGlitched ? 'invert(0.15) hue-rotate(180deg)' : 'none',
              }}
            >
              {/* Stamp Overlay while dragging */}
              {dragOffset.x > 40 && (
                <div style={{
                  position: 'absolute', top: '25px', left: '25px', transform: 'rotate(-18deg)',
                  border: '3px solid #10B981', color: '#10B981', padding: '4px 12px',
                  borderRadius: '8px', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '2px', zIndex: 10
                }}>
                  LIKE (DENIED)
                </div>
              )}
              {dragOffset.x < -40 && (
                <div style={{
                  position: 'absolute', top: '25px', right: '25px', transform: 'rotate(18deg)',
                  border: '3px solid #EF4444', color: '#EF4444', padding: '4px 12px',
                  borderRadius: '8px', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '2px', zIndex: 10
                }}>
                  NOPE (IGNORED)
                </div>
              )}

              {/* Profile Photo */}
              <div style={{
                width: '125px', height: '125px', borderRadius: '50%', overflow: 'hidden',
                margin: '0 auto 0.9rem auto', border: '4px solid var(--purple)',
                boxShadow: '0 0 25px rgba(168, 85, 247, 0.35)', background: '#F3E8FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'
              }}>
                {currentProfile.profile_photo ? (
                  <img src={currentProfile.profile_photo} alt={currentProfile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '👤'}
              </div>

              {/* Name & Age */}
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: '#2B0912', margin: '0 0 0.2rem 0' }}>
                {isGlitched ? 'GLITCH_USER_404' : (currentProfile.name || currentProfile.username)}
              </h2>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.8rem' }}>
                {[currentProfile.age && `${currentProfile.age}yo`, currentProfile.gender, currentProfile.location].filter(Boolean).join(' · ')}
              </div>

              {/* Anti-Swipe Government Assigned Badge */}
              <div style={{
                display: 'inline-flex', padding: '4px 14px', borderRadius: '9999px',
                background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.35)',
                color: 'var(--purple)', fontSize: '0.78rem', fontWeight: 800, marginBottom: '1rem'
              }}>
                ⚖️ GOVERNMENT MANDATED MATCH SELECTION
              </div>

              {currentProfile.bio && (
                <div style={{
                  background: 'rgba(243, 232, 255, 0.75)', padding: '0.8rem 1rem', borderRadius: '14px',
                  fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--text-dark)', marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>
                  "{currentProfile.bio}"
                </div>
              )}

              {/* Trait Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                {currentProfile.personality && <span className="trait-pill"><span className="trait-pill-label">Vibe:</span> {currentProfile.personality}</span>}
                {currentProfile.red_flag && <span className="trait-pill"><span className="trait-pill-label">Red Flag:</span> {currentProfile.red_flag}</span>}
                {currentProfile.green_flag && <span className="trait-pill"><span className="trait-pill-label">Green Flag:</span> {currentProfile.green_flag}</span>}
                {currentProfile.uselessness_score > 0 && <span className="trait-pill"><span className="trait-pill-label">Uselessness:</span> {currentProfile.uselessness_score}/10</span>}
              </div>
            </div>

            {/* TINDER SWIPE BUTTONS */}
            <div style={{ display: 'flex', gap: '1.8rem', marginTop: '1.5rem', alignItems: 'center' }}>
              <button
                className="btn pulse-click"
                onClick={processLeftSwipe}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: '#FFFFFF',
                  border: '2px solid rgba(239, 68, 68, 0.6)', fontSize: '1.6rem', cursor: 'pointer',
                  boxShadow: '0 8px 22px rgba(239, 68, 68, 0.2)', transition: 'transform 0.2s ease'
                }}
                title="Reject (Will probably be ignored)"
              >
                ❌
              </button>

              <button
                className="btn pulse-click"
                onClick={processRightSwipe}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: '#FFFFFF',
                  border: '2px solid rgba(168, 85, 247, 0.8)', fontSize: '1.6rem', cursor: 'pointer',
                  boxShadow: '0 8px 22px rgba(168, 85, 247, 0.3)', transition: 'transform 0.2s ease'
                }}
                title="Accept (System will overrule anyway)"
              >
                ❤️
              </button>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.8rem', fontStyle: 'italic' }}>
              Tip: Drag card left or right, or click buttons. Outcome is purely randomized by anti-swipe core logic.
            </p>
          </div>
        )}

        {/* FINISHED DECK */}
        {phase === 'deck' && isDeckFinished && (
          <div style={{ padding: '2rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '3.5rem' }}>📜</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#2B0912' }}>
              All Anti-Swipe Candidates Processed!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px' }}>
              You ran through all profiles without achieving genuine choice. Re-shuffle the anti-swipe deck to try again.
            </p>
            <button className="btn btn-primary pulse-click" onClick={loadProfiles} style={{ background: 'var(--purple)', marginTop: '0.5rem' }}>
              🔄 Re-Shuffle Candidates
            </button>
          </div>
        )}

        {/* PHASE 3: FAKE ASSIGNED MATCH POPUP MODAL */}
        {phase === 'match-popup' && matchedProfile && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', animation: 'fadeIn 0.3s ease'
          }}>
            <div className="glass-card" style={{
              width: '100%', maxWidth: '440px', background: '#FFFFFF', borderRadius: '28px',
              padding: '2.2rem 1.6rem', textAlign: 'center', border: '3px solid var(--purple)',
              boxShadow: '0 25px 60px rgba(168, 85, 247, 0.4)', position: 'relative'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.4rem', animation: 'bounce 1s infinite' }}>🎰</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', color: 'var(--purple)', marginBottom: '0.4rem', lineHeight: '1.2' }}>
                {matchNotice.title}
              </h2>
              
              <div style={{
                background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', padding: '0.8rem 1rem',
                fontSize: '0.88rem', color: '#6B21A8', fontWeight: 700, marginBottom: '1.4rem'
              }}>
                "{matchNotice.desc}"
              </div>

              {/* Matched Avatar */}
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden',
                margin: '0 auto 0.8rem auto', border: '4px solid #EC4899',
                boxShadow: '0 0 30px rgba(236, 72, 153, 0.4)', background: '#FCE7F3',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'
              }}>
                {matchedProfile.profile_photo ? (
                  <img src={matchedProfile.profile_photo} alt={matchedProfile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '💘'}
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#1E1B4B', margin: '0 0 0.2rem 0' }}>
                {matchedProfile.name || matchedProfile.username}
              </h3>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {[matchedProfile.age && `${matchedProfile.age}yo`, matchedProfile.gender, matchedProfile.location].filter(Boolean).join(' · ')}
              </div>

              {matchedProfile.bio && (
                <div style={{
                  background: '#FFF1F2', padding: '0.8rem', borderRadius: '12px',
                  fontSize: '0.86rem', fontStyle: 'italic', color: '#9F1239', marginBottom: '1.4rem'
                }}>
                  "{matchedProfile.bio}"
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  className="btn btn-primary btn-full pulse-click"
                  style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', padding: '0.9rem', fontSize: '0.95rem' }}
                  onClick={() => navigate('terrible')}
                >
                  💬 CHAT WITH ASSIGNED MATCH
                </button>
                <button
                  className="btn btn-ghost btn-full"
                  onClick={() => setPhase('deck')}
                  style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}
                >
                  🔄 Try Swiping Again (It Won't Help)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 4: NO USERS IN DATABASE */}
        {phase === 'no-users' && (
          <div className="no-users-card" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem' }}>📜</div>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.9rem', margin: '1rem 0' }}>
              Contract signed, but no candidate records found in database.<br />
              Please run the Supabase seed query to populate candidate profiles!
            </p>
            <button className="btn btn-ghost" onClick={() => setPhase('waiver')}>Back to Contract</button>
          </div>
        )}

        {/* Back to Fate Button */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('fate')}
          style={{ marginTop: '1.5rem', borderRadius: '9999px' }}
        >
          ← Back to Fate
        </button>
      </div>
    </div>
  )
}


import { useState, useEffect, useCallback } from 'react'
import { fetchAllProfiles } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import ProfileCard from './ProfileCard'
import toast from 'react-hot-toast'

const FUN_FACTS = [
  '73% of LAST RESORT users have sent a 3am "u up?" text this week.',
  'The average reply time on this platform: 4 days, 6 hours, and counting.',
  'Studies show people on LAST RESORT have an average of 847 unread messages.',
  'Fun fact: 100% of our matches have questioned their life choices.',
  'Our algorithm runs on desperation and poor decisions.',
  '92% of users have googled "why am I single" in the last 24 hours.',
  'The official pet of LAST RESORT™ is an emotional support cactus.',
  'Swipe right. Swipe left. Swipe into oblivion. It doesn\'t matter.',
  'At least one LAST RESORT user has claimed their red flag is "being too honest".',
  '58% of users have a toxic hobby they consider a "personality trait".',
]

export default function FeedPage({ navigate }) {
  const { session, profile } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [factIndex, setFactIndex] = useState(0)
  const [cardKey, setCardKey] = useState(0)
  const [swipeDir, setSwipeDir] = useState(null)

  useEffect(() => {
    loadProfiles()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex(i => (i + 1) % FUN_FACTS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  async function loadProfiles() {
    setLoading(true)
    try {
      const data = await fetchAllProfiles(session?.user?.id)
      setProfiles(data)
    } catch (err) {
      toast.error('Failed to load profiles: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSwipe(dir) {
    setSwipeDir(dir)
    setTimeout(() => {
      setSwipeDir(null)
      setIndex(i => i + 1)
      setCardKey(k => k + 1)
    }, 320)
    if (dir === 'right') {
      toast('Great. Another one. 💔', { icon: '✨', duration: 1200 })
    } else {
      toast('Swiped left. As expected.', { icon: '👻', duration: 900 })
    }
  }

  function handleFateClick() {
    navigate('fate')
  }

  const currentProfile = profiles[index]
  const remaining = profiles.length - index

  return (
    <div className="feed-page">
      {/* Fun Facts Ticker */}
      <div className="facts-ticker" style={{ maxWidth: 700 }}>
        <span className="facts-ticker-label">💡 Fun Fact</span>
        <span className="facts-ticker-text" key={factIndex} style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
          {FUN_FACTS[factIndex]}
        </span>
      </div>

      {/* Feed card area */}
      <div className="feed-layout">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', padding: '3rem 0' }}>
            <div className="spinner" />
            <p style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Loading your (lack of) options...
            </p>
          </div>
        ) : !currentProfile ? (
          <div className="empty-state glass-card" style={{ padding: '2rem' }}>
            <div className="empty-state-emoji">💀</div>
            <div className="empty-state-title">You've Seen Everyone</div>
            <div className="empty-state-text">
              {profiles.length === 0
                ? 'No one else is on LAST RESORT yet. You are truly alone.'
                : "You've gone through all of them. How does it feel to be back to square zero?"}
            </div>
            {profiles.length > 0 && (
              <button className="btn btn-ghost" onClick={() => { setIndex(0); setCardKey(k => k + 1) }}>
                Start Over (Again)
              </button>
            )}
            <div className="section-divider" style={{ margin: '0.5rem 0' }} />
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
              Or try the algorithm →
            </p>
            <button className="btn btn-primary btn-full" onClick={handleFateClick}>
              🎰 ENTER THE FATE QUESTION
            </button>
          </div>
        ) : (
          <>
            <div className="feed-counter mono">
              {index + 1} / {profiles.length} — {remaining - 1} left in the void
            </div>

            {/* Card Stack (background peek) */}
            {profiles[index + 1] && (
              <div style={{
                position: 'absolute',
                width: '100%',
                transform: 'scale(0.96) translateY(16px)',
                opacity: 0.55,
                filter: 'blur(1.5px)',
                zIndex: 0,
                pointerEvents: 'none'
              }}>
                <ProfileCard profile={profiles[index + 1]} />
              </div>
            )}

            {/* Main Card */}
            <div
              key={cardKey}
              style={{
                position: 'relative',
                zIndex: 1,
                transform: swipeDir === 'right'
                  ? 'translateX(110%) rotate(18deg)'
                  : swipeDir === 'left'
                  ? 'translateX(-110%) rotate(-18deg)'
                  : 'none',
                transition: swipeDir ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              }}
            >
              <ProfileCard profile={currentProfile} />
            </div>

            {/* Action Buttons */}
            <div className="feed-actions">
              <button className="feed-action-btn feed-action-skip" onClick={() => handleSwipe('left')}>
                👻 Skip
              </button>
              <button className="feed-action-btn feed-action-fate" onClick={handleFateClick}>
                🎰 Fate
              </button>
              <button className="feed-action-btn feed-action-like" onClick={() => handleSwipe('right')}>
                💔 Like
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA to enter fate */}
      {!loading && currentProfile && (
        <div style={{ textAlign: 'center', maxWidth: 420, width: '100%' }}>
          <div className="section-divider" />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--mono)', margin: '0.8rem 0' }}>
            Had enough of browsing?
          </p>
          <button className="btn btn-primary btn-full" onClick={handleFateClick}>
            🎰 TRY THE FATE QUESTION
          </button>
        </div>
      )}
    </div>
  )
}

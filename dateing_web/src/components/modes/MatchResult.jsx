const GENDER_EMOJIS = {
  Male: '👨', Female: '👩', 'Non-binary': '🧑', Other: '🧑',
}

function randomEmoji(seed) {
  const pool = ['💖', '✨', '🎲', '🌸', '🌵', '🫠', '🧃', '🦦', '🔮', '🫡', '🎀', '🎪']
  return pool[seed % pool.length]
}

export default function MatchResult({ user, compatibilityLabel, wasteMessage, extra, onReset, navigate }) {
  const displayName = user.name || user.username || 'Mystery Human'
  const seed = (displayName.charCodeAt(0) || 0) + (user.age || 0)
  const avatarEmoji = randomEmoji(seed)

  return (
    <div className="match-box">
      <div className="match-title" style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.8rem',
        fontWeight: 800,
        color: '#FF4D6D',
        letterSpacing: '-0.01em',
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        💖 YOUR INTENSITY MATCH
      </div>

      <div className="match-card">
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
          <div className="match-avatar" style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto 1rem auto',
            border: '4px solid #FF4D6D',
            boxShadow: '0 0 30px rgba(255, 77, 109, 0.45)',
            background: '#FFF0F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem'
          }}>
            {user.profile_photo
              ? <img src={user.profile_photo} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (GENDER_EMOJIS[user.gender] || avatarEmoji)}
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#2B0912', marginBottom: '0.2rem' }}>
            {displayName}
          </h2>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {[user.age && `${user.age}yo`, user.gender, user.location].filter(Boolean).join(' · ')}
          </div>
        </div>

        {user.bio && (
          <div className="profile-bio">
            "{user.bio}"
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {user.personality && (
            <span className="trait-pill">
              <span className="trait-pill-label">Vibe:</span> {user.personality}
            </span>
          )}
          {user.uselessness_score > 0 && (
            <span className="trait-pill">
              <span className="trait-pill-label">Score:</span> {user.uselessness_score}% useless
            </span>
          )}
          {user.red_flag && (
            <span className="trait-pill">
              <span className="trait-pill-label">Red Flag:</span> {user.red_flag}
            </span>
          )}
          {user.reason_they_are_single && (
            <span className="trait-pill">
              <span className="trait-pill-label">Single because:</span> {user.reason_they_are_single}
            </span>
          )}
          {user.favorite_animal && (
            <span className="trait-pill">
              <span className="trait-pill-label">Animal:</span> {user.favorite_animal}
            </span>
          )}
          {user.last_google_search && (
            <span className="trait-pill" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span className="trait-pill-label">Search:</span> {user.last_google_search}
            </span>
          )}
          {user.most_useless_skill && (
            <span className="trait-pill">
              <span className="trait-pill-label">Skill:</span> {user.most_useless_skill}
            </span>
          )}
        </div>

        {compatibilityLabel && (
          <div className="alert alert-info" style={{
            marginBottom: '1rem',
            background: 'rgba(255, 77, 109, 0.1)',
            borderColor: 'rgba(255, 77, 109, 0.3)',
            color: '#C9184A',
            fontWeight: 700
          }}>
            ⚡ {compatibilityLabel}
          </div>
        )}

        {wasteMessage && (
          <div className="alert alert-success" style={{ marginBottom: '1rem', fontWeight: 600 }}>
            {wasteMessage}
          </div>
        )}

        {extra && (
          <div className="alert alert-info" style={{ marginBottom: '1rem', fontSize: '0.88rem', textAlign: 'center' }}>
            {extra}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.8rem' }}>
          <button className="btn btn-ghost" onClick={onReset}>Rematch</button>
          <button className="btn btn-primary" onClick={() => navigate('fate')}>← Back to Fate</button>
        </div>
      </div>
    </div>
  )
}

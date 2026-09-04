const GENDER_EMOJIS = {
  Male: '👨', Female: '👩', 'Non-binary': '🧑',
  Other: '🧑', 'Prefer not to say': '🫥',
}

const PERSONALITY_COLORS = {
  Introvert: 'cyan', Extrovert: 'pink', Calm: 'green',
  Chaotic: 'amber', default: 'ghost'
}

function randomEmoji(seed) {
  const pool = ['🤡', '👾', '🎲', '🦑', '🌵', '🫠', '🧃', '🦦', '🕹️', '🫡', '🧌', '🎪']
  return pool[seed % pool.length]
}

export default function ProfileCard({ profile }) {
  const {
    name, username, age, gender, location, bio,
    profile_photo, personality, interests, uselessness_score,
    favorite_color, favorite_animal, red_flag, reason_they_are_single
  } = profile

  const displayName = name || username || 'Anonymous'
  const avatarEmoji = randomEmoji((displayName.charCodeAt(0) || 0) + (age || 0))
  const personalityColor = PERSONALITY_COLORS[personality] || PERSONALITY_COLORS.default

  return (
    <div className="profile-card glass-card">
      {/* Photo or Placeholder */}
      {profile_photo ? (
        <img className="profile-card-photo" src={profile_photo} alt={displayName} />
      ) : (
        <div className="profile-card-placeholder">
          <div className="profile-card-avatar-emoji">{GENDER_EMOJIS[gender] || avatarEmoji}</div>
          {favorite_color && (
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(145deg, ${favorite_color}11, transparent)`, pointerEvents: 'none' }} />
          )}
        </div>
      )}

      {/* Gradient overlay */}
      <div className="profile-card-gradient-overlay" />

      {/* Info */}
      <div className="profile-card-info">
        {/* Name + Age */}
        <div className="profile-card-name-row">
          <span className="profile-card-name">{displayName}</span>
          {age && <span className="profile-card-age">{age}</span>}
        </div>

        {/* Meta tags */}
        <div className="profile-card-meta">
          {gender && (
            <span className="badge badge-ghost">{GENDER_EMOJIS[gender]} {gender}</span>
          )}
          {location && (
            <span className="badge badge-ghost">📍 {location}</span>
          )}
          {personality && (
            <span className={`badge badge-${personalityColor}`}>{personality}</span>
          )}
          {uselessness_score > 0 && (
            <span className="badge badge-amber">💀 {uselessness_score}% useless</span>
          )}
        </div>

        {/* Bio */}
        {bio && <p className="profile-card-bio">{bio}</p>}

        {/* Fun details row */}
        <div className="profile-card-tags">
          {red_flag && (
            <span className="badge badge-pink">🚩 {red_flag}</span>
          )}
          {favorite_animal && (
            <span className="badge badge-ghost">Loves {favorite_animal}</span>
          )}
          {reason_they_are_single && (
            <span className="badge badge-purple" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              💔 {reason_they_are_single}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

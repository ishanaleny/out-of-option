import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const GENDER_EMOJIS = {
  Male: '👨',
  Female: '👩',
  'Non-binary': '🧑',
  Other: '🧑',
  'Prefer not to say': '🫥',
}

export default function TopBar({ navigate, currentScreen }) {
  const { profile, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    toast('See you never. Hopefully. 👋')
  }

  const avatarDisplay = profile?.profile_photo
    ? <img src={profile.profile_photo} alt={profile.name || profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    : (GENDER_EMOJIS[profile?.gender] || '🧍')

  return (
    <div className="top-bar">
      {/* Brand */}
      <button
        onClick={() => navigate('fate')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        title="Home (Fate)"
      >
        <span className="top-bar-brand gradient-text">LAST RESORT™</span>
      </button>

      {/* User Info */}
      <div className="top-bar-user">
        {profile?.uselessness_score > 0 && (
          <span className="user-score-badge">
            💀 {profile.uselessness_score}% useless
          </span>
        )}
        <div className="user-avatar-sm">
          {avatarDisplay}
        </div>
        <div>
          <div className="user-name-sm">{profile?.username || profile?.name || 'User'}</div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleSignOut}
          title="Sign out"
        >
          Exit
        </button>
      </div>
    </div>
  )
}

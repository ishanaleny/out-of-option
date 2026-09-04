import { useState, useRef } from 'react'
import { supabase, uploadProfilePhoto } from '../../lib/supabase'
import toast from 'react-hot-toast'

const FUN_DISCLAIMERS = [
  'By continuing you agree that your dignity is not our responsibility.',
  'Side effects: lowered standards, existential dread, and unexpected vibes.',
  'LAST RESORT™ is not responsible for any feelings you may develop.',
  'Warning: matches may cause confusion, laughter, or mild heartbreak.',
]

export default function AuthPage() {
  const [view, setView] = useState('landing') // 'landing' | 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // register: step 1 = basics, step 2 = profile

  // Login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Register step 1
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regUserId, setRegUserId] = useState(null)

  // Register step 2 - profile data
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const fileInputRef = useRef(null)
  const disclaimer = FUN_DISCLAIMERS[Math.floor(Math.random() * FUN_DISCLAIMERS.length)]

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function openDimension(targetView) {
    setError('')
    setStep(1)
    setView(targetView)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let loginEmail = email.trim()

      // Allow logging in with either username or email
      if (!loginEmail.includes('@')) {
        const { data: matchedProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', loginEmail)
          .maybeSingle()

        if (matchedProfile?.email) {
          loginEmail = matchedProfile.email
        }
      }

      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password })
      if (error) {
        if (error.message.toLowerCase().includes('email logins are disabled') || error.message.toLowerCase().includes('provider is disabled')) {
          throw new Error('Email auth is disabled in Supabase. Enable "Email Provider" in Supabase Dashboard → Auth → Providers.')
        }
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          throw new Error('Invalid credentials. If you recently registered, please check your email inbox to confirm your account first!')
        }
        throw error
      }
      toast.success('Welcome back to your destiny 💕')
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegisterStep1(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const cleanEmail = regEmail.trim()
    const cleanUsername = regUsername.trim()
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', cleanUsername)
        .maybeSingle()

      if (existing) throw new Error('That username is taken. Be more original.')

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: regPassword,
        options: { data: { username: cleanUsername } }
      })
      if (error) throw error

      const userId = data.user?.id
      if (!userId) throw new Error('Signup failed — no user id returned.')

      await supabase.from('profiles').upsert({
        id: userId,
        email: cleanEmail,
        username: cleanUsername,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      setRegUserId(userId)
      setStep(2)
      toast('Account created! Tell us a bit about yourself...', { icon: '✨' })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  async function finishRegistration(saveProfile = true) {
    setLoading(true)
    setError('')
    const cleanEmail = regEmail.trim()
    try {
      if (saveProfile && regUserId) {
        let photoUrl = null
        if (photoFile) {
          try {
            photoUrl = await uploadProfilePhoto(regUserId, photoFile)
          } catch (pErr) {
            console.warn('Profile photo upload error:', pErr)
          }
        }

        await supabase.from('profiles').update({
          name: name.trim() || null,
          age: parseInt(age) || null,
          gender: gender || null,
          location: location.trim() || null,
          bio: bio.trim() || null,
          profile_photo: photoUrl,
          updated_at: new Date().toISOString(),
        }).eq('id', regUserId)
      }

      // Check if session is already active from signUp (e.g. if email confirmation is disabled in Supabase)
      const { data: { session: existingSession } } = await supabase.auth.getSession()

      if (existingSession) {
        toast.success("Welcome! Entering your Fate Questions... 💕")
        return
      }

      // Attempt automatic sign-in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: regPassword,
      })

      if (signInError) {
        setError('')
        toast('📧 Profile saved! Please check your email inbox to confirm your account, then log in.', { duration: 6000, icon: '✨' })
        setStep(1)
        setView('login')
        setEmail(cleanEmail)
        return
      }

      toast.success("Welcome! Entering your Fate Questions... 💕")
    } catch (err) {
      setError(err.message || 'Profile setup failed.')
    } finally {
      setLoading(false)
    }
  }

  function handleStep2Submit(e) {
    e.preventDefault()
    finishRegistration(true)
  }

  function handleSkip() {
    finishRegistration(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* ========================================================= */}
        {/* ULTRA-MINIMAL LANDING HERO (INITIAL SCREEN)              */}
        {/* ========================================================= */}
        {view === 'landing' && (
          <div className="landing-hero dimension-transition">
            <h1 className="landing-brand">
              LAST RESORT™
            </h1>

            <div className="landing-actions">
              <button
                className="btn-landing-register pulse-click"
                onClick={() => openDimension('register')}
              >
                Register ✨
              </button>

              <button
                className="btn-landing-login pulse-click"
                onClick={() => openDimension('login')}
              >
                Log In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* DIMENSIONAL AUTHENTICATION MODAL (LOGIN / REGISTER)       */}
        {/* ========================================================= */}
        {view !== 'landing' && (
          <div className="dimension-transition" style={{ width: '100%' }}>
            {/* Header */}
            <div className="auth-header">
              <div className="auth-brand" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>
                LAST RESORT™
              </div>
              <div className="auth-subtitle">
                {view === 'register' ? 'Join the anti-gravity experience' : 'Welcome back to your destiny'}
              </div>
            </div>

            {/* Card */}
            <div className="glass-card auth-card">
              {/* Back Button & Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setView('landing')}
                  style={{ borderRadius: '9999px' }}
                >
                  ← Back
                </button>

                {step === 1 && (
                  <div className="auth-tabs" style={{ marginBottom: 0 }}>
                    <button
                      className={`auth-tab-btn ${view === 'register' ? 'active' : ''}`}
                      onClick={() => { setView('register'); setError('') }}
                    >
                      Register
                    </button>
                    <button
                      className={`auth-tab-btn ${view === 'login' ? 'active' : ''}`}
                      onClick={() => { setView('login'); setError('') }}
                    >
                      Log In
                    </button>
                  </div>
                )}
              </div>

              {step === 2 && (
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  <div className="badge badge-pink" style={{ display: 'inline-flex' }}>Step 2 of 2</div>
                  <p style={{ marginTop: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Tell us a bit about yourself
                  </p>
                </div>
              )}

              {error && <div className="alert alert-error" style={{ marginBottom: '1.2rem' }}>{error}</div>}

              {/* LOGIN FORM */}
              {view === 'login' && step === 1 && (
                <form className="form" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="you@domain.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary btn-full btn-lg pulse-click" type="submit" disabled={loading}>
                    {loading ? 'Entering...' : 'LOG IN →'}
                  </button>
                </form>
              )}

              {/* REGISTER STEP 1 */}
              {view === 'register' && step === 1 && (
                <form className="form" onSubmit={handleRegisterStep1}>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="romantic_soul"
                      required
                      minLength={3}
                      maxLength={20}
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="soulmate@domain.com"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Secret password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                    />
                  </div>
                  <p className="auth-subtitle" style={{ fontSize: '0.78rem', textAlign: 'center', marginTop: '-0.2rem' }}>
                    {disclaimer}
                  </p>
                  <button className="btn btn-primary btn-full btn-lg pulse-click" type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'CONTINUE TO PROFILE →'}
                  </button>
                </form>
              )}

              {/* REGISTER STEP 2 */}
              {view === 'register' && step === 2 && (
                <form className="form" onSubmit={handleStep2Submit}>
                  {/* Photo Upload */}
                  <div className="profile-photo-upload" style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                    <div
                      className="photo-preview"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: 90, height: 90, borderRadius: '50%', border: '3px solid #FF4D6D',
                        margin: '0 auto 0.6rem auto', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
                        overflow: 'hidden', background: '#FFF0F3', boxShadow: '0 0 20px rgba(255, 77, 109, 0.3)'
                      }}
                    >
                      {photoPreview
                        ? <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : '💖'}
                    </div>
                    <input
                      ref={fileInputRef}
                      className="photo-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                    <label className="photo-upload-label" style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#C9184A', fontWeight: 600 }}>
                      {photoPreview ? 'Change photo' : 'Add profile photo (optional)'}
                    </label>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Age</label>
                      <input
                        className="form-input"
                        type="number"
                        placeholder="18+"
                        min={18}
                        max={99}
                        value={age}
                        onChange={e => setAge(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-input" value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="City"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio <span style={{ color: 'var(--text-dim)', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Tell us something romantic or funny..."
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem' }}>
                    <button className="btn btn-primary btn-full btn-lg pulse-click" type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'ENTER DESTINY →'}
                    </button>
                    <button className="btn btn-ghost" type="button" disabled={loading} onClick={handleSkip}>
                      Skip
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

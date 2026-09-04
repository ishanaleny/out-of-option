import { useState } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import AuthPage from '../components/auth/AuthPage'
import TopBar from '../components/layout/TopBar'
import StatusBar from '../components/layout/StatusBar'
import FatePage from '../components/fate/FatePage'
import OppositeMode from '../components/modes/OppositeMode'
import UselessMode from '../components/modes/UselessMode'
import SlowMode from '../components/modes/SlowMode'
import AntiSwipeMode from '../components/modes/AntiSwipeMode'
import TerribleMode from '../components/modes/TerribleMode'
import FateWheelMode from '../components/modes/FateWheelMode'
import FloatingElements from '../components/ui/FloatingElements'
import { Toaster } from 'react-hot-toast'

function AppInner() {
  const { session, profile, loading } = useAuth()
  const [screen, setScreen] = useState('fate')

  if (loading) {
    return (
      <div className="loading-screen">
        <FloatingElements />
        <div className="spinner" style={{ width: 56, height: 56 }} />
        <p style={{ fontFamily: 'var(--font)', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
          Finding your anti-gravity match... 💕
        </p>
      </div>
    )
  }

  if (!session) {
    return (
      <>
        <FloatingElements />
        <AuthPage />
      </>
    )
  }

  const navigate = (s) => setScreen(s)

  const renderScreen = () => {
    switch (screen) {
      case 'fate':      return <FatePage navigate={navigate} />
      case 'opposite':  return <OppositeMode navigate={navigate} />
      case 'useless':   return <UselessMode navigate={navigate} />
      case 'slow':      return <SlowMode navigate={navigate} />
      case 'antiswipe': return <AntiSwipeMode navigate={navigate} />
      case 'terrible':  return <TerribleMode navigate={navigate} />
      case 'fatewheel': return <FateWheelMode navigate={navigate} />
      default:          return <FatePage navigate={navigate} />
    }
  }

  return (
    <>
      <FloatingElements />
      <TopBar navigate={navigate} currentScreen={screen} />
      {renderScreen()}
      <StatusBar />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.92)',
            color: '#2B0912',
            border: '1px solid rgba(255, 179, 193, 0.6)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: '0.88rem',
            backdropFilter: 'blur(16px)',
            borderRadius: '9999px',
            boxShadow: '0 12px 30px rgba(255, 77, 109, 0.2)',
          }
        }}
      />
      <AppInner />
    </AuthProvider>
  )
}


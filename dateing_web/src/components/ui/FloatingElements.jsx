import { useMemo } from 'react'

export default function FloatingElements() {
  // Generate a set of floating hearts and light orbs with pre-calculated random paths
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 19 + 7) % 94}%`,
      size: 14 + (i % 5) * 6,
      duration: 12 + (i % 6) * 4,
      delay: (i % 7) * 1.8,
      opacity: 0.15 + (i % 4) * 0.1,
      type: i % 3 === 0 ? 'heart' : 'orb'
    }))
  }, [])

  return (
    <div className="anti-gravity-bg-wrapper">
      {/* Blurred Ambient Glowing Light Orbs */}
      <div className="floating-glow-orb orb-1" />
      <div className="floating-glow-orb orb-2" />
      <div className="floating-glow-orb orb-3" />

      {/* Floating Drifting Heart Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`floating-particle ${p.type}`}
          style={{
            left: p.left,
            width: p.type === 'orb' ? `${p.size * 2}px` : undefined,
            height: p.type === 'orb' ? `${p.size * 2}px` : undefined,
            fontSize: p.type === 'heart' ? `${p.size}px` : undefined,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        >
          {p.type === 'heart' ? '💖' : null}
        </div>
      ))}
    </div>
  )
}

import MapChart from '@/components/MapChart'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '0.5rem',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Global AI Solutions
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: '#a0aec0',
            marginBottom: '2rem',
            fontSize: '1.125rem',
          }}
        >
          Interactive map visualization powered by react-simple-maps
        </p>

        <MapChart />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem',
          }}
        >
          {[
            { city: 'New York', users: '12.5M', growth: '+15%' },
            { city: 'London', users: '8.9M', growth: '+12%' },
            { city: 'Tokyo', users: '15.2M', growth: '+18%' },
            { city: 'Singapore', users: '5.8M', growth: '+22%' },
          ].map((stat) => (
            <div
              key={stat.city}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>{stat.city}</h3>
              <p style={{ color: '#667eea', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stat.users}
              </p>
              <p style={{ color: '#48bb78', fontSize: '0.875rem' }}>{stat.growth}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

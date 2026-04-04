interface Props {
  name: string
}

export default function Placeholder({ name }: Props) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 12,
      color: 'rgba(255,255,255,0.5)',
      fontFamily: 'var(--font-stack)',
    }}>
      <span style={{ fontSize: 48 }}>🚧</span>
      <span style={{ fontSize: 16, fontWeight: 500 }}>{name}</span>
      <span style={{ fontSize: 13 }}>Coming Soon</span>
    </div>
  )
}

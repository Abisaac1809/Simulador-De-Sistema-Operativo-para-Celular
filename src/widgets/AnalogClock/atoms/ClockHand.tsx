const CENTER = 80

interface ClockHandProps {
  angle: number       // degrees, 0 = 12-o'clock (straight up)
  length: number      // px in SVG coordinate space
  strokeWidth: number
  color: string
}

export default function ClockHand({ angle, length, strokeWidth, color }: ClockHandProps) {
  return (
    <line
      x1={CENTER}
      y1={CENTER}
      x2={CENTER}
      y2={CENTER - length}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      transform={`rotate(${angle} ${CENTER} ${CENTER})`}
    />
  )
}

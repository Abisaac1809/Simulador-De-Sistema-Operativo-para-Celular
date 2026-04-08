import type { CSSProperties, ReactNode } from 'react'
import { colors } from './tokens'
interface IconWrapperProps {
  /** Hex color — used to derive the tint background at 0.16 opacity */
  color: string
  children: ReactNode
  /** Size of the icon container in px. Default: 52 */
  size?: number
  className?: string
  style?: CSSProperties
}

export default function IconWrapper({
  color: _color,
  children,
  size = 52,
  className,
  style,
}: IconWrapperProps) {
  const containerStyle: CSSProperties = {
    width: size,
    height: size,
    background: colors.glassBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.55, // Scaled down to fit properly inside the visible bounds
    // color: color, // Use the app's specific color for the icon itself
    borderRadius: size * 0.225, // iOS standard squircle ratio bounds
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)', // Subtle shadow

    flexShrink: 0,
    ...style,
  }

  return (
    <div className={className} style={containerStyle}>
      {typeof children === 'string' && children.startsWith('fi ') ? (
        <i className={children} />
      ) : (
        children
      )}
    </div>
  )
}

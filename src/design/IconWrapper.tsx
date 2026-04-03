import type { CSSProperties, ReactNode } from 'react'
import { radius } from './tokens'
import { iconTintColor } from './tokens'

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
  color,
  children,
  size = 52,
  className,
  style,
}: IconWrapperProps) {
  const containerStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius.icon,
    background: iconTintColor(color),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.5,
    flexShrink: 0,
    ...style,
  }

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  )
}

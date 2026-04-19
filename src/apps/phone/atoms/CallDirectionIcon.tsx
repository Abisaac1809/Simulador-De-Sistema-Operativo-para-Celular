import { IconWrapper, colors } from '../../../design'

interface Props {
  direction: 'incoming' | 'outgoing' | 'missed'
}

export default function CallDirectionIcon({ direction }: Props) {
  if (direction === 'incoming') {
    return (
      <IconWrapper size={36} color="transparent">
        <i className="fi fi-rr-phone-incoming" style={{ color: colors.accentBlue }} />
      </IconWrapper>
    )
  }
  if (direction === 'outgoing') {
    return (
      <IconWrapper size={36} color="transparent">
        <i className="fi fi-rr-phone-outgoing" style={{ color: colors.textSecondary }} />
      </IconWrapper>
    )
  }
  return (
    <IconWrapper size={36} color="transparent">
      <i className="fi fi-rr-phone-missed" style={{ color: colors.danger }} />
    </IconWrapper>
  )
}

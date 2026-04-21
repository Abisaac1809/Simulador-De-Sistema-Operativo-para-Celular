import type { CSSProperties } from 'react'
import CalcKey from '../atoms/CalcKey'
import type { CalcControls } from '../hooks/useCalculator'

type KeyRow = {
  label: string
  variant: 'digit' | 'operator' | 'action' | 'equals'
  wide?: boolean
  action: (c: CalcControls) => void
}

const KEYPAD_ROWS: KeyRow[][] = [
  [
    { label: 'AC',  variant: 'action',   action: c => c.handleClear() },
    { label: '+/-', variant: 'action',   action: c => c.handleToggleSign() },
    { label: '%',   variant: 'action',   action: c => c.handlePercent() },
    { label: '÷',   variant: 'operator', action: c => c.handleOperator('÷') },
  ],
  [
    { label: '7', variant: 'digit', action: c => c.handleDigit('7') },
    { label: '8', variant: 'digit', action: c => c.handleDigit('8') },
    { label: '9', variant: 'digit', action: c => c.handleDigit('9') },
    { label: '×', variant: 'operator', action: c => c.handleOperator('×') },
  ],
  [
    { label: '4', variant: 'digit', action: c => c.handleDigit('4') },
    { label: '5', variant: 'digit', action: c => c.handleDigit('5') },
    { label: '6', variant: 'digit', action: c => c.handleDigit('6') },
    { label: '-', variant: 'operator', action: c => c.handleOperator('-') },
  ],
  [
    { label: '1', variant: 'digit', action: c => c.handleDigit('1') },
    { label: '2', variant: 'digit', action: c => c.handleDigit('2') },
    { label: '3', variant: 'digit', action: c => c.handleDigit('3') },
    { label: '+', variant: 'operator', action: c => c.handleOperator('+') },
  ],
  [
    { label: '⌫', variant: 'action',   action: c => c.handleBackspace() },
    { label: '0', variant: 'digit',    action: c => c.handleDigit('0') },
    { label: '.', variant: 'digit',    action: c => c.handleDecimal() },
    { label: '=', variant: 'equals',   action: c => c.handleEquals() },
  ],
]

const GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 10,
  padding: '0 16px 16px',
}

interface CalcKeypadProps {
  controls: CalcControls
}

export default function CalcKeypad({ controls }: CalcKeypadProps) {
  return (
    <div style={GRID_STYLE}>
      {KEYPAD_ROWS.flat().map(key => (
        <CalcKey
          key={key.label}
          label={key.label}
          variant={key.variant}
          wide={key.wide}
          active={
            key.variant === 'operator' &&
            controls.pendingOperator === key.label
          }
          onPress={() => key.action(controls)}
        />
      ))}
    </div>
  )
}

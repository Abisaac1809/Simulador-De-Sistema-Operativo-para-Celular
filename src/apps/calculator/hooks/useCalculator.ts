import { useCallback, useReducer } from 'react'

type Operator = '+' | '-' | '×' | '÷'

interface CalcState {
  display: string
  storedValue: number | null
  pendingOperator: Operator | null
  awaitingNextOperand: boolean
  expression: string
}

type CalcAction =
  | { type: 'DIGIT'; payload: string }
  | { type: 'DECIMAL' }
  | { type: 'OPERATOR'; payload: Operator }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENT' }
  | { type: 'BACKSPACE' }

const INITIAL_STATE: CalcState = {
  display: '0',
  storedValue: null,
  pendingOperator: null,
  awaitingNextOperand: false,
  expression: '',
}

const MAX_DISPLAY_DIGITS = 9

function formatDisplay(value: number): string {
  if (!isFinite(value)) return 'Error'
  const abs = Math.abs(value)
  if (abs !== 0 && (abs >= 1e10 || abs < 1e-6)) {
    return value.toExponential(3)
  }
  const str = String(parseFloat(value.toPrecision(MAX_DISPLAY_DIGITS)))
  return str
}

function evaluate(a: number, operator: Operator, b: number): number {
  switch (operator) {
    case '+': return a + b
    case '-': return a - b
    case '×': return a * b
    case '÷': return b === 0 ? Infinity : a / b
  }
}

function calcReducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'DIGIT': {
      if (state.awaitingNextOperand) {
        return {
          ...state,
          display: action.payload,
          awaitingNextOperand: false,
        }
      }
      if (state.display === '0') {
        return { ...state, display: action.payload }
      }
      if (state.display.replace('-', '').replace('.', '').length >= MAX_DISPLAY_DIGITS) {
        return state
      }
      return { ...state, display: state.display + action.payload }
    }

    case 'DECIMAL': {
      if (state.awaitingNextOperand) {
        return { ...state, display: '0.', awaitingNextOperand: false }
      }
      if (state.display.includes('.')) return state
      return { ...state, display: state.display + '.' }
    }

    case 'OPERATOR': {
      const current = parseFloat(state.display)
      if (state.storedValue !== null && !state.awaitingNextOperand) {
        const result = evaluate(state.storedValue, state.pendingOperator!, current)
        const resultDisplay = formatDisplay(result)
        return {
          ...state,
          display: resultDisplay,
          storedValue: result,
          pendingOperator: action.payload,
          awaitingNextOperand: true,
          expression: `${resultDisplay} ${action.payload}`,
        }
      }
      return {
        ...state,
        storedValue: current,
        pendingOperator: action.payload,
        awaitingNextOperand: true,
        expression: `${state.display} ${action.payload}`,
      }
    }

    case 'EQUALS': {
      if (state.storedValue === null || state.pendingOperator === null) {
        return { ...state, expression: '' }
      }
      const current = parseFloat(state.display)
      const result = evaluate(state.storedValue, state.pendingOperator, current)
      const resultDisplay = formatDisplay(result)
      return {
        ...INITIAL_STATE,
        display: resultDisplay,
        expression: '',
      }
    }

    case 'CLEAR':
      return INITIAL_STATE

    case 'TOGGLE_SIGN': {
      if (state.display === '0') return state
      const toggled = state.display.startsWith('-')
        ? state.display.slice(1)
        : '-' + state.display
      return { ...state, display: toggled }
    }

    case 'PERCENT': {
      const val = parseFloat(state.display) / 100
      return { ...state, display: formatDisplay(val) }
    }

    case 'BACKSPACE': {
      if (state.awaitingNextOperand) return state
      if (state.display.length === 1 || (state.display.length === 2 && state.display.startsWith('-'))) {
        return { ...state, display: '0' }
      }
      return { ...state, display: state.display.slice(0, -1) }
    }

    default:
      return state
  }
}

export interface CalcControls {
  display: string
  expression: string
  pendingOperator: Operator | null
  handleDigit: (d: string) => void
  handleDecimal: () => void
  handleOperator: (op: Operator) => void
  handleEquals: () => void
  handleClear: () => void
  handleToggleSign: () => void
  handlePercent: () => void
  handleBackspace: () => void
}

export default function useCalculator(): CalcControls {
  const [state, dispatch] = useReducer(calcReducer, INITIAL_STATE)

  const handleDigit = useCallback((d: string) => dispatch({ type: 'DIGIT', payload: d }), [])
  const handleDecimal = useCallback(() => dispatch({ type: 'DECIMAL' }), [])
  const handleOperator = useCallback((op: Operator) => dispatch({ type: 'OPERATOR', payload: op }), [])
  const handleEquals = useCallback(() => dispatch({ type: 'EQUALS' }), [])
  const handleClear = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const handleToggleSign = useCallback(() => dispatch({ type: 'TOGGLE_SIGN' }), [])
  const handlePercent = useCallback(() => dispatch({ type: 'PERCENT' }), [])
  const handleBackspace = useCallback(() => dispatch({ type: 'BACKSPACE' }), [])

  return {
    display: state.display,
    expression: state.expression,
    pendingOperator: state.pendingOperator,
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEquals,
    handleClear,
    handleToggleSign,
    handlePercent,
    handleBackspace,
  }
}

import { Component } from 'react'
import type { ReactNode, ErrorInfo, CSSProperties } from 'react'
import { GlassCard, GlassButton, Typography } from '../design'

interface Props  { children: ReactNode }
interface State  { hasError: boolean }

const overlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
}

const cardContentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  textAlign: 'center',
}

/**
 * AppErrorBoundary — Molecule
 *
 * Catches render-phase errors thrown by any child (including lazy imports
 * that fail to resolve) and shows a recovery UI instead of a blank screen.
 * Call `handleRetry` to reset state and remount the children.
 */
export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AppErrorBoundary] App crashed:', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={overlayStyle}>
          <GlassCard elevated padding={24}>
            <div style={cardContentStyle}>
              <Typography variant="body">
                This app crashed — tap to restart
              </Typography>
              <GlassButton variant="danger" onClick={this.handleRetry}>
                Restart App
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )
    }

    return this.props.children
  }
}

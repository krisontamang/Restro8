import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // Production telemetry / monitoring could be attached here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: 'var(--r8-space-8) var(--r8-space-6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '360px',
            backgroundColor: 'var(--r8-bg-subtle, #0d1117)',
            borderRadius: 'var(--r8-radius-lg, 12px)',
            border: '1px solid var(--r8-border-subtle, rgba(255,255,255,0.08))',
            margin: 'var(--r8-space-4)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--r8-danger, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--r8-space-4)',
            }}
          >
            <AlertTriangle size={28} />
          </div>

          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--r8-text-primary, #ffffff)',
              marginBottom: 'var(--r8-space-2)',
            }}
          >
            {this.props.fallbackTitle || 'Module Temporarily Unavailable'}
          </h2>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--r8-text-muted, #94a3b8)',
              maxWidth: '480px',
              marginBottom: 'var(--r8-space-6)',
              lineHeight: 1.5,
            }}
          >
            An unexpected error occurred while rendering this module. You can retry the operation or return to the main dashboard.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--r8-space-3)',
              justifyContent: 'center',
              marginBottom: 'var(--r8-space-6)',
            }}
          >
            <button
              onClick={this.handleReset}
              className="r8-focus-ring"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--r8-space-2)',
                padding: '0.6rem 1.25rem',
                backgroundColor: 'var(--r8-brand-primary, #0F8F6F)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.875rem',
                borderRadius: 'var(--r8-radius-md, 8px)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <RotateCcw size={16} />
              Try Again
            </button>

            <button
              onClick={this.handleReload}
              className="r8-focus-ring"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--r8-space-2)',
                padding: '0.6rem 1.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--r8-text-primary, #ffffff)',
                fontWeight: 600,
                fontSize: '0.875rem',
                borderRadius: 'var(--r8-radius-md, 8px)',
                cursor: 'pointer',
                border: '1px solid var(--r8-border-subtle, rgba(255,255,255,0.1))',
              }}
            >
              <RefreshCw size={16} />
              Reload Page
            </button>
          </div>

          {this.state.error && (
            <details
              style={{
                textAlign: 'left',
                width: '100%',
                maxWidth: '560px',
                padding: 'var(--r8-space-3) var(--r8-space-4)',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 'var(--r8-radius-sm, 6px)',
                border: '1px solid var(--r8-border-subtle, rgba(255,255,255,0.06))',
                fontSize: '0.78rem',
                color: 'var(--r8-text-secondary, #cbd5e1)',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--r8-text-muted, #94a3b8)' }}>
                Technical Diagnostics
              </summary>
              <pre
                style={{
                  marginTop: 'var(--r8-space-2)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'var(--r8-font-mono, monospace)',
                  color: '#f87171',
                }}
              >
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Healthi Dabba ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6 text-center font-apple">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-edge shadow-apple-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-50 text-terracotta-600 border border-terracotta-100 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-charcoal">Something went wrong</h2>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {this.state.error?.message || "An unexpected error occurred while rendering this tab."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 rounded-xl shadow-apple-sm apple-press inline-block"
            >
              Refresh & Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

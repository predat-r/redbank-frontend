import { Component } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ChevronDown,
  ChevronUp,
  Bug,
} from 'lucide-react';
import { Button } from './ui/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  toggleDetails = () => {
    this.setState((prevState) => ({ showDetails: !prevState.showDetails }));
  };

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state;
    const { children, fallback, title, description } = this.props;

    if (hasError) {
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback({ error, errorInfo, resetErrorBoundary: this.handleReset });
        }
        return fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-neutral-50">
          <div className="max-w-lg w-full bg-neutral-0 border border-neutral-200 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center text-center">
            {/* Error Icon */}
            <div className="w-14 h-14 rounded-full bg-error-50 text-error-600 flex items-center justify-center mb-5 shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>

            {/* Error Title & Message */}
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 tracking-tight">
              {title || 'Something went wrong'}
            </h2>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
              {description ||
                'An unexpected error occurred while processing your request. Please try again or refresh the page.'}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full sm:w-auto">
              <Button variant="primary" icon={RefreshCw} onClick={this.handleReset}>
                Try Again
              </Button>

              <Button
                variant="outline"
                icon={Home}
                onClick={() => (window.location.href = '/')}
              >
                Go to Home
              </Button>
            </div>

            {/* Technical Details Toggle */}
            {error && (
              <div className="w-full mt-6 pt-5 border-t border-neutral-200 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="flex items-center justify-between w-full text-xs font-semibold text-neutral-500 hover:text-neutral-700 transition-colors focus:outline-none"
                >
                  <span className="flex items-center gap-1.5">
                    <Bug className="w-3.5 h-3.5" />
                    Technical Error Details
                  </span>
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showDetails && (
                  <div className="mt-3 p-3 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-800 overflow-x-auto max-h-48 leading-normal">
                    <p className="font-semibold text-error-600 mb-1">
                      {error.name}: {error.message}
                    </p>
                    {errorInfo?.componentStack && (
                      <pre className="whitespace-pre-wrap text-[11px] text-neutral-600">
                        {errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

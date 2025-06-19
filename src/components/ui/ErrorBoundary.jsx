"use client";
import React from "react";
import { m } from "framer-motion";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            {/* Error Icon */}
            <m.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-8"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
            </m.div>

            {/* Content */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                We&apos;re sorry for the inconvenience. Our team has been notified
                about this issue.
              </p>
            </m.div>

            {/* Action Buttons */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={this.handleRetry}
                className="btn btn-primary px-6 py-3 flex items-center gap-2 justify-center group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="btn btn-outline px-6 py-3 flex items-center gap-2 justify-center group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                Go Home
              </button>
            </m.div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm"
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  Error Details:
                </h3>
                <pre className="text-red-600 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo.componentStack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                      Component Stack
                    </summary>
                    <pre className="text-gray-600 text-xs mt-2 overflow-x-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </m.div>
            )}
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-100/50 rounded-full blur-xl" />
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-orange-100/50 rounded-full blur-xl" />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

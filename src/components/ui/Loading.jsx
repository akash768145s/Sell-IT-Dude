"use client";
import { m } from "framer-motion";

const Loading = ({
  size = "md",
  variant = "spinner",
  text = "Loading...",
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const Spinner = () => (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <div className="w-full h-full border-2 border-gray-200 rounded-full border-t-primary"></div>
    </div>
  );

  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <m.div
          key={i}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );

  const Pulse = () => (
    <m.div
      className={`${sizeClasses[size]} bg-primary rounded-full`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
    />
  );

  const Skeleton = () => (
    <div className="space-y-3 w-full max-w-sm">
      {[100, 80, 90].map((width, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded skeleton`}
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "dots":
        return <Dots />;
      case "pulse":
        return <Pulse />;
      case "skeleton":
        return <Skeleton />;
      default:
        return <Spinner />;
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderVariant()}
      {text && variant !== "skeleton" && (
        <p className="text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Specialized loading components
export const PageLoading = () => (
  <Loading variant="spinner" size="lg" text="Loading page..." fullScreen />
);

export const CardLoading = () => (
  <div className="bg-white rounded-2xl shadow-card overflow-hidden p-4">
    <Loading variant="skeleton" />
  </div>
);

export const ButtonLoading = ({ size = "sm" }) => (
  <Loading variant="spinner" size={size} />
);

export const InlineLoading = ({ text = "Loading..." }) => (
  <div className="flex items-center space-x-2">
    <Loading variant="dots" size="sm" />
    <span className="text-sm text-gray-600">{text}</span>
  </div>
);

export default Loading;

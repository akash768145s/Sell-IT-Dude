"use client";
import { m } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import Lottie to reduce initial bundle size
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-20 h-20 animate-spin">
      <div className="w-full h-full border-4 border-gray-200 rounded-full border-t-primary shadow-lg"></div>
    </div>
  ),
});

// Import the loading animation
const loadingAnimation = require("/public/Loading.json");

const Loading = ({
  size = "md",
  variant = "lottie",
  text = "Loading...",
  fullScreen = false,
  showText = true,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
    xxl: "w-64 h-64",
  };

  const Spinner = () => (
    <m.div
      className={`${sizeClasses[size]} relative`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-full h-full border-4 border-gray-200 rounded-full border-t-primary shadow-lg"></div>
      <div className="absolute inset-2 border-2 border-gray-100 rounded-full border-r-primary/60 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
    </m.div>
  );

  const LottieAnimation = () => (
    <m.div
      className={`${sizeClasses[size]} flex items-center justify-center relative`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      {/* Glowing background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>

      {/* Main animation container */}
      <div className="relative z-10 w-full h-full">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <m.div
          key={i}
          className="absolute w-2 h-2 bg-primary/40 rounded-full"
          animate={{
            x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
            y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </m.div>
  );

  const Dots = () => (
    <div className="flex space-x-3">
      {[0, 1, 2].map((i) => (
        <m.div
          key={i}
          className="w-4 h-4 bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-lg"
          animate={{
            y: [0, -12, 0],
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const Pulse = () => (
    <m.div
      className={`${sizeClasses[size]} relative flex items-center justify-center`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      {/* Outer ring */}
      <m.div
        className="absolute inset-0 bg-gradient-to-r from-primary/30 via-blue-500/30 to-purple-500/30 rounded-full"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.8, 0.2, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Middle ring */}
      <m.div
        className="absolute inset-2 bg-gradient-to-r from-primary/50 via-blue-500/50 to-purple-500/50 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />

      {/* Inner core */}
      <div className="relative w-1/3 h-1/3 bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-lg" />
    </m.div>
  );

  const Skeleton = () => (
    <div className="space-y-4 w-full max-w-sm">
      {[100, 85, 95, 70].map((width, i) => (
        <m.div
          key={i}
          className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full skeleton relative overflow-hidden"
          style={{ width: `${width}%` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
        </m.div>
      ))}
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "lottie":
        return <LottieAnimation />;
      case "dots":
        return <Dots />;
      case "pulse":
        return <Pulse />;
      case "skeleton":
        return <Skeleton />;
      case "spinner":
        return <Spinner />;
      default:
        return <LottieAnimation />;
    }
  };

  const content = (
    <m.div
      className={`flex flex-col items-center justify-center space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      {renderVariant()}
      {showText && text && variant !== "skeleton" && (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center space-y-2"
        >
          <p className="text-gray-700 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {text}
          </p>
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <m.div
                key={i}
                className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </m.div>
      )}
    </m.div>
  );

  if (fullScreen) {
    return (
      <m.div
        className="fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <m.div
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-12 max-w-md mx-4 border border-white/20"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
        >
          {content}
        </m.div>
      </m.div>
    );
  }

  return content;
};

// Specialized loading components with beautiful animations
export const PageLoading = ({ text = "Preparing something amazing..." }) => (
  <Loading
    variant="lottie"
    size="xxl"
    text={text}
    fullScreen
    className="p-8"
  />
);

export const HeroLoading = ({ text = "Loading marketplace..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
    <Loading
      variant="lottie"
      size="xxl"
      text={text}
      className="p-12"
    />
  </div>
);

export const CardLoading = () => (
  <div className="bg-white rounded-2xl shadow-card overflow-hidden p-8 border border-gray-100">
    <Loading variant="skeleton" showText={false} />
  </div>
);

export const ButtonLoading = ({ size = "sm" }) => (
  <Loading variant="pulse" size={size} showText={false} />
);

export const InlineLoading = ({ text = "Loading..." }) => (
  <div className="flex items-center space-x-4">
    <Loading variant="dots" size="sm" showText={false} />
    <span className="text-sm text-gray-600 font-medium">{text}</span>
  </div>
);

export const FriendlyLoading = ({ text = "Hold on, magic is happening..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8">
    <Loading
      variant="lottie"
      size="xl"
      text={text}
      className="space-y-8"
    />
  </div>
);

export const ProductsLoading = ({ text = "Finding amazing products..." }) => (
  <div className="container py-16">
    <div className="text-center">
      <Loading
        variant="lottie"
        size="xl"
        text={text}
        className="space-y-6"
      />
    </div>
  </div>
);

export default Loading;

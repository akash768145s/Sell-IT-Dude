"use client";
import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

const SafeImage = ({
  src,
  alt,
  fallbackSrc = "/image-product-1.jpg",
  className = "",
  showFallbackIcon = false,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  // If there's an error and no fallback src, show placeholder
  if (error && !fallbackSrc) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        {showFallbackIcon ? (
          <ImageIcon className="w-8 h-8 text-gray-400" />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
        />
      )}
      <Image
        src={error ? fallbackSrc : src || fallbackSrc}
        alt={alt || "Image"}
        onError={handleError}
        onLoad={handleLoad}
        className={className}
        {...props}
      />
    </>
  );
};

export default SafeImage;

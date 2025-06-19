"use client";
import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

/**
 * SafeImage component that handles image loading errors gracefully
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.fallbackSrc - Fallback image source to use when the main image fails to load
 * @param {Object} props.style - Additional style properties
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Any other props to pass to the Image component
 */
const SafeImage = ({
  src,
  alt,
  fallbackSrc = "/image-product-1.jpg",
  style,
  className = "",
  showFallbackIcon = false,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    if (!error) {
      setImgSrc(fallbackSrc);
      setError(true);
    }
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
        src={imgSrc || fallbackSrc}
        alt={alt || "Image"}
        onError={handleError}
        onLoad={handleLoad}
        className={className}
        style={style}
        {...rest}
      />
    </>
  );
};

export default SafeImage;

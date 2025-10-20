"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
  className?: string;
  showFallbackIcon?: boolean;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = "/image-product-1.jpg",
  style,
  className = "",
  showFallbackIcon = false,
  width,
  height,
  fill,
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

  // Auto-detect if we should use fill mode
  const useFill = fill !== undefined ? fill : (!width || !height);

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
        fill={useFill}
        width={!useFill ? width : undefined}
        height={!useFill ? height : undefined}
        {...rest}
      />
    </>
  );
};

export default SafeImage;

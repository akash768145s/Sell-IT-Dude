// Performance utilities for the college marketplace

/**
 * Debounce function to limit the rate of function execution
 * Useful for search inputs and resize handlers
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function to limit function execution to once per specified interval
 * Useful for scroll handlers and API calls
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Intersection Observer hook for lazy loading
 */
export const useIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: "50px",
    ...options,
  };

  if (typeof window !== "undefined") {
    return new IntersectionObserver(callback, defaultOptions);
  }
  return null;
};

/**
 * Image optimization utility
 */
export const optimizeImageUrl = (url, width = 800, quality = 75) => {
  // Handle null, undefined, or empty strings
  if (!url || typeof url !== "string") return "/image-product-1.jpg";

  // Handle data URLs (base64 images)
  if (url.startsWith("data:")) return url;

  // For external URLs (starting with http/https), return as-is
  if (url.startsWith("http")) return url;

  // For Next.js optimized images, ensure the URL starts with /
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;

  // For development, just return the normalized URL
  if (process.env.NODE_ENV === "development") {
    return normalizedUrl;
  }

  // For production, add optimization parameters
  return `${normalizedUrl}?w=${width}&q=${quality}`;
};

/**
 * Format price with Indian currency
 */
export const formatPrice = (price) => {
  if (!price) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Generate optimized image sizes for responsive images
 */
export const getImageSizes = () => {
  return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
};

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      if (typeof window === "undefined") return defaultValue;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage: ${error}`);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing to localStorage: ${error}`);
    }
  },

  remove: (key) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from localStorage: ${error}`);
    }
  },
};

/**
 * Preload critical resources
 */
export const preloadResource = (href, type = "image") => {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = type;
  document.head.appendChild(link);
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get device type for responsive behavior
 */
export const getDeviceType = () => {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

/**
 * Optimize bundle loading with dynamic imports
 */
export const loadComponent = async (componentPath) => {
  try {
    const component = await import(componentPath);
    return component.default || component;
  } catch (error) {
    console.error(`Failed to load component: ${componentPath}`, error);
    return null;
  }
};

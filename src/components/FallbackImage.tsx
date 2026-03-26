'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function FallbackImage({ 
  src, 
  fallbackSrc, 
  alt, 
  style, 
  className 
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src)
  const imgRef = useRef<HTMLImageElement>(null)
  const safeFallback = `/golfer_swing.png`

  const handleError = () => {
    if (imgSrc === src) {
      setImgSrc(fallbackSrc);
    } else if (imgSrc !== safeFallback) {
      setImgSrc(safeFallback);
    }
  }

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth === 0) {
      handleError()
    }
  }, [imgSrc])

  return (
    <img 
      ref={imgRef}
      src={imgSrc}
      onError={handleError}
      alt={alt}
      style={style}
      className={className}
    />
  )
}

'use client'
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <div style={{ fontFamily: 'LCD' }} className="w-full text-4xl md:text-6xl lg:text-8xl xl:text-9xl mx-auto text-center">
      {formatTime(time)}
    </div>
  )
}

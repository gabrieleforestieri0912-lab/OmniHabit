'use client';

import { useEffect, useRef, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4';

export default function ScrollVideo() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const cacheReadyRef = useRef(false);
  const lastSmoothedRef = useRef(0);

  const [videoReady, setVideoReady] = useState(false);
  const [cacheReady, setCacheReady] = useState(false);

  const drawCover = (canvas, source) => {
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const vw = source.videoWidth || source.width || 0;
    const vh = source.videoHeight || source.height || 0;
    if (!vw || !vh || !cw || !ch) return;
    const s = Math.max(cw / vw, ch / vh);
    const dw = vw * s;
    const dh = vh * s;
    ctx.drawImage(source, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  };

  const sizeCanvas = () => {
    const canvas = canvasRef.current;
    const el = containerRef.current;
    if (!canvas || !el) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(el.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(el.clientHeight * dpr));
  };

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!container || !video || !canvas) return;

    sizeCanvas();
    const onResize = () => sizeCanvas();
    window.addEventListener('resize', onResize);

    let target = 0;
    let smoothed = 0;
    let rafId = 0;
    let videoFrameReady = false;

    const computeTarget = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.min(1, Math.max(0, max > 0 ? window.scrollY / max : 0));
    };

    const tick = () => {
      smoothed += (target - smoothed) * 0.12;
      lastSmoothedRef.current = smoothed;

      if (cacheReadyRef.current && framesRef.current.length) {
        const frames = framesRef.current;
        const idx = Math.min(
          frames.length - 1,
          Math.max(0, Math.round(smoothed * (frames.length - 1)))
        );
        const frame = frames[idx];
        if (frame) drawCover(canvas, frame);
      } else if (videoFrameReady && video.duration) {
        const t = smoothed * (video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.04) {
          video.currentTime = t;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const handleLoadedData = () => {
      videoFrameReady = true;
      setVideoReady(true);
      sizeCanvas();
      window.setTimeout(startExtraction, 300);
    };

    const startExtraction = async () => {
      const v = videoRef.current;
      if (!v || !v.duration || cacheReadyRef.current) return;

      const offscreen = document.createElement('video');
      offscreen.muted = true;
      offscreen.playsInline = true;
      offscreen.preload = 'auto';
      offscreen.src = v.currentSrc || VIDEO_URL;

      try {
        await new Promise((resolve, reject) => {
          offscreen.addEventListener('loadeddata', resolve, { once: true });
          offscreen.addEventListener('error', reject, { once: true });
        });
      } catch {
        return;
      }

      const frameCount = Math.min(90, Math.max(24, Math.floor(offscreen.duration * 12)));
      const srcW = offscreen.videoWidth || 0;
      const srcH = offscreen.videoHeight || 0;
      const scale = Math.min(1, 960 / (srcW || 1));
      const tw = Math.max(1, Math.round(srcW * scale));
      const th = Math.max(1, Math.round(srcH * scale));
      const temp = document.createElement('canvas');
      temp.width = tw;
      temp.height = th;
      const tctx = temp.getContext('2d');

      const seek = (time) =>
        new Promise((resolve) => {
          const onSeeked = () => {
            offscreen.removeEventListener('seeked', onSeeked);
            resolve();
          };
          offscreen.addEventListener('seeked', onSeeked);
          offscreen.currentTime = time;
        });

      const frames = framesRef.current;
      const dur = Math.max(0, offscreen.duration - 0.05);
      for (let i = 0; i < frameCount; i++) {
        await seek(dur > 0 ? (i / (frameCount - 1)) * dur : 0);
        tctx.drawImage(offscreen, 0, 0, tw, th);
        try {
          frames.push(await createImageBitmap(temp));
        } catch {
          frames.push(null);
        }
        if (i % 12 === 11) await new Promise((r) => setTimeout(r, 0));
      }

      if (frames.some(Boolean)) {
        cacheReadyRef.current = true;
        setCacheReady(true);
      }
    };

    const onScroll = () => computeTarget();
    window.addEventListener('scroll', onScroll, { passive: true });
    computeTarget();
    rafId = requestAnimationFrame(tick);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      video.removeEventListener('loadeddata', handleLoadedData);
      framesRef.current.forEach((b) => b && b.close && b.close());
      framesRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a] pointer-events-none"
    >
      <img
        src="/hero-poster.jpg"
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          videoReady ? 'opacity-0' : 'opacity-100'
        }`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          videoReady && !cacheReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          cacheReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

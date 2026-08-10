'use client';

import { useEffect, useRef, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4';

const FADE_MS = 500;
const REPLAY_DELAY_MS = 100;

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;
    let start = 0;
    let fadingIn = false;
    let fadingOut = false;
    let started = false;
    let replayTimer = 0;

    const tick = (now: number) => {
      // Idle guard: never keep burning frames when no fade is running.
      if (!fadingIn && !fadingOut) return;

      const elapsed = start > 0 ? now - start : 0;
      const t = Math.min(1, elapsed / FADE_MS);

      if (fadingIn) {
        video.style.opacity = String(t);
        if (t >= 1) {
          fadingIn = false;
          video.style.opacity = '1';
          return; // loop stops — playback continues until 'ended'
        }
      } else if (fadingOut) {
        video.style.opacity = String(1 - t);
        if (t >= 1) {
          fadingOut = false;
          video.style.opacity = '0';
          replayTimer = window.setTimeout(() => {
            video.currentTime = 0;
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
            start = performance.now();
            fadingIn = true;
            rafId = requestAnimationFrame(tick);
          }, REPLAY_DELAY_MS);
          return;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const beginFadeIn = () => {
      if (started) return;
      started = true;
      // Explicit play() — required for playback to start (muted + playsInline alone
      // are not enough in Chrome). Promise is caught to avoid unhandled rejections.
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      start = performance.now();
      fadingIn = true;
      rafId = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      fadingIn = false;
      fadingOut = true;
      start = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        // Tab hidden: stop everything and pause decode to free the GPU.
        cancelAnimationFrame(rafId);
        window.clearTimeout(replayTimer);
        video.pause();
      } else {
        if (video.paused) {
          const p = video.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        }
        if (fadingIn || fadingOut) {
          // Resume an in-progress fade.
          start = performance.now();
          rafId = requestAnimationFrame(tick);
        } else if (video.style.opacity === '0') {
          // We were mid replay-delay when hidden: restart the fade-in so the
          // video never stays invisible after coming back.
          start = performance.now();
          fadingIn = true;
          rafId = requestAnimationFrame(tick);
        }
      }
    };

    video.style.opacity = '0';
    video.addEventListener('canplay', beginFadeIn);
    video.addEventListener('ended', handleEnded);
    document.addEventListener('visibilitychange', handleVisibility);
    // In case `canplay` already fired before the listener was attached (warm cache)
    if (video.readyState >= 3) beginFadeIn();

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(replayTimer);
      video.removeEventListener('canplay', beginFadeIn);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-background pointer-events-none"
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        crossOrigin="anonymous"
        muted
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
        style={{ opacity: 0 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Subtle static atmosphere shown only if the video fails to load */}
      {failed && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.07),transparent_60%)]" />
      )}
    </div>
  );
}

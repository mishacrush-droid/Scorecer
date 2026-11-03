import React, { useRef, useState } from 'react';
import { Play, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HoverPlayVideoProps {
  videoUrl: string;
  posterUrl: string;
  alt: string;
  className?: string;
  badgeText?: string;
  badgeLabel?: string;
  durationText?: string;
  duration?: string;
  scorelineText?: string;
  showHoverHint?: boolean;
  autoPlayOnLoad?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  overlayChildren?: React.ReactNode;
}

/**
 * Reusable visual media container that displays a high-contrast football image
 * and automatically plays the underlying HTML5 video when the user's cursor hovers over it.
 */
export const HoverPlayVideo: React.FC<HoverPlayVideoProps> = ({
  videoUrl,
  posterUrl,
  alt,
  className = 'aspect-video w-full',
  badgeText,
  badgeLabel,
  durationText,
  duration,
  scorelineText,
  showHoverHint = true,
  autoPlayOnLoad = false,
  onClick,
  children,
  overlayChildren,
}) => {
  const effectiveBadge = badgeText ?? badgeLabel;
  const effectiveDuration = durationText ?? duration;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHoverPlaying, setIsHoverPlaying] = useState<boolean>(autoPlayOnLoad);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const handleMouseEnter = () => {
    setIsHoverPlaying(true);
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (autoPlayOnLoad) return;
    setIsHoverPlaying(false);
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`group relative overflow-hidden bg-[#040A06] select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Base Poster Image */}
      <img
        src={posterUrl}
        alt={alt}
        className={`h-full w-full object-cover transition-all duration-700 ${
          isHoverPlaying
            ? 'scale-105 opacity-30'
            : 'scale-100 opacity-90 group-hover:scale-105'
        }`}
      />

      {/* Auto-Playing HTML5 Video on Cursor Hover */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        autoPlay={autoPlayOnLoad}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isHoverPlaying ? 'opacity-95' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Editorial Stadium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-[#050D08]/25 to-black/40 pointer-events-none" />

      {/* Top Overlay Badges */}
      {showHoverHint && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            {effectiveBadge && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#1E3B29] bg-[#050D08]/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#B8FF01] backdrop-blur-md">
                <span
                  className={`h-1.5 w-1.5 rounded-full bg-[#B8FF01] ${
                    isHoverPlaying ? 'animate-ping' : ''
                  }`}
                />
                {effectiveBadge}
              </span>
            )}
            {scorelineText && (
              <span className="rounded-md border border-[#1E3B29] bg-[#050D08]/90 px-2.5 py-1 font-mono text-[11px] font-bold text-white backdrop-blur-md">
                {scorelineText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {isHoverPlaying ? (
              <>
                <span className="inline-flex items-center gap-1 rounded-md bg-[#B8FF01] px-2 py-0.5 font-mono text-[10px] font-extrabold text-[#050D08] shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  LIVE PREVIEW
                </span>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="rounded-md border border-[#1E3B29] bg-[#050D08]/90 p-1.5 text-slate-200 hover:text-[#B8FF01] transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#B8FF01]" />
                  )}
                </button>
              </>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-[#1E3B29] bg-[#050D08]/85 px-2 py-0.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
                <Play className="w-2.5 h-2.5 fill-current text-[#B8FF01]" />
                {effectiveDuration || 'HOVER TO PLAY'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Optional Custom Children Overlay */}
      {overlayChildren}
      {children}
    </div>
  );
};

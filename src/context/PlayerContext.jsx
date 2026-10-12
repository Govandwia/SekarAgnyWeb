import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { songs } from '../data/songs';

const PlayerContext = createContext(null);

export function formatTime(sec) {
  if (isNaN(sec) || sec === null || sec === undefined) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Sync volume & mute to HTML5 audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  const playSong = useCallback((song, options = { openLightbox: true }) => {
    setHasInteracted(true);
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong?.id !== song.id) {
      setCurrentSong(song);
      audio.src = song.audioUrl;
      audio.currentTime = 0;
      setCurrentTime(0);
    }

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.warn('Playback prevented or interrupted:', err);
    });

    if (options.openLightbox) {
      setIsLightboxOpen(true);
    }
  }, [currentSong]);

  const togglePlay = useCallback(() => {
    setHasInteracted(true);
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  }, [isPlaying]);

  const seek = useCallback((timeInSeconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(duration || 0, timeInSeconds));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  const seekPercent = useCallback((pct) => {
    if (!duration) return;
    const target = (pct / 100) * duration;
    seek(target);
  }, [duration, seek]);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => !m);
  }, []);

  const openLightbox = useCallback(() => {
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const stopAndDismiss = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLightboxOpen(false);
    setHasInteracted(false);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  }, []);

  const handleEnded = useCallback(() => {
    // Auto advance to next song
    const idx = songs.findIndex((s) => s.id === currentSong?.id);
    const nextSong = songs[(idx + 1) % songs.length];
    playSong(nextSong, { openLightbox: isLightboxOpen });
  }, [currentSong, isLightboxOpen, playSong]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        progressPercent,
        isMuted,
        volume,
        isLightboxOpen,
        hasInteracted,
        playSong,
        togglePlay,
        seek,
        seekPercent,
        toggleMute,
        setVolume,
        openLightbox,
        closeLightbox,
        stopAndDismiss,
      }}
    >
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

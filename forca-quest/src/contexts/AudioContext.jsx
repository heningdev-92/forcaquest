import { createContext, useState, useEffect, useRef } from "react";

export const AudioContext = createContext();

// Adicione aqui os nomes de todas as músicas que colocar na pasta audio
const TRACKS = [
  "bgm.mp3",
  "bgm2.mp3",
  "bgm3.mp3",
  "bgm4.mp3",
  "bgm5.mp3",
  "bgm6.mp3",
  "bgm7.mp3",
  "bgm8.mp3",
  "bgm9.mp3",
];

export function AudioProvider({ children }) {
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [currentTrack, setCurrentTrack] = useState(0);
  const bgmRef = useRef(null);

  // Gere a faixa atual e avança para a próxima ao terminar
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
    }

    bgmRef.current = new Audio(`/assets/audio/${TRACKS[currentTrack]}`);
    bgmRef.current.volume = volume;

    const playNext = () => {
      setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    };

    bgmRef.current.addEventListener("ended", playNext);

    if (!isMusicMuted) {
      bgmRef.current
        .play()
        .catch(() => console.log("Aguardando interação do utilizador."));
    }

    return () => {
      if (bgmRef.current) {
        bgmRef.current.removeEventListener("ended", playNext);
        bgmRef.current.pause();
      }
    };
  }, [currentTrack]); // Recarrega sempre que a faixa muda

  // Controlo de Mute
  useEffect(() => {
    if (!bgmRef.current) return;
    if (isMusicMuted) {
      bgmRef.current.pause();
    } else {
      bgmRef.current.play().catch(() => {});
    }
  }, [isMusicMuted]);

  // Aplicação instantânea do Controlo de Volume
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = volume;
    }
  }, [volume]);

  const playSfx = (soundName) => {
    const sfx = new Audio(`/assets/audio/${soundName}.mp3`);
    sfx.volume = 0.5;
    sfx.play().catch((e) => console.log("Erro ao tocar SFX:", e));
  };

  return (
    <AudioContext.Provider
      value={{ isMusicMuted, setIsMusicMuted, playSfx, volume, setVolume }}
    >
      {children}
    </AudioContext.Provider>
  );
}

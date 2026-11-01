import { useContext } from "react";
import styled from "styled-components";
import { AudioContext } from "../contexts/AudioContext";

const ToggleContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  background: rgba(10, 15, 30, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 12px 15px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  transition: 0.3s;

  &:hover {
    background: rgba(15, 23, 42, 1);
  }
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
`;

const VolumeSlider = styled.input`
  width: 100%;
  cursor: pointer;
  accent-color: #3498db;
`;

export function AudioToggle() {
  const { isMusicMuted, setIsMusicMuted, playSfx, volume, setVolume } =
    useContext(AudioContext);

  const handleToggle = () => {
    playSfx("click");
    setIsMusicMuted(!isMusicMuted);
  };

  return (
    <ToggleContainer>
      <ToggleButton onClick={handleToggle} title="Ligar/Desligar Música">
        {isMusicMuted ? "🔇 Música OFF" : "🎵 Música ON"}
      </ToggleButton>
      {!isMusicMuted && (
        <VolumeSlider
          type="range"
          min="0"
          max="0.5"
          step="0.02" // Limitado a 50% para não abafar os SFX
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          title="Volume da Música"
        />
      )}
    </ToggleContainer>
  );
}

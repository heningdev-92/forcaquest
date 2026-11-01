import styled from "styled-components";

import { keyframes } from "styled-components"; // Atualize o import do styled-components no topo se necessário

const flashGreen = keyframes`
  0% { box-shadow: inset 0 0 0px rgba(46, 204, 113, 0); }
  50% { box-shadow: inset 0 0 150px rgba(46, 204, 113, 0.5); }
  100% { box-shadow: inset 0 0 0px rgba(46, 204, 113, 0); }
`;

const flashRed = keyframes`
  0% { box-shadow: inset 0 0 0px rgba(231, 76, 60, 0); }
  50% { box-shadow: inset 0 0 150px rgba(231, 76, 60, 0.5); }
  100% { box-shadow: inset 0 0 0px rgba(231, 76, 60, 0); }
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

export const ScreenFeedback = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
  animation: ${(props) =>
      props.$type === "hit"
        ? flashGreen
        : props.$type === "miss"
          ? flashRed
          : "none"}
    0.4s ease-out;
`;

export const GameAreaWrapper = styled.div`
  width: 100%;
  animation: ${(props) => (props.$shake ? shake : "none")} 0.3s ease-in-out;
`;

export const ResultBanner = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(props) =>
    props.$won ? "rgba(46, 204, 113, 0.95)" : "rgba(231, 76, 60, 0.95)"};
  color: white;
  padding: 30px 50px;
  border-radius: 12px;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
  z-index: 2000;
  animation: fadeInScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-align: center;
  border: 4px solid white;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  img {
    width: 180px;
    border-radius: 8px;
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 40px 20px;

  /* NOVO: Vidro fumado que escurece o fundo e melhora a legibilidade */
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
`;

export const ActionArea = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
  margin-bottom: 15px;

  button {
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    font-weight: bold;
    color: white;
    transition: filter 0.2s;

    &:hover {
      filter: brightness(1.1);
    }
  }
`;

export const InfoArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  padding: 15px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

  .stats-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
  }

  .stat-item {
    font-size: 0.9rem;
    color: #bdc3c7;

    strong {
      color: #f1c40f;
    }
    &.lives {
      color: ${(props) => (props.$danger ? "#e74c3c" : "#bdc3c7")};
      font-weight: bold;
    }
  }

  .hint-row {
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
    color: #3498db;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

export const WordArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

export const LetterBox = styled.div`
  width: 50px;
  height: 50px;
  border-bottom: 4px solid #ecf0f1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  padding-bottom: 5px;

  /* Novo: Fundo translúcido sutil para separar as letras do background */
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px 8px 0 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

export const Keyboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 600px;
`;

export const KeyButton = styled.button`
  height: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  /* Lógica de Cores Baseada no Status da Letra */
  background: ${(props) => {
    if (props.$status === "correct") return "#2ecc71";
    if (props.$status === "wrong") return "#e74c3c";
    return "#ecf0f1";
  }};

  color: ${(props) => (props.$status === "default" ? "#2c3e50" : "white")};

  opacity: ${(props) => (props.$status !== "default" ? 0.7 : 1)};
  transform: ${(props) =>
    props.$status !== "default" ? "scale(0.95)" : "scale(1)"};

  &:hover:not(:disabled) {
    background: #bdc3c7;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const ScreenReaderText = styled.span`
  /* Esconde o texto visualmente, mas mantém para leitores de tela */
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

export const HangmanVisual = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0;
  width: 100%;

  svg {
    width: 200px;
    height: 220px;
    fill: transparent;
    stroke-linecap: square;
    stroke-linejoin: miter;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5));
  }
`;

export const MiddleSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Duas colunas rigorosamente iguais */
  align-items: center;
  justify-items: center;
  width: 100%;
  max-width: 550px; /* Mantém os dois próximos e alinhados */
  margin: 20px auto; /* Centraliza a caixa inteira na tela */
  min-height: 220px;

  /* Em celulares, eles empilham para não quebrar a tela */
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const ReactionGifContainer = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 200px;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    border: 3px solid rgba(255, 255, 255, 0.2);
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes popIn {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

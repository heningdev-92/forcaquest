import styled from "styled-components";

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  gap: 30px;
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

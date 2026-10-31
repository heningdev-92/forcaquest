import styled from "styled-components";

export const SetupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  gap: 30px;
`;

export const Title = styled.h2`
  color: #f1c40f;
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 2px 2px 0px #000;
  margin-bottom: 10px;
`;

export const Section = styled.div`
  width: 100%;
  background: rgba(15, 23, 42, 0.85); /* Fundo marinho com opacidade */
  backdrop-filter: blur(8px); /* Desfoque */
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

  h3 {
    margin-bottom: 15px;
    color: #f1c40f; /* Título em amarelo para contraste */
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
  }
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`;

export const OptionButton = styled.button`
  padding: 15px;
  border-radius: 8px;
  border: 2px solid
    ${(props) => (props.$selected ? "#2ecc71" : "rgba(255, 255, 255, 0.2)")};
  background: ${(props) =>
    props.$selected ? "rgba(46, 204, 113, 0.2)" : "rgba(255, 255, 255, 0.05)"};
  color: ${(props) => (props.$selected ? "#2ecc71" : "#ecf0f1")};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(46, 204, 113, 0.15);
    border-color: #2ecc71;
  }
`;

export const StartButton = styled.button`
  width: 100%;
  padding: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 12px;
  border: none;
  background: #3498db;
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

export const TimerDisplay = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: ${(props) => (props.$warning ? "#e74c3c" : "#f1c40f")};
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 2px 2px 0px #000;
  transition: color 0.3s ease;
`;

export const VoteBadge = styled.span`
  background: #e67e22;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  position: absolute;
  top: -10px;
  right: -10px;
  font-weight: bold;
  border: 2px solid #2c3e50;
`;

export const PotDisplay = styled.div`
  background: rgba(46, 204, 113, 0.2);
  border: 2px solid #2ecc71;
  color: #2ecc71;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 1px 1px 0px #000;
`;

export const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ModeCard = styled(OptionButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  padding: 20px 15px;

  span.desc {
    font-size: 0.8rem;
    font-weight: normal;
    color: ${(props) => (props.$selected ? "#ecf0f1" : "#bdc3c7")};
    line-height: 1.3;
  }
`;

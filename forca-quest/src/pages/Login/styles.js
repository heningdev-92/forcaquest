import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
  text-align: center;
  color: #f1c40f; /* Amarelo ouro para remeter a pontos/jogos */
  text-shadow: 2px 2px 0px #000;
`;

export const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  text-align: center;
  opacity: 0.8;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  gap: 15px;
`;

export const Input = styled.input`
  padding: 12px 15px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 3px #3498db;
  }
`;

export const Button = styled.button`
  padding: 15px;
  border-radius: 8px;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.1s,
    opacity 0.2s;

  /* Se for o botão secundário (anônimo), muda a cor */
  background-color: ${(props) => (props.$secondary ? "#95a5a6" : "#2ecc71")};
  color: white;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const Divider = styled.div`
  margin: 20px 0;
  text-align: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    z-index: 1;
  }

  span {
    background-color: #2c3e50; /* Mesma cor do body provisório */
    padding: 0 10px;
    position: relative;
    z-index: 2;
    font-size: 0.9rem;
    opacity: 0.7;
  }
`;

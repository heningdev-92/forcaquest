import styled from "styled-components";

export const LobbyContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 20px;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  padding: 15px 25px;
  border-radius: 12px;
  border: 2px solid #34495e;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  .avatar {
    width: 50px;
    height: 50px;
    background: #ecf0f1;
    border-radius: 8px;
    border: 2px solid #f1c40f;
  }

  .details h3 {
    margin: 0;
    color: #f1c40f;
  }

  .details p {
    margin: 0;
    font-size: 0.9rem;
    color: #bdc3c7;
  }
`;

export const ActionButton = styled.button`
  background: ${(props) => (props.$primary ? "#2ecc71" : "#e74c3c")};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const MainContent = styled.main`
  display: flex;
  gap: 20px;
  flex: 1;
  overflow: hidden; /* Mantém o scroll apenas dentro das áreas específicas */

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ChatSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.85); /* Azul marinho quase opaco */
  backdrop-filter: blur(8px); /* Desfoque do fundo */
  border-radius: 12px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const MessageItem = styled.div`
  display: flex;
  gap: 10px;
  max-width: 85%;
  align-items: flex-end;
  /* Se for a sua mensagem, inverte a ordem para o avatar ficar à direita */
  align-self: ${(props) => (props.$isMine ? "flex-end" : "flex-start")};
  flex-direction: ${(props) => (props.$isMine ? "row-reverse" : "row")};

  .chat-avatar,
  .chat-avatar-placeholder {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .chat-avatar {
    border: 2px solid ${(props) => (props.$isMine ? "#3498db" : "#f1c40f")};
  }

  .chat-avatar-placeholder {
    background: rgba(255, 255, 255, 0.1);
  }

  .msg-content {
    padding: 10px 15px;
    border-radius: 12px;
    line-height: 1.4;
    background: ${(props) =>
      props.$isMine ? "#3498db" : "rgba(255, 255, 255, 0.1)"};
    color: #fff;
    /* Arredondamento dinâmico do balão de fala */
    border-bottom-right-radius: ${(props) => (props.$isMine ? "4px" : "12px")};
    border-bottom-left-radius: ${(props) => (props.$isMine ? "12px" : "4px")};

    strong {
      display: block;
      font-size: 0.85rem;
      margin-bottom: 4px;
      color: ${(props) => (props.$isMine ? "#e0f7fa" : "#f1c40f")};
    }
  }
`;

export const MessageBubble = styled.div`
  background: ${(props) => (props.$isMine ? "#3498db" : "#2c3e50")};
  align-self: ${(props) => (props.$isMine ? "flex-end" : "flex-start")};
  padding: 10px 15px;
  border-radius: 8px;
  max-width: 80%;

  strong {
    display: block;
    font-size: 0.8rem;
    color: #f1c40f;
    margin-bottom: 5px;
  }
`;

export const ChatInputArea = styled.form`
  display: flex;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  gap: 10px;

  input {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    border: none;
    outline: none;
    background: #ecf0f1;
  }

  button {
    background: #f1c40f;
    border: none;
    padding: 0 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }
`;

export const PlayersSection = styled.div`
  width: 300px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  overflow-y: auto;

  h3 {
    font-size: 1rem;
    color: #f1c40f;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 5px;
    margin-bottom: 5px;
  }
`;

export const PlayerCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  padding: 10px;
  border-radius: 8px;
  border-left: 4px solid
    ${(props) => (props.$status === "available" ? "#2ecc71" : "#e67e22")};

  .info {
    display: flex;
    flex-direction: column;
  }

  .name {
    font-weight: bold;
    color: #ffffff; /* Branco puro para contraste */
    font-size: 0.95rem;
  }

  .points {
    font-size: 0.8rem;
    color: #f39c12; /* Amarelo ouro */
  }

  button {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: bold;
    transition: 0.2s;

    &:hover {
      filter: brightness(1.2);
    }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #2c3e50;
  padding: 25px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 2px solid #34495e;

  h3 {
    color: #f1c40f;
    text-align: center;
  }
  p {
    font-size: 0.9rem;
    color: #bdc3c7;
  }

  input {
    padding: 12px;
    border-radius: 8px;
    border: none;
    outline: none;
  }

  .buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 10px;
  }
`;

export const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  h4 {
    color: #3498db;
    margin: 0;
    font-size: 1.2rem;
  }

  .id-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #ecf0f1;
    background: #2c3e50;
    padding: 5px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
    font-weight: bold;
    border: 1px solid #34495e;

    &:hover {
      background: #34495e;
    }
  }
`;

export const ChallengeBoard = styled.div`
  background: rgba(230, 126, 34, 0.1);
  border: 2px solid #e67e22;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(230, 126, 34, 0.3);
    padding-bottom: 10px;
  }

  h4 {
    color: #e67e22;
    margin: 0;
  }
  .pot {
    font-size: 1.2rem;
    font-weight: bold;
    color: #f1c40f;
  }

  .players {
    font-size: 0.9rem;
    color: #bdc3c7;
  }
`;

export const RankList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 60vh; /* Limita a altura para não vazar da tela */
  overflow-y: auto;
  padding-right: 5px;
  margin-top: 10px;
  margin-bottom: 15px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

export const RankItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) =>
    props.$isTop3 ? "rgba(241, 196, 15, 0.15)" : "rgba(0, 0, 0, 0.4)"};
  border-left: 4px solid
    ${(props) =>
      props.$pos === 1
        ? "#f1c40f"
        : props.$pos === 2
          ? "#bdc3c7"
          : props.$pos === 3
            ? "#cd7f32"
            : "#3498db"};
  padding: 12px;
  border-radius: 8px;

  .position-name {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pos {
    font-size: 1.2rem;
    font-weight: bold;
    color: ${(props) =>
      props.$pos === 1
        ? "#f1c40f"
        : props.$pos === 2
          ? "#bdc3c7"
          : props.$pos === 3
            ? "#cd7f32"
            : "#95a5a6"};
    width: 30px;
    text-align: center;
  }

  .name {
    font-size: 1rem;
    font-weight: bold;
    color: ${(props) => (props.$isTop3 ? "#f1c40f" : "#ffffff")};
  }

  .stats {
    text-align: right;
  }

  .points {
    font-size: 1rem;
    font-weight: bold;
    color: #2ecc71;
  }

  .level {
    font-size: 0.8rem;
    color: #bdc3c7;
  }
`;

export const ActionArea = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;

  button {
    padding: 12px 25px;
    font-size: 1.1rem;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
      filter: brightness(1.1);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

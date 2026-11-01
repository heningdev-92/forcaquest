import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalContent = styled.div`
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  width: 90%;
  max-width: 75%;
  padding: 30px;
  color: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #e74c3c;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const StatsArea = styled.div`
  display: flex;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.4);
  padding: 15px;
  border-radius: 12px;
  text-align: center;

  div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  strong {
    font-size: 1.5rem;
    color: #f1c40f;
  }

  span {
    font-size: 0.9rem;
    color: #bdc3c7;
    text-transform: uppercase;
  }
`;

export const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 15px;
  margin-top: 10px;
`;

export const AvatarOption = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid ${(props) => (props.$selected ? "#2ecc71" : "transparent")};
  opacity: ${(props) => (props.$selected ? "1" : "0.6")};
  transition: 0.2s;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

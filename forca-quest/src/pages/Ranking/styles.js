import styled from "styled-components";

export const RankingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
  max-width: 800px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  color: #f1c40f;
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 2px 2px 0px #000;
  margin-bottom: 30px;
`;

export const RankList = styled.div`
  width: 100%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  padding: 15px;
  border-radius: 8px;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(5px);
  }

  .position-name {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .pos {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${(props) =>
      props.$pos === 1
        ? "#f1c40f"
        : props.$pos === 2
          ? "#bdc3c7"
          : props.$pos === 3
            ? "#cd7f32"
            : "#95a5a6"};
    width: 40px;
    text-align: center;
  }

  .name {
    font-size: 1.2rem;
    font-weight: bold;
    color: ${(props) => (props.$isTop3 ? "#f1c40f" : "#ffffff")};
  }

  .stats {
    text-align: right;
  }

  .points {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2ecc71;
  }

  .level {
    font-size: 0.9rem;
    color: #bdc3c7;
  }
`;

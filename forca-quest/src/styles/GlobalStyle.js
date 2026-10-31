import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Courier New', Courier, monospace; /* Fonte provisória com cara de pixel art */
  }

  body {
    background-color: #2c3e50;
    color: #ecf0f1;
    overflow-x: hidden;
    
    /* Regras de Imagem de Fundo Dinâmica */
    background-image: url(${(props) => props.$bgImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    transition: background-image 0.5s ease-in-out;
  }

  /* Scrollbar customizada para combinar com o jogo */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2); 
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2); 
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4); 
  }
`;

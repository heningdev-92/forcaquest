import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [currentBackground, setCurrentBackground] = useState("");

  // Lógica de cálculo do cenário
  useEffect(() => {
    const updateTheme = () => {
      const currentHour = new Date().getHours();

      // Lógica de Horário Base
      let bgName = "";
      if (currentHour >= 6 && currentHour < 15) {
        bgName = "bg_morning.jpg"; // 06:00 às 16:59
      } else if (currentHour >= 15 && currentHour < 18) {
        bgName = "bg_afternoon.jpg"; // 17:00 às 18:59
      } else {
        bgName = "bg_night.jpg"; // 19:00 às 05:59
      }

      /* 
        ESPAÇO FUTURO PARA SAZONALIDADE 
        Aqui no futuro faremos verificações como:
        const currentMonth = new Date().getMonth();
        if (currentMonth === 11) bgName = 'bg_christmas.png';
      */

      // Caminho relativo para a pasta public do Vite
      setCurrentBackground(`/assets/backgrounds/${bgName}`);
    };

    // Roda ao abrir o app
    updateTheme();

    // Roda um "relógio" silencioso a cada 10 minutos para garantir que o
    // tema mude sozinho se o jogador ficar muito tempo com a tela aberta
    const interval = setInterval(updateTheme, 600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentBackground }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const APP_DATA = {
  gameName: "ForQuest",
  developer: "Hening",
  version: "1.0.0",
  rights: "© 2026 Todos os direitos reservados",
  difficulties: {
    EASY: { label: "Fácil", xpReward: 10, pointsReward: 5 },
    MEDIUM: { label: "Médio", xpReward: 25, pointsReward: 15 },
    HARD: { label: "Difícil", xpReward: 50, pointsReward: 30 },
  },
  // NOVO: Modos de Desafio
  challengeModes: {
    SPEEDRUN: {
      label: "Corrida",
      desc: "Quem adivinhar a palavra primeiro leva tudo.",
    },
    PRECISION: {
      label: "Precisão",
      desc: "Quem tiver menos erros no final ganha.",
    },
    SURVIVAL: {
      label: "Sobrevivência",
      desc: "Errou 6 vezes, está fora. O último vivo vence.",
    },
  },
  avatars: [
    { id: "avatar_1", path: "/assets/avatars/pixel_knight.png" },
    { id: "avatar_2", path: "/assets/avatars/pixel_mage.png" },
  ],
  // NOVO: Dicionário padrão para popular o banco na primeira vez
  defaultDictionary: [
    {
      word: "ACESSIBILIDADE",
      theme: "Tecnologia",
      hint: "Inclusão para todos em plataformas digitais.",
    },
    {
      word: "ASTRONAUTA",
      theme: "Profissões",
      hint: "Profissional que viaja pelo espaço sideral.",
    },
    {
      word: "GIRAFA",
      theme: "Animais",
      hint: "Mamífero conhecido por seu pescoço extremamente longo.",
    },
    {
      word: "DESENVOLVEDOR",
      theme: "Profissões",
      hint: "Pessoa que escreve códigos para criar softwares.",
    },
    {
      word: "COMPUTADOR",
      theme: "Tecnologia",
      hint: "Máquina capaz de processar dados em alta velocidade.",
    },
  ],
};

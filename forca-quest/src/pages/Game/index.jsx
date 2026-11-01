import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { APP_DATA } from "../../data/data";
import { AudioContext } from "../../contexts/AudioContext"; // Adicione
import {
  GameContainer,
  ActionArea,
  InfoArea,
  WordArea,
  LetterBox,
  Keyboard,
  KeyButton,
  ScreenReaderText,
  HangmanVisual,
  ScreenFeedback,
  GameAreaWrapper,
  ResultBanner,
  MiddleSection,
  ReactionGifContainer,
} from "./styles";

export function Game() {
  const navigate = useNavigate();
  const { playSfx } = useContext(AudioContext); // Adicione o hook de áudio
  const [visualFeedback, setVisualFeedback] = useState(null); // 'hit' ou 'miss'
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);

  const gameMode = searchParams.get("mode");
  const roomId = searchParams.get("room") || "global";
  const challengeId = searchParams.get("challenge");

  // Valores dinâmicos que podem vir da URL (Solo) ou do Banco (Desafio)
  const [actualTheme, setActualTheme] = useState(
    searchParams.get("theme") || "",
  );
  const [actualDiff, setActualDiff] = useState(
    searchParams.get("diff") || "EASY",
  );
  const [actualCMode, setActualCMode] = useState(
    searchParams.get("cMode") || "",
  );

  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);

  const [gameStatus, setGameStatus] = useState("playing");
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [announcement, setAnnouncement] = useState("Buscando palavra...");
  const [challengeData, setChallengeData] = useState(null);

  const maxMistakes = 6;
  const isDead = mistakes >= maxMistakes;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const fetchRandomWord = async () => {
    setLoading(true);
    try {
      let finalWord = null;
      let finalDiff = actualDiff;

      if (gameMode === "challenge" && challengeId) {
        const challengeRef = doc(db, "challenges", challengeId);
        for (let i = 0; i < 5; i++) {
          const snap = await getDoc(challengeRef);
          if (snap.exists() && snap.data().challengeWord) {
            const data = snap.data();
            finalWord = data.challengeWord;
            finalDiff = data.finalDiff;

            setActualTheme(data.finalTheme);
            setActualDiff(data.finalDiff);
            setActualCMode(data.finalMode);
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      if (!finalWord) {
        const wordsRef = collection(db, "words");
        let snapshot = await getDocs(wordsRef);
        if (snapshot.empty) {
          for (const item of APP_DATA.defaultDictionary) {
            await addDoc(wordsRef, item);
          }
          snapshot = await getDocs(wordsRef);
        }
        const wordsList = snapshot.docs.map((doc) => doc.data());
        let filteredWords = wordsList;

        // Filtro por Tema
        if (actualTheme && actualTheme !== "Aleatório") {
          filteredWords = wordsList.filter(
            (word) => word.theme === actualTheme,
          );
        }

        // NOVO: Filtro rigoroso por Categoria (STANDARD ou HARD)
        const targetCategory = actualDiff === "HARD" ? "HARD" : "STANDARD";
        filteredWords = filteredWords.filter(
          (word) => (word.category || "STANDARD") === targetCategory,
        );

        if (filteredWords.length === 0) {
          // Se não houver palavras na categoria selecionada, recua para a lista base do tema para evitar crash
          filteredWords = wordsList.filter(
            (word) => word.theme === actualTheme,
          );
          if (filteredWords.length === 0) filteredWords = wordsList;
        }

        finalWord =
          filteredWords[Math.floor(Math.random() * filteredWords.length)];
      }

      setWordData(finalWord);
      setGameStatus("playing");
      setMistakes(0);
      setGuessedLetters([]);
      setRewardClaimed(false);
      setAnnouncement(
        `Jogo iniciado. Tema: ${finalWord.theme}. Palavra com ${finalWord.word.length} letras.`,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // O Vite lê a pasta e conta os arquivos automaticamente
  const hitsGifs = import.meta.glob("../../assets/gifs/hits/*.gif");
  const missGifs = import.meta.glob("../../assets/gifs/miss/*.gif");
  const wonsGifs = import.meta.glob("../../assets/gifs/wons/*.gif");
  const lostsGifs = import.meta.glob("../../assets/gifs/losts/*.gif");

  const GIF_CONFIG = {
    hits: Object.keys(hitsGifs).length,
    miss: Object.keys(missGifs).length,
    wons: Object.keys(wonsGifs).length,
    losts: Object.keys(lostsGifs).length,
  };

  const [activeReactionGif, setActiveReactionGif] = useState(null);
  const [endGameGif, setEndGameGif] = useState(null);

  // Sorteia o GIF final assim que o status do jogo mudar para won ou lost
  useEffect(() => {
    if (gameStatus === "won") {
      const randomId = Math.floor(Math.random() * GIF_CONFIG.wons) + 1;
      setEndGameGif(`/assets/gifs/wons/${randomId}.gif`);
    } else if (gameStatus === "lost") {
      const randomId = Math.floor(Math.random() * GIF_CONFIG.losts) + 1;
      setEndGameGif(`/assets/gifs/losts/${randomId}.gif`);
    }
  }, [gameStatus]);

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const processWinReward = async (potValue = 0) => {
    if (!user || rewardClaimed) return;
    setRewardClaimed(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const diffConfig =
          APP_DATA.difficulties[actualDiff] || APP_DATA.difficulties.EASY;
        const newXp = (userData.xp || 0) + diffConfig.xpReward;
        const newPoints =
          (userData.points || 0) +
          (gameMode === "challenge" ? potValue : diffConfig.pointsReward);
        const newLevel = Math.floor(newXp / 100) + 1;
        await updateDoc(userRef, {
          xp: newXp,
          points: newPoints,
          level: newLevel,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (gameMode !== "challenge" || !challengeId || !user) return;
    const challengeRef = doc(db, "challenges", challengeId);

    const unsubscribe = onSnapshot(challengeRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setChallengeData(data);

        if (data.winnerId && data.status === "finished") {
          if (data.winnerId === user.uid && gameStatus !== "won") {
            setGameStatus("won");
            setAnnouncement(
              `Você venceu o desafio e levou os ${data.pot} pontos!`,
            );
            processWinReward(data.pot);
          } else if (data.winnerId !== user.uid && gameStatus !== "lost") {
            setGameStatus("lost");
            setAnnouncement(`${data.winnerName} venceu e levou o prêmio!`);
          }
          return;
        }

        if (actualCMode === "PRECISION" && data.progress && !data.winnerId) {
          const finishedPlayers = Object.keys(data.progress);
          if (finishedPlayers.length === data.acceptedPlayers.length) {
            if (finishedPlayers[0] === user.uid) {
              let bestPlayer = null;
              let minMistakes = 99;
              let minTime = Infinity;
              for (const uid of data.acceptedPlayers) {
                const p = data.progress[uid];
                if (
                  p.mistakes < minMistakes ||
                  (p.mistakes === minMistakes && p.time < minTime)
                ) {
                  minMistakes = p.mistakes;
                  minTime = p.time;
                  bestPlayer = uid;
                }
              }
              const winnerRef = await getDoc(doc(db, "users", bestPlayer));
              await updateDoc(challengeRef, {
                winnerId: bestPlayer,
                winnerName: winnerRef.data().username,
                status: "finished",
              });
            }
          }
        }

        if (actualCMode === "SURVIVAL" && data.progress && !data.winnerId) {
          const alivePlayers = data.acceptedPlayers.filter(
            (uid) => data.progress[uid]?.status !== "dead",
          );

          if (alivePlayers.length === 1) {
            if (alivePlayers[0] === user.uid) {
              const winnerRef = await getDoc(doc(db, "users", user.uid));
              await updateDoc(challengeRef, {
                winnerId: user.uid,
                winnerName: winnerRef.data().username,
                status: "finished",
              });
            }
          } else if (
            alivePlayers.length > 1 &&
            alivePlayers.every(
              (uid) => data.progress[uid]?.status === "survived",
            )
          ) {
            if (alivePlayers[0] === user.uid && !data.isFetchingNext) {
              await updateDoc(challengeRef, { isFetchingNext: true });

              const wordsRef = collection(db, "words");
              const snapshot = await getDocs(wordsRef);
              const wordsList = snapshot.docs.map((d) => d.data());
              let filtered =
                actualTheme !== "Aleatório"
                  ? wordsList.filter((w) => w.theme === actualTheme)
                  : wordsList;
              if (filtered.length === 0) filtered = wordsList;
              const nextWord =
                filtered[Math.floor(Math.random() * filtered.length)];

              const newProgress = {};
              data.acceptedPlayers.forEach((uid) => {
                newProgress[uid] =
                  data.progress[uid]?.status === "dead"
                    ? { status: "dead" }
                    : { status: "playing" };
              });

              await updateDoc(challengeRef, {
                challengeWord: nextWord,
                progress: newProgress,
                isFetchingNext: false,
                round: (data.round || 1) + 1,
              });
            }
          }
        }

        if (
          actualCMode === "SURVIVAL" &&
          data.challengeWord &&
          wordData &&
          data.challengeWord.word !== wordData.word
        ) {
          setWordData(data.challengeWord);
          setGuessedLetters([]);
          setMistakes(0);
          setGameStatus("playing");
          setAnnouncement(`Rodada ${data.round || 2} iniciada! Nova palavra.`);
        }
      }
    });
    return () => unsubscribe();
  }, [
    gameMode,
    challengeId,
    user,
    gameStatus,
    actualCMode,
    wordData,
    actualTheme,
    actualDiff,
  ]);

  useEffect(() => {
    if (!wordData || gameStatus !== "playing") return;
    const isWordGuessed = wordData.word
      .split("")
      .every((letter) => guessedLetters.includes(letter));

    if (isWordGuessed) {
      if (gameMode === "challenge") {
        const handleChallengeWin = async () => {
          const challengeRef = doc(db, "challenges", challengeId);
          if (actualCMode === "SPEEDRUN") {
            const snap = await getDoc(challengeRef);
            if (!snap.data().winnerId) {
              const userRef = await getDoc(doc(db, "users", user.uid));
              await updateDoc(challengeRef, {
                winnerId: user.uid,
                winnerName: userRef.data().username,
                status: "finished",
              });
            }
            setGameStatus("waiting");
            setAnnouncement("Verificando chegada...");
            playSfx("win"); // <-- Toca som de vitória
          } else if (actualCMode === "PRECISION") {
            await updateDoc(challengeRef, {
              [`progress.${user.uid}`]: { mistakes, time: Date.now() },
            });
            setGameStatus("waiting");
            setAnnouncement("Terminou! Aguardando os outros...");
          } else if (actualCMode === "SURVIVAL") {
            await updateDoc(challengeRef, {
              [`progress.${user.uid}`]: { status: "survived" },
            });
            setGameStatus("waiting");
            setAnnouncement("Sobreviveu! Aguardando rodada...");
          }
        };
        handleChallengeWin();
      } else {
        setGameStatus("won");
        setAnnouncement("Parabéns! Você adivinhou a palavra.");
        processWinReward();
        playSfx("win"); // <-- Toca som de vitória
      }
    } else if (mistakes >= maxMistakes) {
      if (gameMode === "challenge") {
        const handleChallengeLoss = async () => {
          const challengeRef = doc(db, "challenges", challengeId);
          if (actualCMode === "PRECISION") {
            await updateDoc(challengeRef, {
              [`progress.${user.uid}`]: { mistakes, time: Date.now() },
            });
            setGameStatus("waiting");
            setAnnouncement("Enforcado! Aguardando apuração...");
            playSfx("lose"); // <-- Toca som de derrota
          } else if (actualCMode === "SURVIVAL") {
            await updateDoc(challengeRef, {
              [`progress.${user.uid}`]: { status: "dead" },
            });
            setGameStatus("lost");
            setAnnouncement("Você foi eliminado da Sobrevivência!");
          } else {
            setGameStatus("lost");
            setAnnouncement("Enforcado! Aguardando vencedor...");
          }
        };
        handleChallengeLoss();
      } else {
        setGameStatus("lost");
        setAnnouncement(`Fim de jogo. A palavra era ${wordData.word}.`);
        playSfx("lose"); // <-- Toca som de derrota
      }
    }
  }, [guessedLetters, mistakes, wordData, gameStatus]);

  const handleGuess = (letter) => {
    if (
      guessedLetters.includes(letter) ||
      gameStatus !== "playing" ||
      !wordData
    )
      return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!wordData.word.includes(letter)) {
      setMistakes((prev) => prev + 1);
      playSfx("miss");
      triggerFeedback("miss");
    } else {
      playSfx("hit");
      triggerFeedback("hit");
    }
  };

  const triggerFeedback = (type) => {
    // Define qual pasta procurar com base no tipo
    const folder = type === "hit" ? "hits" : "miss";
    const maxGifs = GIF_CONFIG[folder];

    // Sorteia o número
    const randomId = Math.floor(Math.random() * maxGifs) + 1;

    setActiveReactionGif(`/assets/gifs/${folder}/${randomId}.gif`);
    setVisualFeedback(type);

    setTimeout(() => {
      setVisualFeedback(null);
      setActiveReactionGif(null);
    }, 3500); // Aumentado para 3.5s para dar tempo de ver o GIF
  };

  const getLetterStatus = (letter) => {
    if (!guessedLetters.includes(letter) || !wordData) return "default";
    return wordData.word.includes(letter) ? "correct" : "wrong";
  };

  // Processamento Dinâmico da Dica baseado na Dificuldade
  const getHintDisplay = () => {
    if (actualDiff === "HARD") return "Dica desativada (Modo Difícil)";
    if (actualDiff === "MEDIUM") {
      const words = wordData.hint.split(" ");
      return `Dica: ${words.slice(0, 2).join(" ")}...`;
    }
    return `Dica: ${wordData.hint}`;
  };

  if (loading || !wordData)
    return (
      <GameContainer style={{ justifyContent: "center" }}>
        <h2 style={{ color: "#f1c40f" }}>Sorteando Palavra...</h2>
      </GameContainer>
    );

  return (
    <GameContainer>
      <ScreenReaderText aria-live="polite">{announcement}</ScreenReaderText>

      {/* Feedback de Ecrã Inteiro */}
      {visualFeedback && <ScreenFeedback $type={visualFeedback} />}

      {/* Banner de Resultado Final com GIF Sorteado */}
      {(gameStatus === "won" || gameStatus === "lost") && (
        <ResultBanner $won={gameStatus === "won"}>
          {endGameGif && <img src={endGameGif} alt={gameStatus} />}
          <span>{gameStatus === "won" ? "Vitória! 🎉" : "Enforcado! 💀"}</span>
        </ResultBanner>
      )}

      {/* Envolva os componentes visuais para o efeito Shake */}
      <GameAreaWrapper $shake={visualFeedback === "miss"}>
        <ActionArea>
          <button
            onClick={() => navigate("/lobby?room=global")}
            style={{ backgroundColor: "#e74c3c" }}
          >
            Sair para o Lobby
          </button>
          {roomId !== "global" &&
            (gameStatus === "won" || gameStatus === "lost") && (
              <button
                onClick={() => navigate(`/lobby?room=${roomId}`)}
                style={{ backgroundColor: "#9b59b6" }}
              >
                Voltar para a Sala
              </button>
            )}
          {gameMode === "solo" && (
            <button
              onClick={() => navigate(`/setup?mode=${gameMode}&room=${roomId}`)}
              style={{ backgroundColor: "#95a5a6" }}
            >
              Voltar ao Setup
            </button>
          )}
        </ActionArea>

        <InfoArea $danger={mistakes >= 4}>
          <div className="stats-row">
            <div className="stat-item">
              Tema: <strong>{actualTheme}</strong>
            </div>
            {gameMode === "challenge" && (
              <div
                className="stat-item"
                style={{ color: "#f1c40f", fontWeight: "bold" }}
              >
                🏆 {APP_DATA.challengeModes[actualCMode]?.label} (
                {challengeData?.pot || 0} pts)
              </div>
            )}
            <div className="stat-item lives">
              Erros: {mistakes} / {maxMistakes}
            </div>
          </div>
          <div className="hint-row">
            {gameStatus === "won" && (
              <span style={{ color: "#2ecc71" }}>{announcement}</span>
            )}
            {gameStatus === "lost" && (
              <span style={{ color: "#e74c3c" }}>{announcement}</span>
            )}
            {gameStatus === "waiting" && (
              <span style={{ color: "#f39c12" }}>{announcement}</span>
            )}
            {gameStatus === "playing" && getHintDisplay()}
          </div>
        </InfoArea>

        {/* NOVA SEÇÃO CENTRAL: Forca e GIF Lado a Lado */}
        <MiddleSection>
          <HangmanVisual aria-hidden="true">
            <svg viewBox="0 0 300 300">
              <g stroke="#d35400" strokeWidth="10">
                <line x1="50" y1="280" x2="150" y2="280" />
                <line x1="100" y1="280" x2="100" y2="20" />
                <line x1="95" y1="20" x2="220" y2="20" />
                <line
                  x1="220"
                  y1="20"
                  x2="220"
                  y2="50"
                  strokeWidth="6"
                  stroke="#95a5a6"
                />
              </g>
              <g stroke={isDead ? "#e74c3c" : "#f1c40f"} strokeWidth="8">
                {mistakes >= 1 && <circle cx="220" cy="80" r="30" />}
                {mistakes >= 2 && <line x1="220" y1="110" x2="220" y2="180" />}
                {mistakes >= 3 && <line x1="220" y1="130" x2="180" y2="170" />}
                {mistakes >= 4 && <line x1="220" y1="130" x2="260" y2="170" />}
                {mistakes >= 5 && <line x1="220" y1="180" x2="190" y2="240" />}
                {mistakes >= 6 && <line x1="220" y1="180" x2="250" y2="240" />}
                {isDead && (
                  <g stroke="#e74c3c" strokeWidth="4">
                    <line x1="205" y1="70" x2="215" y2="80" />
                    <line x1="215" y1="70" x2="205" y2="80" />
                    <line x1="225" y1="70" x2="235" y2="80" />
                    <line x1="235" y1="70" x2="225" y2="80" />
                  </g>
                )}
              </g>
            </svg>
          </HangmanVisual>

          <ReactionGifContainer>
            {visualFeedback && activeReactionGif && (
              <img src={activeReactionGif} alt={visualFeedback} />
            )}
          </ReactionGifContainer>
        </MiddleSection>

        <WordArea aria-label="Palavra oculta">
          {wordData.word.split("").map((letter, index) => {
            const isRevealed =
              guessedLetters.includes(letter) || gameStatus === "lost";
            return (
              <LetterBox key={index} $revealed={isRevealed}>
                {isRevealed ? letter : ""}
              </LetterBox>
            );
          })}
        </WordArea>

        <Keyboard aria-label="Teclado Virtual">
          {alphabet.map((letter) => (
            <KeyButton
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={
                guessedLetters.includes(letter) || gameStatus !== "playing"
              }
              $status={getLetterStatus(letter)}
            >
              {letter}
            </KeyButton>
          ))}
        </Keyboard>
      </GameAreaWrapper>

      {gameStatus !== "playing" &&
        gameStatus !== "waiting" &&
        gameMode === "solo" && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={fetchRandomWord}
              style={{
                padding: "15px 30px",
                fontSize: "1.2rem",
                backgroundColor: "#3498db",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Jogar Novamente
            </button>
          </div>
        )}
    </GameContainer>
  );
}

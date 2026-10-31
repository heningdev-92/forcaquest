import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { APP_DATA } from "../../data/data";
import {
  SetupContainer,
  Title,
  Section,
  OptionsGrid,
  OptionButton,
  StartButton,
  TimerDisplay,
  VoteBadge,
  PotDisplay,
  ModeGrid,
  ModeCard,
} from "./styles";

export function SetupGame() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);

  const mode = searchParams.get("mode");
  const roomId = searchParams.get("room") || "global";
  const challengeId = searchParams.get("challenge");

  const [availableThemes, setAvailableThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(30);
  const [challengeData, setChallengeData] = useState(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const wordsSnap = await getDocs(collection(db, "words"));
        const themesSet = new Set();
        wordsSnap.forEach((doc) => themesSet.add(doc.data().theme));
        if (themesSet.size === 0)
          APP_DATA.defaultDictionary.forEach((item) =>
            themesSet.add(item.theme),
          );
        setAvailableThemes(Array.from(themesSet));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  useEffect(() => {
    if (mode !== "challenge" || !user || !challengeId) return;
    const challengeRef = doc(db, "challenges", challengeId);

    const unsubscribe = onSnapshot(challengeRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === "cancelled") {
          alert(
            "O desafio foi cancelado porque um ou mais jogadores abandonaram a sala.",
          );
          navigate(`/lobby?room=${roomId}`);
          return;
        }
        setChallengeData(data);
      }
    });
    return () => unsubscribe();
  }, [mode, challengeId, user, navigate, roomId]);

  // NOVO: Gatilho que teletransporta todo mundo para o jogo em perfeita sincronia
  useEffect(() => {
    if (mode === "challenge" && challengeData?.status === "playing") {
      navigate(`/game?mode=challenge&room=${roomId}&challenge=${challengeId}`);
    }
  }, [challengeData?.status, mode, navigate, roomId, challengeId]);

  useEffect(() => {
    if (
      mode !== "challenge" ||
      !challengeData ||
      !challengeData.endTime ||
      challengeData.status === "cancelled"
    )
      return;
    const interval = setInterval(() => {
      const remaining = Math.floor((challengeData.endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        // CORREÇÃO: Apenas o líder tem autorização para apurar e salvar no banco!
        if (
          challengeData.leaderId === user.uid &&
          challengeData.status === "voting"
        ) {
          apurarVotos(challengeData.votes);
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [challengeData, mode, user]);

  const apurarVotos = async (votesMap) => {
    const themesCount = {};
    const diffsCount = {};
    const modesCount = {};

    Object.values(votesMap || {}).forEach((vote) => {
      if (vote.theme)
        themesCount[vote.theme] = (themesCount[vote.theme] || 0) + 1;
      if (vote.diff) diffsCount[vote.diff] = (diffsCount[vote.diff] || 0) + 1;
      if (vote.gameMode)
        modesCount[vote.gameMode] = (modesCount[vote.gameMode] || 0) + 1;
    });

    const getWinner = (counts, defaultVal) => {
      if (Object.keys(counts).length === 0) return defaultVal;
      let max = 0;
      let winners = [];
      for (const [key, qty] of Object.entries(counts)) {
        if (qty > max) {
          max = qty;
          winners = [key];
        } else if (qty === max) {
          winners.push(key);
        }
      }
      return winners[Math.floor(Math.random() * winners.length)];
    };

    const winnerTheme = getWinner(themesCount, "Aleatório");
    const winnerDiff = getWinner(diffsCount, "EASY");
    const winnerMode = getWinner(modesCount, "SPEEDRUN");

    if (mode === "challenge") {
      try {
        const wordsSnap = await getDocs(collection(db, "words"));
        const wordsList = wordsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        let filteredWords =
          winnerTheme !== "Aleatório"
            ? wordsList.filter((w) => w.theme === winnerTheme)
            : wordsList;
        if (filteredWords.length === 0) filteredWords = wordsList;
        const drawnWord =
          filteredWords[Math.floor(Math.random() * filteredWords.length)];

        // O Líder atualiza o banco e muda o status para 'playing', o que puxa todo mundo via useEffect
        await updateDoc(doc(db, "challenges", challengeId), {
          challengeWord: drawnWord,
          finalMode: winnerMode,
          finalTheme: winnerTheme,
          finalDiff: winnerDiff,
          status: "playing",
        });
      } catch (error) {
        console.error("Erro na apuração:", error);
      }
    } else {
      // Se for Solo, o próprio jogador navega imediatamente
      navigate(
        `/game?mode=solo&theme=${selectedTheme}&diff=${selectedDifficulty}&room=${roomId}`,
      );
    }
  };

  const handleVote = async (field, value) => {
    if (mode === "solo") {
      if (field === "theme") setSelectedTheme(value);
      if (field === "diff") setSelectedDifficulty(value);
      return;
    }
    if (!user || !challengeData) return;
    const myVote = challengeData.votes?.[user.uid] || {};
    myVote[field] = value;
    await updateDoc(doc(db, "challenges", challengeId), {
      [`votes.${user.uid}`]: myVote,
    });
  };

  const handleAbandon = async () => {
    if (mode === "challenge" && challengeData && user) {
      try {
        const challengeRef = doc(db, "challenges", challengeId);
        const updatedPlayers = challengeData.acceptedPlayers.filter(
          (id) => id !== user.uid,
        );

        if (updatedPlayers.length < 2) {
          for (const playerId of challengeData.acceptedPlayers) {
            const pRef = doc(db, "users", playerId);
            const pSnap = await getDoc(pRef);
            if (pSnap.exists()) {
              await updateDoc(pRef, {
                points: (pSnap.data().points || 0) + challengeData.entryFee,
              });
            }
          }
          await updateDoc(challengeRef, { status: "cancelled" });
        } else {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            await updateDoc(userRef, {
              points: (userSnap.data().points || 0) + challengeData.entryFee,
            });
          }
          await updateDoc(challengeRef, {
            acceptedPlayers: updatedPlayers,
            pot: challengeData.pot - challengeData.entryFee,
          });
        }
      } catch (error) {
        console.error("Erro ao abandonar:", error);
      }
    }
    navigate(`/lobby?room=${roomId}`);
  };

  const getVoteCount = (field, value) => {
    if (mode !== "challenge" || !challengeData || !challengeData.votes)
      return 0;
    return Object.values(challengeData.votes).filter((v) => v[field] === value)
      .length;
  };

  const myCurrentThemeVote =
    mode === "challenge"
      ? challengeData?.votes?.[user?.uid]?.theme
      : selectedTheme;
  const myCurrentDiffVote =
    mode === "challenge"
      ? challengeData?.votes?.[user?.uid]?.diff
      : selectedDifficulty;
  const myCurrentModeVote =
    mode === "challenge" ? challengeData?.votes?.[user?.uid]?.gameMode : null;

  if (loading)
    return (
      <SetupContainer>
        <Title>Carregando opções...</Title>
      </SetupContainer>
    );

  return (
    <SetupContainer
      style={{
        maxWidth: "800px",
        height: "auto",
        minHeight: "100vh",
        paddingTop: "40px",
      }}
    >
      <Title>
        {mode === "challenge" ? "Votação do Desafio" : "Configurar Partida"}
      </Title>

      {mode === "challenge" && (
        <>
          <TimerDisplay $warning={timeLeft <= 10}>
            00:{timeLeft.toString().padStart(2, "0")}
          </TimerDisplay>
          <PotDisplay>
            Prêmio Total: {challengeData?.pot || 0} Pontos 💰
          </PotDisplay>
        </>
      )}

      {mode === "challenge" && (
        <Section>
          <h3>1. Modo de Jogo</h3>
          <ModeGrid>
            {Object.entries(APP_DATA.challengeModes).map(([key, value]) => {
              const votes = getVoteCount("gameMode", key);
              return (
                <ModeCard
                  key={key}
                  style={{ position: "relative" }}
                  $selected={myCurrentModeVote === key}
                  onClick={() => handleVote("gameMode", key)}
                >
                  <strong style={{ fontSize: "1.2rem" }}>{value.label}</strong>
                  <span className="desc">{value.desc}</span>
                  {votes > 0 && <VoteBadge>{votes}</VoteBadge>}
                </ModeCard>
              );
            })}
          </ModeGrid>
        </Section>
      )}

      <Section>
        <h3>{mode === "challenge" ? "2. Tema" : "1. Tema"}</h3>
        <OptionsGrid>
          {availableThemes.map((theme) => (
            <OptionButton
              key={theme}
              style={{ position: "relative" }}
              $selected={myCurrentThemeVote === theme}
              onClick={() => handleVote("theme", theme)}
            >
              {theme}{" "}
              {getVoteCount("theme", theme) > 0 && (
                <VoteBadge>{getVoteCount("theme", theme)}</VoteBadge>
              )}
            </OptionButton>
          ))}
          <OptionButton
            style={{ position: "relative" }}
            $selected={myCurrentThemeVote === "Aleatório"}
            onClick={() => handleVote("theme", "Aleatório")}
          >
            Aleatório{" "}
            {getVoteCount("theme", "Aleatório") > 0 && (
              <VoteBadge>{getVoteCount("theme", "Aleatório")}</VoteBadge>
            )}
          </OptionButton>
        </OptionsGrid>
      </Section>

      <Section>
        <h3>{mode === "challenge" ? "3. Dificuldade" : "2. Dificuldade"}</h3>
        <OptionsGrid>
          {Object.entries(APP_DATA.difficulties).map(([key, value]) => (
            <OptionButton
              key={key}
              style={{ position: "relative" }}
              $selected={myCurrentDiffVote === key}
              onClick={() => handleVote("diff", key)}
            >
              {value.label}
              <span
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#bdc3c7",
                  marginTop: "5px",
                }}
              >
                +{value.xpReward} XP
              </span>
              {getVoteCount("diff", key) > 0 && (
                <VoteBadge>{getVoteCount("diff", key)}</VoteBadge>
              )}
            </OptionButton>
          ))}
        </OptionsGrid>
      </Section>

      <div
        style={{
          width: "100%",
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handleAbandon}
          style={{
            padding: "20px",
            borderRadius: "12px",
            border: "none",
            background: "#e74c3c",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Abandonar Sala
        </button>
        {mode === "solo" && (
          <StartButton
            disabled={!selectedTheme || !selectedDifficulty}
            onClick={() => apurarVotos()}
          >
            Iniciar Partida
          </StartButton>
        )}
      </div>
    </SetupContainer>
  );
}

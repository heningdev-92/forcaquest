import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { auth, db } from "../../services/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
  orderBy,
  limit,
} from "firebase/firestore"; // <--- getDocs adicionado aqui!
import {
  LobbyContainer,
  Header,
  UserInfo,
  ActionButton,
  MainContent,
  ChatSection,
  ChatMessages,
  MessageBubble,
  ChatInputArea,
  PlayersSection,
  PlayerCard,
  ModalOverlay,
  ModalContent,
  RoomHeader,
  ChallengeBoard,
  RankList,
  RankItem,
} from "./styles";

export function Lobby() {
  const { user, changeUserStatus } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlRoomId = searchParams.get("room");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [onlinePlayers, setOnlinePlayers] = useState([]);

  const [currentRoom, setCurrentRoom] = useState({
    id: "global",
    name: "Lobby Global",
    ownerId: null,
  });
  const [modalType, setModalType] = useState(null);
  const [roomForm, setRoomForm] = useState({ name: "", password: "", id: "" });
  const [betAmount, setBetAmount] = useState(50);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [idCopied, setIdCopied] = useState(false);
  const messagesEndRef = useRef(null);

  const [topPlayers, setTopPlayers] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(false);

  useEffect(() => {
    if (urlRoomId && urlRoomId !== "global") {
      const restoreRoom = async () => {
        try {
          const snap = await getDoc(doc(db, "rooms", urlRoomId));
          if (snap.exists()) {
            const data = snap.data();
            setCurrentRoom({
              id: snap.id,
              name: data.name,
              ownerId: data.ownerId,
            });
          } else {
            navigate("/lobby?room=global");
          }
        } catch (error) {
          console.error("Erro ao restaurar sala:", error);
        }
      };
      restoreRoom();
    } else {
      setCurrentRoom({ id: "global", name: "Lobby Global", ownerId: null });
    }
  }, [urlRoomId, navigate]);

  useEffect(() => {
    if (user && currentRoom.id) {
      updateDoc(doc(db, "users", user.uid), {
        currentRoomId: currentRoom.id,
      }).catch(console.error);
    }
  }, [currentRoom.id, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) setUserProfile(docSnap.data());
    });
    return () => unsubscribeProfile();
  }, [user]);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      where("roomId", "==", currentRoom.id),
    );
    const unsubscribeChat = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = [];
      snapshot.forEach((document) =>
        fetchedMessages.push({ id: document.id, ...document.data() }),
      );
      fetchedMessages.sort(
        (a, b) =>
          (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0),
      );
      setMessages(fetchedMessages);
    });
    return () => unsubscribeChat();
  }, [currentRoom.id]);

  useEffect(() => {
    if (!user) return;
    const playersQuery = query(
      collection(db, "users"),
      where("status", "in", ["available", "in_game"]),
    );
    const unsubscribePlayers = onSnapshot(playersQuery, (snapshot) => {
      const fetchedPlayers = [];
      snapshot.forEach((document) => {
        if (document.id !== user.uid)
          fetchedPlayers.push({ id: document.id, ...document.data() });
      });
      setOnlinePlayers(fetchedPlayers);
    });
    return () => unsubscribePlayers();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const invitesQuery = query(
      collection(db, "invites"),
      where("to", "==", user.uid),
    );
    const unsubscribeInvites = onSnapshot(invitesQuery, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const invite = change.doc.data();
          const accept = window.confirm(
            `📩 Convite: ${invite.fromName} te convidou para a sala "${invite.roomName}". Deseja entrar?`,
          );
          if (accept) navigate(`/lobby?room=${invite.roomId}`);
          await deleteDoc(doc(db, "invites", change.doc.id));
        }
      });
    });
    return () => unsubscribeInvites();
  }, [user, navigate]);

  useEffect(() => {
    if (currentRoom.id === "global") {
      setActiveChallenge(null);
      return;
    }
    const challengeQuery = query(
      collection(db, "challenges"),
      where("roomId", "==", currentRoom.id),
      where("status", "in", ["waiting", "voting"]),
    );
    const unsubscribeChallenge = onSnapshot(challengeQuery, (snapshot) => {
      if (!snapshot.empty)
        setActiveChallenge({
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        });
      else setActiveChallenge(null);
    });
    return () => unsubscribeChallenge();
  }, [currentRoom.id]);

  useEffect(() => {
    if (
      activeChallenge?.status === "voting" &&
      activeChallenge?.acceptedPlayers?.includes(user?.uid)
    ) {
      navigate(
        `/setup?mode=challenge&room=${currentRoom.id}&challenge=${activeChallenge.id}`,
      );
    }
  }, [activeChallenge, navigate, user, currentRoom.id]);

  useEffect(() => {
    if (modalType === "ranking") {
      const fetchRanking = async () => {
        setLoadingRanking(true);
        try {
          const rankingQuery = query(
            collection(db, "users"),
            orderBy("points", "desc"),
            limit(50),
          );
          const snapshot = await getDocs(rankingQuery);
          setTopPlayers(snapshot.docs.map((doc) => doc.data()));
        } catch (error) {
          console.error("Erro ao buscar ranking:", error);
        } finally {
          setLoadingRanking(false);
        }
      };
      fetchRanking();
    }
  }, [modalType]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentRoom.id);
    setIdCopied(true);
    setTimeout(() => setIdCopied(false), 2000);
  };

  const handleProposeChallenge = async () => {
    if (userProfile.points < betAmount)
      return alert("Você não tem pontos suficientes.");
    try {
      await updateDoc(doc(db, "users", user.uid), {
        points: userProfile.points - betAmount,
      });
      await addDoc(collection(db, "challenges"), {
        roomId: currentRoom.id,
        leaderId: user.uid,
        entryFee: Number(betAmount),
        pot: Number(betAmount),
        status: "waiting",
        acceptedPlayers: [user.uid],
        createdAt: serverTimestamp(),
      });
      setModalType(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptChallenge = async () => {
    if (userProfile.points < activeChallenge.entryFee)
      return alert("Saldo insuficiente.");
    try {
      await updateDoc(doc(db, "users", user.uid), {
        points: userProfile.points - activeChallenge.entryFee,
      });
      await updateDoc(doc(db, "challenges", activeChallenge.id), {
        pot: activeChallenge.pot + activeChallenge.entryFee,
        acceptedPlayers: arrayUnion(user.uid),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartVoting = async () => {
    if (activeChallenge.acceptedPlayers.length < 2)
      return alert("É necessário mais um jogador!");
    try {
      await updateDoc(doc(db, "challenges", activeChallenge.id), {
        status: "voting",
        endTime: Date.now() + 30000,
        votes: {},
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomForm.name) return;
    try {
      const newRoomRef = await addDoc(collection(db, "rooms"), {
        name: roomForm.name,
        password: roomForm.password || "",
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
      navigate(`/lobby?room=${newRoomRef.id}`);
      setModalType(null);
      setRoomForm({ name: "", password: "", id: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomForm.id) return;
    try {
      const roomSnap = await getDoc(doc(db, "rooms", roomForm.id));
      if (!roomSnap.exists()) return alert("Sala não encontrada!");
      if (
        roomSnap.data().password &&
        roomSnap.data().password !== roomForm.password
      )
        return alert("Senha incorreta!");
      navigate(`/lobby?room=${roomSnap.id}`);
      setModalType(null);
      setRoomForm({ name: "", password: "", id: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleInvitePlayer = async (playerId) => {
    if (currentRoom.id === "global") return;
    try {
      await addDoc(collection(db, "invites"), {
        to: playerId,
        fromName: userProfile?.username || "Um jogador",
        roomId: currentRoom.id,
        roomName: currentRoom.name,
        ownerId: currentRoom.ownerId,
        createdAt: serverTimestamp(),
      });
      alert("Convite enviado!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        uid: user.uid,
        username: userProfile?.username || "Desconhecido",
        roomId: currentRoom.id,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    if (user) await changeUserStatus(user.uid, "offline");
    signOut(auth);
  };

  const playersInRoom = onlinePlayers.filter(
    (p) => p.currentRoomId === currentRoom.id,
  );
  const playersInGlobal = onlinePlayers.filter(
    (p) => p.currentRoomId !== currentRoom.id,
  );

  return (
    <LobbyContainer>
      <Header>
        <UserInfo>
          <div className="avatar"></div>
          <div className="details">
            <h3>{userProfile ? userProfile.username : "Carregando..."}</h3>
            <p>
              {userProfile
                ? `Nível ${userProfile.level} | ${userProfile.points} Pontos`
                : "..."}
            </p>
          </div>
        </UserInfo>
        <div style={{ display: "flex", gap: "10px" }}>
          <ActionButton
            onClick={() => setModalType("ranking")}
            style={{ backgroundColor: "#f39c12" }}
          >
            🏆 Ranking
          </ActionButton>
          <ActionButton
            $primary
            onClick={() => navigate(`/setup?mode=solo&room=${currentRoom.id}`)}
          >
            Jogar Solo
          </ActionButton>
          <ActionButton onClick={handleLogout}>Sair</ActionButton>
        </div>
      </Header>

      <MainContent>
        <ChatSection>
          <RoomHeader>
            <h4>{currentRoom.name}</h4>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {currentRoom.id !== "global" && (
                <>
                  <div
                    className="id-badge"
                    onClick={handleCopyId}
                    title="Clique para copiar"
                  >
                    ID: {currentRoom.id} {idCopied ? "✅" : "📋"}
                  </div>
                  {currentRoom.ownerId === user.uid && !activeChallenge && (
                    <ActionButton
                      $primary
                      onClick={() => setModalType("bet")}
                      style={{ padding: "5px 10px", fontSize: "0.8rem" }}
                    >
                      ⚔️ Iniciar Desafio
                    </ActionButton>
                  )}
                  <ActionButton
                    onClick={() => navigate("/lobby?room=global")}
                    style={{ padding: "5px 10px", fontSize: "0.8rem" }}
                  >
                    Sair da Sala
                  </ActionButton>
                </>
              )}
              {currentRoom.id === "global" && (
                <>
                  <ActionButton
                    onClick={() => setModalType("create")}
                    $primary
                    style={{ padding: "5px 10px", fontSize: "0.8rem" }}
                  >
                    + Criar Sala
                  </ActionButton>
                  <ActionButton
                    onClick={() => setModalType("join")}
                    style={{ padding: "5px 10px", fontSize: "0.8rem" }}
                  >
                    Entrar com ID
                  </ActionButton>
                </>
              )}
            </div>
          </RoomHeader>

          {activeChallenge && activeChallenge.status === "waiting" && (
            <ChallengeBoard>
              <div className="header">
                <h4>⚔️ Desafio em Aberto</h4>
                <div className="pot">Pote: {activeChallenge.pot} pts</div>
              </div>
              <div className="players">
                Taxa de Entrada: <strong>{activeChallenge.entryFee} pts</strong>{" "}
                <br />
                Jogadores Confirmados: {activeChallenge.acceptedPlayers.length}
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {activeChallenge.leaderId === user.uid ? (
                  <ActionButton
                    $primary
                    style={{ width: "100%" }}
                    onClick={handleStartVoting}
                  >
                    Iniciar Votação
                  </ActionButton>
                ) : !activeChallenge.acceptedPlayers.includes(user.uid) ? (
                  <ActionButton
                    $primary
                    style={{ width: "100%" }}
                    onClick={handleAcceptChallenge}
                  >
                    Pagar e Entrar
                  </ActionButton>
                ) : (
                  <span
                    style={{
                      color: "#2ecc71",
                      fontWeight: "bold",
                      margin: "auto",
                    }}
                  >
                    Aguardando líder...
                  </span>
                )}
              </div>
            </ChallengeBoard>
          )}

          <ChatMessages>
            <MessageBubble>
              <strong>Sistema</strong>
              Você está em: {currentRoom.name}.{" "}
              {currentRoom.id === "global"
                ? "O chat é público."
                : "Chat privado."}
            </MessageBubble>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} $isMine={msg.uid === user?.uid}>
                <strong>{msg.username}</strong>
                {msg.text}
              </MessageBubble>
            ))}
            <div ref={messagesEndRef} />
          </ChatMessages>
          <ChatInputArea onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </ChatInputArea>
        </ChatSection>

        <PlayersSection>
          {currentRoom.id !== "global" && (
            <>
              <h3>👥 Na Sala ({playersInRoom.length + 1})</h3>
              <PlayerCard
                $status={userProfile?.status || "available"}
                style={{ borderLeftColor: "#3498db" }}
              >
                <div className="info">
                  <span className="name">{userProfile?.username} (Você)</span>
                  <span className="points">
                    Nvl {userProfile?.level} | {userProfile?.points} pts
                  </span>
                </div>
              </PlayerCard>
              {playersInRoom.map((player) => (
                <PlayerCard key={player.id} $status={player.status}>
                  <div className="info">
                    <span className="name">{player.username}</span>
                    <span className="points">
                      Nvl {player.level} | {player.points} pts
                    </span>
                  </div>
                </PlayerCard>
              ))}
            </>
          )}

          <h3>🌐 Lobby Global ({playersInGlobal.length})</h3>
          {playersInGlobal.map((player) => (
            <PlayerCard key={player.id} $status={player.status}>
              <div className="info">
                <span className="name">{player.username}</span>
                <span className="points">
                  Nvl {player.level} | {player.points} pts
                </span>
              </div>
              {player.status === "available" && currentRoom.id !== "global" && (
                <button
                  onClick={() => handleInvitePlayer(player.id)}
                  style={{ background: "#3498db" }}
                >
                  Convidar
                </button>
              )}
            </PlayerCard>
          ))}
        </PlayersSection>
      </MainContent>

      {/* MODAL DE RANKING */}
      {modalType === "ranking" && (
        <ModalOverlay>
          <ModalContent style={{ maxWidth: "500px" }}>
            <h3 style={{ fontSize: "1.5rem", margin: 0 }}>🏆 Hall da Fama</h3>

            {loadingRanking ? (
              <p style={{ textAlign: "center", margin: "20px 0" }}>
                Buscando as lendas...
              </p>
            ) : (
              <RankList>
                {topPlayers.map((player, index) => {
                  const position = index + 1;
                  const isTop3 = position <= 3;
                  return (
                    <RankItem key={player.uid} $pos={position} $isTop3={isTop3}>
                      <div className="position-name">
                        <span className="pos">
                          {position === 1
                            ? "🥇"
                            : position === 2
                              ? "🥈"
                              : position === 3
                                ? "🥉"
                                : `${position}º`}
                        </span>
                        <span className="name">{player.username}</span>
                      </div>
                      <div className="stats">
                        <div className="points">{player.points} pts</div>
                        <div className="level">Nível {player.level}</div>
                      </div>
                    </RankItem>
                  );
                })}
                {topPlayers.length === 0 && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#bdc3c7",
                      padding: "20px",
                    }}
                  >
                    Nenhum jogador pontuou ainda.
                  </p>
                )}
              </RankList>
            )}

            <div className="buttons">
              <ActionButton
                $primary
                style={{ width: "100%" }}
                onClick={() => setModalType(null)}
              >
                Fechar
              </ActionButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Outros modais existentes */}
      {modalType === "bet" && (
        <ModalOverlay>
          <ModalContent>
            <h3>Definir Aposta</h3>
            <input
              type="number"
              min="10"
              placeholder="Valor em Pontos"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />
            <div className="buttons">
              <ActionButton onClick={() => setModalType(null)}>
                Cancelar
              </ActionButton>
              <ActionButton $primary onClick={handleProposeChallenge}>
                Propor Desafio
              </ActionButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {modalType === "create" && (
        <ModalOverlay>
          <ModalContent>
            <h3>Criar Sala Privada</h3>
            <input
              placeholder="Nome da Sala"
              value={roomForm.name}
              onChange={(e) =>
                setRoomForm({ ...roomForm, name: e.target.value })
              }
            />
            <input
              placeholder="Senha (Opcional)"
              type="password"
              value={roomForm.password}
              onChange={(e) =>
                setRoomForm({ ...roomForm, password: e.target.value })
              }
            />
            <div className="buttons">
              <ActionButton onClick={() => setModalType(null)}>
                Cancelar
              </ActionButton>
              <ActionButton $primary onClick={handleCreateRoom}>
                Criar
              </ActionButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {modalType === "join" && (
        <ModalOverlay>
          <ModalContent>
            <h3>Entrar em Sala</h3>
            <input
              placeholder="ID da Sala"
              value={roomForm.id}
              onChange={(e) => setRoomForm({ ...roomForm, id: e.target.value })}
            />
            <input
              placeholder="Senha (se houver)"
              type="password"
              value={roomForm.password}
              onChange={(e) =>
                setRoomForm({ ...roomForm, password: e.target.value })
              }
            />
            <div className="buttons">
              <ActionButton onClick={() => setModalType(null)}>
                Cancelar
              </ActionButton>
              <ActionButton $primary onClick={handleJoinRoom}>
                Entrar
              </ActionButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </LobbyContainer>
  );
}

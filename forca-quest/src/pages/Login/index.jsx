import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { auth, db } from "../../services/firebase";
import { signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { APP_DATA } from "../../data/data";
import {
  LoginContainer,
  Title,
  Subtitle,
  Form,
  Input,
  Button,
  Divider,
} from "./styles";

export function Login() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/lobby" />;
  }

  const createUserProfile = async (user, displayName) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        username: displayName,
        avatarId: APP_DATA.avatars[0].id,
        level: 1,
        xp: 0,
        points: 100,
        status: "available",
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password)
      return alert("Preencha todos os campos de e-mail e senha!");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      alert("Erro na autenticação: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async (e) => {
    e.preventDefault();
    if (guestName.trim() === "") {
      return alert("Por favor, digite um apelido para jogar como convidado!");
    }
    setLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      await createUserProfile(userCredential.user, guestName.trim());
    } catch (error) {
      console.error(error);
      alert("Erro ao entrar como convidado: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Title>{APP_DATA.gameName}</Title>
      <Subtitle>Entre para desafiar e jogar!</Subtitle>

      <Form onSubmit={handleEmailAuth}>
        <Input
          type="email"
          placeholder="Seu E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Sua Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Carregando..." : "Entrar"}
        </Button>

        <p
          style={{
            textAlign: "center",
            cursor: "pointer",
            fontSize: "0.9rem",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/register")}
        >
          Não tem conta? Registre-se aqui.
        </p>
      </Form>

      <Divider>
        <span>OU</span>
      </Divider>

      <Form onSubmit={handleAnonymousLogin} style={{ gap: "10px" }}>
        <Input
          type="text"
          placeholder="Digite seu Apelido"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          maxLength={15}
        />
        <Button type="submit" $secondary disabled={loading}>
          Jogar como Convidado
        </Button>
      </Form>
    </LoginContainer>
  );
}

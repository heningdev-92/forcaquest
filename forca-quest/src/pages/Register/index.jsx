import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { auth, db } from "../../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { APP_DATA } from "../../data/data";
// Importamos os estilos já existentes da tela de Login para manter a consistência visual
import {
  LoginContainer,
  Title,
  Subtitle,
  Form,
  Input,
  Button,
} from "../Login/styles";

export function Register() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // Redireciona automaticamente se já estiver logado
  if (user) {
    return <Navigate to="/lobby" />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      return alert("Preencha todos os campos (E-mail, Senha e Apelido)!");
    }
    setLoading(true);

    try {
      // 1. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const newUser = userCredential.user;

      // 2. Cria o perfil no Firestore
      const userRef = doc(db, "users", newUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: newUser.uid,
          username: username.trim(),
          avatarId: APP_DATA.avatars[0].id,
          level: 1,
          xp: 0,
          points: 100, // Saldo inicial
          status: "available",
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao criar conta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Title>{APP_DATA.gameName}</Title>
      <Subtitle>Crie sua conta para salvar seu progresso!</Subtitle>

      <Form onSubmit={handleRegister}>
        <Input
          type="text"
          placeholder="Seu Apelido (Username)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={15}
        />
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
          {loading ? "Criando Conta..." : "Cadastrar"}
        </Button>

        <p
          style={{
            textAlign: "center",
            cursor: "pointer",
            fontSize: "0.9rem",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/login")}
        >
          Já tem uma conta? Faça Login aqui.
        </p>
      </Form>
    </LoginContainer>
  );
}

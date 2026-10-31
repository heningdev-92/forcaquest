import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { ActionButton } from "../Lobby/styles";
import {
  AdminContainer,
  AdminPanel,
  FormRow,
  BulkArea,
  WordTable,
} from "./styles";

export function Admin() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wordsList, setWordsList] = useState([]);

  // Form Unitário
  const [word, setWord] = useState("");
  const [theme, setTheme] = useState("");
  const [hint, setHint] = useState("");
  const [category, setCategory] = useState("STANDARD");

  // Form em Massa
  const [bulkText, setBulkText] = useState("");

  // 1. Verificação de Segurança
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return navigate("/login");
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists() && snap.data().isAdmin === true) {
        setIsAdmin(true);
        fetchWords();
      } else {
        alert("Acesso Negado.");
        navigate("/lobby");
      }
      setLoading(false);
    };
    checkAdmin();
  }, [user, navigate]);

  // 2. Busca Palavras
  const fetchWords = async () => {
    try {
      const snap = await getDocs(collection(db, "words"));
      const fetched = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setWordsList(fetched);
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Adicionar Uma Palavra
  const handleAddWord = async () => {
    if (!word || !theme || !hint) return alert("Preencha todos os campos.");
    try {
      await addDoc(collection(db, "words"), {
        word: word.toUpperCase().trim(),
        theme: theme.trim(),
        hint: hint.trim(),
        category,
      });
      setWord("");
      setHint("");
      fetchWords();
      alert("Palavra adicionada!");
    } catch (error) {
      console.error(error);
    }
  };

  // 4. Adicionar em Massa
  const handleBulkAdd = async () => {
    if (!bulkText) return;
    const lines = bulkText.split("\n");
    let count = 0;

    for (let line of lines) {
      if (!line.trim()) continue;
      // Formato esperado: PALAVRA | Tema | Dica longa | CATEGORIA
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length >= 3) {
        try {
          await addDoc(collection(db, "words"), {
            word: parts[0].toUpperCase(),
            theme: parts[1],
            hint: parts[2],
            category: parts[3] === "HARD" ? "HARD" : "STANDARD",
          });
          count++;
        } catch (e) {
          console.error("Erro na linha:", line, e);
        }
      }
    }
    setBulkText("");
    fetchWords();
    alert(`${count} palavras adicionadas com sucesso!`);
  };

  // 5. Deletar Palavra
  const handleDelete = async (id) => {
    if (!window.confirm("Certeza que deseja excluir?")) return;
    try {
      await deleteDoc(doc(db, "words", id));
      fetchWords();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <AdminContainer>
        <h2>Verificando credenciais...</h2>
      </AdminContainer>
    );
  if (!isAdmin) return null;

  return (
    <AdminContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#ecf0f1" }}>🛠️ Painel Admin</h2>
        <ActionButton
          onClick={() => navigate("/lobby")}
          style={{ backgroundColor: "#95a5a6" }}
        >
          Voltar ao Lobby
        </ActionButton>
      </div>

      <AdminPanel>
        <h3>Adicionar Palavra Individual</h3>
        <FormRow>
          <input
            placeholder="PALAVRA (ex: ORNITORRINCO)"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <input
            placeholder="Tema (ex: Animais)"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="STANDARD">Fácil / Médio (STANDARD)</option>
            <option value="HARD">Difícil (HARD)</option>
          </select>
        </FormRow>
        <FormRow>
          <input
            placeholder="Dica longa detalhada..."
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            style={{ flex: 3 }}
          />
          <ActionButton $primary onClick={handleAddWord}>
            Salvar Palavra
          </ActionButton>
        </FormRow>
      </AdminPanel>

      <AdminPanel>
        <h3>Adicionar em Massa</h3>
        <p
          style={{ fontSize: "0.8rem", color: "#bdc3c7", marginBottom: "10px" }}
        >
          Formato: <strong>PALAVRA | Tema | Dica detalhada | CATEGORIA</strong>{" "}
          (uma por linha).
        </p>
        <BulkArea
          placeholder="Exemplo:&#10;GIRAFA | Animais | Mamífero africano com pescoço muito longo | STANDARD&#10;QUANTICA | Física | Ramo que estuda sistemas atômicos | HARD"
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
        />
        <ActionButton $primary onClick={handleBulkAdd}>
          Processar Lote
        </ActionButton>
      </AdminPanel>

      <AdminPanel>
        <h3>Dicionário Atual ({wordsList.length} palavras)</h3>
        <WordTable>
          <thead>
            <tr>
              <th>Palavra</th>
              <th>Tema</th>
              <th>Categoria</th>
              <th>Dica</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {wordsList.map((w) => (
              <tr key={w.id}>
                <td>
                  <strong>{w.word}</strong>
                </td>
                <td>{w.theme}</td>
                <td>{w.category || "STANDARD"}</td>
                <td style={{ fontSize: "0.8rem", color: "#bdc3c7" }}>
                  {w.hint}
                </td>
                <td>
                  <button
                    className="del-btn"
                    onClick={() => handleDelete(w.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </WordTable>
      </AdminPanel>
    </AdminContainer>
  );
}

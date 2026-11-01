import { useContext } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Overlay,
  ModalContent,
  CloseBtn,
  StatsArea,
  AvatarGrid,
  AvatarOption,
} from "./styles";

const AVATAR_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
]; // IDs dos avatares disponíveis

export function ProfileModal({
  isOpen,
  onClose,
  currentAvatar,
  onUpdateAvatar,
  userProfile, // <--- Propriedade recebida para preencher as estatísticas
}) {
  const { user } = useContext(AuthContext);

  if (!isOpen || !user) return null;

  const handleSelectAvatar = async (id) => {
    // 1. Atualiza a interface instantaneamente (borda verde e imagem no Header)
    onUpdateAvatar(id);

    // 2. Salva silenciosamente no banco de dados
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { avatar: id });
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>X</CloseBtn>

        <h2 style={{ margin: 0 }}>Perfil</h2>

        {/* ÁREA DE STATS COMPLETADA */}
        <StatsArea>
          <div>
            <strong>{userProfile?.level || 1}</strong>
            <span>Nível</span>
          </div>
          <div>
            <strong>{userProfile?.xp || 0}</strong>
            <span>XP</span>
          </div>
          <div>
            <strong>{userProfile?.points || 0}</strong>
            <span>Pontos</span>
          </div>
        </StatsArea>

        <div>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
            Escolha seu Avatar
          </h3>
          <AvatarGrid>
            {AVATAR_IDS.map((id) => (
              <AvatarOption
                key={id}
                src={`/assets/avatars/${id}.jpg`}
                alt={`Avatar ${id}`}
                $selected={currentAvatar === id} // Usa o estado atualizado
                onClick={() => handleSelectAvatar(id)}
              />
            ))}
          </AvatarGrid>
        </div>
      </ModalContent>
    </Overlay>
  );
}

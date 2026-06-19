import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { auth, db } from "../firebase/Config";

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  let fechaConvertida;
  if (fecha.toDate) {
    fechaConvertida = fecha.toDate();
  } else {
    fechaConvertida = new Date(fecha);
  }

  return fechaConvertida.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Post({ item, navigation }) {
  let emailUsuario = auth.currentUser ? auth.currentUser.email : "";
  let likes = item.data.likes ? item.data.likes : [];
  let estaLikeado = likes.includes(emailUsuario);

  let imageUri =
    item.data.imageUrl &&
    (item.data.imageUrl.startsWith("http") || item.data.imageUrl.startsWith("data:"))
      ? item.data.imageUrl
      : `data:image/jpeg;base64,${item.data.imageUrl}`;

  function likePost() {
    if (likes.includes(emailUsuario)) {
      db.collection("posts")
        .doc(item.id)
        .update({
          likes: likes.filter((email) => email !== emailUsuario),
        });
    } else {
      db.collection("posts")
        .doc(item.id)
        .update({
          likes: likes.concat(emailUsuario),
        });
    }
  }

  return (
    <Pressable
      style={styles.post}
      onPress={() => navigation.navigate("PostDetail", { post: item })}
    >
      <Pressable
        style={styles.ownerRow}
        onPress={() =>
          navigation.navigate("UserProfile", { email: item.data.owner })
        }
      >
        {item.user && item.user.profilePic ? (
          <Image source={{ uri: item.user.profilePic }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetter}>
              {item.user && item.user.userName ? item.user.userName[0].toUpperCase() : "?"}
            </Text>
          </View>
        )}
        <Text style={styles.owner}>
          {item.user ? item.user.userName : item.data.owner}
        </Text>
      </Pressable>

      <Text style={styles.date}>{formatearFecha(item.data.createdAt)}</Text>
      <Text style={styles.description}>{item.data.description}</Text>

      {item.data.imageUrl ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : null}

      <Text style={styles.likes}>{likes.length} likes</Text>

      <View style={styles.actions}>
        <Pressable
          onPress={() => likePost()}
          style={estaLikeado ? styles.buttonFilled : styles.buttonOutline}
        >
          <Text style={estaLikeado ? styles.buttonTextFilled : styles.buttonTextOutline}>
            {estaLikeado ? "Me gusta ✓" : "Me gusta"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("ComentarPosteo", { postId: item.id })}
          style={styles.buttonOutline}
        >
          <Text style={styles.buttonTextOutline}>Comentar</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  post: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ddd",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
  },
  owner: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
  },
  date: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#111",
    lineHeight: 22,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 12,
    resizeMode: "contain",
  },
  likes: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  buttonOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonFilled: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonTextOutline: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },
  buttonTextFilled: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});

export default Post;

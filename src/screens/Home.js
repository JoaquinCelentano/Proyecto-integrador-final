import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image } from "react-native";
import { auth, db } from "../firebase/Config";

function Home({ navigation }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((docs) => {
        let posteos = [];

        docs.forEach((doc) => {
          posteos.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setPosts(posteos);
      });

    return () => unsubscribe();
  }, []);

  function likePost(post) {
    let emailUsuario = auth.currentUser.email;
    let likes = post.data.likes ? post.data.likes : [];

    if (likes.includes(emailUsuario)) {
      db.collection("posts")
        .doc(post.id)
        .update({
          likes: likes.filter((email) => email !== emailUsuario),
        });
    } else {
      db.collection("posts")
        .doc(post.id)
        .update({
          likes: likes.concat(emailUsuario),
        });
    }
  }

  function formatearFecha(fecha) {
  if (!fecha) {
    return "Sin fecha";
  }

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
  function renderPost({ item }) {
    let emailUsuario = auth.currentUser.email;
    let likes = item.data.likes ? item.data.likes : [];
    let estaLikeado = likes.includes(emailUsuario);

    return (
      <Pressable
        style={styles.post}
        onPress={() => navigation.navigate("PostDetail", { post: item })}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("UserProfile", { email: item.data.owner })
          }
        >
          <Text style={styles.owner}>{item.data.owner}</Text>
          
        </Pressable>
        <Text style={styles.date}>
          {formatearFecha(item.data.createdAt)}
        </Text>
        <Text style={styles.description}>{item.data.description}</Text>

        {item.data.imageUrl ? (
          <Image source={{ uri: item.data.imageUrl }} style={styles.image} />
        ) : null}

        <Text style={styles.likes}>{likes.length} likes</Text>

        <View style={styles.actions}>
          <Pressable
            onPress={() => likePost(item)}
            style={estaLikeado ? styles.buttonFilled : styles.buttonOutline}
          >
            <Text
              style={
                estaLikeado
                  ? styles.buttonTextFilled
                  : styles.buttonTextOutline
              }
            >
              {estaLikeado ? "Me gusta ✓" : "Me gusta"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate("ComentarPosteo", { postId: item.id })
            }
            style={styles.buttonOutline}
          >
            <Text style={styles.buttonTextOutline}>Comentar</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/DHboxd.png")}
        style={styles.logo}
      />

      {posts.length === 0 ? (
        <Text style={styles.empty}>No hay posteos todavía.</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    width: 220,
    height: 90,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 60,
    fontSize: 15,
  },
  post: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  owner: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    marginBottom: 6,
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
  date: {
  fontSize: 12,
  color: "#aaa",
  marginBottom: 8,
},
});

export default Home;
import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image } from "react-native";
import { auth, db } from "../firebase/Config";

function Home({ navigation }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((docs) => {
        let posteos = [];
        docs.forEach((doc) => {
          posteos.push({ id: doc.id, data: doc.data() });
        });
        setPosts(posteos);
      });
  }, []);

  function likePost(post) {
    let emailUsuario = auth.currentUser.email;
    let likes = post.data.likes;
    if (likes.includes(emailUsuario)) {
      db.collection("posts").doc(post.id).update({
        likes: likes.filter((email) => email !== emailUsuario)
      });
    } else {
      db.collection("posts").doc(post.id).update({
        likes: likes.concat(emailUsuario)
      });
    }
  }

  function renderPost({ item }) {
    let emailUsuario = auth.currentUser.email;
    let estaLikeado = item.data.likes.includes(emailUsuario);

    return (
      <Pressable
        style={styles.post}
        onPress={() => navigation.navigate('PostDetail', { post: item })}
      >
        <Text style={styles.owner}>{item.data.owner}</Text>
        <Text style={styles.description}>{item.data.description}</Text>
        {item.data.imageUrl ? (
          <Image source={{ uri: item.data.imageUrl }} style={styles.image} />
        ) : null}
        <Text style={styles.likes}>{item.data.likes.length} likes</Text>
        <View style={styles.actions}>
          <Pressable
            onPress={() => likePost(item)}
            style={estaLikeado ? styles.buttonFilled : styles.buttonOutline}
          >
            <Text style={estaLikeado ? styles.buttonTextFilled : styles.buttonTextOutline}>
              {estaLikeado ? "Me gusta ✓" : "Me gusta"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('ComentarPosteo', { postId: item.id })}
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
      <Text style={styles.title}>DHboxd</Text>
      {posts.length === 0 ? (
        <Text style={styles.empty}>No hay posteos todavía.</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          style={{ width: '100%', flex: 1 }}
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
});

export default Home;

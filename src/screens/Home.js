import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { db } from "../firebase/Config";
import Post from "../components/Post";

function Home({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    db.collection("users")
      .onSnapshot((docs) => {
        let usersLista = [];

        docs.forEach((doc) => {
          usersLista.push(doc.data());
        });

        setUsers(usersLista);
      });
  }, []);

  useEffect(() => {
    db.collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((docs) => {
        let posteos = [];

        docs.forEach((doc) => {
          let user = users.find((user) => user.email === doc.data().owner);

          posteos.push({
            id: doc.id,
            data: doc.data(),
            user: user,
          });
        });

        setPosts(posteos);
      });
  }, [users]);

  function renderPost({ item }) {
    return <Post item={item} navigation={navigation} />;
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
});

export default Home;
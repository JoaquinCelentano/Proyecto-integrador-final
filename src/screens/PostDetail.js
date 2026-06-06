import { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { db } from "../firebase/Config";

function PostDetail({ route }) {
    const post = route.params.post;
    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
        db.collection('comments')
            .where('postId', '==', post.id)
            .onSnapshot(docs => {
                let lista = [];
                docs.forEach(doc => {
                    lista.push({ id: doc.id, data: doc.data() });
                });
                setComentarios(lista);
            });
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.owner}>{post.data.owner}</Text>
                <Text style={styles.description}>{post.data.description}</Text>
                {post.data.imageUrl ? (
                    <Image source={{ uri: post.data.imageUrl }} style={styles.image} />
                ) : null}
                <Text style={styles.likes}>{post.data.likes.length} likes</Text>
                <Text style={styles.subtitle}>Comentarios</Text>
            </View>
            {comentarios.length === 0 ? (
                <Text style={styles.empty}>Sé el primero en comentar.</Text>
            ) : (
                <FlatList
                    data={comentarios}
                    keyExtractor={item => item.id}
                    style={{ width: '100%', flex: 1 }}
                    renderItem={({ item }) => (
                        <View style={styles.comentario}>
                            <Text style={styles.comentarioOwner}>{item.data.owner}</Text>
                            <Text style={styles.comentarioText}>{item.data.text}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    owner: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
        paddingHorizontal: 20,
        marginBottom: 6,
    },
    description: {
        fontSize: 16,
        color: '#111',
        lineHeight: 24,
        paddingHorizontal: 20,
        marginBottom: 14,
    },
    image: {
        width: '100%',
        height: 400,
        marginBottom: 14,
        resizeMode: 'contain',
        backgroundColor: '#fafafa',
    },
    likes: {
        fontSize: 13,
        color: '#888',
        paddingHorizontal: 20,
        marginBottom: 18,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111',
        paddingHorizontal: 20,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    empty: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 40,
    },
    comentario: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    comentarioOwner: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
        marginBottom: 4,
    },
    comentarioText: {
        fontSize: 15,
        color: '#111',
    },
});

export default PostDetail;

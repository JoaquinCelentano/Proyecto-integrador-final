import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { auth, db } from "../firebase/Config";

function ComentarPosteo({ route }) {
    const postId = route.params.postId;
    const [comentario, setComentario] = useState("");
    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
        db.collection('comments')
            .where('postId', '==', postId)
            .onSnapshot(docs => {
                let lista = [];
                docs.forEach(doc => {
                    lista.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                setComentarios(lista);
            });
    }, []);

    function agregarComentario() {
        if (comentario === "") return;

        db.collection('comments').add({
            postId: postId,
            text: comentario,
            owner: auth.currentUser.email,
            createdAt: Date.now(),
        })
        .then(() => {
            setComentario("");
        })
        .catch(e => console.log(e));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Comentarios</Text>

            <FlatList
                data={comentarios}
                keyExtractor={item => item.id}
                style={{ width: '100%', flex: 1 }}
                renderItem={({ item }) => (
                    <View style={styles.comentario}>
                        <Text style={styles.owner}>{item.data.owner}</Text>
                        <Text style={styles.text}>{item.data.text}</Text>
                    </View>
                )}
            />

            <TextInput
                style={styles.input}
                placeholder="Escribí un comentario..."
                value={comentario}
                onChangeText={text => setComentario(text)}
            />

            <Pressable style={styles.button} onPress={() => agregarComentario()}>
                <Text style={styles.buttonText}>Comentar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
    },
    comentario: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    owner: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    text: {
        fontSize: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#222',
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default ComentarPosteo;

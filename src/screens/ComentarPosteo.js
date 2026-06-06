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
                    lista.push({ id: doc.id, data: doc.data() });
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
        .then(() => { setComentario(""); })
        .catch(e => console.log(e));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Comentarios</Text>

            <FlatList
                data={comentarios}
                keyExtractor={item => item.id}
                style={{ flex: 1, width: '100%' }}
                ListEmptyComponent={<Text style={styles.empty}>Sé el primero en comentar.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.comentario}>
                        <Text style={styles.owner}>{item.data.owner}</Text>
                        <Text style={styles.text}>{item.data.text}</Text>
                    
                    </View>
                )}
            />

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribí un comentario..."
                    value={comentario}
                    onChangeText={text => setComentario(text)}
                />
                <Pressable style={styles.sendButton} onPress={() => agregarComentario()}>
                    <Text style={styles.sendText}>→</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111',
        paddingHorizontal: 20,
        marginBottom: 12,
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
    owner: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
        marginBottom: 4,
    },
    text: {
        fontSize: 15,
        color: '#111',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        backgroundColor: '#fafafa',
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#111',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ComentarPosteo;

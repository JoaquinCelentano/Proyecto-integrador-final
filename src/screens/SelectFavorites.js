import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Image } from 'react-native';
import { auth, db } from '../firebase/Config';
import { TMDB_API_KEY, TMDB_SEARCH_URL, TMDB_IMAGE_URL } from '../tmdb/Config';

function SelectFavorites({ navigation }) {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [userDocId, setUserDocId] = useState("");

    useEffect(() => {
        db.collection('users')
            .where('email', '==', auth.currentUser.email)
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    setUserDocId(snapshot.docs[0].id);
                    setFavorites(snapshot.docs[0].data().favorites || []);
                }
            });
    }, []);

    function buscar() {
        fetch(TMDB_SEARCH_URL + "?api_key=" + TMDB_API_KEY + "&query=" + query)
            .then(res => res.json())
            .then(data => setResultados(data.results))
            .catch(error => console.log(error));
    }

    function agregarFavorito(movie) {
        if (favorites.length >= 4) {
            return;
        }
        if (favorites.filter(f => f.id === movie.id).length > 0) {
            return;
        }
        const nuevo = favorites.concat({ id: movie.id, title: movie.title, posterPath: movie.poster_path });
        setFavorites(nuevo);
        db.collection('users').doc(userDocId).update({ favorites: nuevo });
    }

    function quitarFavorito(movie) {
        const nuevo = favorites.filter(f => f.id !== movie.id);
        setFavorites(nuevo);
        db.collection('users').doc(userDocId).update({ favorites: nuevo });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>Elegí tus 4 favoritas</Text>

            <Text style={styles.sectionTitle}>4 favoritas</Text>
            {favorites.length === 0 ? (
                <Text style={styles.empty}>Elegí tus 4 favoritas</Text>
            ) : (
                <FlatList
                    data={favorites}
                    horizontal
                    keyExtractor={item => item.id.toString()}
                    style={styles.favRow}
                    renderItem={({ item }) => (
                        <View style={styles.favItem}>
                            {item.posterPath ? (
                                <Image source={{ uri: TMDB_IMAGE_URL + item.posterPath }} style={styles.favPoster} />
                            ) : (
                                <View style={styles.favPosterEmpty}>
                                    <Text style={styles.favPosterEmptyText}>{item.title}</Text>
                                </View>
                            )}
                            <Pressable style={styles.quitarButton} onPress={() => quitarFavorito(item)}>
                                <Text style={styles.quitarText}>Quitar</Text>
                            </Pressable>
                        </View>
                    )}
                />
            )}

            {favorites.length >= 4 ? (
                <Text style={styles.empty}>Ya tenés 4 favoritas.</Text>
            ) : null}

            <View style={styles.searchRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Buscar película"
                    value={query}
                    onChangeText={(text) => setQuery(text)}
                />
                <Pressable style={styles.searchButton} onPress={() => buscar()}>
                    <Text style={styles.searchButtonText}>Buscar</Text>
                </Pressable>
            </View>

            <FlatList
                data={resultados}
                keyExtractor={item => item.id.toString()}
                style={{ flex: 1, width: '100%' }}
                renderItem={({ item }) => (
                    <View style={styles.resultRow}>
                        {item.poster_path ? (
                            <Image source={{ uri: TMDB_IMAGE_URL + item.poster_path }} style={styles.resultPoster} />
                        ) : (
                            <View style={styles.resultPosterEmpty} />
                        )}
                        <Text style={styles.resultTitle}>{item.title}</Text>
                        <Pressable style={styles.agregarButton} onPress={() => agregarFavorito(item)}>
                            <Text style={styles.agregarText}>Agregar</Text>
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    appName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111',
        marginTop: 52,
        marginBottom: 24,
        letterSpacing: -0.5,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#999',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    empty: {
        color: '#bbb',
        fontSize: 14,
        marginBottom: 12,
    },
    favRow: {
        marginBottom: 16,
    },
    favItem: {
        marginRight: 12,
        alignItems: 'center',
    },
    favPoster: {
        width: 80,
        height: 120,
        borderRadius: 8,
        marginBottom: 6,
    },
    favPosterEmpty: {
        width: 80,
        height: 120,
        borderRadius: 8,
        marginBottom: 6,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    favPosterEmptyText: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
    },
    quitarButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    quitarText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111',
    },
    searchRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 14,
        fontSize: 15,
        color: '#111',
        backgroundColor: '#fafafa',
    },
    searchButton: {
        backgroundColor: '#111',
        borderRadius: 10,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    resultPoster: {
        width: 50,
        height: 75,
        borderRadius: 6,
        marginRight: 12,
    },
    resultPosterEmpty: {
        width: 50,
        height: 75,
        borderRadius: 6,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    resultTitle: {
        flex: 1,
        fontSize: 15,
        color: '#111',
    },
    agregarButton: {
        backgroundColor: '#111',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    agregarText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
});

export default SelectFavorites;

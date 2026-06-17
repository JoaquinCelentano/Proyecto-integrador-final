import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { auth, db } from '../firebase/Config';
import { TMDB_IMAGE_URL } from '../tmdb/Config';

function Profile({ navigation }) {
    const [userName, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [userDocId, setUserDocId] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        db.collection('users')
            .where('email', '==', auth.currentUser ? auth.currentUser.email : '')
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    setUserName(snapshot.docs[0].data().userName);
                    setBio(snapshot.docs[0].data().bio || '');
                    setProfilePic(snapshot.docs[0].data().profilePic || '');
                    setFavorites(snapshot.docs[0].data().favorites || []);
                    setUserDocId(snapshot.docs[0].id);
                }
            });
    }, []);

    useEffect(() => {
        db.collection('posts')
            .where('owner', '==', auth.currentUser ? auth.currentUser.email : '')
            .onSnapshot(snapshot => {
                const myPosts = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
                setPosts(myPosts);
                setLoading(false);
            });
    }, []);

    function logout() {
        auth.signOut()
            .then(() => { navigation.navigate('Login'); })
            .catch((error) => { console.log(error); });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>DHboxd</Text>

            <View style={styles.header}>
                {profilePic ? (
                    <Image source={{ uri: profilePic }} style={styles.avatarImage} />
                ) : (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {userName ? userName[0].toUpperCase() : '?'}
                        </Text>
                    </View>
                )}
                <View style={styles.headerInfo}>
                    <Text style={styles.userName}>{userName || '—'}</Text>
                    <Text style={styles.email}>{auth.currentUser ? auth.currentUser.email : ''}</Text>
                </View>
            </View>

            {bio ? <Text style={styles.bio}>{bio}</Text> : null}

            <View style={styles.editActions}>
                <Pressable style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
                    <Text style={styles.editButtonText}>Editar perfil</Text>
                </Pressable>
                <Pressable style={styles.editButton} onPress={() => navigation.navigate('SelectFavorites')}>
                    <Text style={styles.editButtonText}>Elegir favoritas</Text>
                </Pressable>
            </View>

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
                        item.posterPath ? (
                            <Image source={{ uri: TMDB_IMAGE_URL + item.posterPath }} style={styles.favPoster} />
                        ) : (
                            <View style={styles.favPosterEmpty}>
                                <Text style={styles.favPosterEmptyText}>{item.title}</Text>
                            </View>
                        )
                    )}
                />
            )}

            <Text style={styles.sectionTitle}>Mis posteos</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#111" style={{ marginTop: 20 }} />
            ) : posts.length === 0 ? (
                <Text style={styles.empty}>Todavía no publicaste nada.</Text>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={item => item.id}
                    style={{ flex: 1, width: '100%' }}
                    renderItem={({ item }) => (
                        <View style={styles.post}>
                            <Text style={styles.postText}>{item.data.description}</Text>
                            <Text style={styles.postMeta}>{item.data.likes.length} likes</Text>
                        </View>
                    )}
                />
            )}

            <Pressable style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 16,
    },
    bio: {
        fontSize: 14,
        color: '#111',
        marginBottom: 16,
    },
    editActions: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    editButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111',
    },
    favRow: {
        marginBottom: 20,
    },
    favPoster: {
        width: 80,
        height: 120,
        borderRadius: 8,
        marginRight: 12,
    },
    favPosterEmpty: {
        width: 80,
        height: 120,
        borderRadius: 8,
        marginRight: 12,
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
    avatarText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
    },
    headerInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111',
        marginBottom: 2,
    },
    email: {
        fontSize: 13,
        color: '#999',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#999',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    post: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    postText: {
        fontSize: 15,
        color: '#111',
        marginBottom: 4,
    },
    postMeta: {
        fontSize: 12,
        color: '#bbb',
    },
    empty: {
        color: '#bbb',
        fontSize: 14,
        marginTop: 20,
    },
    logoutButton: {
        paddingVertical: 16,
        alignItems: 'center',
        marginVertical: 16,
    },
    logoutText: {
        fontSize: 14,
        color: '#999',
    },
});

export default Profile;

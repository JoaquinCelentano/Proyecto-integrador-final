import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { db } from '../firebase/Config';
import { TMDB_IMAGE_URL } from '../tmdb/Config';

function UserProfile({ route }) {
    const [userName, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        db.collection('users')
            .where('email', '==', route.params.email)
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    setUserName(snapshot.docs[0].data().userName);
                    setBio(snapshot.docs[0].data().bio || '');
                    setProfilePic(snapshot.docs[0].data().profilePic || '');
                    setFavorites(snapshot.docs[0].data().favorites || []);
                }
            });
    }, []);

    useEffect(() => {
        db.collection('posts')
            .where('owner', '==', route.params.email)
            .onSnapshot(snapshot => {
                const susPosts = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
                setPosts(susPosts);
                setLoading(false);
            });
    }, []);

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
                    <Text style={styles.email}>{route.params.email}</Text>
                </View>
            </View>

            {bio ? <Text style={styles.bio}>{bio}</Text> : null}

            <Text style={styles.sectionTitle}>4 favoritas</Text>
            {favorites.length === 0 ? (
                <Text style={styles.empty}>Todavía no eligió sus 4 favoritas</Text>
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

            <Text style={styles.sectionTitle}>Sus posteos</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#111" style={{ marginTop: 20 }} />
            ) : posts.length === 0 ? (
                <Text style={styles.empty}>Todavía no publicó nada.</Text>
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
        marginBottom: 16,
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
    bio: {
        fontSize: 14,
        color: '#111',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#999',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 12,
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
        marginBottom: 12,
    },
});

export default UserProfile;

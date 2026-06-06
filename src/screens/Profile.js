import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase/Config';

function Profile({ navigation }) {
    const [userName, setUserName] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        db.collection('users')
            .where('email', '==', auth.currentUser.email)
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    setUserName(snapshot.docs[0].data().userName);
                }
            });
    }, []);

    useEffect(() => {
        db.collection('posts')
            .where('owner', '==', auth.currentUser.email)
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
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {userName ? userName[0].toUpperCase() : '?'}
                    </Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.userName}>{userName || '—'}</Text>
                    <Text style={styles.email}>{auth.currentUser.email}</Text>
                </View>
            </View>

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

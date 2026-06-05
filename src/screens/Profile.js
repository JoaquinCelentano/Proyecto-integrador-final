import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
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
            .then(() => {
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/DHboxd.png')} style={styles.logo} />
            <Text style={styles.title}>Mi Perfil</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{auth.currentUser.email}</Text>

            <Text style={styles.label}>Nombre de usuario</Text>
            <Text style={styles.value}>{userName}</Text>

            <Pressable style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
            </Pressable>

            <Text style={styles.postsTitle}>Mis posteos</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#222" />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={item => item.id}
                    style={{ width: '100%', flex: 1 }}
                    renderItem={({ item }) => (
                        <View style={styles.post}>
                            <Text style={styles.postText}>{item.data.description}</Text>
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
        padding: 20,
        backgroundColor: '#fff',
    },
    logo: {
        width: 140,
        height: 44,
        resizeMode: 'contain',
        marginTop: 40,
        marginBottom: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 10,
    },
    label: {
        fontSize: 12,
        color: '#999',
        marginTop: 20,
    },
    value: {
        fontSize: 16,
        marginTop: 4,
    },
    button: {
        backgroundColor: '#222',
        padding: 15,
        borderRadius: 8,
        marginTop: 30,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    postsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
    },
    post: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    postText: {
        fontSize: 15,
        color: '#111',
    },
});

export default Profile;

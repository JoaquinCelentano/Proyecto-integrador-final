import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { auth } from '../firebase/Config';

function Profile({ navigation }) {
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
            <Text style={styles.value}>-</Text>

            <Text style={styles.label}>Mis posteos</Text>
            <Text style={styles.value}>-</Text>

            <Pressable style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
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
        marginTop: 40,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default Profile;

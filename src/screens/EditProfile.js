import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/Config';

function EditProfile({ navigation }) {
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [userDocId, setUserDocId] = useState("");

    useEffect(() => {
        db.collection('users')
            .where('email', '==', auth.currentUser.email)
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    setUserDocId(snapshot.docs[0].id);
                    setBio(snapshot.docs[0].data().bio || '');
                    setProfilePic(snapshot.docs[0].data().profilePic || '');
                }
            });
    }, []);

    function guardar() {
        db.collection('users').doc(userDocId)
            .update({ bio: bio, profilePic: profilePic })
            .then(() => { navigation.navigate('MiPerfilMain'); })
            .catch((error) => { console.log(error); });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar perfil</Text>

            <Text style={styles.label}>Bio</Text>
            <TextInput
                style={styles.inputMultiline}
                placeholder="Escribí tu bio"
                value={bio}
                onChangeText={(text) => setBio(text)}
                multiline
            />

            <Text style={styles.label}>URL de la foto de perfil</Text>
            <TextInput
                style={styles.input}
                placeholder="URL de la foto de perfil"
                value={profilePic}
                onChangeText={(text) => setProfilePic(text)}
            />

            <Pressable style={styles.button} onPress={() => guardar()}>
                <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 28,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#999',
        marginBottom: 8,
    },
    inputMultiline: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 14,
        minHeight: 100,
        marginBottom: 16,
        fontSize: 15,
        color: '#111',
        backgroundColor: '#fafafa',
        textAlignVertical: 'top',
    },
    input: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        fontSize: 15,
        color: '#111',
        backgroundColor: '#fafafa',
    },
    button: {
        backgroundColor: '#111',
        padding: 16,
        borderRadius: 10,
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default EditProfile;

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import SelectFavorites from '../screens/SelectFavorites';

const Stack = createNativeStackNavigator();

function PerfilStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MiPerfilMain" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            <Stack.Screen name="SelectFavorites" component={SelectFavorites} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default PerfilStack;

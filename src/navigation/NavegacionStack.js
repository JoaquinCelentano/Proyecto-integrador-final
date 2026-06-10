import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import ComentarPosteo from '../screens/ComentarPosteo';
import PostDetail from '../screens/PostDetail';
import UserProfile from '../screens/UserProfile';

const Stack = createNativeStackNavigator();

function NavegacionStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomePage" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="PostDetail" component={PostDetail} options={{ headerShown: false }} />
            <Stack.Screen name="ComentarPosteo" component={ComentarPosteo} options={{ headerShown: false }} />
            <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default NavegacionStack;

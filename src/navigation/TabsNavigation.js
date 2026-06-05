import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import NavegacionStack from './NavegacionStack';
import CreatePost from '../screens/CreatePost';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return (
        <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
            <Tab.Screen
                name="HomeTabs"
                component={NavegacionStack}
                options={{ headerShown: false, tabBarIcon: () => <FontAwesome name="home" size={24} color="black" /> }}
            />
            <Tab.Screen
                name="Crear posteo"
                component={CreatePost}
                options={{ headerShown: false, tabBarIcon: () => <FontAwesome name="plus-square" size={24} color="black" /> }}
            />
            <Tab.Screen
                name="Mi Perfil"
                component={Profile}
                options={{ headerShown: false, tabBarIcon: () => <FontAwesome name="user" size={24} color="black" /> }}
            />
        </Tab.Navigator>
    );
}

export default TabNavigation;

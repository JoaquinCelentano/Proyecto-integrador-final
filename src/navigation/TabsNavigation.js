import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import NavegacionStack from './NavegacionStack';
import CreatePost from '../screens/CreatePost';
import PerfilStack from './PerfilStack';

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#111',
            tabBarInactiveTintColor: '#bbb',
            tabBarStyle: {
                backgroundColor: '#fff',
                borderTopColor: '#eee',
                borderTopWidth: 1,
            }
        }}>
            <Tab.Screen
                name="HomeTabs"
                component={NavegacionStack}
                options={{ headerShown: false, tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} /> }}
            />
            <Tab.Screen
                name="Crear posteo"
                component={CreatePost}
                options={{ headerShown: false, tabBarIcon: ({ color }) => <FontAwesome name="plus-square" size={24} color={color} /> }}
            />
            <Tab.Screen
                name="Mi Perfil"
                component={PerfilStack}
                options={{ headerShown: false, tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} /> }}
            />
        </Tab.Navigator>
    );
}

export default TabNavigation;

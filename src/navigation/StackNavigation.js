import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login'
import Register from '../screens/Register'
import TabNavigation from './TabsNavigation';

const Stack = createNativeStackNavigator();

function StackNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name= "TabsNavigation"
        component={TabNavigation}
        options={{headerShown: false}}/>
        <Stack.Screen 
        name="Login" 
        component={Login}
        options={{headerShown: false}}/>
        <Stack.Screen 
        name= "Register" 
        component={Register}
        options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigation
import {NavigationContainer, StackRouter} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Screens/Login'
import Register from '../Screens/Register'
import TabNavigation from './TabsNavigation';

function StackNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name="Login" 
        component={Login}
        options={{headerShown: false}}/>
        <Stack.Screen 
        name= "Register" 
        component={Register}
        options={{headerShown: false}}/>
        <Stack.Sreen 
        name= "TabsNavigation"
        component={TabNavigation}
        options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigation
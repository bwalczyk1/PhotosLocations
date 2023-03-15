import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Main from './components/Main'
import Gallery from './components/Gallery'
import BigPhoto from './components/BigPhoto'
import CameraScreen from './components/CameraScreen'
import Map from './components/Map'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="main" component={Main} options={{ headerShown: false }} />
        <Stack.Screen
          name="gallery"
          component={Gallery}
          options={{
            title: 'Gallery',
            headerStyle: {
              backgroundColor: 'deeppink'
            },
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen
          name="bigPhoto"
          component={BigPhoto}
          options={{
            title: 'Selected photo',
            headerStyle: {
              backgroundColor: 'deeppink'
            },
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen
          name="cameraScreen"
          component={CameraScreen}
          options={{
            title: 'Camera',
            headerStyle: {
              backgroundColor: 'deeppink'
            },
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen
          name="map"
          component={Map}
          options={{
            title: 'Map',
            headerStyle: {
              backgroundColor: 'deeppink'
            },
            headerTintColor: 'white'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
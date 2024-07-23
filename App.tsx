import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SnapScreen from './screens/SnapScreen';
import GalleryScreen from './screens/GalleryScreen';

import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { createStore } from 'redux';
import storage from 'redux-persist/lib/storage' ;
import { PersistGate } from 'redux-persist/integration/react';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faImage } from '@fortawesome/free-solid-svg-icons';
import {
  IconLookup,
  IconDefinition,
  findIconDefinition
} from '@fortawesome/fontawesome-svg-core'

const persistConfig = {
  key: 'user',
  storage: AsyncStorage,
}

const reducers = combineReducers({ user });
const persistedReducer = persistReducer(persistConfig, reducers)

//const store = createStore(persistedReducer)
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck : false})
});

const persistor = persistStore(store)


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
//A MODIFIER ////////////////////////////////////////////////////////////////////////////
        let icon: any = '';

        if (route.name === 'Snap') {
          icon = faCamera;
        } else if (route.name === 'Gallery') {
          icon = faImage;
        };

        const navIcon: IconLookup = { prefix: 'fas', iconName: "camera" }
        const navIconDefinition: IconDefinition = findIconDefinition(navIcon)

        return <FontAwesomeIcon icon={icon} color={color} /> 
        // <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#e8be4b',
      tabBarInactiveTintColor: '#b2b2b2',
      headerShown: false,
    })}>
      <Tab.Screen name="Snap" component={SnapScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} >
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />           
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

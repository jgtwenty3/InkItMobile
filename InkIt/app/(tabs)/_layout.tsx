
import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'


const TabIcon = ({ name, size, color }) => (
  <Icon name={name} size={size} color={color} />
);

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{headerShown:false, tabBarStyle: {
      backgroundColor: "black",
      borderTopWidth: 1,
      borderTopColor: "#232533",
      height: 84,
    },
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "gray", }}>
      <Tabs.Screen 
        name="home"
        options={{
          title: 'Home',
          
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="calendar"
        options={{
          title: 'Calendar',
          
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="calendar" size={size} color={color} />
          ),
        }}
      />
       <Tabs.Screen 
        name="clients"
        options={{
          title: 'Clients',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="address-card" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="messages"
        options={{
          title: 'Messages',
          
          tabBarIcon: ({ color, size }) => (
            <TabIcon  name = "envelope" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="profile"
        options={{
          title: 'Profile',
          
          tabBarIcon: ({ color, size }) => (
            <TabIcon  name = "user" size={size} color={color} />
          ),
        }}
      />

      
    </Tabs>
    
    
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  tabs:{
    backgroundColor:'black',
    color:'white',
  }
});
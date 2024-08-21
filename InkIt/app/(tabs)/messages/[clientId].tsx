import React, {useState, useEffect} from "react"
import { useGlobalContext } from "@/app/context/GlobalProvider";
import { Text, TextInput } from "react-native";
import { Router } from "expo-router";
import { useRoute } from "@react-navigation/native";

const ClientMessage = () =>{
    const {user} = useGlobalContext()
    console.log(user)
    const route = useRoute();
    const { clientId } = route.params as { clientId: string };
    const [messageBody, setMessageBody] = useState('');
    const [messages, setMessages] = useState ([]);

    return(
        <Text>Client Message</Text>
    )
}

export default ClientMessage;
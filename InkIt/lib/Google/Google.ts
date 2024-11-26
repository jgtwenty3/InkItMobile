import React, { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import dotenv from "dotenv"

// Initialize WebBrowser session
WebBrowser.maybeCompleteAuthSession();

const webClientId = "1017532779880-d679drdbo0v10656tdtpnc4cqupaj1e1.apps.googleusercontent.com";
const iosClientId = "1017532779880-sq6ebuhbq93m5nbraa537kae0qldf7a0.apps.googleusercontent.com";
const androidClientId = "1017532779880-58s7s51cdi4pgiu507mvhrfag4n6vjco.apps.googleusercontent.com";

export async function useGoogleLogin (){
  const config = {
    clientId: webClientId,
    iosClientId,
    androidClientId,
    scopes: [
      'profile',
      'email',
      'openid',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar',
    ],
    responseType:"code",
    shouldAutoExchangeCode:false,
    extraParams: {
      access_type: 'offline', // Ensures you get a refresh token
      prompt: 'consent', // Forces the user to re-consent, necessary for refresh tokens
    },
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  useEffect(() => {
    if (response?.type === 'success') {
      console.log(response)
      const { authentication } = response;
      
      if (authentication) {
        console.log("Access Token (Bearer Token):", authentication.accessToken);
        console.log("ID Token:", authentication.idToken);
        
      

        const { access_token  } = response.params;
        console.log("Access Token:", access_token);
    
      }
    }
  }, [response]);

  return promptAsync;
};




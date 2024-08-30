import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { updateUser, getCurrentUser } from '@/lib/appwrite'; // Adjust the path as necessary

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '1017532779880-d679drdbo0v10656tdtpnc4cqupaj1e1.apps.googleusercontent.com'
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      if (authentication && authentication.accessToken && authentication.refreshToken) {
        console.log('Access Token:', authentication.accessToken);
        console.log('ID Token:', authentication.idToken);

        const updateCurrentUser = async () => {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            try {
              await updateUser(currentUser.$id, {
                googleId: authentication.idToken,
                accessToken: authentication.accessToken,
                refreshToken: authentication.refreshToken
              });
            } catch (error) {
              console.error('Failed to update user:', error);
            }
          }
        };

        updateCurrentUser();
      } else {
        console.error('Missing authentication tokens');
      }
    }
  }, [response]);

  return { request, response, promptAsync };
}

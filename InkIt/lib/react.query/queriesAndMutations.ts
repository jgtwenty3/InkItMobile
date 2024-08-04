import {
  useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { createClient, createUserAccount, deleteClient, getAppointmentsById, updateUser, getClientById, getClients, getCurrentUser, getUserById, signInAccount, signOutAccount, updateClient, } from '../appwrite/api';
import {  INewClient, INewUser, IUpdateClient, IUpdateUser } from '@/types';
import { QUERY_KEYS } from './queryKeys';



export const useCreateUserAccount= () =>{
  return useMutation({
      mutationFn:(user: INewUser)=>createUserAccount(user)
  });
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};


export const useSignInAccount = () =>{
  return useMutation({
      mutationFn:(user:{
          email:string;
          password:string;
      })=>signInAccount(user),
  });
}

export const useSignOutAccount = () =>{
  return useMutation({
      mutationFn:signOutAccount
  });
}

export const useGetClients = () =>{
  return(
    useQuery({
      queryKey:[QUERY_KEYS.GET_CLIENTS_],
      queryFn: getClients,
    })
  )
}

export const useGetClientById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CLIENT_BY_ID, userId],
    queryFn: () => getClientById(userId),
    enabled: !!userId
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (client: INewClient) => createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_CLIENTS],
      });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (client:IUpdateClient) => updateClient(client),
    onSuccess: (data) =>{
      queryClient.invalidateQueries({
        queryKey :[QUERY_KEYS.GET_CLIENT_BY_ID, data?.$id]
      })
    }
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({clientId, imageId}: {clientId:string | undefined, imageId:string}) => {
      if (!clientId) {
        throw new Error("postId is undefined");
      }
      return deleteClient(clientId, imageId);
    },
    onSuccess: () =>{
      queryClient.invalidateQueries({
        queryKey :[QUERY_KEYS.GET_RECENT_CLIENTS]
      })
    }
  });
};

export const useGetCurrentUser =() =>{
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  })
}
export const useGetAppointmentsById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CLIENT_BY_ID, userId],
    queryFn: () => getAppointmentsById(userId),
    enabled: !!userId
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};
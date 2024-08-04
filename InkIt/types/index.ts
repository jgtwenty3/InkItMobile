export type IContextType = {
    user:IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated:boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: ()=> Promise<boolean>;
  }
  
  export type INavLink = {
      imgURL: string;
      route: string;
      label: string;
    };
    
    export type IUpdateUser = {
      userId: string;
      name: string;
      bio: string;
      email:string;
      phoneNumber: string,
      imageId: string;
      imageUrl: URL | string;
      file: File[];
    };
    
    export type IUser = {
      id: string;
      name: string;
      username: string;
      email: string;
      imageUrl: string;
      bio: string;
    };
    
    export type INewUser = {
      name: string;
      email: string;
      username: string;
      password: string;
    };

    export type INewClient = {
      fullName: string;
      email:string;
      phoneNumber:string;
      city:string;
      state:string;
      country: string;
      // user:string;
      // appointmentId:string;
      // messagesId:string
      // userId: string
      
    
    }

    export type IUpdateClient = {
      clientId: string;
      fullName: string;
      email:string;
      phoneNumber:string;
      city:string;
      state:string;
      country: string;
      appointmentId:string;
      messagesId:string,
      imageId: string;
      imageUrl: URL;
      
    };
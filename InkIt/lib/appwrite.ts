import { Account, Avatars, Client, Databases, ID, Query, Storage, } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: 'com.inkit.inkit',
  projectId: '66ada1ec002ab93f9932',
  databaseId: '66adaa790001a0bd2c6f',
  storageId: '66adad96000dd26f4653',
  userCollectionId: '66adaa90003c87d9bd06',
  clientCollectionId: '66adaa990011a8dcd6e9',
  appointmentCollectionId: '66adaa9f0022a0ccfd62',
  toDoListCollectionId:'66c2a02c002f643033f5',
  imagesCollectionId:'66c7dac8003d84bbe97e',
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const storage = new Storage(client);



export async function createUser(email: string, password: string,) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      
    );

    if (!newAccount) throw new Error("Failed to create account");

   

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        
        
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("Failed to get current account");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error("Failed to get current user");

    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getUserAppointments(userId: string){
  try {
    const appointments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      [Query.equal("creator", userId), Query.orderDesc('startTime')]
      
    ) ;
    return appointments.documents;
    
  }catch(error){
    throw new Error(error)
  }
}

export async function getUserToDoList(userId:string){
  try {
    const toDoList = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.toDoListCollectionId,
      [Query.equal("creator", userId)]
    )
    return toDoList.documents;
    
  } catch (error) {
    throw new Error(error)
    
  }
}

export async function createAppointment(form: {
  startTime: string;
  endTime: string;
  title: string;
  location?: string;
  depositPaid?: boolean;
  client?: string;
  notes?:string

}) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const startTimeISO = new Date(form.startTime).toISOString();
    const endTimeISO = new Date(form.endTime).toISOString();

    const newAppointment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      ID.unique(),
      {
        creator: currentUser.$id,
        startTime: startTimeISO,
        endTime: endTimeISO,
        title: form.title,
        location: form.location,
        depositPaid: form.depositPaid || false,
        client: form.client,
        notes:form.notes
      }
    );
    return newAppointment;
  } catch (error) {
    console.error('Failed to create appointment:', error);
    throw new Error(error.message);
  }
}

export async function createToDoListItem(form: { item: string }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // Create the new to-do item
    const newItem = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.toDoListCollectionId,
      ID.unique(),
      {
        item: form.item,
        creator: currentUser.$id, 
      }
    );
    return newItem;
  } catch (error) {
    console.error('Failed to create to-do item:', error); 
    throw new Error(error.message);
  }
}

export async function deleteToDoListItem(toDoListItemId:string){
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.toDoListCollectionId,
      toDoListItemId
    )
    return { success: true }
  } catch (error) {
    throw new Error('Failed to delete item: ' + error.message);
  }
}
export async function deleteImage(imageId:string){
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.imagesCollectionId,
      imageId,
    )
    return { success: true }
  } catch (error) {
    throw new Error('Failed to delete image: ' + error.message);
  }
}

export async function getUserClients(userId:string){
  try {
    const clients = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      [Query.equal("creator", userId)]
    );
    return clients.documents
  }
  catch(error){
    throw new Error(error)
  }
}

export async function createClient(form: {
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
  waiverSigned:boolean
  notes:string[];
}) {
  try {
    //  get the current user to associate the client with the logged-in user
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // Create a new client document in the database
    const newClient = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      ID.unique(),
      {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        city: form.city,
        state: form.state,
        country: form.country,
        creator: currentUser.$id, 
        waiverSigned:form.waiverSigned,
        notes:form.notes
      }
    );

    return newClient;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getClientById(clientId: string) {
  try {
    const clientData = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      clientId
    );
    return clientData;
  } catch (error) {
    throw new Error('Failed to fetch client');
  }
}

export async function getAppointmentById(appointmentId:string){
  try {
    const appointmentData = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      appointmentId,
    )
    return appointmentData;
  } catch (error) {
    throw new Error('Failed to fetch appointment');
  }
}

export async function deleteAppointment(appointmentId:string){
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      appointmentId,
    )
    return { success: true }
  } catch (error) {
    throw new Error('Failed to delete appointment: ' + error.message);
  }
}

export async function updateAppointment(
  appointmentId: string,
  form: {
    startTime: string;
    endTime: string;
    title: string;
    location?: string;
    depositPaid: boolean;
  }
) {
  try {
 

    const updatedAppointment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      appointmentId,
      {
        startTime: form.startTime,
        endTime: form.endTime,
        title: form.title,
        location: form.location,
        depositPaid: form.depositPaid,
      }
    );

    return updatedAppointment;
  } catch (error) {
    console.error('Failed to update appointment:', error);
    throw new Error('Failed to update appointment: ' + error.message);
  }
}


export async function deleteClient(clientId:string){
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      clientId
    )
    return { success: true }
  } catch (error) {
    throw new Error('Failed to delete client: ' + error.message);
  }
}

export async function updateClient(clientId: string, form: {
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
  waiverSigned:boolean,
  notes?:string[]
}) {
  try {
    // Update the client document in the database
    const updatedClient = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      clientId,
      {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        city: form.city,
        state: form.state,
        country: form.country,
        waiverSigned:form.waiverSigned,
        notes:form.notes
      }
    );

    return updatedClient;
  } catch (error) {
    throw new Error('Failed to update client: ' + error.message);
  }
}


export async function getAppointments(){
  try {
    const allAppointments = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.appointmentCollectionId,
    )
    return allAppointments.documents;
  }
  catch(error){
    throw new Error(error)
  }
}



export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  console.log('Blob created:', blob);
  return blob;
};

export async function getFilePreview(fileId: string) {
  try {
    const fileURL = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000
    );
    return fileURL; // Ensure this is returned as a URL
  } catch (error) {
    console.error('Failed to get file preview:', error);
    throw new Error(error.message);
  }
}
export const uploadImage = async (imageUri) => {
  if (!imageUri) return;

  try {
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image`;

    // Convert URI to Blob
    const blob = await uriToBlob(imageUri);

    // Create a FormData object
    let formData = new FormData();
    formData.append('fileId', 'unique()'); // Assuming unique ID generation logic here
    formData.append('file', {
      uri: imageUri,
      name: filename || `image_${Date.now()}.jpg`,
      type,
    });

    // Upload the image to Appwrite
    const response = await fetch('https://cloud.appwrite.io/v1/storage/buckets/66adad96000dd26f4653/files/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Appwrite-Project': '66ada1ec002ab93f9932',
        'x-sdk-version': 'appwrite:web:10.2.0',
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const file = await response.json();
    return file;
  } catch (err) {
    console.error('Failed to upload image:', err);
    throw err;
  }
};

export const addImageToCollection = async (fileId: string, userId: string, appointmentId:string) => {
  const previewUrl = await getFilePreview(fileId);

  const response = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.imagesCollectionId,
    ID.unique(),
    {
      imageId: fileId,
      imageUrl:previewUrl,
      creator: userId,
      appointment: [appointmentId],

     
    }
  );
  console.log('Create Document Response:', response);
  return response;
};

export async function getUserImages(userId:string){
  try {
    const clients = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.imagesCollectionId,
      [Query.equal("creator", userId),]
    );
    return clients.documents
  }
  catch(error){
    throw new Error(error)
  }
}

export async function updateUser(userId: string, form: {
  email?: string;
  username?: string;
  name?: string;
  googleId?: string;
  accessToken?: string;
  refreshToken?: string;
}) {
  try {
    // Fetch the current user document from the database (if needed)
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // Update account details if email or username is provided
    if (form.email || form.username) {
      await account.updateName(form.username || currentUser.username);
    }

    // Update the document in the database
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId, // Ensure this is the correct database ID
      appwriteConfig.userCollectionId, // Ensure this is the correct collection ID
      userId, // This should be the document ID (userId)
      {
        username: form.username || currentUser.username,
        name: form.name,
        googleId: form.googleId,
        accessToken: form.accessToken,
        refreshToken: form.refreshToken,
      }
    );

    return updatedUser;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user: ' + error.message);
  }
}


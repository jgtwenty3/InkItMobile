import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

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

interface FileType {
  mimeType: string;
  [key: string]: any;
}

export async function createUser(email: string, password: string, username: string) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        
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
      [Query.equal("creator", userId)]
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

export async function createToDoListItem(form: { item: string }) {
  try {
    // Await the result of getCurrentUser to ensure you get the user object
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // Create the new to-do item
    const newItem = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.toDoListCollectionId,
      ID.unique(),
      {
        item: form.item,
        creator: currentUser.$id, // Use the user ID from the resolved user object
      }
    );
    return newItem;
  } catch (error) {
    console.error('Failed to create to-do item:', error); // Log the error for debugging
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
        creator: currentUser.$id, // Associate the client with the logged-in user
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





// // Upload File
// export async function uploadFile(file: FileType, type: string) {
//   if (!file) return;

//   const { mimeType, ...rest } = file;
//   const asset = { type: mimeType, ...rest };

//   try {
//     const uploadedFile = await storage.createFile(
//       appwriteConfig.storageId,
//       ID.unique(),
//       asset
//     );

//     const fileUrl = await getFilePreview(uploadedFile.$id, type);
//     return fileUrl;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// // Get File Preview
// export async function getFilePreview(fileId: string, type: string) {
//   let fileUrl;

//   try {
//     if (type === "video") {
//       fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
//     } else if (type === "image") {
//       fileUrl = storage.getFilePreview(
//         appwriteConfig.storageId,
//         fileId,
//         2000,
//         2000,
//         "top",
//         100
//       );
//     } else {
//       throw new Error("Invalid file type");
//     }

//     if (!fileUrl) throw new Error("Failed to get file preview");

//     return fileUrl;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

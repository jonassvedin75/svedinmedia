
"use server";

import { auth, db } from "@/lib/firebase";
import { AdminDriveLinkSchema, type ActionResponse } from "@/types";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import type { User } from "firebase/auth"; // Import User type

// In a real app, you'd fetch users from Firebase Auth or a users collection
// This is a placeholder for fetching user-like data if needed for admin UI
export async function getPortalUsers(): Promise<ActionResponse<Partial<User>[]>> {
  if (!auth.currentUser) { // Basic auth check, not role check
    return { success: false, error: "Autentisering krävs (admin)." };
  }
  // Note: Listing all Firebase Auth users directly from client-SDK driven actions is not straightforward
  // and usually requires Firebase Admin SDK on a backend.
  // This function would typically fetch from a 'users' collection in Firestore if you maintain one.
  // For now, let's assume we have a 'userProfiles' collection for demonstration.
  try {
    const usersCollectionRef = collection(db, "userProfiles"); // Assuming you have this collection
    const querySnapshot = await getDocs(usersCollectionRef);
    const users = querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as Partial<User>[]; // Adjust type as per your userProfiles structure
    
    // If you don't have a userProfiles collection, return a placeholder or an empty array
    if (users.length === 0) {
        // Fallback: try to get the current admin user as an example
        const adminUser = auth.currentUser;
        if (adminUser) {
            return { success: true, data: [{ uid: adminUser.uid, email: adminUser.email, displayName: adminUser.displayName }] };
        }
         return { success: true, data: [], message: "Inga användarprofiler funna i Firestore. Admin kan behöva skapa 'userProfiles' samlingen." };
    }

    return { success: true, data: users };

  } catch (error: any) {
    console.error("Error fetching portal users:", error);
    return { success: false, error: "Kunde inte hämta användare." };
  }
}


export async function saveUserDriveLink(
  userId: string,
  driveUrl: string
): Promise<ActionResponse> {
  if (!auth.currentUser) { // Basic auth check, not role check
    return { success: false, error: "Autentisering krävs (admin)." };
  }

  try {
    const validatedInput = AdminDriveLinkSchema.safeParse({ userId, driveUrl });
    if (!validatedInput.success) {
      return { success: false, error: validatedInput.error.errors.map(e => e.message).join(', ') };
    }

    // We'll store this in a separate collection `userDriveLinks` or update a `userProfiles` doc.
    // Using `userProfiles` for this example, assuming each user has a doc in `userProfiles` collection with their UID as doc ID.
    const userProfileRef = doc(db, "userProfiles", userId);
    
    // Check if document exists, create if not (or handle as error if preferred)
    // For this example, we'll use setDoc with merge: true to create or update.
    await setDoc(userProfileRef, { driveUrl: validatedInput.data.driveUrl }, { merge: true });
    
    return { success: true, message: "Google Drive-länk sparad." };

  } catch (error: any) {
    console.error("Error saving user Drive link:", error);
    return { success: false, error: error.message || "Kunde inte spara Drive-länk." };
  }
}

export async function getUserDriveLink(userId: string): Promise<ActionResponse<{ driveUrl?: string }>> {
   if (!auth.currentUser) {
    return { success: false, error: "Autentisering krävs." };
  }
  try {
    const userProfileRef = doc(db, "userProfiles", userId);
    const docSnap = await getDoc(userProfileRef);

    if (docSnap.exists()) {
      return { success: true, data: { driveUrl: docSnap.data()?.driveUrl } };
    } else {
      return { success: true, data: { driveUrl: "" }, message: "Ingen Drive-länk angiven." }; // No link set
    }
  } catch (error: any) {
     console.error("Error fetching user Drive link:", error);
    return { success: false, error: "Kunde inte hämta Drive-länk." };
  }
}

    
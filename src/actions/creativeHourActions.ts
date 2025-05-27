
"use server";

import { auth, db } from "@/lib/firebase";
import { SaveCreativeHourSubmissionInputSchema, type ActionResponse, type CreativeHourMission, CreativeHourMissionSchema } from "@/types";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { z } from "zod";

export async function saveCreativeHourSubmission(
  input: z.infer<typeof SaveCreativeHourSubmissionInputSchema>
): Promise<ActionResponse<{ submissionId: string }>> {
  try {
    const validatedInput = SaveCreativeHourSubmissionInputSchema.safeParse(input);
    if (!validatedInput.success) {
      return { success: false, error: validatedInput.error.errors.map(e => e.message).join(', ') };
    }

    if (!auth.currentUser) {
      return { success: false, error: "Autentisering krävs." };
    }
    const userId = auth.currentUser.uid;

    const submissionData = {
      ...validatedInput.data,
      userId,
      submittedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "userCreativeHourSubmissions"), submissionData);
    return { success: true, submissionId: docRef.id, message: "Svar sparat!" };

  } catch (error: any) {
    console.error("Error in saveCreativeHourSubmission:", error);
    return { success: false, error: error.message || "Kunde inte spara svar." };
  }
}

export async function getCreativeHourMissions(): Promise<ActionResponse<CreativeHourMission[]>> {
  try {
    const missionsCollection = collection(db, "creativeHourMissions");
    const q = query(missionsCollection, orderBy("missionOrder", "asc"));
    const querySnapshot = await getDocs(q);
    const missions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CreativeHourMission));
    return { success: true, data: missions };
  } catch (error: any) {
    console.error("Error fetching creative hour missions:", error);
    return { success: false, error: "Kunde inte hämta uppdrag." };
  }
}

export async function getUserCreativeHourSubmissions(): Promise<ActionResponse<any[]>> {
   if (!auth.currentUser) {
    return { success: false, error: "Autentisering krävs." };
  }
  const userId = auth.currentUser.uid;

  try {
    const submissionsCollection = collection(db, "userCreativeHourSubmissions");
    const q = query(submissionsCollection, where("userId", "==", userId), orderBy("submittedAt", "desc"));
    const querySnapshot = await getDocs(q);
    const submissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: submissions };
  } catch (error: any) {
    console.error("Error fetching user creative hour submissions:", error);
    return { success: false, error: "Kunde inte hämta dina sparade svar." };
  }
}

// --- Admin Actions for Creative Hour Missions ---

export async function addCreativeHourMission(
  data: Omit<CreativeHourMission, "id">
): Promise<ActionResponse<{ missionId: string }>> {
  // TODO: Add admin role verification here in a real app
  if (!auth.currentUser) { // Basic auth check, not role check
    return { success: false, error: "Autentisering krävs (admin)." };
  }

  try {
    const validatedData = CreativeHourMissionSchema.omit({id: true}).safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.errors.map(e => e.message).join(', ') };
    }

    const docRef = await addDoc(collection(db, "creativeHourMissions"), validatedData.data);
    return { success: true, missionId: docRef.id, message: "Uppdrag tillagt!" };
  } catch (error: any) {
    console.error("Error adding creative hour mission:", error);
    return { success: false, error: error.message || "Kunde inte lägga till uppdrag." };
  }
}

export async function updateCreativeHourMission(
  id: string,
  data: Partial<Omit<CreativeHourMission, "id">>
): Promise<ActionResponse> {
  if (!auth.currentUser) {
    return { success: false, error: "Autentisering krävs (admin)." };
  }
   try {
    // Validate only the fields that are being updated
    const validatedData = CreativeHourMissionSchema.omit({id:true}).partial().safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.errors.map(e => e.message).join(', ') };
    }

    const missionDocRef = doc(db, "creativeHourMissions", id);
    await updateDoc(missionDocRef, validatedData.data);
    return { success: true, message: "Uppdrag uppdaterat!" };
  } catch (error: any) {
    console.error("Error updating creative hour mission:", error);
    return { success: false, error: error.message || "Kunde inte uppdatera uppdrag." };
  }
}

export async function deleteCreativeHourMission(id: string): Promise<ActionResponse> {
  if (!auth.currentUser) {
    return { success: false, error: "Autentisering krävs (admin)." };
  }
  try {
    const missionDocRef = doc(db, "creativeHourMissions", id);
    await deleteDoc(missionDocRef);
    return { success: true, message: "Uppdrag raderat!" };
  } catch (error: any) {
    console.error("Error deleting creative hour mission:", error);
    return { success: false, error: error.message || "Kunde inte radera uppdrag." };
  }
}

    
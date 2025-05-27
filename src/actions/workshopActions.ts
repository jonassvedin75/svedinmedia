
"use server";

import { auth, db } from "@/lib/firebase";
import { StartBrandWorkshopSchema, WorkshopStepAnswersSchema, type ActionResponse, type StartBrandWorkshopFormData, type WorkshopStepAnswers } from "@/types";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { z } from "zod";

// Helper to get current authenticated user ID
async function getUserId(): Promise<string | null> {
  // This relies on Firebase server-side session management or custom token verification if not in Firebase environment
  // For Next.js Server Actions, `auth.currentUser` might not be available directly without special setup.
  // A common pattern is to pass the user ID from the client (obtained from useAuth) or verify an ID token.
  // For simplicity in this prototype, we'll assume this function can somehow get the UID.
  // In a real app, you'd likely verify an ID token passed from the client.
  // This is a placeholder: In a real scenario, ensure `auth.currentUser` is populated on the server
  // or pass an ID token from client to verify.
  
  // The most straightforward way with Firebase Client SDK in Server Actions is less common.
  // If you configure Firebase Admin SDK, you can verify ID tokens.
  // Let's assume for now this is placeholder and would need robust auth check.
  // For a prototype, we might rely on client sending UID, which isn't secure for production.
  
  // This is a conceptual placeholder. Actual server-side auth is more complex.
  // if (auth.currentUser) {
  //   return auth.currentUser.uid;
  // }
  // For callable functions, `context.auth.uid` is available.
  // For Server Actions, you'd typically get this from a session or by verifying a token.
  // This action will be called from a client component which has user context.
  // The client should pass the userId.

  return null; // Placeholder - this needs to be implemented based on auth strategy
}


interface SaveWorkshopStep1DataInput {
  companyName: string;
  userId: string; // Client must provide this from useAuth()
}

export async function saveWorkshopStep1Data(
  input: SaveWorkshopStep1DataInput
): Promise<ActionResponse<{ docId: string }>> {
  try {
    // Validate input using Zod schema (subset of StartBrandWorkshopFormData, as userId is passed separately)
    const validatedInput = z.object({ 
        companyName: z.string().min(1, { message: "Företagsnamn måste anges." }),
        userId: z.string().min(1, {message: "AnvändarID saknas."})
    }).safeParse(input);

    if (!validatedInput.success) {
      return { success: false, error: validatedInput.error.errors.map(e => e.message).join(', ') };
    }

    const { companyName, userId } = validatedInput.data;

    if (!userId) {
      return { success: false, error: "Autentisering krävs." };
    }

    const workshopSessionData = {
      userId: userId,
      companyName: companyName,
      workshopType: 'brandWorkshop',
      status: 'started' as const,
      createdAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
      answers: {},
    };

    const docRef = await addDoc(collection(db, "workshopSessions"), workshopSessionData);
    return { success: true, docId: docRef.id, message: "Workshop startad!" };

  } catch (error: any) {
    console.error("Error in saveWorkshopStep1Data:", error);
    return { success: false, error: error.message || "Kunde inte starta workshopen." };
  }
}


interface SaveWorkshopStepAnswersInput {
  workshopSessionId: string;
  stepIdentifier: string;
  stepAnswers: WorkshopStepAnswers;
  userId: string; // Client must provide this
}

export async function saveWorkshopStepAnswers(
  input: SaveWorkshopStepAnswersInput
): Promise<ActionResponse> {
  try {
    // Validate input
     const validatedInput = z.object({
      workshopSessionId: z.string().min(1),
      stepIdentifier: z.string().min(1),
      stepAnswers: WorkshopStepAnswersSchema, // Assuming this is flexible enough
      userId: z.string().min(1, {message: "AnvändarID saknas."}),
    }).safeParse(input);

    if (!validatedInput.success) {
      return { success: false, error: validatedInput.error.errors.map(e => e.message).join(', ') };
    }
    
    const { workshopSessionId, stepIdentifier, stepAnswers, userId } = validatedInput.data;

    if (!userId) {
      return { success: false, error: "Autentisering krävs." };
    }

    const sessionDocRef = doc(db, "workshopSessions", workshopSessionId);
    
    // Optional: Verify user owns this session
    const sessionSnap = await getDoc(sessionDocRef);
    if (!sessionSnap.exists() || sessionSnap.data()?.userId !== userId) {
        return { success: false, error: "Åtkomst nekad eller sessionen finns inte." };
    }

    // Sanitize answers: remove any undefined values to prevent Firestore errors
    const sanitizedAnswers: WorkshopStepAnswers = {};
    for (const key in stepAnswers) {
      if (stepAnswers[key] !== undefined && stepAnswers[key] !== null) {
        sanitizedAnswers[key] = stepAnswers[key];
      }
    }

    const updateData = {
      [`answers.${stepIdentifier}`]: sanitizedAnswers,
      lastUpdatedAt: serverTimestamp(),
      status: 'in-progress' as const, // Mark as in-progress
    };

    await updateDoc(sessionDocRef, updateData);

    return { success: true, message: "Svar sparade." };

  } catch (error: any) {
    console.error("Error in saveWorkshopStepAnswers:", error);
    return { success: false, error: error.message || "Kunde inte spara svar." };
  }
}

interface MarkWorkshopCompletedInput {
  workshopSessionId: string;
  userId: string; // Client must provide this
}

export async function markWorkshopAsCompleted(
  input: MarkWorkshopCompletedInput
): Promise<ActionResponse> {
  try {
    const validatedInput = z.object({
      workshopSessionId: z.string().min(1),
      userId: z.string().min(1, {message: "AnvändarID saknas."}),
    }).safeParse(input);

    if (!validatedInput.success) {
      return { success: false, error: validatedInput.error.errors.map(e => e.message).join(', ') };
    }

    const { workshopSessionId, userId } = validatedInput.data;
    
    if (!userId) {
      return { success: false, error: "Autentisering krävs." };
    }

    const sessionDocRef = doc(db, "workshopSessions", workshopSessionId);
    const sessionSnap = await getDoc(sessionDocRef);

    if (!sessionSnap.exists() || sessionSnap.data()?.userId !== userId) {
      return { success: false, error: "Åtkomst nekad eller sessionen finns inte." };
    }
    
    await updateDoc(sessionDocRef, {
      status: 'completed' as const,
      lastUpdatedAt: serverTimestamp(),
    });

    return { success: true, message: "Workshop markerad som slutförd!" };

  } catch (error: any) {
    console.error("Error marking workshop as completed:", error);
    return { success: false, error: error.message || "Kunde inte markera workshop som slutförd." };
  }
}

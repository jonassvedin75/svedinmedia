
import { z } from 'zod';

// --- Authentication Schemas ---
export const LoginSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress." }),
  password: z.string().min(6, { message: "Lösenordet måste vara minst 6 tecken." }),
});
export type LoginFormData = z.infer<typeof LoginSchema>;

export const SignupSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress." }),
  password: z.string().min(6, { message: "Lösenordet måste vara minst 6 tecken." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Lösenorden matchar inte.",
  path: ["confirmPassword"],
});
export type SignupFormData = z.infer<typeof SignupSchema>;


// --- Idea Generation (Legacy, might be reused for Kreativa Timmen) ---
export interface Idea {
  id: string;
  content: string;
  createdAt: Date; // Consider Firestore Timestamp if stored there
}


// --- Workshop Schemas & Types ---

// For starting a brand workshop
export const StartBrandWorkshopSchema = z.object({
  companyName: z.string().min(1, { message: "Företagsnamn måste anges." }),
});
export type StartBrandWorkshopFormData = z.infer<typeof StartBrandWorkshopSchema>;

// For saving answers for a workshop step
export const WorkshopStepAnswersSchema = z.object({
  // Dynamically populated based on step questions.
  // Example: q1a: z.string().optional(), q1b: z.string().optional(), ...
  [key: string]: z.string().optional(),
});
export type WorkshopStepAnswers = z.infer<typeof WorkshopStepAnswersSchema>;


export interface WorkshopSession {
  id: string;
  userId: string;
  companyName?: string; // Specific to brand workshop, could be generalized
  workshopType: 'brandWorkshop' | string; // Add other workshop types later
  status: 'started' | 'in-progress' | 'completed';
  createdAt: any; // Firestore Timestamp (or Date for client)
  lastUpdatedAt: any; // Firestore Timestamp (or Date for client)
  answers: {
    [stepIdentifier: string]: WorkshopStepAnswers;
  };
  // Add other common workshop fields here
}

// Structure for a single question within a step
export interface WorkshopQuestion {
  id: string; // e.g., "q1a"
  label: string; // The question text
  type: 'textarea' | 'text' | 'radio' | 'checkbox'; // Add more as needed
  options?: { label: string; value: string }[]; // For radio/checkbox
  placeholder?: string;
}

// Structure for a step in the multi-step form
export interface WorkshopFormStep {
  stepIdentifier: string; // e.g., "pass1_q1"
  title: string;
  questions: WorkshopQuestion[];
}

// For Cloud Function/Server Action responses
export interface ActionResponseSuccess<T = any> {
  success: true;
  data?: T;
  message?: string;
  docId?: string; // Often useful for creation actions
}

export interface ActionResponseError {
  success: false;
  error: string;
}

export type ActionResponse<T = any> = ActionResponseSuccess<T> | ActionResponseError;

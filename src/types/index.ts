
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
export const StartBrandWorkshopSchema = z.object({
  companyName: z.string().min(1, { message: "Företagsnamn måste anges." }),
});
export type StartBrandWorkshopFormData = z.infer<typeof StartBrandWorkshopSchema>;

export const WorkshopStepAnswersSchema = z.record(z.string().optional());
export type WorkshopStepAnswers = z.infer<typeof WorkshopStepAnswersSchema>;


export interface WorkshopSession {
  id: string;
  userId: string;
  companyName?: string; 
  workshopType: 'brandWorkshop' | string; 
  status: 'started' | 'in-progress' | 'completed';
  createdAt: any; 
  lastUpdatedAt: any; 
  answers: {
    [stepIdentifier: string]: WorkshopStepAnswers;
  };
}

export interface WorkshopQuestion {
  id: string; 
  label: string; 
  type: 'textarea' | 'text' | 'radio' | 'checkbox'; 
  options?: { label: string; value: string }[]; 
  placeholder?: string;
}

export interface WorkshopFormStep {
  stepIdentifier: string; 
  title: string;
  questions: WorkshopQuestion[];
}

// --- Kreativa Timmen Schemas & Types ---
export const CreativeHourMissionSchema = z.object({
  id: z.string().optional(), // Firestore document ID, optional for creation
  title: z.string().min(1, "Titel måste anges."),
  category: z.string().min(1, "Kategori måste anges."),
  taskDescription: z.string().min(1, "Uppdragsbeskrivning måste anges."),
  bonusTask: z.string().optional(),
  missionOrder: z.number().min(0, "Ordning måste vara ett positivt tal.").default(0),
});
export type CreativeHourMission = z.infer<typeof CreativeHourMissionSchema> & { id: string }; // Ensure id is present after fetch

export const UserCreativeHourSubmissionSchema = z.object({
  userId: z.string(),
  missionId: z.string(),
  companyNameForSession: z.string().optional(),
  responseText: z.string().min(1, "Svarstext får inte vara tom."),
  submittedAt: z.any(), // Firestore Timestamp
});
export type UserCreativeHourSubmission = z.infer<typeof UserCreativeHourSubmissionSchema> & { id: string };

export const SaveCreativeHourSubmissionInputSchema = z.object({
  missionId: z.string().min(1, "Uppdrags-ID saknas."),
  companyNameForSession: z.string().optional(),
  responseText: z.string().min(1, "Svarstext får inte vara tom."),
});
export type SaveCreativeHourSubmissionFormData = z.infer<typeof SaveCreativeHourSubmissionInputSchema>;


// --- Admin Schemas & Types ---
export const AdminDriveLinkSchema = z.object({
  userId: z.string().min(1, "Användar-ID saknas."), // Could also be companyId or similar identifier
  driveUrl: z.string().url("Ogiltig URL för Google Drive-mapp.").optional().or(z.literal('')),
});
export type AdminDriveLinkFormData = z.infer<typeof AdminDriveLinkSchema>;


// --- General Action Response ---
export interface ActionResponseSuccess<T = any> {
  success: true;
  data?: T;
  message?: string;
  docId?: string; 
}

export interface ActionResponseError {
  success: false;
  error: string;
}

export type ActionResponse<T = any> = ActionResponseSuccess<T> | ActionResponseError;

    
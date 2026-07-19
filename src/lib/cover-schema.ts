import { z } from "zod";

export const coverSchema = z.object({
  studentName: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  roll: z.string().trim().min(1, "Roll is required").max(20),
  section: z.string().trim().min(1, "Section is required").max(10),
  className: z.string().trim().min(1, "Class is required").max(20),
  studentId: z.string().trim().min(1, "Student ID is required").max(30),
  photoDataUrl: z.string().nullable().optional(),
  schoolName: z.string().trim().min(2, "School name is required").max(120),
  teacherName: z.string().trim().max(80).optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Subject is required").max(80),
  assignmentTitle: z.string().trim().min(2, "Assignment title is required").max(120),
  submissionDate: z.string().trim().min(1, "Submission date is required"),
  academicYear: z.string().trim().max(20).optional().or(z.literal("")),
  logoDataUrl: z.string().nullable().optional(),
});

export type CoverForm = z.infer<typeof coverSchema>;
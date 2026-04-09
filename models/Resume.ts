import { Schema, type Model } from "mongoose";
import mongooseHistoryTrace from "mongoose-history-trace";
import { connectToDatabase } from "@/lib/db";
import type {
  ResumeDocument,
  ContactInfo,
  WorkExperience,
  Education,
  ResumeHeader,
} from "@/types/resume.types";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const ContactInfoSchema = new Schema<ContactInfo>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    linkedin: { type: String },
    website: { type: String },
  },
  { _id: false },
);

const WorkExperienceSchema = new Schema<WorkExperience>(
  {
    id: { type: String, required: true },
    company: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: String, required: true },
    // null = current/ongoing role
    endDate: { type: String, default: null },
    // Tiptap JSONContent is a free-form JSON object
    description: { type: Schema.Types.Mixed, required: true },
    highlights: [{ type: String }],
  },
  { _id: false },
);

const EducationSchema = new Schema<Education>(
  {
    id: { type: String, required: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    description: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const ResumeHeaderSchema = new Schema<ResumeHeader>(
  {
    contactInfo: { type: ContactInfoSchema, required: true },
    summary: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

// ─── Root schema ──────────────────────────────────────────────────────────────

const ResumeSchema = new Schema<ResumeDocument>(
  {
    id: { type: String, required: true, unique: true },
    header: { type: ResumeHeaderSchema, required: true },
    workExperiences: [WorkExperienceSchema],
    educations: [EducationSchema],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);

// ─── History trace plugin ─────────────────────────────────────────────────────
// The plugin requires the active mongoose connection, which is available after
// connectToDatabase() resolves. We wrap model registration in an async factory
// so the connection is guaranteed to exist before the plugin is applied.

let ResumeModel: Model<ResumeDocument> | null = null;

export async function getResumeModel(): Promise<Model<ResumeDocument>> {
  if (ResumeModel !== null) return ResumeModel;

  const conn = await connectToDatabase();

  // Guard: only register the plugin once, before any model is compiled.
  const isAlreadyRegistered = "Resume" in conn.connection.models;

  if (!isAlreadyRegistered) {
    ResumeSchema.plugin(mongooseHistoryTrace, {
      mongooseConnection: conn.connection,
      isAuthenticated: false,
    });
  }

  // Prevent model recompilation on Next.js HMR by reusing an existing model.
  ResumeModel =
    (conn.connection.models["Resume"] as Model<ResumeDocument> | undefined) ??
    conn.connection.model<ResumeDocument>("Resume", ResumeSchema);

  return ResumeModel;
}

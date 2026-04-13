import { Schema, type Model } from "mongoose";
import mongooseHistoryTrace from "mongoose-history-trace";
import { connectToDatabase } from "@/lib/db";
import type {
  ResumeDocument,
  ContactInfo,
  ExperienceProject,
  ExperienceEntry,
  EducationEntry,
  SkillEntry,
  ProjectEntry,
  CertificationEntry,
  CustomEntry,
  CustomSection,
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

const ExperienceProjectSchema = new Schema<ExperienceProject>(
  {
    id: { type: String, required: true },
    name: { type: String, default: null },
    bullets: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const ExperienceEntrySchema = new Schema<ExperienceEntry>(
  {
    id: { type: String, required: true },
    company: { type: String, required: true },
    designation: { type: String, required: true },
    startYear: { type: String, required: true },
    endYear: { type: String, default: null },
    bullets: { type: Schema.Types.Mixed, required: true },
    projects: { type: [ExperienceProjectSchema], default: [] },
  },
  { _id: false },
);

const EducationEntrySchema = new Schema<EducationEntry>(
  {
    id: { type: String, required: true },
    institution: { type: String, required: true },
    programme: { type: String, required: true },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true },
    description: { type: String },
  },
  { _id: false },
);

const SkillEntrySchema = new Schema<SkillEntry>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false },
);

const ProjectEntrySchema = new Schema<ProjectEntry>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    subtitle: { type: String },
    bullets: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const CertificationEntrySchema = new Schema<CertificationEntry>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    issuer: { type: String },
    year: { type: String },
  },
  { _id: false },
);

const CustomEntrySchema = new Schema<CustomEntry>(
  {
    id: { type: String, required: true },
    title: { type: String },
    subtitle: { type: String },
    body: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const CustomSectionSchema = new Schema<CustomSection>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true, enum: ["custom"] },
    sectionTitle: { type: String, required: true },
    bodyType: { type: String, required: true, enum: ["bullets", "paragraphs"] },
    entries: { type: [CustomEntrySchema], default: [] },
  },
  { _id: false },
);

// ─── Root schema ──────────────────────────────────────────────────────────────

const ResumeSchema = new Schema<ResumeDocument>(
  {
    id: { type: String, required: true, unique: true },
    contactInfo: { type: ContactInfoSchema, required: true },
    objective: { type: Schema.Types.Mixed, required: true },
    experience: { type: Schema.Types.Mixed, required: true },
    education: { type: Schema.Types.Mixed, required: true },
    skills: { type: Schema.Types.Mixed, required: true },
    projects: { type: Schema.Types.Mixed, required: true },
    certifications: { type: Schema.Types.Mixed, required: true },
    customSections: { type: [CustomSectionSchema], default: [] },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);

// ─── History trace plugin ─────────────────────────────────────────────────────

let ResumeModel: Model<ResumeDocument> | null = null;

export async function getResumeModel(): Promise<Model<ResumeDocument>> {
  if (ResumeModel !== null) return ResumeModel;

  const conn = await connectToDatabase();
  const isAlreadyRegistered = "Resume" in conn.connection.models;

  if (!isAlreadyRegistered) {
    ResumeSchema.plugin(mongooseHistoryTrace, {
      mongooseConnection: conn.connection,
      isAuthenticated: false,
    });
  }

  ResumeModel =
    (conn.connection.models["Resume"] as Model<ResumeDocument> | undefined) ??
    conn.connection.model<ResumeDocument>("Resume", ResumeSchema);

  return ResumeModel;
}

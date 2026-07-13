import { prisma } from "./prisma";

/** Contact form subjects the site offers. Anything else is rejected. */
export const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Research Partnership",
  "Training & Certification",
  "Careers",
];

/** A CV must be a document, and small enough to keep in the database. */
export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_TYPES = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

export function validateContact(input) {
  if (!input.firstName) return "First name is required.";
  if (!input.lastName) return "Last name is required.";
  if (!EMAIL.test(input.email)) return "A valid email address is required.";
  if (!CONTACT_SUBJECTS.includes(input.subject)) return "Choose a subject.";
  if (input.message.length < 10) {
    return "Please write a message of at least 10 characters.";
  }
  return null;
}

export async function createContactMessage(body) {
  const input = {
    firstName: text(body?.firstName, 60),
    lastName: text(body?.lastName, 60),
    email: text(body?.email, 120),
    phone: text(body?.phone, 30),
    subject: text(body?.subject, 60),
    message: text(body?.message, 4000),
  };

  const error = validateContact(input);
  if (error) return { ok: false, error };

  await prisma.contactMessage.create({
    data: { ...input, phone: input.phone || null },
  });

  return { ok: true };
}

export function validateApplication(input) {
  if (!input.firstName) return "First name is required.";
  if (!input.lastName) return "Last name is required.";
  if (!EMAIL.test(input.email)) return "A valid email address is required.";
  if (!/^\d{9,15}$/.test(input.phone.replace(/\D/g, ""))) {
    return "A valid phone number is required.";
  }
  if (!input.programme) return "Missing the programme applied for.";
  if (input.motivation.length < 10) {
    return "Tell us a little more about why you are interested.";
  }
  return null;
}

/**
 * @param {object} body   plain form fields
 * @param {File?}  cvFile optional CV upload
 */
export async function createApplication(body, cvFile) {
  const input = {
    firstName: text(body?.firstName, 60),
    lastName: text(body?.lastName, 60),
    email: text(body?.email, 120),
    phone: text(body?.phone, 30),
    programme: text(body?.programme, 160),
    programmeId: text(body?.programmeId, 40),
    occupation: text(body?.occupation, 80),
    motivation: text(body?.motivation, 4000),
  };

  const error = validateApplication(input);
  if (error) return { ok: false, error };

  let cv = {};
  if (cvFile && cvFile.size > 0) {
    if (!CV_TYPES[cvFile.type]) {
      return { ok: false, error: "The CV must be a PDF, DOC or DOCX file." };
    }
    if (cvFile.size > CV_MAX_BYTES) {
      return { ok: false, error: "The CV must be smaller than 5MB." };
    }
    cv = {
      cvName: text(cvFile.name, 160) || "cv",
      cvType: cvFile.type,
      cvData: Buffer.from(await cvFile.arrayBuffer()),
    };
  }

  await prisma.application.create({
    data: {
      ...input,
      programmeId: input.programmeId || null,
      occupation: input.occupation || null,
      ...cv,
    },
  });

  return { ok: true };
}

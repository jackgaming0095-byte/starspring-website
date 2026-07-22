import { z } from "zod";

/**
 * One schema, used by React Hook Form in the browser AND by the API route on
 * the server. The client copy is a convenience; the server copy is the gate.
 */

const optionalUrl = z
  .union([z.literal(""), z.url("Include the full address, starting with https://")])
  .optional();

export const LOCATION_OPTIONS = [
  "1 location",
  "2 to 5 locations",
  "6 to 20 locations",
  "More than 20 locations",
] as const;

export const BUSINESS_TYPE_OPTIONS = [
  "Restaurant or café",
  "Salon or spa",
  "Gym or studio",
  "Dentist or clinic",
  "Estate agency",
  "Car dealership",
  "Home services or trade",
  "Retail store",
  "Legal or finance firm",
  "Hotel or travel business",
  "Something else",
] as const;

export const auditRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tell us your name so we know who we are replying to.")
    .max(80, "That name is longer than we can store."),

  email: z
    .string()
    .trim()
    .min(1, "We need an email address to send the audit to.")
    .pipe(z.email("That does not look like a valid email address.")),

  phone: z
    .string()
    .trim()
    .min(6, "Add a phone number we can reach you on.")
    .max(32, "That number is longer than we can store.")
    .regex(/^[+()\d\s-]+$/, "Use digits, spaces and the + sign only."),

  businessName: z
    .string()
    .trim()
    .min(2, "Which business is this for?")
    .max(120, "That business name is longer than we can store."),

  website: optionalUrl,
  googleProfileUrl: optionalUrl,

  businessType: z.enum(BUSINESS_TYPE_OPTIONS, "Pick the closest match."),
  locations: z.enum(LOCATION_OPTIONS, "Let us know how many locations you run."),

  challenge: z
    .string()
    .trim()
    .min(10, "A sentence or two is plenty. What is the problem right now?")
    .max(1200, "Keep it under 1200 characters and we will ask the rest on the call."),

  consent: z.literal(true, "We need your permission before we can get in touch."),

  /*
    Spam controls. Both are invisible to real users and neither is validated
    here on purpose: the route inspects them AFTER a successful parse and
    answers 200 either way, so an automated submission never learns which
    control caught it. Rejecting `fax` in the schema would leak that in a
    400 response naming the field.
  */
  fax: z.string().optional(),
  renderedAt: z.number().int().nonnegative().optional(),
});

export type AuditRequest = z.infer<typeof auditRequestSchema>;

/** Fields the server persists. Spam controls are dropped, never stored. */
export type AuditLead = Omit<AuditRequest, "fax" | "renderedAt"> & {
  receivedAt: string;
};

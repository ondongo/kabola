import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID ?? "";
const authToken = process.env.TWILIO_AUTH_TOKEN ?? "";

/** Client Twilio Verify (SMS). Les variables d’environnement sont requises à l’exécution des routes /api/twilio. */
export const client = twilio(accountSid, authToken);

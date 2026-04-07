"use server";

export interface LoginState {
  message?: string;
}

export interface SignupState {
  errors?: Record<string, string[]>;
  message?: string;
}

export async function loginAction(
  _prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { message: "Veuillez remplir tous les champs." };
  }

  // TODO: implement actual auth with NextAuth
  return { message: "" };
}

export async function signupAction(
  _prevState: SignupState | undefined,
  formData: FormData,
): Promise<SignupState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: Record<string, string[]> = {};

  if (!name || name.length < 2) {
    errors.name = ["Le nom doit contenir au moins 2 caractères"];
  }
  if (!email) {
    errors.email = ["L'email est requis"];
  }
  if (!password || password.length < 8) {
    errors.password = ["Au moins 8 caractères"];
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = ["Les mots de passe ne correspondent pas"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // TODO: implement actual signup with Prisma + NextAuth
  return { message: "" };
}

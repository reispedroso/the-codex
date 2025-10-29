"use server";

import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "@/lib/validators/auth.schema";
import { ZodError } from "zod";
import { login, register } from "@/lib/services/auth.service";
import { createSession, deleteSession } from "@/lib/auth/session";

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};


function zodFieldErrors(err: ZodError): Record<string, string[] | undefined> {
  const formatted = err.format();
  const result: Record<string, string[] | undefined> = {};

  for (const [key, val] of Object.entries(formatted)) {
    if (key === "_errors") continue;
    if (val && typeof val === "object" && "_errors" in val) {
      const maybe = val as unknown as { _errors?: string[] };
      result[key] = maybe._errors;
    }
  }

  return result;
}

export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields. Please correct the errors and try again.",
      errors: zodFieldErrors(validatedFields.error),
    };
  }

  try {
    const credentials = validatedFields.data;
    const loginResponse = await login(credentials);

    await createSession(loginResponse);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
  redirect("/dashboard");
}

export async function signupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Campos inválidos. Corrija os erros e tente novamente.',
      errors: zodFieldErrors(validatedFields.error),
    };
  }

  try {
    const newUserData = validatedFields.data;
    const registerResponse = await register(newUserData);

    await createSession(registerResponse);

  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
    };
  }

  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  await deleteSession();

  redirect('/login');
}
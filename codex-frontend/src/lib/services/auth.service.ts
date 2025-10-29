import { apiClient } from "./api-client";
import type {
  UserLoginDto,
  LoginResponseDto,
  UserCreateDto,
} from "@/types/api/auth";

type ApiErrorResponse = {
  error: string;
};

export async function login(
  credentials: UserLoginDto
): Promise<LoginResponseDto> {
  const response = await apiClient("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw new Error(errorData.error || "Failed to log in");
  }

  return response.json() as Promise<LoginResponseDto>;
}

export async function register(
  userData: UserCreateDto
): Promise<LoginResponseDto> {
  const payload: Partial<UserCreateDto> = { ...userData };

  const response = await apiClient("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw new Error(errorData.error || "Failed to register");
  }

  return response.json() as Promise<LoginResponseDto>;
}

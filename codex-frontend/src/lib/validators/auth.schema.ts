import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ message: 'Email is required' })
        .email('Invalid email'),
    password: z
        .string({ message: 'Password is required' })
        .min(1, 'Password is required'),
});

export const signupSchema = z.object({
    username: z
        .string({ message: 'Username is required' })
        .min(5, 'Username must be at least 5 characters')
        .max(20, 'Username must be at most 20 characters'),

    firstName: z
        .string({ message: 'First name is required' })
        .min(1, 'First name is required'),

    lastName: z
        .string({ message: 'Last name is required' })
        .min(1, 'Last name is required'),

    email: z
        .string({ message: 'Email is required' })
        .email('Invalid email'),

    password: z
        .string({ message: 'Password is required' })
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),

    confirmPassword: z
        .string({ message: 'Password confirmation is required' }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

export type SignupFormInputs = z.infer<typeof signupSchema>;

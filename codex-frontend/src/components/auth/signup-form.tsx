'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { signupAction, type FormState } from '@/lib/actions/auth.actions';

const initialState: FormState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating account...' : 'Register'}
    </Button>
  );
}

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Hello! Please insert some info to create an account!
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="grid gap-4">
          
          {!state.success && state.message && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Register failed</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="firstName">First name</FieldLabel>
              <Input id="firstName" name="firstName" placeholder="John" required />
              {state.errors?.firstName && (
                <FieldDescription className="text-destructive">
                  {state.errors.firstName[0]}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Last name</FieldLabel>
              <Input id="lastName" name="lastName" placeholder="Doe" required />
              {state.errors?.lastName && (
                <FieldDescription className="text-destructive">
                  {state.errors.lastName[0]}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" name="username" placeholder="john.doe" required />
            {state.errors?.username && (
              <FieldDescription className="text-destructive">
                {state.errors.username[0]}
              </FieldDescription>
            )}
          </Field>
        
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Your best email"
              required
            />
            {state.errors?.email && (
              <FieldDescription className="text-destructive">
                {state.errors.email[0]}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" required />
            {state.errors?.password && (
              <FieldDescription className="text-destructive">
                {state.errors.password[0]}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
            {state.errors?.confirmPassword && (
              <FieldDescription className="text-destructive">
                {state.errors.confirmPassword[0]}
              </FieldDescription>
            )}
          </Field>

          <SubmitButton />

        </CardContent>
      </form>

      <CardFooter className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="underline ml-1">
          Login
        </Link>
      </CardFooter>
    </Card>
  );
}
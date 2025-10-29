'use client'; 
import { useActionState } from 'react';
import {  useFormStatus } from 'react-dom';
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

import { loginAction, type FormState } from '@/lib/actions/auth.actions';

const initialState: FormState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Login...' : 'Login'}
    </Button>
  );
}

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
 const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Welcome back! Please login to continue!
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="grid gap-4">
          
          {!state.success && state.message && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Login failed</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email" 
                type="email"
                placeholder="email@exemplo.com"
                required
              />
              {state.errors?.email && (
                <FieldDescription className="text-destructive">
                  {state.errors.email[0]}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
              {state.errors?.password && (
                <FieldDescription className="text-destructive">
                  {state.errors.password[0]}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
          <SubmitButton />
        </CardContent>
      </form>

      <CardFooter className="text-center text-sm">
        Doesnt have an account?{' '}
        <Link href="/register" className="underline ml-1">
         Register
        </Link>
      </CardFooter>
    </Card>
  );
}
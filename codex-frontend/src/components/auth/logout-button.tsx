import { useFormStatus } from "react-dom";
import { LogOutIcon } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth.actions";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { ComponentProps } from "react";

function LogoutButtonContent(props: ComponentProps<typeof SidebarMenuButton>) {
  const { pending } = useFormStatus();

  return (
    <SidebarMenuButton
      type="submit"
      disabled={pending}
      className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-500"
      tooltip={pending ? "Login out..." : "Logout"}
      {...props}
    >
      <LogOutIcon className="size-4" />
      <span className="group-data-[collapsible=icon]:hidden">
        {pending ? "Login out..." : "Logout"}
      </span>
    </SidebarMenuButton>
  );
}

export function LogoutButton(props: ComponentProps<typeof SidebarMenuButton>) {
  return (
    <form action={logoutAction} className="w-full">
      <LogoutButtonContent {...props} />
    </form>
  );
}
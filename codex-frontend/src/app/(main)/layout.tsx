'use client'; // O layout DEVE ser 'use client' por causa da Sidebar

import Link from 'next/link';
import {
  HomeIcon,
  BookIcon,
  SettingsIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger, // Importado
} from '@/components/ui/sidebar';

import { LogoutButton } from '@/components/auth/logout-button';
// Não precisamos mais do Button aqui no layout

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-r"
        variant="sidebar"
      >
        <SidebarHeader>
          {/* <Logo /> */}
        </SidebarHeader>

        <SidebarContent className="flex-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard">
                  <HomeIcon className="size-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Dashboard
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="All books">
                <Link href="/books">
                  <BookIcon className="size-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    All books
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="/settings">
                  <SettingsIcon className="size-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Settings
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <LogoutButton />
            </SidebarMenuItem>
            
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Header para a versão mobile */}
        <header className="flex h-12 items-center border-b px-4 md:hidden">
          
          {/* --- CORREÇÃO AQUI --- */}
          {/* O SidebarTrigger é o próprio botão. Não precisa de 'asChild' */}
          <SidebarTrigger />
          {/* --- FIM DA CORREÇÃO --- */}
          
          <h1 className="text-lg font-semibold ml-2">Codex</h1>
        </header>
        
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
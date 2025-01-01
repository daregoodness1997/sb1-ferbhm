import React, { FC, memo } from "react";

import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );
};

export default AppLayout;

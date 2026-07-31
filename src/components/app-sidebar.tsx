import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Send,
  CalendarDays,
  TrendingUp,
  Wallet,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const modules = [
  { title: "Executive Dashboard", url: "/", icon: LayoutDashboard, mod: "M1" },
  { title: "Client Tracker", url: "/principals", icon: Users, mod: "M2" },
  { title: "Outreach Tracker", url: "/outreach", icon: Send, mod: "M3" },
  { title: "Meeting Planner", url: "/meetings", icon: CalendarDays, mod: "M4" },
  { title: "Opportunity Pipeline", url: "/pipeline", icon: TrendingUp, mod: "M5" },
];

const purchaseModules = [
  { title: "Meeting Planner", url: "/purchase-meetings", icon: CalendarDays, mod: "P1" },
  { title: "Outreach Tracker", url: "/purchase-outreach", icon: Send, mod: "P2" },
  { title: "Sourcing Pipeline", url: "/purchase-pipeline", icon: TrendingUp, mod: "P3" },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="font-display text-sm font-semibold tracking-tight text-sidebar-foreground">
              Rawji × IFEAT 2026
            </div>
            <div className="text-[11px] uppercase tracking-widest text-sidebar-foreground/60">
              Bangkok War Room
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {[
          { label: "Sales Modules", items: modules },
          { label: "Purchase Modules", items: purchaseModules },
        ].map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          <span className="text-[10px] font-mono text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
                            {item.mod}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-2 text-[11px] text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
          <div className="font-semibold text-sidebar-foreground/80">T-23 days to event</div>
          <div>Oct 19 – 23, 2026 · Bangkok</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

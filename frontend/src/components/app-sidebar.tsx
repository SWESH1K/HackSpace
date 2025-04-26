import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onMenuItemClick: (title: string) => void;
  userId: string|undefined;
  hackathonAdminId: string|undefined;
}

export function AppSidebar({ onMenuItemClick, userId, hackathonAdminId,...props }: AppSidebarProps) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const data = {
    navMain: [
      {
        title: "Getting Started",
        url: "#",
        items: [
          {
            title: "Overview",
            url: "#",
            isActive: true,
          },
          {
            title: "Problem Statements",
            url: "#",
          },
          {
            title: "Rules and Instructions",
            url: "#",
          },
          {
            title: "Rounds-Evaluation",
            url: "#",
          },
        ],
      },
      {
        title: "Enrollments",
        url: "#",
        items: [
          {
            title: "Register",
            url: "#",
          },
          {
            title: "Participants",
            url: "#",
          },
          {
            title: "All Teams",
            url: "#",
          },
        ],
      },
      {
        title: "Results and Announcements",
        url: "#",
        items: [
          {
            title: "Announcements",
            url: "#",
          },
          {
            title: "Result",
            url: "#",
          },
        ],
      },
      ...(userId === hackathonAdminId
        ? [
            {
              title: "Admin Panel",
              url: "#",
              items: [
                {
                  title: "Problem-Statements",
                  url: "#",
                },
                {
                  title: "Rules-and-Instructions",
                  url: "#",
                },
              ],
            },
          ]
        : []),
    ],
  };

  const handleItemClick = (title: string) => {
    setActiveItem(title);
    onMenuItemClick(title);
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="text-xl md:text-3xl font-bold ml-5">
              <a href="/">HackSpace</a>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-[45px]">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={activeItem === item.title}
                  onClick={() => handleItemClick(item.title)}
                >
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={activeItem === subItem.title}
                          onClick={() => handleItemClick(subItem.title)}
                        >
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
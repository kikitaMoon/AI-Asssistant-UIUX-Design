import React from 'react';
import { MessageSquare, Plus, Settings, History } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Mock historical topics data
const historicalTopics = [
  { id: '1', title: 'React State Management', date: '2025-05-26' },
  { id: '2', title: 'API Integration Help', date: '2025-05-25' },
  { id: '3', title: 'CSS Grid Layout', date: '2025-05-24' },
  { id: '4', title: 'TypeScript Best Practices', date: '2025-05-23' },
  { id: '5', title: 'Database Design Questions', date: '2025-05-22' },
];

interface AppSidebarProps {
  onNewChat: () => void;
  onSettingsClick: () => void;
}

export function AppSidebar({ onNewChat, onSettingsClick }: AppSidebarProps) {
  const handleTopicClick = (topicId: string) => {
    console.log('Loading topic:', topicId);
    // This would typically load the selected conversation
  };

  const handleNewChatClick = () => {
    console.log('New chat clicked from sidebar');
    onNewChat();
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleNewChatClick}
              className="w-full justify-start bg-sidebar-accent hover:bg-sidebar-accent/80"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Chat History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)]">
              {historicalTopics.map((topic) => (
                <SidebarMenuItem key={topic.id}>
                  <SidebarMenuButton 
                    onClick={() => handleTopicClick(topic.id)}
                    className="flex flex-col items-start gap-1 h-auto py-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <MessageSquare className="w-3 h-3 flex-shrink-0" />
                      <span className="text-sm truncate">{topic.title}</span>
                    </div>
                    <span className="text-xs text-sidebar-foreground/60 ml-5">
                      {topic.date}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={onSettingsClick}
              className="w-full justify-start hover:bg-sidebar-accent"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

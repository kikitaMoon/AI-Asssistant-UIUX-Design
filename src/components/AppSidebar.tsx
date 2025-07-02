
import React, { useState } from 'react';
import { MessageSquare, Plus, Settings, History, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const handleTopicClick = (topicId: string) => {
    console.log('Loading topic:', topicId);
    // This would typically load the selected conversation
  };

  const handleRename = (topicId: string) => {
    console.log('Renaming topic:', topicId);
    // This would open a rename dialog
  };

  const handleDelete = (topicId: string) => {
    console.log('Deleting topic:', topicId);
    // This would delete the conversation
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={onNewChat}
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
                  <div 
                    className="group relative flex items-center w-full"
                    onMouseEnter={() => setHoveredTopic(topic.id)}
                    onMouseLeave={() => setHoveredTopic(null)}
                  >
                    <SidebarMenuButton 
                      onClick={() => handleTopicClick(topic.id)}
                      className="flex-1 justify-start text-left h-auto py-2 pr-8"
                    >
                      <MessageSquare className="w-3 h-3 flex-shrink-0" />
                      <span className="text-sm truncate">{topic.title}</span>
                    </SidebarMenuButton>
                    
                    {hoveredTopic === topic.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="absolute right-1 p-1 rounded hover:bg-sidebar-accent opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem onClick={() => handleRename(topic.id)} className="text-sm">
                            <Edit2 className="w-3 h-3 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(topic.id)} 
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
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

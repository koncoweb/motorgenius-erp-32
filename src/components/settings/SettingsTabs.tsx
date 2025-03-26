
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./ProfileTab";
import { NotificationsTab } from "./NotificationsTab";
import { AppearanceTab } from "./AppearanceTab";
import { Profile } from "@/context/auth/types";

interface SettingsTabsProps {
  profile: Profile | null;
  userEmail: string | undefined;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ profile, userEmail }) => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="mb-6 w-full justify-start">
        <TabsTrigger value="profile">Profil</TabsTrigger>
        <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
        <TabsTrigger value="appearance">Tampilan</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileTab profile={profile} userEmail={userEmail} />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>
      
      <TabsContent value="appearance">
        <AppearanceTab />
      </TabsContent>
    </Tabs>
  );
};

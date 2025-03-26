
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/context/auth";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  
  return (
    <Layout>
      <PageHeader 
        title="Pengaturan" 
        description="Kelola pengaturan akun, notifikasi, dan tampilan aplikasi."
      />
      
      <div className="container mx-auto py-6">
        <SettingsTabs profile={profile} userEmail={user?.email} />
      </div>
    </Layout>
  );
};

export default Settings;

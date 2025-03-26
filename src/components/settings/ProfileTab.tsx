
import React from "react";
import { Profile } from "@/context/auth/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ProfileTabProps {
  profile: Profile | null;
  userEmail: string | undefined;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, userEmail }) => {
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profil berhasil diperbarui");
  };

  return (
    <Card className="backdrop-blur-sm bg-card/50 border border-muted/30">
      <CardHeader>
        <CardTitle>Informasi Profil</CardTitle>
        <CardDescription>
          Perbarui informasi profil Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nama Depan</Label>
              <Input 
                id="firstName" 
                defaultValue={profile?.first_name || ""}
                placeholder="Nama depan Anda" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nama Belakang</Label>
              <Input 
                id="lastName" 
                defaultValue={profile?.last_name || ""}
                placeholder="Nama belakang Anda" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={userEmail || ""}
                placeholder="Email Anda"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input 
                id="phone" 
                type="tel" 
                defaultValue={profile?.phone || ""}
                placeholder="Nomor telepon Anda" 
              />
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label htmlFor="department">Departemen</Label>
            <Input 
              id="department" 
              defaultValue={profile?.department || ""}
              placeholder="Departemen Anda" 
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-primary text-white">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

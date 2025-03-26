
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profil berhasil diperbarui");
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pengaturan notifikasi berhasil diperbarui");
  };
  
  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pengaturan tampilan berhasil diperbarui");
  };

  return (
    <Layout>
      <PageHeader 
        title="Pengaturan" 
        description="Kelola pengaturan akun, notifikasi, dan tampilan aplikasi."
      />
      
      <div className="container mx-auto py-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
            <TabsTrigger value="appearance">Tampilan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
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
                        defaultValue={user?.email || ""}
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
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio" 
                      rows={4}
                      defaultValue={profile?.bio || ""}
                      placeholder="Ceritakan sedikit tentang diri Anda"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background p-3 text-sm"
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
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="backdrop-blur-sm bg-card/50 border border-muted/30">
              <CardHeader>
                <CardTitle>Pengaturan Notifikasi</CardTitle>
                <CardDescription>
                  Atur preferensi notifikasi Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNotifications} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Notifikasi Email</Label>
                        <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Notifikasi Work Order</Label>
                        <p className="text-sm text-muted-foreground">Terima notifikasi saat status work order berubah</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Notifikasi Inventaris</Label>
                        <p className="text-sm text-muted-foreground">Terima notifikasi saat stok hampir habis</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Notifikasi Jadwal</Label>
                        <p className="text-sm text-muted-foreground">Terima pengingat jadwal upcoming</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Ringkasan Mingguan</Label>
                        <p className="text-sm text-muted-foreground">Terima ringkasan mingguan kinerja bisnis</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-primary text-white">
                      Simpan Pengaturan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card className="backdrop-blur-sm bg-card/50 border border-muted/30">
              <CardHeader>
                <CardTitle>Pengaturan Tampilan</CardTitle>
                <CardDescription>
                  Sesuaikan tampilan aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveAppearance} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Mode Gelap</Label>
                        <p className="text-sm text-muted-foreground">Beralih ke tema gelap</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Animasi</Label>
                        <p className="text-sm text-muted-foreground">Aktifkan animasi UI</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Efek Blur</Label>
                        <p className="text-sm text-muted-foreground">Aktifkan efek glassmorphism</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Ukuran Font</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="w-full">Kecil</Button>
                        <Button variant="default" className="w-full">Sedang</Button>
                        <Button variant="outline" className="w-full">Besar</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-primary text-white">
                      Simpan Pengaturan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;

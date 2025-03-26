
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const NotificationsTab: React.FC = () => {
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pengaturan notifikasi berhasil diperbarui");
  };

  return (
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
  );
};

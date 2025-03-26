
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const AppearanceTab: React.FC = () => {
  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pengaturan tampilan berhasil diperbarui");
  };

  return (
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
  );
};

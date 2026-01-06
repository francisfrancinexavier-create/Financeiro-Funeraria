import React, { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LogoUploadProps {
  companyId: string;
  currentLogoUrl?: string;
  onLogoUploaded: (url: string) => void;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  companyId,
  currentLogoUrl,
  onLogoUploaded
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Apenas arquivos PNG, JPG e SVG são permitidos.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 2MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${companyId}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onLogoUploaded(publicUrl);

      toast({
        title: "Logo enviado com sucesso!",
        description: "O logo da empresa foi atualizado."
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Erro ao enviar logo",
        description: "Não foi possível enviar o logo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = () => {
    setPreviewUrl(null);
    onLogoUploaded('');
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="logo-upload">Logo da Empresa</Label>
      
      {previewUrl ? (
        <div className="relative w-32 h-32 border-2 border-dashed border-border rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="Logo preview"
            className="w-full h-full object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1"
            onClick={removeLogo}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
          <Image className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      <div>
        <Input
          id="logo-upload"
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
        <Label htmlFor="logo-upload" className="cursor-pointer">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="w-full"
            asChild
          >
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Enviando...' : 'Selecionar Logo'}
            </span>
          </Button>
        </Label>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Formatos aceitos: PNG, JPG, SVG. Tamanho máximo: 2MB.
      </p>
    </div>
  );
};
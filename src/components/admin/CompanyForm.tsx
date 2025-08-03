import React, { useState } from 'react';
import { Building2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LogoUpload } from './LogoUpload';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Company {
  id?: string;
  name: string;
  cnpj: string;
  type: string;
  city: string;
  logo_url?: string;
  brand_color: string;
}

interface CompanyFormProps {
  company?: Company;
  onSaved: () => void;
  onCancel: () => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSaved,
  onCancel
}) => {
  const [formData, setFormData] = useState<Company>({
    name: company?.name || '',
    cnpj: company?.cnpj || '',
    type: company?.type || '',
    city: company?.city || '',
    logo_url: company?.logo_url || '',
    brand_color: company?.brand_color || '#3b82f6'
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: keyof Company, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
  };

  const formatCNPJ = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    handleInputChange('cnpj', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCNPJ(formData.cnpj)) {
      toast({
        title: "CNPJ inválido",
        description: "Por favor, insira um CNPJ válido com 14 dígitos.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      const cleanCNPJ = formData.cnpj.replace(/\D/g, '');
      
      if (company?.id) {
        // Update existing company
        const { error } = await supabase
          .from('companies')
          .update({
            name: formData.name,
            cnpj: cleanCNPJ,
            type: formData.type,
            city: formData.city,
            logo_url: formData.logo_url,
            brand_color: formData.brand_color
          })
          .eq('id', company.id);

        if (error) throw error;
      } else {
        // Create new company
        const { error } = await supabase
          .from('companies')
          .insert({
            name: formData.name,
            cnpj: cleanCNPJ,
            type: formData.type,
            city: formData.city,
            logo_url: formData.logo_url,
            brand_color: formData.brand_color
          });

        if (error) throw error;
      }

      toast({
        title: "Empresa salva com sucesso!",
        description: company?.id ? "A empresa foi atualizada." : "Nova empresa foi cadastrada."
      });

      onSaved();
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: "Erro ao salvar empresa",
        description: "Não foi possível salvar a empresa. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {company?.id ? 'Editar Empresa' : 'Nova Empresa'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Empresa LTDA"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => handleCNPJChange(e.target.value)}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LTDA">LTDA</SelectItem>
                  <SelectItem value="MEI">MEI</SelectItem>
                  <SelectItem value="SA">S/A</SelectItem>
                  <SelectItem value="EIRELI">EIRELI</SelectItem>
                  <SelectItem value="SLU">SLU</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Ex: São Paulo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_color">Cor da Marca</Label>
              <div className="flex gap-2">
                <Input
                  id="brand_color"
                  type="color"
                  value={formData.brand_color}
                  onChange={(e) => handleInputChange('brand_color', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.brand_color}
                  onChange={(e) => handleInputChange('brand_color', e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <LogoUpload
              companyId={company?.id || 'new'}
              currentLogoUrl={formData.logo_url}
              onLogoUploaded={(url) => handleInputChange('logo_url', url)}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
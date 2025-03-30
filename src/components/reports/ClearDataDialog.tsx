
import React from 'react';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ClearDataDialogProps {
  onClearData: () => Promise<void>;
}

export const ClearDataDialog = ({ onClearData }: ClearDataDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors">
          <Trash2 className="h-4 w-4" />
          <span>Limpar Dados</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Limpar todos os dados?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá remover todas as receitas, despesas e relatórios do sistema. 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Limpar dados
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

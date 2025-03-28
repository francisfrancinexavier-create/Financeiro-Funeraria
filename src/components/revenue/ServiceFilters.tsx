
import React from 'react';
import { Search, Filter, Calendar, Download, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ServiceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  isDateRangeOpen: boolean;
  setIsDateRangeOpen: (open: boolean) => void;
  onExport: () => void;
  onAddNew: () => void;
  onDeleteAll: () => void;
  hasServices: boolean;
  handleDateRangeApply: () => void;
  resetDateRange: () => void;
}

export const ServiceFilters = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isFilterSheetOpen,
  setIsFilterSheetOpen,
  isDateRangeOpen,
  setIsDateRangeOpen,
  onExport,
  onAddNew,
  onDeleteAll,
  hasServices,
  handleDateRangeApply,
  resetDateRange
}: ServiceFiltersProps) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Buscar serviço ou cliente..."
            className="pl-10 pr-4 py-2 w-full border border-border rounded-lg subtle-ring-focus text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Filtrar</span>
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                  <SheetDescription>
                    Filtre os serviços por diferentes critérios
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Status do Pagamento</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSelectedStatus(null);
                          setIsFilterSheetOpen(false);
                        }}
                        className={cn(
                          "px-3 py-1 text-sm rounded-full transition-colors",
                          selectedStatus === null 
                            ? "bg-primary text-white" 
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStatus('paid');
                          setIsFilterSheetOpen(false);
                        }}
                        className={cn(
                          "px-3 py-1 text-sm rounded-full transition-colors",
                          selectedStatus === 'paid' 
                            ? "bg-green-500 text-white" 
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        )}
                      >
                        Pagos
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStatus('pending');
                          setIsFilterSheetOpen(false);
                        }}
                        className={cn(
                          "px-3 py-1 text-sm rounded-full transition-colors",
                          selectedStatus === 'pending' 
                            ? "bg-blue-500 text-white" 
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        )}
                      >
                        Pendentes
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStatus('late');
                          setIsFilterSheetOpen(false);
                        }}
                        className={cn(
                          "px-3 py-1 text-sm rounded-full transition-colors",
                          selectedStatus === 'late' 
                            ? "bg-red-500 text-white" 
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        )}
                      >
                        Atrasados
                      </button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Sheet open={isDateRangeOpen} onOpenChange={setIsDateRangeOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span>Período</span>
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Selecionar Período</SheetTitle>
                  <SheetDescription>
                    Defina um intervalo de datas para filtrar os serviços
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Data Inicial</h3>
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      className="rounded-md border shadow p-3 pointer-events-auto"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Data Final</h3>
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => startDate ? date < startDate : false}
                      className="rounded-md border shadow p-3 pointer-events-auto"
                    />
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleDateRangeApply} variant="default">
                      Aplicar
                    </Button>
                    <Button onClick={resetDateRange} variant="outline">
                      Limpar
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <button 
              onClick={onExport}
              className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={onAddNew}
              className="premium-button flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Serviço</span>
            </button>
            
            {hasServices && (
              <button 
                onClick={onDeleteAll}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir Tudo</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setSelectedStatus(null)}
          className={cn(
            "px-3 py-1 text-sm rounded-full transition-colors",
            selectedStatus === null 
              ? "bg-primary text-white" 
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedStatus('paid')}
          className={cn(
            "px-3 py-1 text-sm rounded-full transition-colors",
            selectedStatus === 'paid' 
              ? "bg-green-500 text-white" 
              : "bg-green-100 text-green-800 hover:bg-green-200"
          )}
        >
          Pagos
        </button>
        <button
          onClick={() => setSelectedStatus('pending')}
          className={cn(
            "px-3 py-1 text-sm rounded-full transition-colors",
            selectedStatus === 'pending' 
              ? "bg-blue-500 text-white" 
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          )}
        >
          Pendentes
        </button>
        <button
          onClick={() => setSelectedStatus('late')}
          className={cn(
            "px-3 py-1 text-sm rounded-full transition-colors",
            selectedStatus === 'late' 
              ? "bg-red-500 text-white" 
              : "bg-red-100 text-red-800 hover:bg-red-200"
          )}
        >
          Atrasados
        </button>
      </div>
    </div>
  );
};

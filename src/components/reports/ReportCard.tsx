
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  delay?: number;
  onClick?: () => void;
}

export const ReportCard = ({ title, description, icon: Icon, delay = 0, onClick }: ReportCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="premium-card p-6 cursor-pointer hover:animate-card-hover"
      onClick={onClick}
    >
      <div className="p-3 rounded-full bg-primary/10 inline-flex mb-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center space-x-1 mt-4 text-primary text-sm font-medium">
        <span>Visualizar</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </div>
    </motion.div>
  );
};

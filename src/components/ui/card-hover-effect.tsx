
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const CardHoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon: React.ReactNode;
    link?: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/0 opacity-0 blur-xl group-hover:opacity-100 transition duration-300"
            animate={{
              scale: hoveredIndex === idx ? 1 : 0.95,
              opacity: hoveredIndex === idx ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
          
          <motion.div
            className="premium-card relative h-full p-6 flex flex-col justify-between"
            animate={{
              scale: hoveredIndex === idx ? 1.02 : 1,
              boxShadow:
                hoveredIndex === idx
                  ? "0 10px 20px 0 rgba(0, 0, 0, 0.1)"
                  : "0 4px 28px 0 rgba(0, 0, 0, 0.05)",
            }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <div className="p-3 rounded-full bg-primary/10 inline-flex mb-4">
                {item.icon}
              </div>
              <h3 className="font-medium text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">
                {item.description}
              </p>
            </div>
            
            {item.link && (
              <div className="mt-4">
                <a
                  href={item.link}
                  className="text-primary text-sm font-medium inline-flex items-center gap-1 animated-underline"
                >
                  Acessar
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

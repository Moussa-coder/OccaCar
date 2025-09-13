import { cn } from "@/lib/utils";
import logoImage from "@/Assets/logo.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white" | "primary";
}

export function Logo({ 
  className, 
  showText = true, 
  size = "md", 
  variant = "default" 
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Logo OccazCar */}
      <div className={cn(
        "flex items-center justify-center rounded-lg bg-primary/10",
        sizeClasses[size]
      )}>
        <img 
          src={logoImage} 
          alt="OccazCar Logo" 
          className="h-full w-full object-contain"
        />
      </div>
      
      {showText && (
        <span className={cn(
          "font-bold gradient-text",
          textSizeClasses[size],
          variant === "white" ? "text-white" : ""
        )}>
          OccazCar
        </span>
      )}
    </div>
  );
}

// Composant Logo simple (juste l'icône)
export function LogoIcon({ 
  className, 
  size = "md",
  variant = "default" 
}: Omit<LogoProps, 'showText'>) {
  return (
    <Logo 
      className={className}
      showText={false}
      size={size}
      variant={variant}
    />
  );
}

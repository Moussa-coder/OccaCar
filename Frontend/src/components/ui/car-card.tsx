import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Fuel, Gauge, MapPin, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarCardProps {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  location: string;
  imageUrl: string;
  isAvailable: boolean;
  className?: string;
}

export function CarCard({
  id,
  title,
  price,
  year,
  mileage,
  fuel,
  location,
  imageUrl,
  isAvailable,
  className,
}: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('fr-FR').format(mileage);
  };
  
  return (
    <div className={cn("car-card bg-card rounded-lg border overflow-hidden group", className)}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Disponible" : "Vendue"}
          </Badge>
        </div>
        
        {/* View Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            asChild
          >
            <Link to={`/voiture/${id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold text-lg">
            {formatPrice(price)}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
          <Link to={`/voiture/${id}`}>
            {title}
          </Link>
        </h3>
        
        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Gauge className="h-4 w-4" />
            <span>{formatMileage(mileage)} km</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Fuel className="h-4 w-4" />
            <span>{fuel}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          asChild
        >
          <Link to={`/voiture/${id}`}>
            Voir les détails
          </Link>
        </Button>
      </div>
    </div>
  );
}
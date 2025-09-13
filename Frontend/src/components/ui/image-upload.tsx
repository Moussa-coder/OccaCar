import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  images: File[];
  imagePreviews: string[];
  onImagesChange: (images: File[]) => void;
  onPreviewsChange: (previews: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  images,
  imagePreviews,
  onImagesChange,
  onPreviewsChange,
  maxImages = 8,
  maxSizeMB = 5,
  disabled = false,
  className = ""
}: ImageUploadProps) {
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > maxImages) {
      toast({
        title: "Limite d'images dépassée",
        description: `Vous ne pouvez télécharger que ${maxImages} images maximum`,
        variant: "destructive"
      });
      return;
    }
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Format de fichier invalide",
          description: `${file.name} n'est pas une image valide`,
          variant: "destructive"
        });
        return false;
      }
      
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de ${maxSizeMB}MB`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });
    
    // Add new images
    onImagesChange([...images, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPreviewsChange([...imagePreviews, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    onImagesChange(newImages);
    onPreviewsChange(newPreviews);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      <div className="flex items-center justify-center w-full">
        <label 
          htmlFor="image-upload" 
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors ${
            disabled || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Cliquez pour télécharger</span> ou glissez-déposez
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à {maxSizeMB}MB</p>
          </div>
          <input 
            id="image-upload" 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
            disabled={disabled || images.length >= maxImages}
          />
        </label>
      </div>
      
      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                  Principal
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
      
      <p className="text-sm text-muted-foreground">
        {images.length}/{maxImages} photos • La première photo sera utilisée comme photo principale
      </p>
    </div>
  );
}

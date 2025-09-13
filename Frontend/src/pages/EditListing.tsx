import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Car, 
  Calendar, 
  Gauge, 
  Fuel, 
  MapPin, 
  Euro,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour récupérer l'annonce à modifier
const mockListingData = {
  "1": {
    id: "1",
    title: "BMW Série 3 320d Luxury",
    price: 25900,
    year: 2019,
    mileage: 85000,
    fuel: "Diesel",
    location: "Paris 75015",
    description: "Véhicule en excellent état, entretien suivi chez BMW. Première main, jamais accidenté.",
    transmission: "Manuelle",
    color: "Noir",
    doors: 4,
    seats: 5,
    power: 190,
    consumption: 4.5,
    co2: 118,
    firstRegistration: "2019-03-15",
    lastTechnicalInspection: "2023-03-15",
    warranty: "6 mois",
    selectedEquipments: ["Climatisation", "GPS", "Bluetooth", "Caméra de recul"],
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300"
    ]
  }
};

const fuelTypes = ["Essence", "Diesel", "Hybride", "Électrique", "GPL", "Éthanol"];
const transmissionTypes = ["Manuelle", "Automatique", "Semi-automatique"];
const colors = ["Blanc", "Noir", "Gris", "Rouge", "Bleu", "Vert", "Jaune", "Orange", "Beige", "Argent"];
const doorOptions = [2, 3, 4, 5];
const seatOptions = [2, 4, 5, 7, 8, 9];
const warrantyOptions = ["Aucune", "3 mois", "6 mois", "1 an", "2 ans"];

const equipmentOptions = [
  "Climatisation", "GPS", "Bluetooth", "Caméra de recul", "Régulateur de vitesse",
  "Limiteur de vitesse", "ABS", "ESP", "Airbags", "Sièges chauffants",
  "Toit ouvrant", "Jantes alliage", "Phares LED", "Détecteur de pluie",
  "Rétroviseurs électriques", "Vitres électriques", "Verrouillage centralisé"
];

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    location: "",
    description: "",
    transmission: "",
    color: "",
    doors: "",
    seats: "",
    power: "",
    consumption: "",
    co2: "",
    firstRegistration: "",
    lastTechnicalInspection: "",
    warranty: "",
    selectedEquipments: [] as string[]
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const loadListingData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      // Simulation du chargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const listingData = mockListingData[id as keyof typeof mockListingData];
      if (listingData) {
        setFormData({
          title: listingData.title,
          price: listingData.price.toString(),
          year: listingData.year.toString(),
          mileage: listingData.mileage.toString(),
          fuel: listingData.fuel,
          location: listingData.location,
          description: listingData.description,
          transmission: listingData.transmission,
          color: listingData.color,
          doors: listingData.doors.toString(),
          seats: listingData.seats.toString(),
          power: listingData.power.toString(),
          consumption: listingData.consumption.toString(),
          co2: listingData.co2.toString(),
          firstRegistration: listingData.firstRegistration,
          lastTechnicalInspection: listingData.lastTechnicalInspection,
          warranty: listingData.warranty,
          selectedEquipments: listingData.selectedEquipments
        });
        
        // Simuler les images existantes
        setImagePreviews(listingData.images);
      } else {
        toast({
          title: "Erreur",
          description: "Annonce non trouvée",
          variant: "destructive"
        });
        navigate('/mes-annonces');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de l'annonce",
        variant: "destructive"
      });
      navigate('/mes-annonces');
    } finally {
      setIsLoadingData(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    loadListingData();
  }, [loadListingData]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedEquipments: checked
        ? [...prev.selectedEquipments, equipment]
        : prev.selectedEquipments.filter(e => e !== equipment)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    
    // Calculate total images (existing + new)
    const totalImages = imagePreviews.length + files.length;
    
    if (totalImages > 8) {
      toast({
        title: "Limite d'images dépassée",
        description: "Vous ne pouvez télécharger que 8 images maximum",
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
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de 5MB`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });
    
    // Add new images
    setImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear the input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    // If it's an existing image (from imagePreviews), we only remove from previews
    // If it's a new image (from images), we remove from both arrays
    const isExistingImage = index < (imagePreviews.length - images.length);
    
    if (isExistingImage) {
      // Remove existing image from previews only
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove new image from both arrays
      const newImageIndex = index - (imagePreviews.length - images.length);
      setImages(prev => prev.filter((_, i) => i !== newImageIndex));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Le prix doit être supérieur à 0";
    if (!formData.year || parseInt(formData.year) < 1990 || parseInt(formData.year) > new Date().getFullYear() + 1) {
      newErrors.year = "Année invalide";
    }
    if (!formData.mileage || parseInt(formData.mileage) < 0) newErrors.mileage = "Kilométrage invalide";
    if (!formData.fuel) newErrors.fuel = "Type de carburant requis";
    if (!formData.location.trim()) newErrors.location = "Localisation requise";
    if (!formData.description.trim()) newErrors.description = "Description requise";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erreurs dans le formulaire",
        description: "Veuillez corriger les erreurs avant de continuer",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare form data for multipart upload
      const submitData = new FormData();
      
      // Add car data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'selectedEquipments') {
          submitData.append(key, JSON.stringify(value));
        } else if (typeof value === 'string') {
          submitData.append(key, value);
        }
      });
      
      // Add new images
      images.forEach((image) => {
        submitData.append(`images`, image);
      });

      // API call to update
      // const response = await axios.put(`/api/cars/${id}/`, submitData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });

      // Simulation d'une réponse réussie
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Annonce modifiée avec succès",
        description: "Vos modifications ont été sauvegardées",
      });
      
      // Redirection vers mes annonces
      navigate('/mes-annonces');
      
    } catch (error: unknown) {
      console.error('Edit listing error:', error);
      toast({
        title: "Erreur lors de la modification",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/mes-annonces')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Modifier l'annonce</h1>
            <p className="text-muted-foreground">
              Modifiez les informations de votre véhicule
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'annonce *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: BMW Série 3 320d Luxury"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€) *</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="25900"
                      className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre véhicule, son état, son historique..."
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Caractéristiques techniques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Caractéristiques techniques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="year">Année *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="2019"
                      className={`pl-10 ${errors.year ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mileage">Kilométrage (km) *</Label>
                  <div className="relative">
                    <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                      placeholder="85000"
                      className={`pl-10 ${errors.mileage ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fuel">Carburant *</Label>
                  <Select value={formData.fuel} onValueChange={(value) => handleInputChange('fuel', value)}>
                    <SelectTrigger className={errors.fuel ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fuel && <p className="text-sm text-red-500">{errors.fuel}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map((transmission) => (
                        <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Couleur</Label>
                  <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doors">Nombre de portes</Label>
                  <Select value={formData.doors} onValueChange={(value) => handleInputChange('doors', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {doorOptions.map((doors) => (
                        <SelectItem key={doors} value={doors.toString()}>{doors}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seats">Nombre de places</Label>
                  <Select value={formData.seats} onValueChange={(value) => handleInputChange('seats', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {seatOptions.map((seats) => (
                        <SelectItem key={seats} value={seats.toString()}>{seats}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="power">Puissance (ch)</Label>
                  <Input
                    id="power"
                    type="number"
                    value={formData.power}
                    onChange={(e) => handleInputChange('power', e.target.value)}
                    placeholder="190"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="consumption">Consommation (L/100km)</Label>
                  <div className="relative">
                    <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="consumption"
                      type="number"
                      step="0.1"
                      value={formData.consumption}
                      onChange={(e) => handleInputChange('consumption', e.target.value)}
                      placeholder="4.5"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="co2">Émissions CO2 (g/km)</Label>
                  <Input
                    id="co2"
                    type="number"
                    value={formData.co2}
                    onChange={(e) => handleInputChange('co2', e.target.value)}
                    placeholder="118"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localisation et garantie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localisation et garantie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Paris 75015"
                      className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="warranty">Garantie</Label>
                  <Select value={formData.warranty} onValueChange={(value) => handleInputChange('warranty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {warrantyOptions.map((warranty) => (
                        <SelectItem key={warranty} value={warranty}>{warranty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstRegistration">Première mise en circulation</Label>
                  <Input
                    id="firstRegistration"
                    type="date"
                    value={formData.firstRegistration}
                    onChange={(e) => handleInputChange('firstRegistration', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastTechnicalInspection">Dernier contrôle technique</Label>
                  <Input
                    id="lastTechnicalInspection"
                    type="date"
                    value={formData.lastTechnicalInspection}
                    onChange={(e) => handleInputChange('lastTechnicalInspection', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Équipements */}
          <Card>
            <CardHeader>
              <CardTitle>Équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {equipmentOptions.map((equipment) => (
                  <div key={equipment} className="flex items-center space-x-2">
                    <Checkbox
                      id={equipment}
                      checked={formData.selectedEquipments.includes(equipment)}
                      onCheckedChange={(checked) => handleEquipmentChange(equipment, checked as boolean)}
                    />
                    <Label htmlFor={equipment} className="text-sm">{equipment}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Photos du véhicule</span>
              </CardTitle>
              <CardDescription>
                Ajoutez jusqu'à 8 photos de votre véhicule (formats: JPG, PNG, max 5MB par photo)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Upload Button */}
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="image-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors ${
                    isLoading || imagePreviews.length >= 8 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Cliquez pour télécharger</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5MB</p>
                    </div>
                    <input 
                      id="image-upload" 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      disabled={isLoading || imagePreviews.length >= 8}
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
                  {imagePreviews.length}/8 photos • La première photo sera utilisée comme photo principale
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/mes-annonces')}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Sauvegarder les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

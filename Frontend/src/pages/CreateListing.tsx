import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Car, 
  AlertCircle, 
  CheckCircle2,
  ImageIcon,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const carBrands = [
  "Audi", "BMW", "Citroën", "Ford", "Mercedes-Benz", "Nissan", 
  "Opel", "Peugeot", "Renault", "Toyota", "Volkswagen", "Volvo"
];

const fuelTypes = [
  "Essence", "Diesel", "Hybride", "Électrique", "GPL", "Éthanol"
];

const transmissionTypes = [
  "Manuelle", "Automatique", "Semi-automatique"
];

const equipments = [
  "Climatisation", "GPS/Navigation", "Bluetooth", "Caméra de recul",
  "Régulateur de vitesse", "Jantes alliage", "Toit ouvrant", 
  "Sièges cuir", "Sièges chauffants", "Phares LED/Xénon",
  "Aide au stationnement", "Démarrage sans clé", "USB/AUX"
];

export default function CreateListing() {
  const navigate = useNavigate();
  
  // Vérifier l'authentification au chargement de la page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      navigate('/login', { 
        state: { 
          message: 'Vous devez être connecté pour vendre une voiture',
          redirectTo: '/deposer'
        } 
      });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    version: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    transmission: "",
    power: "",
    doors: "",
    seats: "",
    color: "",
    location: "",
    description: "",
    phone: "",
    selectedEquipments: [] as string[],
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleEquipmentToggle = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      selectedEquipments: prev.selectedEquipments.includes(equipment)
        ? prev.selectedEquipments.filter(e => e !== equipment)
        : [...prev.selectedEquipments, equipment]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 8) {
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
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.brand) newErrors.brand = "La marque est requise";
    if (!formData.model.trim()) newErrors.model = "Le modèle est requis";
    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = "Le prix doit être un nombre valide";
    }
    if (!formData.year || isNaN(Number(formData.year)) || Number(formData.year) < 1990 || Number(formData.year) > new Date().getFullYear() + 1) {
      newErrors.year = "L'année doit être valide";
    }
    if (!formData.mileage || isNaN(Number(formData.mileage))) {
      newErrors.mileage = "Le kilométrage doit être un nombre valide";
    }
    if (!formData.fuel) newErrors.fuel = "Le carburant est requis";
    if (!formData.location.trim()) newErrors.location = "La localisation est requise";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    
    if (images.length === 0) {
      newErrors.images = "Au moins une image est requise";
    }

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
      
      // Add images
      images.forEach((image, index) => {
        submitData.append(`images`, image);
      });

      // API call
      // const response = await axios.post('/api/cars/', submitData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });

      // Simulation d'une réponse réussie
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Annonce créée avec succès",
        description: "Votre annonce a été publiée et est maintenant visible",
      });
      
      // Redirection vers mes annonces
      // navigate('/mes-annonces');
      
    } catch (error: unknown) {
      console.error('Create listing error:', error);
      toast({
        title: "Erreur lors de la création",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" size="sm" className="mb-4" asChild>
            <Link to="/mes-annonces">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à mes annonces
            </Link>
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Déposer une annonce</h1>
            <p className="text-muted-foreground">
              Remplissez le formulaire ci-dessous pour créer votre annonce
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Photos du véhicule</span>
              </CardTitle>
              <CardDescription>
                Ajoutez jusqu'à 8 photos de votre véhicule (formats: JPG, PNG, max 5MB par photo)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.images && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.images}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                {/* Upload Button */}
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors">
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
                      disabled={isLoading || images.length >= 8}
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
                  {images.length}/8 photos • La première photo sera utilisée comme photo principale
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="h-5 w-5" />
                <span>Informations du véhicule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="ex: BMW Série 3 320d Luxury"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Brand & Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marque *</Label>
                  <Select value={formData.brand} onValueChange={(value) => handleSelectChange('brand', value)}>
                    <SelectTrigger className={errors.brand ? "border-destructive" : ""}>
                      <SelectValue placeholder="Sélectionnez une marque" />
                    </SelectTrigger>
                    <SelectContent>
                      {carBrands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.brand && (
                    <p className="text-sm text-destructive">{errors.brand}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Modèle *</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="ex: Série 3"
                    value={formData.model}
                    onChange={handleChange}
                    className={errors.model ? "border-destructive" : ""}
                  />
                  {errors.model && (
                    <p className="text-sm text-destructive">{errors.model}</p>
                  )}
                </div>
              </div>

              {/* Version & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version/Finition</Label>
                  <Input
                    id="version"
                    name="version"
                    placeholder="ex: Luxury, Sport, etc."
                    value={formData.version}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="25000"
                    value={formData.price}
                    onChange={handleChange}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Year & Mileage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Année *</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    placeholder="2019"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={handleChange}
                    className={errors.year ? "border-destructive" : ""}
                  />
                  {errors.year && (
                    <p className="text-sm text-destructive">{errors.year}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mileage">Kilométrage *</Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    type="number"
                    placeholder="85000"
                    value={formData.mileage}
                    onChange={handleChange}
                    className={errors.mileage ? "border-destructive" : ""}
                  />
                  {errors.mileage && (
                    <p className="text-sm text-destructive">{errors.mileage}</p>
                  )}
                </div>
              </div>

              {/* Fuel & Transmission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Carburant *</Label>
                  <Select value={formData.fuel} onValueChange={(value) => handleSelectChange('fuel', value)}>
                    <SelectTrigger className={errors.fuel ? "border-destructive" : ""}>
                      <SelectValue placeholder="Sélectionnez un carburant" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map(fuel => (
                        <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fuel && (
                    <p className="text-sm text-destructive">{errors.fuel}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Transmission</Label>
                  <Select value={formData.transmission} onValueChange={(value) => handleSelectChange('transmission', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map(transmission => (
                        <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Power & Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="power">Puissance (ch)</Label>
                  <Input
                    id="power"
                    name="power"
                    placeholder="190"
                    value={formData.power}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doors">Nombre de portes</Label>
                  <Select value={formData.doors} onValueChange={(value) => handleSelectChange('doors', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Portes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 portes</SelectItem>
                      <SelectItem value="5">5 portes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seats">Nombre de places</Label>
                  <Select value={formData.seats} onValueChange={(value) => handleSelectChange('seats', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Places" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 places</SelectItem>
                      <SelectItem value="4">4 places</SelectItem>
                      <SelectItem value="5">5 places</SelectItem>
                      <SelectItem value="7">7 places</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Couleur</Label>
                <Input
                  id="color"
                  name="color"
                  placeholder="ex: Noir métallisé"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle>Équipements</CardTitle>
              <CardDescription>
                Sélectionnez les équipements présents dans votre véhicule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {equipments.map(equipment => (
                  <div key={equipment} className="flex items-center space-x-2">
                    <Checkbox
                      id={equipment}
                      checked={formData.selectedEquipments.includes(equipment)}
                      onCheckedChange={() => handleEquipmentToggle(equipment)}
                    />
                    <Label htmlFor={equipment} className="text-sm font-normal cursor-pointer">
                      {equipment}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description & Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Description et contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Décrivez votre véhicule en détail (historique, entretien, état général, etc.)"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="ex: Paris 75015"
                    value={formData.location}
                    onChange={handleChange}
                    className={errors.location ? "border-destructive" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link to="/mes-annonces">Annuler</Link>
            </Button>
            
            <Button type="submit" size="lg" disabled={isLoading} className="md:min-w-48">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  Publication...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Publier l'annonce
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
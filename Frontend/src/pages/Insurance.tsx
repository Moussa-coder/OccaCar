import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Car, 
  Euro, 
  CheckCircle2, 
  Star,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const insurancePlans = [
  {
    id: "tiers",
    name: "Au Tiers",
    price: 15,
    description: "Protection de base",
    features: ["Responsabilité civile", "Défense recours", "Protection juridique"]
  },
  {
    id: "tous-risques",
    name: "Tous Risques",
    price: 35,
    description: "Protection complète",
    features: ["Tous risques", "Bris de glace", "Vol et incendie", "Assistance 0km"],
    recommended: true
  },
  {
    id: "premium",
    name: "Premium",
    price: 55,
    description: "Protection maximale",
    features: ["Tous risques +", "Véhicule de remplacement", "Assistance premium", "Garantie conducteur"]
  }
];

const carBrands = [
  "Audi", "BMW", "Citroën", "Fiat", "Ford", "Hyundai", "Kia", "Mercedes-Benz", 
  "Nissan", "Opel", "Peugeot", "Renault", "Seat", "Skoda", "Toyota", "Volkswagen"
];

export default function Insurance() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    carBrand: "",
    carModel: "",
    carYear: "",
    carValue: "",
    drivingExperience: "",
    previousClaims: "0"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.carBrand || !formData.carModel || !formData.carYear || !formData.carValue) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPlan) {
      toast({
        title: "Formule non sélectionnée",
        description: "Veuillez choisir une formule d'assurance.",
        variant: "destructive"
      });
      return;
    }

    const selectedPlanData = insurancePlans.find(plan => plan.id === selectedPlan);
    
    // Envoyer la demande à l'admin (simulation)
    const requestData = {
      type: "insurance",
      status: "pending",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      details: {
        carBrand: formData.carBrand,
        carModel: formData.carModel,
        carYear: formData.carYear,
        carValue: formData.carValue,
        drivingExperience: formData.drivingExperience,
        previousClaims: formData.previousClaims,
        selectedPlan: selectedPlanData?.name
      }
    };

    // Ici, vous pourriez envoyer les données à votre API
    console.log("Demande d'assurance envoyée:", requestData);
    
    toast({
      title: "Devis demandé",
      description: `Votre demande de devis pour ${selectedPlanData?.name} a été envoyée. Vous recevrez une réponse sous 24h.`,
    });
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      carBrand: "",
      carModel: "",
      carYear: "",
      carValue: "",
      drivingExperience: "",
      previousClaims: "0"
    });
    setSelectedPlan("");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Assurance Auto <span className="text-primary">OccazCar</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Assurance spécialement conçue pour les véhicules d'occasion
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Protection Complète</h3>
              <p className="text-sm text-muted-foreground">
                Couverture tous risques adaptée aux véhicules d'occasion
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Euro className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Tarifs Préférentiels</h3>
              <p className="text-sm text-muted-foreground">
                Jusqu'à 30% de réduction pour nos clients OccazCar
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Service Premium</h3>
              <p className="text-sm text-muted-foreground">
                Assistance 24h/24 et gestion simplifiée
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Euro className="h-5 w-5" />
              <span>Nos Tarifs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insurancePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`text-center p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    toast({
                      title: "Formule sélectionnée",
                      description: `Vous avez choisi ${plan.name} - ${plan.price}€/mois`,
                    });
                  }}
                >
                  {plan.recommended && (
                    <Badge className="mb-2 bg-primary text-primary-foreground">Recommandé</Badge>
                  )}
                  <h3 className="font-semibold mb-2">{plan.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-2">{plan.price}€/mois</div>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <ul className="text-sm space-y-1 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedPlan === plan.id && (
                    <Badge className="mt-4 w-full justify-center bg-primary text-primary-foreground">
                      ✓ Sélectionné
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quote Form */}
        <Card>
          <CardHeader>
            <CardTitle>Demander un devis gratuit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom <span className="text-red-500">*</span></Label>
                  <Input
                    id="firstName"
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom <span className="text-red-500">*</span></Label>
                  <Input
                    id="lastName"
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carBrand">Marque du véhicule <span className="text-red-500">*</span></Label>
                  <Input
                    id="carBrand"
                    placeholder="Ex: BMW, Audi, Peugeot, Renault..."
                    value={formData.carBrand}
                    onChange={(e) => handleInputChange('carBrand', e.target.value)}
                    required
                    list="carBrands"
                  />
                  <datalist id="carBrands">
                    {carBrands.map((brand) => (
                      <option key={brand} value={brand} />
                    ))}
                  </datalist>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carModel">Modèle <span className="text-red-500">*</span></Label>
                  <Input
                    id="carModel"
                    placeholder="Ex: Série 3, A4, Clio..."
                    value={formData.carModel}
                    onChange={(e) => handleInputChange('carModel', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carYear">Année <span className="text-red-500">*</span></Label>
                  <Input
                    id="carYear"
                    type="number"
                    min="1990"
                    max="2024"
                    placeholder="2020"
                    value={formData.carYear}
                    onChange={(e) => handleInputChange('carYear', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carValue">Valeur du véhicule (€) <span className="text-red-500">*</span></Label>
                  <Input
                    id="carValue"
                    type="number"
                    min="1000"
                    placeholder="25000"
                    value={formData.carValue}
                    onChange={(e) => handleInputChange('carValue', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="drivingExperience">Années de permis</Label>
                  <Select value={formData.drivingExperience} onValueChange={(value) => handleInputChange('drivingExperience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 ans</SelectItem>
                      <SelectItem value="3-5">3-5 ans</SelectItem>
                      <SelectItem value="6-10">6-10 ans</SelectItem>
                      <SelectItem value="10+">Plus de 10 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="previousClaims">Sinistres des 3 dernières années</Label>
                  <Select value={formData.previousClaims} onValueChange={(value) => handleInputChange('previousClaims', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Aucun</SelectItem>
                      <SelectItem value="1">1 sinistre</SelectItem>
                      <SelectItem value="2">2 sinistres</SelectItem>
                      <SelectItem value="3+">3 sinistres ou plus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Devis gratuit et sans engagement</strong><br />
                  Vous recevrez votre devis personnalisé sous 24h par email.
                </AlertDescription>
              </Alert>
              
              <Button type="submit" size="lg" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Demander mon devis gratuit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

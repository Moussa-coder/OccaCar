import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Info,
  Lock,
  Eye,
  MapPin,
  Calendar,
  Euro
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour la démo
const mockCarData = {
  id: "1",
  title: "BMW Série 3 320d Luxury",
  price: 25000,
  brand: "BMW",
  model: "Série 3",
  year: 2020,
  mileage: 45000,
  fuel: "Diesel",
  location: "Paris, France",
  images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"]
};

const mockUserData = {
  id: "user123",
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean.dupont@email.com",
  phone: "06 12 34 56 78"
};

export default function SecurePurchase() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [carData, setCarData] = useState(mockCarData);
  const [userData, setUserData] = useState(mockUserData);
  
  // Données du formulaire
  const [formData, setFormData] = useState({
    deliveryMethod: "pickup",
    deliveryAddress: {
      street: "",
      city: "",
      postalCode: "",
      country: "France"
    },
    paymentMethod: "card",
    acceptTerms: false
  });

  // Calculs des montants
  const carPrice = carData.price;
  const commissionRate = 2.5;
  const commission = Math.max(Math.min(carPrice * (commissionRate / 100), 500), 50);
  const totalAmount = carPrice + commission;
  const sellerAmount = carPrice - commission;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitPurchase = async () => {
    setIsLoading(true);
    
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Transaction initiée",
        description: "Votre paiement sécurisé a été traité avec succès.",
      });
      
      // Rediriger vers la page de suivi de transaction
      navigate(`/transaction/${carId}/tracking`);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de votre paiement.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Récapitulatif de l'achat</h2>
              <p className="text-muted-foreground">Vérifiez les détails de votre achat sécurisé</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Achat Sécurisé OccazCar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={carData.images[0]} 
                    alt={carData.title}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{carData.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {carData.year} • {carData.mileage.toLocaleString()} km • {carData.fuel}
                    </p>
                    <p className="text-sm text-muted-foreground">{carData.location}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Prix du véhicule</span>
                    <span className="font-semibold">{formatPrice(carPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Commission OccazCar ({commissionRate}%)</span>
                    <span>{formatPrice(commission)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total à payer</span>
                    <span className="text-primary">{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Comment fonctionne l'achat sécurisé :</strong><br />
                1. Vous payez OccazCar qui retient l'argent<br />
                2. Le vendeur vous livre le véhicule<br />
                3. Vous avez 7 jours pour l'inspecter<br />
                4. Si satisfait, OccazCar verse l'argent au vendeur
              </AlertDescription>
            </Alert>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Méthode de livraison</h2>
              <p className="text-muted-foreground">Choisissez comment vous souhaitez recevoir votre véhicule</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Méthode de livraison</Label>
                <Select 
                  value={formData.deliveryMethod} 
                  onValueChange={(value) => handleInputChange('deliveryMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Récupération chez le vendeur</SelectItem>
                    <SelectItem value="delivery">Livraison à domicile</SelectItem>
                    <SelectItem value="meeting_point">Point de rencontre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.deliveryMethod === 'delivery' && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Adresse de livraison</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Rue</Label>
                      <Input
                        id="street"
                        value={formData.deliveryAddress.street}
                        onChange={(e) => handleInputChange('deliveryAddress.street', e.target.value)}
                        placeholder="123 Rue de la Paix"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={formData.deliveryAddress.city}
                        onChange={(e) => handleInputChange('deliveryAddress.city', e.target.value)}
                        placeholder="Paris"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        value={formData.deliveryAddress.postalCode}
                        onChange={(e) => handleInputChange('deliveryAddress.postalCode', e.target.value)}
                        placeholder="75001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        value={formData.deliveryAddress.country}
                        onChange={(e) => handleInputChange('deliveryAddress.country', e.target.value)}
                        placeholder="France"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Alert>
                <Truck className="h-4 w-4" />
                <AlertDescription>
                  La livraison à domicile peut engendrer des frais supplémentaires selon la distance.
                  Ces frais seront communiqués avant la finalisation de la commande.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Paiement sécurisé</h2>
              <p className="text-muted-foreground">Votre paiement est protégé par notre système d'escrow</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  <span>Paiement Sécurisé</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Méthode de paiement</Label>
                  <Select 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Carte bancaire</SelectItem>
                      <SelectItem value="sepa">Virement SEPA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-800">Protection OccazCar</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Votre argent est sécurisé jusqu'à ce que vous confirmiez la réception 
                        et l'état satisfaisant du véhicule. Aucun paiement ne sera versé au vendeur 
                        sans votre accord explicite.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Montant total</span>
                    <span className="text-primary">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Dont {formatPrice(sellerAmount)} pour le vendeur et {formatPrice(commission)} de commission
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Confirmation finale</h2>
              <p className="text-muted-foreground">Vérifiez tous les détails avant de finaliser</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif complet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Véhicule</h3>
                    <p>{carData.title} - {formatPrice(carPrice)}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Livraison</h3>
                    <p>
                      {formData.deliveryMethod === 'pickup' && 'Récupération chez le vendeur'}
                      {formData.deliveryMethod === 'delivery' && `Livraison à ${formData.deliveryAddress.city}`}
                      {formData.deliveryMethod === 'meeting_point' && 'Point de rencontre'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Paiement</h3>
                    <p>Total: {formatPrice(totalAmount)}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    className="mt-1"
                    title="Accepter les conditions générales"
                  />
                  <Label htmlFor="acceptTerms" className="text-sm">
                    J'accepte les conditions générales de vente et le processus d'achat sécurisé OccazCar.
                    Je comprends que mon paiement sera retenu jusqu'à confirmation de la réception satisfaisante du véhicule.
                  </Label>
                </div>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Prochaines étapes :</strong><br />
                  1. Paiement sécurisé vers OccazCar<br />
                  2. Livraison du véhicule<br />
                  3. Période d'inspection de 7 jours<br />
                  4. Confirmation et versement au vendeur
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Récapitulatif</span>
            <span>Livraison</span>
            <span>Paiement</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevStep}
            disabled={step === 1}
          >
            Précédent
          </Button>
          
          {step < 4 ? (
            <Button onClick={handleNextStep}>
              Suivant
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitPurchase}
              disabled={!formData.acceptTerms || isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Finaliser l'achat sécurisé
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

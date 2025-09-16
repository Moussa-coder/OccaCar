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
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Shield,
  Phone,
  Calendar,
  Car,
  Euro,
  Package,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const deliveryOptions = [
  {
    id: "standard",
    name: "Livraison Standard",
    price: 299,
    duration: "3-5 jours",
    description: "Transport sécurisé par transporteur partenaire",
    features: ["Assurance transport", "Suivi en temps réel", "Livraison à domicile"]
  },
  {
    id: "express",
    name: "Livraison Express",
    price: 499,
    duration: "1-2 jours",
    description: "Transport prioritaire avec chauffeur dédié",
    features: ["Chauffeur dédié", "Livraison express", "Service premium", "Assurance totale"]
  },
  {
    id: "same-day",
    name: "Livraison le jour même",
    price: 799,
    duration: "Le jour même",
    description: "Livraison ultra-rapide pour les urgences",
    features: ["Livraison immédiate", "Chauffeur expert", "Service VIP", "Garantie satisfaction"]
  }
];

export default function Delivery() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    carId: "",
    pickupAddress: "",
    deliveryAddress: "",
    deliveryDate: "",
    deliveryTime: "",
    contactName: "",
    contactPhone: "",
    specialInstructions: ""
  });
  const [selectedOption, setSelectedOption] = useState("standard");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBookDelivery = () => {
    // Validation basique
    if (!formData.carId || !formData.pickupAddress || !formData.deliveryAddress || 
        !formData.deliveryDate || !formData.contactName || !formData.contactPhone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Envoyer la demande à l'admin (simulation)
    const requestData = {
      type: "delivery",
      status: "pending",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      user: {
        firstName: formData.contactName.split(' ')[0] || formData.contactName,
        lastName: formData.contactName.split(' ').slice(1).join(' ') || "",
        email: "", // Pas d'email dans ce formulaire
        phone: formData.contactPhone
      },
      details: {
        carId: formData.carId,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        specialInstructions: formData.specialInstructions,
        selectedOption: selectedDelivery?.name
      }
    };

    // Ici, vous pourriez envoyer les données à votre API
    console.log("Demande de livraison envoyée:", requestData);

    toast({
      title: "Livraison réservée",
      description: `Votre demande de livraison ${selectedDelivery?.name} a été confirmée. Vous recevrez un SMS avec les détails.`,
    });
    
    // Reset form
    setFormData({
      carId: "",
      pickupAddress: "",
      deliveryAddress: "",
      deliveryDate: "",
      deliveryTime: "",
      contactName: "",
      contactPhone: "",
      specialInstructions: ""
    });
  };

  const selectedDelivery = deliveryOptions.find(option => option.id === selectedOption);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux services
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Livraison à domicile <span className="text-primary">OccazCar</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Votre véhicule livré chez vous en toute sécurité
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Transport Sécurisé</h3>
              <p className="text-sm text-muted-foreground">
                Assurance transport incluse et suivi en temps réel
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Livraison à domicile</h3>
              <p className="text-sm text-muted-foreground">
                Votre véhicule livré directement chez vous
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Horaires flexibles</h3>
              <p className="text-sm text-muted-foreground">
                Choisissez votre créneau de livraison
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Options de livraison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deliveryOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-6 border rounded-lg cursor-pointer transition-all ${
                    selectedOption === option.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedOption(option.id);
                    toast({
                      title: "Option sélectionnée",
                      description: `Vous avez choisi ${option.name} - ${option.price}€`,
                    });
                  }}
                >
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-lg mb-2">{option.name}</h3>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {option.price}€
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {option.duration}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    {option.description}
                  </p>
                  
                  <ul className="space-y-2 text-sm">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {selectedOption === option.id && (
                    <Badge className="mt-4 w-full justify-center bg-primary text-primary-foreground">
                      ✓ Sélectionné
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Réserver votre livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="carId">ID du véhicule <span className="text-red-500">*</span></Label>
                  <Input
                    id="carId"
                    placeholder="Ex: BMW-320d-2020"
                    value={formData.carId}
                    onChange={(e) => handleInputChange('carId', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactName">Nom du contact <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactName"
                    placeholder="Votre nom complet"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickupAddress">Adresse de récupération <span className="text-red-500">*</span></Label>
                  <Input
                    id="pickupAddress"
                    placeholder="Adresse du vendeur"
                    value={formData.pickupAddress}
                    onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">Adresse de livraison <span className="text-red-500">*</span></Label>
                  <Input
                    id="deliveryAddress"
                    placeholder="Votre adresse complète"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Date de livraison souhaitée <span className="text-red-500">*</span></Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">Créneau horaire</Label>
                  <Select value={formData.deliveryTime} onValueChange={(value) => handleInputChange('deliveryTime', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un créneau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Matin (9h-12h)</SelectItem>
                      <SelectItem value="afternoon">Après-midi (14h-17h)</SelectItem>
                      <SelectItem value="evening">Soirée (17h-20h)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Téléphone de contact <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Instructions spéciales (optionnel)</Label>
                <Input
                  id="specialInstructions"
                  placeholder="Accès difficile, code d'entrée, etc."
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                />
              </div>
              
              {/* Summary */}
              {selectedDelivery && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Récapitulatif de votre commande</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{selectedDelivery.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedDelivery.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{selectedDelivery.price}€</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Livraison sécurisée</strong><br />
                  Votre véhicule est assuré pendant le transport. Vous recevrez un SMS de confirmation avec le numéro de suivi.
                </AlertDescription>
              </Alert>
              
              <Button onClick={handleBookDelivery} size="lg" className="w-full">
                <Truck className="h-4 w-4 mr-2" />
                Réserver la livraison
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

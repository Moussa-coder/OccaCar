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
  Wrench, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Star,
  Phone,
  Calendar,
  Car,
  Shield,
  Euro,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const occazCarGarage = {
  id: 1,
  name: "Garage OccazCar",
  address: "15 Avenue des Champs-Élysées, 75008 Paris",
  distance: "Centre-ville",
  rating: 5.0,
  services: ["Révision", "Réparation", "Contrôle technique", "Diagnostic", "Carrosserie", "Pneumatiques"],
  price: "Gratuit 2 mois",
  isOccazCar: true,
  description: "Notre garage officiel avec des techniciens certifiés et des équipements de pointe."
};

export default function AfterSalesService() {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState("");
  const [selectedGarage, setSelectedGarage] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const handleBookAppointment = () => {
    // Validation basique
    if (!selectedService) {
      toast({
        title: "Service non sélectionné",
        description: "Veuillez choisir un type de service.",
        variant: "destructive"
      });
      return;
    }

    if (!appointmentDate || !appointmentTime || !contactName || !contactPhone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs pour le rendez-vous.",
        variant: "destructive"
      });
      return;
    }

    // Envoyer la demande à l'admin (simulation)
    const requestData = {
      type: "service",
      status: "pending",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      user: {
        firstName: contactName.split(' ')[0] || contactName,
        lastName: contactName.split(' ').slice(1).join(' ') || "",
        email: "", // Pas d'email dans ce formulaire
        phone: contactPhone
      },
      details: {
        selectedService: selectedService,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        contactName: contactName,
        contactPhone: contactPhone
      }
    };

    // Ici, vous pourriez envoyer les données à votre API
    console.log("Demande de service envoyée:", requestData);

    toast({
      title: "Rendez-vous réservé",
      description: `Votre rendez-vous pour ${selectedService} le ${appointmentDate} à ${appointmentTime} a été confirmé. Vous recevrez un SMS de confirmation.`,
    });
    
    // Reset form
    setSelectedService("");
    setAppointmentDate("");
    setAppointmentTime("");
    setContactName("");
    setContactPhone("");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
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
            Service Après-Vente <span className="text-primary">OccazCar</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Entretien et réparations avec notre garage officiel
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">2 mois gratuits</h3>
              <p className="text-sm text-muted-foreground">
                Service après-vente gratuit pendant 2 mois
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Wrench className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Garage OccazCar</h3>
              <p className="text-sm text-muted-foreground">
                Notre garage officiel avec des techniciens certifiés
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Garantie Maintenue</h3>
              <p className="text-sm text-muted-foreground">
                Garantie constructeur préservée
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Euro className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Tarifs Préférentiels</h3>
              <p className="text-sm text-muted-foreground">
                Jusqu'à 20% de réduction après la période gratuite
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Service Selection & Appointment Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="h-5 w-5" />
              <span>Prendre rendez-vous</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Type de service <span className="text-red-500">*</span></Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revision">Révision</SelectItem>
                      <SelectItem value="reparation">Réparation</SelectItem>
                      <SelectItem value="controle">Contrôle technique</SelectItem>
                      <SelectItem value="pneumatiques">Pneumatiques</SelectItem>
                      <SelectItem value="carrosserie">Carrosserie</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Date souhaitée <span className="text-red-500">*</span></Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appointmentTime">Créneau horaire <span className="text-red-500">*</span></Label>
                  <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un créneau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9h00 - 10h00</SelectItem>
                      <SelectItem value="10:00">10h00 - 11h00</SelectItem>
                      <SelectItem value="11:00">11h00 - 12h00</SelectItem>
                      <SelectItem value="14:00">14h00 - 15h00</SelectItem>
                      <SelectItem value="15:00">15h00 - 16h00</SelectItem>
                      <SelectItem value="16:00">16h00 - 17h00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactName">Nom du contact <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactName"
                    placeholder="Votre nom complet"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Téléphone <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button onClick={handleBookAppointment} className="w-full md:w-auto">
                <Calendar className="h-4 w-4 mr-2" />
                Confirmer le rendez-vous
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* OccazCar Garage */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Notre garage officiel</h2>
          
          <Card className="hover:shadow-lg transition-shadow border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold">{occazCarGarage.name}</h3>
                    <Badge className="bg-primary text-primary-foreground">
                      Garage Officiel
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">
                    {occazCarGarage.description}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{occazCarGarage.address}</span>
                    <span>•</span>
                    <span>{occazCarGarage.distance}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{occazCarGarage.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Ouvert du lundi au samedi</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {occazCarGarage.services.map((service, index) => (
                      <Badge key={index} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <strong>Prix :</strong> {occazCarGarage.price} • Puis tarifs préférentiels
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    onClick={() => handleBookAppointment(occazCarGarage.id)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Prendre RDV
                  </Button>
                  
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    01 23 45 67 89
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Nos services inclus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Pendant la période gratuite (2 mois)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Révisions d'entretien</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Diagnostic électronique</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Contrôle des niveaux</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Vérification des freins</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Après la période gratuite</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Tarifs préférentiels (-20%)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Priorité sur les rendez-vous</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Garantie étendue</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Assistance 24h/24</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

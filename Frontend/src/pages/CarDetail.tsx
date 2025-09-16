import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Fuel, 
  Gauge, 
  MapPin, 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  CheckCircle2,
  Star,
  Eye,
  Clock,
  AlertTriangle,
  Car,
  Wrench,
  FileText,
  Calculator,
  TrendingUp,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Advertisement, PartnerAdvertisements } from "@/components/ui/advertisement";

// Mock data - sera remplacé par un appel API
const mockCarDetails = {
  id: "1",
  title: "BMW Série 3 320d Luxury",
  brand: "BMW",
  model: "Série 3",
  version: "320d Luxury",
  price: 25900,
  year: 2019,
  mileage: 85000,
  fuel: "Diesel",
  transmission: "Automatique",
  power: "190 ch",
  location: "Paris 75015",
  isAvailable: true,
  description: "Magnifique BMW Série 3 320d en finition Luxury. Véhicule en excellent état, entretenu régulièrement en concession BMW. Toutes les révisions à jour. Intérieur cuir beige, jantes alliage 18\", GPS Professional, caméra de recul, régulateur de vitesse adaptatif, aide au stationnement.",
  features: [
    "GPS Professionnel",
    "Caméra de recul", 
    "Régulateur adaptatif",
    "Sièges cuir chauffants",
    "Jantes alliage 18\"",
    "Phares LED",
    "Climatisation automatique",
    "Bluetooth & USB"
  ],
  images: [
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    "https://images.unsplash.com/photo-1549399729-de96f96b7db7?w=800",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800"
  ],
  seller: {
    name: "Martin Dubois",
    memberSince: "2021",
    rating: 4.8,
    totalSales: 12,
    verified: true,
    phone: "06 12 34 56 78",
    email: "martin.dubois@email.com"
  },
  createdAt: "2024-01-15",
  lastUpdate: "2024-01-18",
  views: 127,
  likes: 23,
  technicalSpecs: {
    engine: "2.0L Diesel",
    power: "190 ch",
    torque: "400 Nm",
    acceleration: "7.1s (0-100 km/h)",
    maxSpeed: "230 km/h",
    consumption: "4.8L/100km",
    co2: "126 g/km",
    weight: "1540 kg",
    length: "4709 mm",
    width: "1827 mm",
    height: "1442 mm",
    trunk: "480 L"
  },
  history: {
    owners: 1,
    accidents: 0,
    maintenance: "Concession BMW",
    lastService: "2024-01-10",
    nextService: "2024-07-10",
    warranty: "6 mois OccazCar"
  },
  financing: {
    monthlyPayment: 485,
    downPayment: 5000,
    duration: 60,
    rate: 3.9
  }
};

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [carData, setCarData] = useState(mockCarDetails);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Simulation du chargement des données
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // Ici on ferait l'appel API
      // fetchCarDetails(id);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [id]);

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

  const handleContactWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par votre ${carData.title} à ${formatPrice(carData.price)}. Pourriez-vous me donner plus d'informations ?`
    );
    const phoneNumber = "33123456789"; // À remplacer par le vrai numéro
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: carData.title,
          text: `Découvrez cette ${carData.title} sur OccazCar`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier l'URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papiers",
      });
    }
  };

  const handleSecurePurchase = () => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour effectuer un achat sécurisé.",
        variant: "destructive"
      });
      navigate('/login', { 
        state: { 
          message: 'Vous devez être connecté pour effectuer un achat sécurisé',
          redirectTo: `/voiture/${id}/achat-securise`
        } 
      });
      return;
    }
    
    // Rediriger vers la page d'achat sécurisé
    navigate(`/voiture/${id}/achat-securise`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === carData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? carData.images.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span>{carData.brand}</span>
          <span>/</span>
          <span className="text-foreground">{carData.model}</span>
        </div>

        {/* Back Button */}
        <Button variant="outline" size="sm" className="mb-6" asChild>
          <Link to="/voitures">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux annonces
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images & Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={carData.images[currentImageIndex]}
                  alt={`${carData.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />
                
                {/* Navigation arrows */}
                {carData.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-background/80 backdrop-blur-sm"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-background/80 backdrop-blur-sm"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
                
                {/* Status & Actions */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <Badge variant={carData.isAvailable ? "default" : "secondary"}>
                    {carData.isAvailable ? "Disponible" : "Vendue"}
                  </Badge>
                </div>
                
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-10 w-10 p-0 bg-background/80 backdrop-blur-sm"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-10 w-10 p-0 bg-background/80 backdrop-blur-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Image counter */}
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                  {currentImageIndex + 1} / {carData.images.length}
                </div>
              </div>
              
              {/* Thumbnail strip */}
              {carData.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {carData.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Car Details with Tabs */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">{carData.title}</h1>
                  <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{carData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Publié le {new Date(carData.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{carData.views} vues</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{carData.likes} favoris</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{carData.year}</div>
                      <div className="text-sm text-muted-foreground">Année</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <Gauge className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{formatMileage(carData.mileage)} km</div>
                      <div className="text-sm text-muted-foreground">Kilométrage</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <Fuel className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{carData.fuel}</div>
                      <div className="text-sm text-muted-foreground">Carburant</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-primary font-bold text-lg mx-auto mb-2">{carData.power}</div>
                      <div className="text-sm text-muted-foreground">Puissance</div>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="technical">Technique</TabsTrigger>
                    <TabsTrigger value="history">Historique</TabsTrigger>
                    <TabsTrigger value="financing">Financement</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {carData.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Équipements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {carData.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="technical" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Spécifications techniques</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Moteur</span>
                            <span className="font-medium">{carData.technicalSpecs.engine}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Puissance</span>
                            <span className="font-medium">{carData.technicalSpecs.power}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Couple</span>
                            <span className="font-medium">{carData.technicalSpecs.torque}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Accélération</span>
                            <span className="font-medium">{carData.technicalSpecs.acceleration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Vitesse max</span>
                            <span className="font-medium">{carData.technicalSpecs.maxSpeed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Consommation</span>
                            <span className="font-medium">{carData.technicalSpecs.consumption}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CO₂</span>
                            <span className="font-medium">{carData.technicalSpecs.co2}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Poids</span>
                            <span className="font-medium">{carData.technicalSpecs.weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Longueur</span>
                            <span className="font-medium">{carData.technicalSpecs.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Largeur</span>
                            <span className="font-medium">{carData.technicalSpecs.width}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Hauteur</span>
                            <span className="font-medium">{carData.technicalSpecs.height}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Coffre</span>
                            <span className="font-medium">{carData.technicalSpecs.trunk}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Historique du véhicule</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Propriétaires</div>
                              <div className="text-sm text-muted-foreground">{carData.history.owners} propriétaire(s)</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-success" />
                            <div>
                              <div className="font-medium">Accidents</div>
                              <div className="text-sm text-muted-foreground">{carData.history.accidents} accident(s) déclaré(s)</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Wrench className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Entretien</div>
                              <div className="text-sm text-muted-foreground">{carData.history.maintenance}</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Dernier entretien</div>
                              <div className="text-sm text-muted-foreground">{new Date(carData.history.lastService).toLocaleDateString('fr-FR')}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Prochain entretien</div>
                              <div className="text-sm text-muted-foreground">{new Date(carData.history.nextService).toLocaleDateString('fr-FR')}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Shield className="h-5 w-5 text-success" />
                            <div>
                              <div className="font-medium">Garantie</div>
                              <div className="text-sm text-muted-foreground">{carData.history.warranty}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Achat Sécurisé OccazCar */}
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-6 w-6 text-green-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-green-800 mb-2">Achat Sécurisé OccazCar</h3>
                          <p className="text-sm text-green-700 mb-3">
                            Protégez votre achat avec notre système d'escrow. OccazCar retient l'argent 
                            jusqu'à ce que vous confirmiez la réception satisfaisante du véhicule.
                          </p>
                          <div className="text-xs text-green-600 space-y-1">
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Paiement sécurisé vers OccazCar</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Livraison du véhicule</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>7 jours d'inspection</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Versement au vendeur après validation</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="financing" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Options de financement</h3>
                      <Alert className="mb-6">
                        <Calculator className="h-4 w-4" />
                        <AlertDescription>
                          Simulation indicative. Les conditions finales dépendent de votre profil et seront confirmées par notre partenaire financier.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-primary mb-2">
                              {formatPrice(carData.financing.monthlyPayment)}
                            </div>
                            <div className="text-sm text-muted-foreground mb-4">Mensualité</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Apport</span>
                                <span>{formatPrice(carData.financing.downPayment)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Durée</span>
                                <span>{carData.financing.duration} mois</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Taux</span>
                                <span>{carData.financing.rate}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-primary mb-2">
                              {formatPrice(carData.price * 0.1)}
                            </div>
                            <div className="text-sm text-muted-foreground mb-4">Apport minimum</div>
                            <div className="text-xs text-muted-foreground">
                              Recommandé pour un financement optimal
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-primary mb-2">
                              {formatPrice(carData.price * 0.2)}
                            </div>
                            <div className="text-sm text-muted-foreground mb-4">Apport conseillé</div>
                            <div className="text-xs text-muted-foreground">
                              Pour des mensualités réduites
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <Button variant="outline" className="mr-4">
                          <Calculator className="h-4 w-4 mr-2" />
                          Simuler un crédit
                        </Button>
                        <Button>
                          <FileText className="h-4 w-4 mr-2" />
                          Demander un financement
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Contact */}
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(carData.price)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Prix négociable
                  </Badge>
                </div>

                <Separator />

                {/* Contact Actions */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    onClick={handleSecurePurchase}
                    disabled={!carData.isAvailable}
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Achat Sécurisé OccazCar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={handleContactWhatsApp}
                    disabled={!carData.isAvailable}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contacter via WhatsApp
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    disabled={!carData.isAvailable}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Appeler le vendeur
                  </Button>
                </div>

                {!carData.isAvailable && (
                  <div className="text-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    Ce véhicule n'est plus disponible
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Informations vendeur</h3>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{carData.seller.name}</span>
                      {carData.seller.verified && (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Membre depuis {carData.seller.memberSince}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Note moyenne</span>
                  <span className="font-medium">{carData.seller.rating}/5 ⭐</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Véhicules vendus</span>
                  <span className="font-medium">{carData.seller.totalSales}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-success">
                  <Shield className="h-4 w-4" />
                  <span>Vendeur vérifié</span>
                </div>
              </CardContent>
            </Card>

            {/* Advertisement Sidebar */}
            <div className="space-y-6">
              <Advertisement type="sidebar" />
              <Advertisement type="sidebar" />
              <PartnerAdvertisements />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
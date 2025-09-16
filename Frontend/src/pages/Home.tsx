import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CarCard } from "@/components/ui/car-card";
import { Advertisement, AdvertisementGrid, PartnerAdvertisements } from "@/components/ui/advertisement";
import { 
  Search, 
  Car as CarIcon, 
  Users, 
  Award, 
  Shield,
  Star,
  ArrowRight,
  Phone,
  MessageCircle,
  FileText,
  CreditCard,
  Wrench,
  MapPin,
  TrendingUp,
  Lock
} from "lucide-react";

// Mock data - sera remplacé par des appels API
const mockCars = [
  {
    id: "1",
    title: "BMW Série 3 320d Luxury",
    price: 25900,
    year: 2019,
    mileage: 85000,
    fuel: "Diesel",
    location: "Paris 75",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500",
    isAvailable: true,
  },
  {
    id: "2", 
    title: "Audi A4 Avant 2.0 TDI S-Line",
    price: 32500,
    year: 2020,
    mileage: 65000,
    fuel: "Diesel", 
    location: "Lyon 69",
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500",
    isAvailable: true,
  },
  {
    id: "3",
    title: "Mercedes Classe C 220d AMG Line",
    price: 28750,
    year: 2018,
    mileage: 92000,
    fuel: "Diesel",
    location: "Marseille 13", 
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500",
    isAvailable: false,
  },
  {
    id: "4",
    title: "Volkswagen Golf GTI 7.5",
    price: 24900,
    year: 2019,
    mileage: 78000,
    fuel: "Essence",
    location: "Toulouse 31",
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500",
    isAvailable: true,
  },
  {
    id: "5",
    title: "Peugeot 308 GT BlueHDi",
    price: 19200,
    year: 2018,
    mileage: 95000,
    fuel: "Diesel",
    location: "Nantes 44",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
    isAvailable: true,
  },
  {
    id: "6",
    title: "Renault Clio RS Trophy",
    price: 21500,
    year: 2019,
    mileage: 68000,
    fuel: "Essence",
    location: "Nice 06",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500",
    isAvailable: true,
  },
];

const stats = [
  { label: "Voitures vendues", value: "12 547", icon: CarIcon },
  { label: "Clients satisfaits", value: "8 923", icon: Users },
  { label: "Années d'expérience", value: "15+", icon: Award },
  { label: "Transaction sécurisée", value: "100%", icon: Shield },
];

const features = [
  {
    icon: Shield,
    title: "Véhicules Vérifiés",
    description: "Chaque véhicule passe par notre processus de vérification rigoureux pour garantir sa qualité et son authenticité."
  },
  {
    icon: Lock,
    title: "Achat Sécurisé",
    description: "Système d'escrow pour protéger votre paiement jusqu'à la livraison et inspection du véhicule."
  },
  {
    icon: Phone,
    title: "Support 24/7",
    description: "Notre équipe d'experts est disponible 24h/24 et 7j/7 pour vous accompagner dans votre achat."
  },
  {
    icon: FileText,
    title: "Gestion Administrative",
    description: "Nous nous occupons de toutes les démarches administratives pour faciliter votre transaction."
  }
];

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Acheteuse",
    content: "OccazCar m'a permis de trouver ma voiture idéale en toute sécurité. Le processus de vérification est rassurant !",
    rating: 5,
    location: "Paris"
  },
  {
    name: "Thomas Martin",
    role: "Vendeur",
    content: "Vendre ma voiture sur OccazCar a été un jeu d'enfant. L'équipe m'a accompagné à chaque étape.",
    rating: 5,
    location: "Lyon"
  },
  {
    name: "Sophie Laurent",
    role: "Acheteuse",
    content: "Le financement a été accordé en 24h. Service impeccable et professionnel !",
    rating: 5,
    location: "Marseille"
  }
];

const quickActions = [
  {
    title: "Acheter une voiture",
    description: "Découvrez notre sélection de véhicules vérifiés",
    icon: CarIcon,
    link: "/voitures",
    color: "bg-primary/10 text-primary"
  },
  {
    title: "Vendre ma voiture",
    description: "Vendez votre véhicule en toute simplicité",
    icon: TrendingUp,
    link: "/deposer",
    color: "bg-success/10 text-success"
  },
  {
    title: "Nos services",
    description: "Découvrez tous nos services d'accompagnement",
    icon: Wrench,
    link: "/services",
    color: "bg-accent/10 text-accent"
  },
  {
    title: "Nous contacter",
    description: "Une question ? Notre équipe vous répond",
    icon: MessageCircle,
    link: "/contact",
    color: "bg-warning/10 text-warning"
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState(mockCars);

  // Filter logic
  useEffect(() => {
    const filtered = mockCars.filter(car => {
      const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    
    setFilteredCars(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Trouvez votre{" "}
              <span className="gradient-text">voiture d'occasion</span>{" "}
              idéale
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des milliers de véhicules vérifiés, des prix transparents, et une transaction 100% sécurisée.
            </p>
            
            {/* Citation inspirante */}
            <blockquote className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary max-w-3xl mx-auto">
              <p className="text-lg italic text-muted-foreground">
                "Votre prochaine aventure commence par le bon véhicule. 
                Chez OccazCar, nous croyons que chaque voiture a une histoire à raconter."
              </p>
              <footer className="text-sm text-primary font-medium mt-2">
                — L'équipe OccazCar
              </footer>
            </blockquote>
            
            {/* Quick Search */}
            <div className="max-w-2xl mx-auto">
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une marque, un modèle..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button size="lg" className="md:w-auto w-full">
                    Rechercher
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Que souhaitez-vous faire ?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              OccazCar vous accompagne dans toutes vos démarches automobiles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{action.description}</p>
                  <Button variant="outline" size="sm" asChild className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link to={action.link}>
                      Découvrir
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir OccazCar ?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nous nous engageons à vous offrir la meilleure expérience d'achat automobile
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez les témoignages de nos clients satisfaits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="space-y-1">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Services complémentaires</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Complétez votre achat avec nos services partenaires
            </p>
          </div>
          
          <AdvertisementGrid count={3} type="card" className="mb-12" />
          
          <div className="max-w-4xl mx-auto">
            <Advertisement type="hero" />
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Véhicules en vedette</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez notre sélection de véhicules d'occasion vérifiés et garantis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredCars.slice(0, 6).map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/voitures">
                Voir tous nos véhicules
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
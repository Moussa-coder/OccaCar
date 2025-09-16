import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Car, 
  Shield, 
  Search, 
  CreditCard, 
  Phone, 
  FileText, 
  CheckCircle2,
  Star,
  Clock,
  Users,
  Award,
  Zap,
  Wrench,
  MapPin,
  Calculator,
  MessageCircle,
  Eye,
  Heart,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const services = [
  {
    icon: Search,
    title: "Recherche Avancée",
    description: "Trouvez votre véhicule idéal grâce à nos filtres intelligents et notre moteur de recherche puissant.",
    features: [
      "Filtres par marque, modèle, prix, année",
      "Recherche géolocalisée",
      "Alertes personnalisées",
      "Comparateur de véhicules"
    ],
    price: "Gratuit",
    popular: true
  },
  {
    icon: Shield,
    title: "Vérification Véhicule",
    description: "Notre équipe d'experts vérifie chaque véhicule pour garantir sa qualité et son authenticité.",
    features: [
      "Contrôle technique complet",
      "Vérification de l'historique",
      "Inspection des documents",
      "Rapport détaillé fourni"
    ],
    price: "À partir de 150€",
    popular: false
  },
  {
    icon: Wrench,
    title: "Entretien & Réparation",
    description: "Service d'entretien et de réparation pour maintenir votre véhicule en parfait état.",
    features: [
      "Contrôle technique",
      "Réparations mécaniques",
      "Entretien préventif",
      "Pièces d'origine garanties"
    ],
    price: "Devis gratuit",
    popular: true
  },
  {
    icon: Phone,
    title: "Assistance 24/7",
    description: "Notre équipe d'experts est disponible 24h/24 et 7j/7 pour vous accompagner dans votre achat.",
    features: [
      "Support téléphonique",
      "Chat en ligne",
      "Conseils personnalisés",
      "Suivi de votre dossier"
    ],
    price: "Inclus",
    popular: false
  },
  {
    icon: FileText,
    title: "Gestion Administrative",
    description: "Nous nous occupons de toutes les démarches administratives pour faciliter votre transaction.",
    features: [
      "Transfert de propriété",
      "Assurance véhicule",
      "Carte grise",
      "Contrat de vente"
    ],
    price: "À partir de 200€",
    popular: false
  },
  {
    icon: Car,
    title: "Livraison à Domicile",
    description: "Livrez votre véhicule directement chez vous, partout en France, en toute sécurité.",
    features: [
      "Transport sécurisé",
      "Suivi en temps réel",
      "Livraison sous 48h",
      "Inspection à la livraison"
    ],
    price: "À partir de 300€",
    popular: false
  }
];

const stats = [
  { label: "Véhicules vérifiés", value: "15 000+", icon: Shield },
  { label: "Réparations effectuées", value: "8 500+", icon: Wrench },
  { label: "Clients satisfaits", value: "12 000+", icon: Users },
  { label: "Temps de réponse", value: "< 2h", icon: Clock }
];

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Acheteuse",
    content: "Le service de vérification m'a rassurée sur l'achat de ma voiture. Tout était parfait !",
    rating: 5,
    service: "Vérification Véhicule"
  },
  {
    name: "Thomas Martin",
    role: "Vendeur",
    content: "La gestion administrative m'a fait gagner un temps précieux. Service impeccable !",
    rating: 5,
    service: "Gestion Administrative"
  },
  {
    name: "Sophie Laurent",
    role: "Propriétaire",
    content: "L'entretien de ma voiture a été fait rapidement et avec des pièces de qualité. Service impeccable !",
    rating: 5,
    service: "Entretien & Réparation"
  }
];

const processSteps = [
  {
    step: 1,
    title: "Choisissez votre service",
    description: "Sélectionnez le service qui correspond à vos besoins",
    icon: Search
  },
  {
    step: 2,
    title: "Demande en ligne",
    description: "Remplissez notre formulaire simple et rapide",
    icon: FileText
  },
  {
    step: 3,
    title: "Traitement",
    description: "Notre équipe traite votre demande avec expertise",
    icon: Wrench
  },
  {
    step: 4,
    title: "Livraison",
    description: "Recevez votre service dans les délais convenus",
    icon: CheckCircle2
  }
];

export default function Services() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleServiceClick = (serviceTitle: string) => {
    // Actions spécifiques selon le service
    switch (serviceTitle) {
      case "Recherche Avancée":
        navigate('/voitures');
        break;
      case "Vérification Véhicule":
        toast({
          title: "Service de Vérification",
          description: "Contactez-nous au 01 23 45 67 89 pour planifier une vérification de véhicule.",
        });
        break;
      case "Entretien & Réparation":
        navigate('/service-apres-vente');
        break;
      case "Assistance 24/7":
        toast({
          title: "Assistance 24/7",
          description: "Notre équipe est disponible 24h/24 au 01 23 45 67 89 ou via le chat en ligne.",
        });
        break;
      case "Gestion Administrative":
        toast({
          title: "Gestion Administrative",
          description: "Contactez-nous au 01 23 45 67 89 pour nous confier vos démarches administratives.",
        });
        break;
      case "Livraison à Domicile":
        navigate('/livraison');
        break;
      default:
        toast({
          title: "Service",
          description: "Contactez-nous au 01 23 45 67 89 pour plus d'informations sur ce service.",
        });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Nos <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              OccazCar vous accompagne à chaque étape de votre achat ou vente automobile 
              avec des services professionnels et personnalisés.
            </p>
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

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez tous les services que nous proposons pour faciliter votre expérience automobile
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className={`relative ${service.popular ? 'ring-2 ring-primary' : ''}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">{service.price}</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={service.popular ? "default" : "outline"}
                      onClick={() => handleServiceClick(service.title)}
                    >
                      Découvrir ce service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Un processus simple et transparent en 4 étapes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Témoignages Clients</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez ce que nos clients pensent de nos services
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
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.service}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Besoin d'aide pour choisir ?</h2>
              <p className="text-muted-foreground mb-6">
                Notre équipe d'experts est là pour vous conseiller et vous accompagner 
                dans le choix du service le plus adapté à vos besoins.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/contact">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Nous contacter
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/voitures">
                    <Car className="h-5 w-5 mr-2" />
                    Voir nos véhicules
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

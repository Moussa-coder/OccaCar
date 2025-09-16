import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Star, 
  TrendingUp, 
  Users, 
  Shield,
  Car,
  CreditCard,
  Phone,
  MapPin
} from "lucide-react";

interface AdvertisementProps {
  type?: 'banner' | 'card' | 'sidebar' | 'hero';
  className?: string;
}

const mockAdvertisements = [
  {
    id: 1,
    type: 'insurance',
    title: "Assurance Auto OccazCar",
    subtitle: "Protégez votre véhicule d'occasion",
    description: "Assurance spécialement conçue pour les véhicules d'occasion. Tarifs préférentiels pour nos clients.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    cta: "Demander un devis",
    badge: "Exclusif",
    price: "À partir de 15€/mois"
  },
  {
    id: 3,
    type: 'service',
    title: "Service Après-Vente",
    subtitle: "Entretien et réparations",
    description: "Notre garage officiel OccazCar. Garantie constructeur maintenue. Gratuit pendant 2 mois, puis tarifs préférentiels.",
    image: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400",
    cta: "Prendre RDV",
    badge: "2 mois gratuits",
    price: "Gratuit 2 mois"
  },
  {
    id: 4,
    type: 'delivery',
    title: "Livraison à domicile",
    subtitle: "Votre véhicule livré chez vous",
    description: "Service de livraison sécurisé partout en France. Assurance transport incluse.",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    cta: "Réserver une livraison",
    badge: "Sécurisé",
    price: "À partir de 299€"
  }
];

export function Advertisement({ type = 'card', className = '' }: AdvertisementProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const getRandomAd = () => {
    return mockAdvertisements[Math.floor(Math.random() * mockAdvertisements.length)];
  };

  const ad = getRandomAd();

  const handleServiceClick = (serviceType: string, serviceName: string) => {
    switch (serviceType) {
      case 'insurance':
        navigate('/assurance');
        break;
      case 'service':
        navigate('/service-apres-vente');
        break;
      case 'delivery':
        navigate('/livraison');
        break;
      default:
        toast({
          title: serviceName,
          description: "Service en cours de développement.",
        });
    }
  };

  const renderBanner = () => (
    <Card className={`bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{ad.title}</h3>
              <p className="text-sm text-muted-foreground">{ad.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">{ad.price}</p>
              <Badge variant="secondary" className="text-xs">{ad.badge}</Badge>
            </div>
            <Button size="sm" onClick={() => handleServiceClick(ad.type, ad.title)}>{ad.cta}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCard = () => (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={ad.image} 
            alt={ad.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge className="absolute top-3 left-3 bg-primary/90 text-white">
            {ad.badge}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{ad.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{ad.subtitle}</p>
          <p className="text-sm mb-3">{ad.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">{ad.price}</span>
            <Button size="sm" variant="outline">{ad.cta}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSidebar = () => (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">{ad.title}</h4>
            <p className="text-xs text-muted-foreground">{ad.subtitle}</p>
          </div>
          <Badge variant="secondary" className="text-xs">{ad.badge}</Badge>
          <p className="text-xs text-muted-foreground">{ad.description}</p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">{ad.price}</p>
            <Button size="sm" className="w-full text-xs" onClick={() => handleServiceClick(ad.type, ad.title)}>{ad.cta}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderHero = () => (
    <div className={`bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center">
            <Car className="h-10 w-10 text-primary" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold">{ad.title}</h2>
              <Badge className="bg-primary/90 text-white">{ad.badge}</Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-1">{ad.subtitle}</p>
            <p className="text-muted-foreground">{ad.description}</p>
          </div>
        </div>
        <div className="text-right space-y-3">
          <p className="text-2xl font-bold text-primary">{ad.price}</p>
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => handleServiceClick(ad.type, ad.title)}>
            {ad.cta}
          </Button>
        </div>
      </div>
    </div>
  );

  switch (type) {
    case 'banner':
      return renderBanner();
    case 'card':
      return renderCard();
    case 'sidebar':
      return renderSidebar();
    case 'hero':
      return renderHero();
    default:
      return renderCard();
  }
}

// Composant pour afficher plusieurs publicités
export function AdvertisementGrid({ count = 3, type = 'card', className = '' }: AdvertisementProps & { count?: number }) {
  const navigate = useNavigate();
  
  const handleServiceClick = (serviceType: string, serviceName: string) => {
    switch (serviceType) {
      case 'insurance':
        navigate('/assurance');
        break;
      case 'service':
        navigate('/service-apres-vente');
        break;
      case 'delivery':
        navigate('/livraison');
        break;
      default:
        toast({
          title: serviceName,
          description: "Service en cours de développement.",
        });
    }
  };

  // Pour la grille, on affiche toujours les 3 premiers services
  const fixedAds = mockAdvertisements.slice(0, count);
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${count} gap-6 ${className}`}>
      {fixedAds.map((ad, index) => (
        <div key={index}>
          {type === 'card' ? (
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={ad.image} 
                    alt={ad.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-white">
                    {ad.badge}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{ad.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{ad.subtitle}</p>
                  <p className="text-sm mb-3">{ad.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">{ad.price}</span>
                    <Button size="sm" variant="outline" onClick={() => handleServiceClick(ad.type, ad.title)}>{ad.cta}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Advertisement type={type} />
          )}
        </div>
      ))}
    </div>
  );
}

// Composant pour les publicités partenaires
export function PartnerAdvertisements() {
  const partners = [
    {
      name: "Assurance Directe",
      logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100",
      description: "Assurance auto pas chère",
      cta: "Devis gratuit"
    },
    {
      name: "Crédit Agricole",
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100",
      description: "Crédit auto avantageux",
      cta: "Simuler"
    },
    {
      name: "Norauto",
      logo: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=100",
      description: "Entretien auto",
      cta: "Prendre RDV"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Nos partenaires</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {partners.map((partner, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
              />
              <h4 className="font-semibold text-sm mb-1">{partner.name}</h4>
              <p className="text-xs text-muted-foreground mb-3">{partner.description}</p>
              <Button size="sm" variant="outline" className="w-full text-xs">
                {partner.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

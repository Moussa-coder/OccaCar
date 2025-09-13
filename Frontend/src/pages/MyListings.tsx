import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Fuel,
  Gauge,
  MapPin,
  Users,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour les annonces du vendeur
const mockMyListings = [
  {
    id: "1",
    title: "BMW Série 3 320d Luxury",
    price: 25900,
    year: 2019,
    mileage: 85000,
    fuel: "Diesel",
    location: "Paris 75015",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300",
    isAvailable: true,
    views: 127,
    createdAt: "2024-01-15",
    lastUpdate: "2024-01-18"
  },
  {
    id: "5",
    title: "Peugeot 308 GT BlueHDi",
    price: 19200,
    year: 2018,
    mileage: 95000,
    fuel: "Diesel",
    location: "Nantes 44",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300",
    isAvailable: false,
    views: 89,
    createdAt: "2024-01-10",
    lastUpdate: "2024-01-20"
  }
];

export default function MyListings() {
  const [listings, setListings] = useState(mockMyListings);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
      // Rediriger vers login si pas connecté
      window.location.href = '/login';
      return;
    }

    // Charger les annonces du vendeur
    loadMyListings();
  }, []);

  const loadMyListings = async () => {
    setIsLoading(true);
    try {
      // Ici on ferait l'appel API : GET /api/cars/?owner=me
      // const response = await axios.get('/api/cars/?owner=me');
      // setListings(response.data.results);
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos annonces",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // API call to update status
      // await axios.patch(`/api/cars/${id}/`, { is_available: !currentStatus });
      
      setListings(prev => prev.map(listing => 
        listing.id === id 
          ? { ...listing, isAvailable: !currentStatus }
          : listing
      ));
      
      toast({
        title: "Statut mis à jour",
        description: `Annonce marquée comme ${!currentStatus ? 'disponible' : 'vendue'}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'annonce "${title}" ?`)) {
      return;
    }

    try {
      // API call to delete
      // await axios.delete(`/api/cars/${id}/`);
      
      setListings(prev => prev.filter(listing => listing.id !== id));
      
      toast({
        title: "Annonce supprimée",
        description: "L'annonce a été supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annonce",
        variant: "destructive"
      });
    }
  };

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

  const totalViews = listings.reduce((sum, listing) => sum + listing.views, 0);
  const availableCount = listings.filter(listing => listing.isAvailable).length;
  const soldCount = listings.filter(listing => !listing.isAvailable).length;

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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes annonces</h1>
            <p className="text-muted-foreground">
              Gérez vos annonces et suivez leurs performances
            </p>
          </div>
          
          <Button size="lg" asChild>
            <Link to="/deposer">
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle annonce
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalViews}</div>
                  <div className="text-sm text-muted-foreground">Vues totales</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{availableCount}</div>
                  <div className="text-sm text-muted-foreground">Disponibles</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-muted rounded-lg">
                  <XCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{soldCount}</div>
                  <div className="text-sm text-muted-foreground">Vendues</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{listings.length}</div>
                  <div className="text-sm text-muted-foreground">Total annonces</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <Plus className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold">Aucune annonce</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Vous n'avez pas encore créé d'annonce. Commencez par déposer votre première annonce.
              </p>
              <Button asChild>
                <Link to="/deposer">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer ma première annonce
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {listings.map((listing) => (
              <Card key={listing.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full md:w-48 h-36 relative rounded-lg overflow-hidden">
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant={listing.isAvailable ? "default" : "secondary"}>
                          {listing.isAvailable ? "Disponible" : "Vendue"}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{listing.year}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Gauge className="h-4 w-4" />
                              <span>{formatMileage(listing.mileage)} km</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Fuel className="h-4 w-4" />
                              <span>{listing.fuel}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{listing.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{listing.views} vues</span>
                            </div>
                            <span>Publié le {new Date(listing.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary mb-2">
                            {formatPrice(listing.price)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/voiture/${listing.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Link>
                        </Button>
                        
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/modifier/${listing.id}`}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Modifier
                          </Link>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(listing.id, listing.isAvailable)}
                        >
                          {listing.isAvailable ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Marquer vendue
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Marquer disponible
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(listing.id, listing.title)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
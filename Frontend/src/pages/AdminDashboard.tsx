import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Car, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  Shield,
  BarChart3,
  UserCheck,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock admin data
const mockStats = {
  totalListings: 156,
  activeListings: 124,
  soldCars: 32,
  totalUsers: 89,
  todayViews: 2847,
  thisMonthSales: 18
};

const mockRecentListings = [
  {
    id: "1",
    title: "BMW Série 3 320d Luxury",
    seller: "Martin Dubois",
    price: 25900,
    status: "active",
    createdAt: "2024-01-20",
    views: 45,
    flagged: false
  },
  {
    id: "2",
    title: "Audi A4 Avant 2.0 TDI",
    seller: "Sophie Laurent",
    price: 32500,
    status: "active", 
    createdAt: "2024-01-19",
    views: 73,
    flagged: true
  },
  {
    id: "3",
    title: "Mercedes Classe C 220d",
    seller: "Pierre Martin",
    price: 28750,
    status: "sold",
    createdAt: "2024-01-18",
    views: 89,
    flagged: false
  }
];

export default function AdminDashboard() {
  const [listings, setListings] = useState(mockRecentListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier les droits admin
    const token = localStorage.getItem('token');
    // const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    // En production, vérifier le rôle admin
    // if (userRole !== 'admin') {
    //   window.location.href = '/';
    //   return;
    // }

    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // API calls pour charger les données admin
      // const [statsRes, listingsRes] = await Promise.all([
      //   axios.get('/api/admin/stats/'),
      //   axios.get('/api/admin/listings/')
      // ]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données administrateur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteListing = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer définitivement l'annonce "${title}" ?`)) {
      return;
    }

    try {
      // await axios.delete(`/api/admin/listings/${id}/`);
      
      setListings(prev => prev.filter(listing => listing.id !== id));
      
      toast({
        title: "Annonce supprimée",
        description: "L'annonce a été supprimée définitivement",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annonce",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    try {
      // await axios.patch(`/api/admin/listings/${id}/`, { status: newStatus });
      
      setListings(prev => prev.map(listing => 
        listing.id === id 
          ? { ...listing, status: newStatus }
          : listing
      ));
      
      toast({
        title: "Statut modifié",
        description: `Annonce ${newStatus === 'active' ? 'activée' : 'suspendue'}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
          </div>
          <p className="text-muted-foreground">
            Gestion et supervision de la plateforme OccazCar
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/users'}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Gestion des Utilisateurs</h3>
                  <p className="text-sm text-muted-foreground">Gérer les comptes et rôles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/analytics'}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Analytics Avancées</h3>
                  <p className="text-sm text-muted-foreground">Analyser les performances</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/moderation'}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Queue de Modération</h3>
                  <p className="text-sm text-muted-foreground">Modérer le contenu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Admin Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/settings'}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Configuration Système</h3>
                  <p className="text-sm text-muted-foreground">Paramètres de la plateforme</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/security'}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Shield className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Sécurité</h3>
                  <p className="text-sm text-muted-foreground">Logs et sécurité</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mockStats.totalListings}</div>
                  <div className="text-sm text-muted-foreground">Total annonces</div>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{mockStats.activeListings} actives</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <XCircle className="h-3 w-3" />
                  <span>{mockStats.soldCars} vendues</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Utilisateurs inscrits</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mockStats.thisMonthSales}</div>
                  <div className="text-sm text-muted-foreground">Ventes ce mois</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {mockStats.todayViews.toLocaleString('fr-FR')} vues aujourd'hui
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Listings Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Gestion des annonces</span>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une annonce..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredListings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune annonce trouvée
                </div>
              ) : (
                filteredListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{listing.title}</h3>
                        {listing.flagged && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Signalée
                          </Badge>
                        )}
                        <Badge variant={
                          listing.status === 'active' ? 'default' : 
                          listing.status === 'sold' ? 'secondary' : 'destructive'
                        }>
                          {listing.status === 'active' ? 'Active' : 
                           listing.status === 'sold' ? 'Vendue' : 'Suspendue'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <span>Vendeur: {listing.seller}</span>
                        <span className="font-medium text-primary">{formatPrice(listing.price)}</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{listing.views} vues</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(listing.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/voiture/${listing.id}`} target="_blank">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </a>
                      </Button>
                      
                      {listing.status !== 'sold' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(listing.id, listing.status)}
                        >
                          {listing.status === 'active' ? (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Suspendre
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Activer
                            </>
                          )}
                        </Button>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteListing(listing.id, listing.title)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admin Notice */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Zone Administrateur :</strong> Vous avez accès à toutes les fonctionnalités de modération et de gestion de la plateforme. 
            Utilisez ces outils avec précaution.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
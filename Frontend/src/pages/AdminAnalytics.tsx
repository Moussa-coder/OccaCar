import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Car,
  Eye,
  DollarSign,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  ArrowLeft,
  Target,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  ShoppingCart,
  Percent
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour les analytics
const mockAnalytics = {
  overview: {
    totalRevenue: 125000,
    revenueGrowth: 12.5,
    totalListings: 156,
    listingsGrowth: 8.2,
    totalUsers: 89,
    usersGrowth: 15.3,
    conversionRate: 3.2,
    conversionGrowth: -2.1,
    averageListingPrice: 28500,
    averageTimeToSale: "18 jours",
    customerSatisfaction: 4.7,
    bounceRate: 35.2
  },
  dailyStats: [
    { date: "2024-01-20", views: 2847, listings: 12, users: 8, revenue: 8500, conversions: 3 },
    { date: "2024-01-19", views: 2654, listings: 15, users: 12, revenue: 9200, conversions: 4 },
    { date: "2024-01-18", views: 3120, listings: 8, users: 6, revenue: 6800, conversions: 2 },
    { date: "2024-01-17", views: 2890, listings: 18, users: 15, revenue: 10500, conversions: 5 },
    { date: "2024-01-16", views: 2756, listings: 14, users: 9, revenue: 7800, conversions: 3 },
    { date: "2024-01-15", views: 2987, listings: 11, users: 7, revenue: 8900, conversions: 4 },
    { date: "2024-01-14", views: 2634, listings: 16, users: 11, revenue: 7200, conversions: 2 }
  ],
  topListings: [
    { id: "1", title: "BMW Série 3 320d Luxury", views: 127, price: 25900, status: "active", inquiries: 8, daysOnline: 5 },
    { id: "2", title: "Audi A4 Avant 2.0 TDI", views: 98, price: 32500, status: "active", inquiries: 6, daysOnline: 3 },
    { id: "3", title: "Mercedes Classe C 220d", views: 89, price: 28750, status: "sold", inquiries: 12, daysOnline: 8 },
    { id: "4", title: "Volkswagen Golf GTI", views: 76, price: 22500, status: "active", inquiries: 4, daysOnline: 2 },
    { id: "5", title: "Peugeot 308 GT BlueHDi", views: 65, price: 19200, status: "active", inquiries: 3, daysOnline: 1 }
  ],
  userActivity: {
    newRegistrations: 15,
    activeUsers: 67,
    returningUsers: 45,
    averageSessionTime: "4m 32s",
    pageViewsPerSession: 3.2,
    bounceRate: 35.2,
    topPages: ["/voitures", "/", "/a-propos", "/contact"]
  },
  revenueByMonth: [
    { month: "Jan 2024", revenue: 125000, growth: 12.5, listings: 45, sales: 18 },
    { month: "Déc 2023", revenue: 111000, growth: 8.3, listings: 38, sales: 15 },
    { month: "Nov 2023", revenue: 102500, growth: 15.2, listings: 42, sales: 17 },
    { month: "Oct 2023", revenue: 89000, growth: -5.1, listings: 35, sales: 12 }
  ],
  performanceMetrics: {
    averageResponseTime: "1.2s",
    uptime: "99.8%",
    serverLoad: "45%",
    databaseQueries: 1250,
    apiCalls: 8900,
    errorRate: "0.3%"
  },
  geographicData: [
    { region: "Île-de-France", users: 45, listings: 67, revenue: 45000 },
    { region: "Auvergne-Rhône-Alpes", users: 23, listings: 34, revenue: 28000 },
    { region: "Provence-Alpes-Côte d'Azur", users: 18, listings: 28, revenue: 22000 },
    { region: "Nouvelle-Aquitaine", users: 15, listings: 22, revenue: 18000 },
    { region: "Occitanie", users: 12, listings: 18, revenue: 15000 }
  ],
  brandPerformance: [
    { brand: "BMW", listings: 25, views: 1250, sales: 8, avgPrice: 32000 },
    { brand: "Audi", listings: 22, views: 1100, sales: 6, avgPrice: 35000 },
    { brand: "Mercedes-Benz", listings: 20, views: 980, sales: 7, avgPrice: 38000 },
    { brand: "Volkswagen", listings: 18, views: 850, sales: 5, avgPrice: 22000 },
    { brand: "Peugeot", listings: 15, views: 720, sales: 4, avgPrice: 18000 }
  ],
  conversionFunnel: {
    visitors: 10000,
    pageViews: 25000,
    listingViews: 8500,
    inquiries: 450,
    sales: 18,
    conversionRates: {
      visitorToInquiry: 4.5,
      inquiryToSale: 4.0,
      visitorToSale: 0.18
    }
  }
};

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier les droits admin
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      window.location.href = '/login';
      return;
    }

    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // API call pour charger les analytics
      // const response = await axios.get(`/api/admin/analytics/?period=${selectedPeriod}`);
      // setAnalytics(response.data);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les analytics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const exportAnalytics = () => {
    toast({
      title: "Export en cours",
      description: "Les données analytics sont en cours d'export...",
    });
    // Implémenter l'export des données
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
          <Button variant="outline" size="sm" className="mb-4" onClick={() => window.location.href = '/admin'}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Analytics Avancées</h1>
              </div>
              <p className="text-muted-foreground">
                Analysez les performances de votre plateforme OccazCar
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
              aria-label="Sélectionner la période"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
              <option value="1y">1 an</option>
            </select>
            
            <Button variant="outline" onClick={exportAnalytics}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenus Totaux</p>
                  <p className="text-2xl font-bold">{formatCurrency(analytics.overview.totalRevenue)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-2">
                {getGrowthIcon(analytics.overview.revenueGrowth)}
                <span className={`text-sm ${getGrowthColor(analytics.overview.revenueGrowth)}`}>
                  {analytics.overview.revenueGrowth > 0 ? '+' : ''}{analytics.overview.revenueGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Annonces</p>
                  <p className="text-2xl font-bold">{analytics.overview.totalListings}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-2">
                {getGrowthIcon(analytics.overview.listingsGrowth)}
                <span className={`text-sm ${getGrowthColor(analytics.overview.listingsGrowth)}`}>
                  {analytics.overview.listingsGrowth > 0 ? '+' : ''}{analytics.overview.listingsGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                  <p className="text-2xl font-bold">{analytics.overview.totalUsers}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-2">
                {getGrowthIcon(analytics.overview.usersGrowth)}
                <span className={`text-sm ${getGrowthColor(analytics.overview.usersGrowth)}`}>
                  {analytics.overview.usersGrowth > 0 ? '+' : ''}{analytics.overview.usersGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taux de Conversion</p>
                  <p className="text-2xl font-bold">{analytics.overview.conversionRate}%</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-2">
                {getGrowthIcon(analytics.overview.conversionGrowth)}
                <span className={`text-sm ${getGrowthColor(analytics.overview.conversionGrowth)}`}>
                  {analytics.overview.conversionGrowth > 0 ? '+' : ''}{analytics.overview.conversionGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prix Moyen</p>
                  <p className="text-2xl font-bold">{formatCurrency(analytics.overview.averageListingPrice)}</p>
                </div>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Temps de Vente</p>
                  <p className="text-2xl font-bold">{analytics.overview.averageTimeToSale}</p>
                </div>
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Clock className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold">{analytics.overview.customerSatisfaction}/5</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taux de Rebond</p>
                  <p className="text-2xl font-bold">{analytics.overview.bounceRate}%</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Activité Quotidienne</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.dailyStats.slice(0, 7).map((stat, index) => {
                  const maxViews = Math.max(...analytics.dailyStats.map(d => d.views));
                  const viewPercentage = (stat.views / maxViews) * 100;
                  const maxRevenue = Math.max(...analytics.dailyStats.map(d => d.revenue));
                  const revenuePercentage = (stat.revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={stat.date} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium">
                            {new Date(stat.date).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{formatNumber(stat.views)} vues</span>
                          <span>{stat.listings} annonces</span>
                          <span>{formatCurrency(stat.revenue)}</span>
                        </div>
                      </div>
                      
                      {/* Bar Charts */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Vues</span>
                          <span className="font-medium">{formatNumber(stat.views)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${viewPercentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Revenus</span>
                          <span className="font-medium">{formatCurrency(stat.revenue)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${revenuePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Activité Utilisateurs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Nouvelles inscriptions avec graphique */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Nouvelles inscriptions</span>
                    <span className="text-2xl font-bold text-blue-600">{analytics.userActivity.newRegistrations}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(analytics.userActivity.newRegistrations / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Utilisateurs actifs avec graphique */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Utilisateurs actifs</span>
                    <span className="text-2xl font-bold text-green-600">{analytics.userActivity.activeUsers}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(analytics.userActivity.activeUsers / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Utilisateurs récurrents avec graphique */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Utilisateurs récurrents</span>
                    <span className="text-2xl font-bold text-purple-600">{analytics.userActivity.returningUsers}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(analytics.userActivity.returningUsers / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Temps de session avec graphique */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Temps de session moyen</span>
                    <span className="text-2xl font-bold text-orange-600">{analytics.userActivity.averageSessionTime}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(parseFloat(analytics.userActivity.averageSessionTime) / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Graphique circulaire pour la répartition */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Répartition des utilisateurs</h4>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      {/* Cercle de fond */}
                      <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                      {/* Cercle pour les nouveaux utilisateurs */}
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-blue-500 transition-all duration-500"
                        style={{ 
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(0)}% ${50 + 50 * Math.sin(0)}%)` 
                        }}
                      ></div>
                      {/* Cercle pour les utilisateurs actifs */}
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-green-500 transition-all duration-500"
                        style={{ 
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(Math.PI * 0.6)}% ${50 + 50 * Math.sin(Math.PI * 0.6)}%)` 
                        }}
                      ></div>
                      {/* Cercle pour les utilisateurs récurrents */}
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-purple-500 transition-all duration-500"
                        style={{ 
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(Math.PI * 1.2)}% ${50 + 50 * Math.sin(Math.PI * 1.2)}%)` 
                        }}
                      ></div>
                      {/* Texte au centre */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">{analytics.userActivity.activeUsers + analytics.userActivity.returningUsers}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4 mt-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Nouveaux</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Actifs</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Récurrents</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Listings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top Annonces</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topListings.map((listing, index) => (
                <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{listing.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{formatCurrency(listing.price)}</span>
                        <span>{listing.daysOnline} jours en ligne</span>
                        <span>{listing.inquiries} demandes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{listing.views}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">vues</div>
                    </div>
                    <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                      {listing.status === 'active' ? 'Active' : 'Vendue'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Revenus par Mois</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.revenueByMonth.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">{month.month}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{formatCurrency(month.revenue)}</span>
                    <div className="flex items-center space-x-1">
                      {getGrowthIcon(month.growth)}
                      <span className={`text-sm ${getGrowthColor(month.growth)}`}>
                        {month.growth > 0 ? '+' : ''}{month.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Technique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Performance Technique</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Uptime avec graphique circulaire */}
              <div className="text-center p-4 border rounded-lg">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-green-500 transition-all duration-500"
                    style={{ 
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(Math.PI * 1.8)}% ${50 + 50 * Math.sin(Math.PI * 1.8)}%)` 
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{analytics.performanceMetrics.uptime}</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium">Uptime</div>
              </div>

              {/* Temps de réponse avec graphique */}
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.performanceMetrics.averageResponseTime}</div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <div className="text-sm font-medium">Temps de réponse</div>
              </div>

              {/* Charge serveur avec graphique */}
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.performanceMetrics.serverLoad}</div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="text-sm font-medium">Charge serveur</div>
              </div>

              {/* Requêtes DB avec graphique */}
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">{formatNumber(analytics.performanceMetrics.databaseQueries)}</div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="text-sm font-medium">Requêtes DB</div>
              </div>

              {/* Appels API avec graphique */}
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{formatNumber(analytics.performanceMetrics.apiCalls)}</div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <div className="text-sm font-medium">Appels API</div>
              </div>

              {/* Taux d'erreur avec graphique */}
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">{analytics.performanceMetrics.errorRate}</div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full" style={{ width: '3%' }}></div>
                </div>
                <div className="text-sm font-medium">Taux d'erreur</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Données Géographiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Performance par Région</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.geographicData.map((region, index) => {
                const maxRevenue = Math.max(...analytics.geographicData.map(r => r.revenue));
                const revenuePercentage = (region.revenue / maxRevenue) * 100;
                const maxUsers = Math.max(...analytics.geographicData.map(r => r.users));
                const usersPercentage = (region.users / maxUsers) * 100;
                
                return (
                  <div key={region.region} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {region.region.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">{region.region}</h4>
                          <p className="text-sm text-muted-foreground">{region.users} utilisateurs • {region.listings} annonces</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-green-600">{formatCurrency(region.revenue)}</div>
                        <div className="text-sm text-muted-foreground">Revenus</div>
                      </div>
                    </div>
                    
                    {/* Graphiques de performance */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Revenus</span>
                          <span className="font-medium">{formatCurrency(region.revenue)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${revenuePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Utilisateurs</span>
                          <span className="font-medium">{region.users}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${usersPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance des Marques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Performance des Marques</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.brandPerformance.map((brand, index) => {
                const maxSales = Math.max(...analytics.brandPerformance.map(b => b.sales));
                const salesPercentage = (brand.sales / maxSales) * 100;
                const maxViews = Math.max(...analytics.brandPerformance.map(b => b.views));
                const viewsPercentage = (brand.views / maxViews) * 100;
                
                return (
                  <div key={brand.brand} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {brand.brand.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">{brand.brand}</h4>
                          <p className="text-sm text-muted-foreground">{brand.listings} annonces • {brand.views} vues</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-green-600">{brand.sales} ventes</div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(brand.avgPrice)} moy.</div>
                      </div>
                    </div>
                    
                    {/* Graphiques de performance */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Ventes</span>
                          <span className="font-medium">{brand.sales}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${salesPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Vues</span>
                          <span className="font-medium">{formatNumber(brand.views)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${viewsPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Entonnoir de Conversion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Entonnoir de Conversion</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {Math.floor(analytics.conversionFunnel.visitors / 1000)}k
                  </div>
                  <div>
                    <h4 className="font-medium">Visiteurs</h4>
                    <p className="text-sm text-muted-foreground">{formatNumber(analytics.conversionFunnel.visitors)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-muted-foreground">Base</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {Math.floor(analytics.conversionFunnel.inquiries / 100)}
                  </div>
                  <div>
                    <h4 className="font-medium">Demandes</h4>
                    <p className="text-sm text-muted-foreground">{formatNumber(analytics.conversionFunnel.inquiries)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{analytics.conversionFunnel.conversionRates.visitorToInquiry}%</div>
                  <div className="text-sm text-muted-foreground">Conversion</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                    {analytics.conversionFunnel.sales}
                  </div>
                  <div>
                    <h4 className="font-medium">Ventes</h4>
                    <p className="text-sm text-muted-foreground">{formatNumber(analytics.conversionFunnel.sales)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{analytics.conversionFunnel.conversionRates.visitorToSale}%</div>
                  <div className="text-sm text-muted-foreground">Conversion finale</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

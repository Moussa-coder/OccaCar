import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Flag,
  User,
  Calendar,
  MessageSquare,
  Filter,
  Search,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour la queue de modération
const mockModerationQueue = [
  {
    id: "1",
    type: "listing",
    title: "BMW Série 3 320d Luxury",
    content: "Vente de ma BMW en excellent état...",
    author: "Martin Dubois",
    authorEmail: "martin.dubois@email.com",
    status: "pending",
    priority: "high",
    reason: "Prix suspect",
    reportedBy: "Utilisateur anonyme",
    createdAt: "2024-01-20T10:30:00Z",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300"],
    details: {
      price: 25900,
      year: 2019,
      mileage: 85000,
      location: "Paris 75015"
    }
  },
  {
    id: "2",
    type: "user",
    title: "Profil utilisateur signalé",
    content: "Comportement inapproprié dans les messages",
    author: "Pierre Martin",
    authorEmail: "pierre.martin@email.com",
    status: "pending",
    priority: "medium",
    reason: "Harcèlement",
    reportedBy: "Sophie Laurent",
    createdAt: "2024-01-20T09:15:00Z",
    details: {
      joinDate: "2024-01-05",
      listingsCount: 1,
      reportsCount: 2
    }
  },
  {
    id: "3",
    type: "listing",
    title: "Audi A4 Avant 2.0 TDI",
    content: "Véhicule accidenté mais réparé...",
    author: "Sophie Laurent",
    authorEmail: "sophie.laurent@email.com",
    status: "pending",
    priority: "low",
    reason: "Information manquante",
    reportedBy: "Système automatique",
    createdAt: "2024-01-20T08:45:00Z",
    images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300"],
    details: {
      price: 32500,
      year: 2020,
      mileage: 45000,
      location: "Lyon 69000"
    }
  },
  {
    id: "4",
    type: "message",
    title: "Message inapproprié",
    content: "Contenu offensant dans un message privé",
    author: "Utilisateur anonyme",
    authorEmail: "anonyme@email.com",
    status: "pending",
    priority: "high",
    reason: "Langage offensant",
    reportedBy: "Marie Bernard",
    createdAt: "2024-01-19T16:20:00Z",
    details: {
      messageContent: "Message contenant des propos inappropriés...",
      conversationId: "conv_123"
    }
  }
];

export default function ModerationQueue() {
  const [queue, setQueue] = useState(mockModerationQueue);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
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

    loadModerationQueue();
  }, []);

  const loadModerationQueue = async () => {
    setIsLoading(true);
    try {
      // API call pour charger la queue de modération
      // const response = await axios.get('/api/admin/moderation/queue/');
      // setQueue(response.data);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger la queue de modération",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      // await axios.post(`/api/admin/moderation/${id}/approve/`);
      
      setQueue(prev => prev.map(item => 
        item.id === id 
          ? { ...item, status: 'approved' }
          : item
      ));
      
      toast({
        title: "Contenu approuvé",
        description: "Le contenu a été approuvé et est maintenant visible",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver le contenu",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      // await axios.post(`/api/admin/moderation/${id}/reject/`);
      
      setQueue(prev => prev.map(item => 
        item.id === id 
          ? { ...item, status: 'rejected' }
          : item
      ));
      
      toast({
        title: "Contenu rejeté",
        description: "Le contenu a été rejeté et n'est plus visible",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter le contenu",
        variant: "destructive"
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Urgent</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-orange-100 text-orange-800">Moyen</Badge>;
      case 'low':
        return <Badge variant="secondary">Faible</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'listing':
        return <Eye className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'listing':
        return 'Annonce';
      case 'user':
        return 'Utilisateur';
      case 'message':
        return 'Message';
      default:
        return type;
    }
  };

  const filteredQueue = queue.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const pendingCount = queue.filter(item => item.status === 'pending').length;
  const highPriorityCount = queue.filter(item => item.priority === 'high' && item.status === 'pending').length;

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
          
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Queue de Modération</h1>
          </div>
          <p className="text-muted-foreground">
            Gérez les signalements et modérez le contenu de la plateforme
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <div className="text-sm text-muted-foreground">En attente</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{highPriorityCount}</div>
                  <div className="text-sm text-muted-foreground">Priorité haute</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Flag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{queue.length}</div>
                  <div className="text-sm text-muted-foreground">Total signalements</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher dans la queue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                  aria-label="Filtrer par statut"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                </select>
                
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                  aria-label="Filtrer par priorité"
                >
                  <option value="all">Toutes priorités</option>
                  <option value="high">Haute</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Faible</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                  aria-label="Filtrer par type"
                >
                  <option value="all">Tous types</option>
                  <option value="listing">Annonces</option>
                  <option value="user">Utilisateurs</option>
                  <option value="message">Messages</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Moderation Queue */}
        <div className="space-y-6">
          {filteredQueue.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold">Queue vide</h3>
                <p className="text-muted-foreground">
                  Aucun élément en attente de modération
                </p>
              </div>
            </Card>
          ) : (
            filteredQueue.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(item.type)}
                          <div>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {getTypeLabel(item.type)} • {item.author}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(item.priority)}
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm">{item.content}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Raison du signalement:</strong> {item.reason}</p>
                          <p><strong>Signalé par:</strong> {item.reportedBy}</p>
                        </div>
                        <div>
                          <p><strong>Date:</strong> {formatDate(item.createdAt)}</p>
                          <p><strong>Email:</strong> {item.authorEmail}</p>
                        </div>
                      </div>
                      
                      {/* Additional Details */}
                      {item.details && (
                        <div className="bg-background p-4 rounded-lg border">
                          <h4 className="font-medium mb-2">Détails supplémentaires:</h4>
                          {item.type === 'listing' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Prix:</span>
                                <p className="font-medium">{formatCurrency(item.details.price)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Année:</span>
                                <p className="font-medium">{item.details.year}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Kilométrage:</span>
                                <p className="font-medium">{item.details.mileage.toLocaleString('fr-FR')} km</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Localisation:</span>
                                <p className="font-medium">{item.details.location}</p>
                              </div>
                            </div>
                          )}
                          {item.type === 'user' && (
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Inscrit le:</span>
                                <p className="font-medium">{new Date(item.details.joinDate).toLocaleDateString('fr-FR')}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Annonces:</span>
                                <p className="font-medium">{item.details.listingsCount}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Signalements:</span>
                                <p className="font-medium">{item.details.reportsCount}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col space-y-2 lg:w-48">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                      
                      {item.status === 'pending' && (
                        <>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                            className="w-full"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approuver
                          </Button>
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleReject(item.id)}
                            className="w-full"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      
                      {item.status === 'approved' && (
                        <Badge variant="default" className="w-full justify-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Approuvé
                        </Badge>
                      )}
                      
                      {item.status === 'rejected' && (
                        <Badge variant="destructive" className="w-full justify-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejeté
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Admin Notice */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Modération :</strong> Examinez attentivement chaque signalement avant de prendre une décision. 
            Vos actions affectent directement l'expérience utilisateur.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Phone, 
  Calendar, 
  Car, 
  Wrench, 
  Truck,
  Shield,
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - sera remplacé par des appels API
const mockRequests = [
  {
    id: 1,
    type: "insurance",
    status: "pending",
    date: "2024-01-15",
    time: "14:30",
    user: {
      firstName: "Marie",
      lastName: "Dubois",
      email: "marie.dubois@email.com",
      phone: "06 12 34 56 78"
    },
    details: {
      carBrand: "BMW",
      carModel: "Série 3",
      carYear: "2020",
      carValue: "25000",
      drivingExperience: "5-10 ans",
      previousClaims: "0",
      selectedPlan: "Tous Risques"
    }
  },
  {
    id: 2,
    type: "service",
    status: "pending",
    date: "2024-01-15",
    time: "10:15",
    user: {
      firstName: "Thomas",
      lastName: "Martin",
      email: "thomas.martin@email.com",
      phone: "06 98 76 54 32"
    },
    details: {
      selectedService: "Révision",
      appointmentDate: "2024-01-20",
      appointmentTime: "14:00",
      contactName: "Thomas Martin",
      contactPhone: "06 98 76 54 32"
    }
  },
  {
    id: 3,
    type: "delivery",
    status: "confirmed",
    date: "2024-01-14",
    time: "16:45",
    user: {
      firstName: "Sophie",
      lastName: "Laurent",
      email: "sophie.laurent@email.com",
      phone: "06 55 44 33 22"
    },
    details: {
      carId: "BMW-320d-2020",
      pickupAddress: "123 Rue de la Paix, 75001 Paris",
      deliveryAddress: "45 Avenue des Champs, 75008 Paris",
      deliveryDate: "2024-01-18",
      deliveryTime: "afternoon",
      contactName: "Sophie Laurent",
      contactPhone: "06 55 44 33 22",
      selectedOption: "express"
    }
  }
];

const requestTypes = {
  insurance: {
    title: "Demande d'assurance",
    icon: Shield,
    color: "bg-blue-100 text-blue-800"
  },
  service: {
    title: "Rendez-vous service",
    icon: Wrench,
    color: "bg-green-100 text-green-800"
  },
  delivery: {
    title: "Demande de livraison",
    icon: Truck,
    color: "bg-purple-100 text-purple-800"
  }
};

const statusTypes = {
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800"
  },
  confirmed: {
    label: "Confirmé",
    color: "bg-green-100 text-green-800"
  },
  completed: {
    label: "Terminé",
    color: "bg-blue-100 text-blue-800"
  },
  cancelled: {
    label: "Annulé",
    color: "bg-red-100 text-red-800"
  }
};

export default function AdminRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState(mockRequests);
  const [filteredRequests, setFilteredRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Filter logic
  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(request => request.type === typeFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, typeFilter]);

  const handleStatusChange = (requestId: number, newStatus: string) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    ));
    
    toast({
      title: "Statut mis à jour",
      description: `Le statut de la demande a été changé en "${statusTypes[newStatus as keyof typeof statusTypes].label}".`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/admin'}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour au dashboard</span>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Gestion des demandes</h1>
          <p className="text-muted-foreground">
            Gérez les demandes d'assurance, de service et de livraison des clients
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rechercher</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="insurance">Assurance</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="delivery">Livraison</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmé</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === 'confirmed').length}</p>
                  <p className="text-sm text-muted-foreground">Confirmés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === 'completed').length}</p>
                  <p className="text-sm text-muted-foreground">Terminés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === 'cancelled').length}</p>
                  <p className="text-sm text-muted-foreground">Annulés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredRequests.map((request) => {
              const requestType = requestTypes[request.type as keyof typeof requestTypes];
              const status = statusTypes[request.status as keyof typeof statusTypes];
              const Icon = requestType.icon;

              return (
                <Card key={request.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedRequest(request)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{requestType.title}</h3>
                            <Badge className={requestType.color}>
                              {requestType.title}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {request.user.firstName} {request.user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {request.user.email}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(request.date)}</span>
                            </span>
                            <span>{request.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Request Details */}
          <div className="lg:col-span-1">
            {selectedRequest ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Détails de la demande</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* User Info */}
                  <div>
                    <h4 className="font-semibold mb-3">Informations client</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Nom:</span>
                        <span>{selectedRequest.user.firstName} {selectedRequest.user.lastName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedRequest.user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedRequest.user.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div>
                    <h4 className="font-semibold mb-3">Détails de la demande</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedRequest.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span>{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Management */}
                  <div>
                    <h4 className="font-semibold mb-3">Gestion du statut</h4>
                    <div className="space-y-2">
                      <Select 
                        value={selectedRequest.status} 
                        onValueChange={(value) => handleStatusChange(selectedRequest.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="confirmed">Confirmé</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer un email
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler le client
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Sélectionnez une demande pour voir les détails
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

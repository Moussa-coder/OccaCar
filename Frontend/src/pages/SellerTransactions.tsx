import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search,
  Filter,
  Truck,
  Clock,
  CheckCircle2,
  Euro,
  Eye,
  MessageSquare,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour la démo
const mockTransactions = [
  {
    id: "tx_001",
    status: "payment_received",
    carPrice: 25000,
    commission: 625,
    sellerAmount: 24375,
    paymentDate: "2024-01-15T10:30:00Z",
    car: {
      title: "BMW Série 3 320d Luxury",
      brand: "BMW",
      model: "Série 3",
      year: 2020,
      images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"]
    },
    buyer: {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@email.com",
      phone: "06 12 34 56 78"
    },
    delivery: {
      method: "delivery",
      address: {
        street: "123 Rue de la Paix",
        city: "Paris",
        postalCode: "75001"
      }
    }
  },
  {
    id: "tx_002",
    status: "car_delivered",
    carPrice: 18000,
    commission: 450,
    sellerAmount: 17550,
    paymentDate: "2024-01-10T14:20:00Z",
    deliveryDate: "2024-01-12T16:00:00Z",
    inspectionDeadline: "2024-01-19T16:00:00Z",
    car: {
      title: "Audi A4 2.0 TDI",
      brand: "Audi",
      model: "A4",
      year: 2019,
      images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]
    },
    buyer: {
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@email.com",
      phone: "06 98 76 54 32"
    },
    delivery: {
      method: "pickup"
    }
  },
  {
    id: "tx_003",
    status: "payment_released",
    carPrice: 32000,
    commission: 500,
    sellerAmount: 31500,
    paymentDate: "2024-01-05T09:15:00Z",
    deliveryDate: "2024-01-07T11:30:00Z",
    releaseDate: "2024-01-14T10:00:00Z",
    car: {
      title: "Mercedes C-Class C220d",
      brand: "Mercedes",
      model: "C-Class",
      year: 2021,
      images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"]
    },
    buyer: {
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre.durand@email.com",
      phone: "06 55 44 33 22"
    },
    delivery: {
      method: "meeting_point"
    }
  }
];

const statusConfig = {
  pending_payment: {
    label: "En attente de paiement",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    description: "L'acheteur n'a pas encore effectué le paiement"
  },
  payment_received: {
    label: "Paiement reçu",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle2,
    description: "Paiement confirmé, préparez la livraison"
  },
  car_delivered: {
    label: "Véhicule livré",
    color: "bg-green-100 text-green-800",
    icon: Truck,
    description: "Véhicule livré, en attente d'inspection"
  },
  inspection_period: {
    label: "Période d'inspection",
    color: "bg-orange-100 text-orange-800",
    icon: Eye,
    description: "L'acheteur inspecte le véhicule (7 jours)"
  },
  inspection_approved: {
    label: "Inspection approuvée",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
    description: "Inspection approuvée, paiement en cours"
  },
  inspection_disputed: {
    label: "Litige d'inspection",
    color: "bg-red-100 text-red-800",
    icon: AlertTriangle,
    description: "Problèmes signalés, médiation en cours"
  },
  payment_released: {
    label: "Paiement versé",
    color: "bg-green-100 text-green-800",
    icon: Euro,
    description: "Paiement versé avec succès"
  },
  transaction_completed: {
    label: "Transaction terminée",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
    description: "Transaction complètement finalisée"
  }
};

export default function SellerTransactions() {
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrer les transactions
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.buyer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.buyer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter]);

  const handleMarkAsDelivered = async (transactionId: string) => {
    setIsLoading(true);
    
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransactions(prev => prev.map(tx => 
        tx.id === transactionId 
          ? { 
              ...tx, 
              status: 'car_delivered',
              deliveryDate: new Date().toISOString(),
              inspectionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          : tx
      ));
      
      setSelectedTransaction(null);
      setDeliveryNotes("");
      setTrackingNumber("");
      
      toast({
        title: "Livraison confirmée",
        description: "Le véhicule a été marqué comme livré.",
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la confirmation de livraison.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: transactions.length,
      pending_payment: 0,
      payment_received: 0,
      car_delivered: 0,
      inspection_period: 0,
      payment_released: 0
    };

    transactions.forEach(tx => {
      if (stats.hasOwnProperty(tx.status)) {
        stats[tx.status as keyof typeof stats]++;
      }
    });

    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mes transactions</h1>
          <p className="text-muted-foreground">
            Gérez vos ventes et suivez l'état de vos transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending_payment}</div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.payment_received}</div>
              <div className="text-sm text-muted-foreground">Paiement reçu</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.car_delivered}</div>
              <div className="text-sm text-muted-foreground">Livré</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.inspection_period}</div>
              <div className="text-sm text-muted-foreground">Inspection</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.payment_released}</div>
              <div className="text-sm text-muted-foreground">Payé</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par véhicule, acheteur ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending_payment">En attente de paiement</SelectItem>
                    <SelectItem value="payment_received">Paiement reçu</SelectItem>
                    <SelectItem value="car_delivered">Véhicule livré</SelectItem>
                    <SelectItem value="inspection_period">Période d'inspection</SelectItem>
                    <SelectItem value="payment_released">Paiement versé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => {
            const statusInfo = statusConfig[transaction.status as keyof typeof statusConfig];
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={transaction.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={transaction.car.images[0]} 
                        alt={transaction.car.title}
                        className="w-20 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{transaction.car.title}</h3>
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p><strong>Acheteur:</strong> {transaction.buyer.firstName} {transaction.buyer.lastName}</p>
                            <p><strong>Email:</strong> {transaction.buyer.email}</p>
                            <p><strong>Téléphone:</strong> {transaction.buyer.phone}</p>
                          </div>
                          
                          <div>
                            <p><strong>Prix:</strong> {formatPrice(transaction.carPrice)}</p>
                            <p><strong>Commission:</strong> {formatPrice(transaction.commission)}</p>
                            <p><strong>Vous recevrez:</strong> {formatPrice(transaction.sellerAmount)}</p>
                          </div>
                          
                          <div>
                            <p><strong>ID Transaction:</strong> {transaction.id}</p>
                            {transaction.paymentDate && (
                              <p><strong>Paiement reçu:</strong> {formatDate(transaction.paymentDate)}</p>
                            )}
                            {transaction.deliveryDate && (
                              <p><strong>Livré le:</strong> {formatDate(transaction.deliveryDate)}</p>
                            )}
                            {transaction.releaseDate && (
                              <p><strong>Paiement versé:</strong> {formatDate(transaction.releaseDate)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {transaction.status === 'payment_received' && (
                        <Button 
                          onClick={() => setSelectedTransaction(transaction)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Marquer comme livré
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                Aucune transaction trouvée avec ces critères.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Delivery Confirmation Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Confirmer la livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Confirmez que le véhicule <strong>{selectedTransaction.car.title}</strong> 
                    a été livré à l'acheteur.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delivery-notes">Notes de livraison (optionnel)</Label>
                  <Textarea
                    id="delivery-notes"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Ajoutez des détails sur la livraison..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tracking-number">Numéro de suivi (optionnel)</Label>
                  <Input
                    id="tracking-number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="TRK123456789"
                  />
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Une fois confirmée, l'acheteur aura 7 jours pour inspecter le véhicule 
                    avant que le paiement ne soit versé.
                  </AlertDescription>
                </Alert>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTransaction(null)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={() => handleMarkAsDelivered(selectedTransaction.id)}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? "Confirmation..." : "Confirmer la livraison"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

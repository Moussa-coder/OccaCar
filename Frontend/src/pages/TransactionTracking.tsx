import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Eye, 
  AlertTriangle,
  Shield,
  Euro,
  Calendar,
  MessageSquare,
  Phone,
  MapPin,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour la démo
const mockTransaction = {
  id: "tx_123456789",
  status: "car_delivered",
  carPrice: 25000,
  commission: 625,
  totalAmount: 25625,
  sellerAmount: 24375,
  paymentDate: "2024-01-15T10:30:00Z",
  deliveryDate: "2024-01-16T14:00:00Z",
  inspectionDeadline: "2024-01-23T14:00:00Z",
  car: {
    title: "BMW Série 3 320d Luxury",
    brand: "BMW",
    model: "Série 3",
    year: 2020,
    mileage: 45000,
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"]
  },
  seller: {
    firstName: "Marie",
    lastName: "Martin",
    phone: "06 12 34 56 78",
    email: "marie.martin@email.com"
  },
  buyer: {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com"
  },
  delivery: {
    method: "delivery",
    address: {
      street: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "France"
    },
    trackingNumber: "TRK123456789"
  },
  inspection: {
    buyerApproved: false,
    buyerComments: "",
    issues: []
  },
  messages: [
    {
      id: 1,
      sender: "system",
      message: "Transaction créée avec succès",
      timestamp: "2024-01-15T10:30:00Z",
      type: "system"
    },
    {
      id: 2,
      sender: "system",
      message: "Paiement confirmé. Le véhicule peut maintenant être livré.",
      timestamp: "2024-01-15T10:35:00Z",
      type: "system"
    },
    {
      id: 3,
      sender: "seller",
      message: "Véhicule en cours de préparation pour la livraison",
      timestamp: "2024-01-15T16:20:00Z",
      type: "seller"
    },
    {
      id: 4,
      sender: "system",
      message: "Véhicule livré. Période d'inspection de 7 jours commencée.",
      timestamp: "2024-01-16T14:00:00Z",
      type: "system"
    }
  ]
};

const statusConfig = {
  pending_payment: {
    label: "En attente de paiement",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    description: "En attente de votre paiement sécurisé"
  },
  payment_received: {
    label: "Paiement reçu",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle2,
    description: "Paiement confirmé, préparation de la livraison"
  },
  car_delivered: {
    label: "Véhicule livré",
    color: "bg-green-100 text-green-800",
    icon: Truck,
    description: "Véhicule livré, période d'inspection en cours"
  },
  inspection_period: {
    label: "Période d'inspection",
    color: "bg-orange-100 text-orange-800",
    icon: Eye,
    description: "Vous avez 7 jours pour inspecter le véhicule"
  },
  inspection_approved: {
    label: "Inspection approuvée",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
    description: "Inspection approuvée, paiement versé au vendeur"
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
    description: "Paiement versé au vendeur avec succès"
  },
  transaction_completed: {
    label: "Transaction terminée",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
    description: "Transaction complètement finalisée"
  }
};

export default function TransactionTracking() {
  const { transactionId } = useParams();
  const { toast } = useToast();
  
  const [transaction, setTransaction] = useState(mockTransaction);
  const [isLoading, setIsLoading] = useState(false);
  const [inspectionComments, setInspectionComments] = useState("");
  const [newMessage, setNewMessage] = useState("");

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleApproveInspection = async () => {
    setIsLoading(true);
    
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransaction(prev => ({
        ...prev,
        status: "inspection_approved",
        inspection: {
          ...prev.inspection,
          buyerApproved: true,
          buyerComments: inspectionComments
        }
      }));
      
      toast({
        title: "Inspection approuvée",
        description: "Le paiement sera versé au vendeur sous 24h.",
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisputeInspection = async () => {
    setIsLoading(true);
    
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransaction(prev => ({
        ...prev,
        status: "inspection_disputed"
      }));
      
      toast({
        title: "Problèmes signalés",
        description: "Notre équipe va examiner la situation.",
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du signalement.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const message = {
        id: transaction.messages.length + 1,
        sender: "buyer",
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: "buyer"
      };
      
      setTransaction(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));
      
      setNewMessage("");
      
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé au vendeur.",
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatus = statusConfig[transaction.status as keyof typeof statusConfig];
  const StatusIcon = currentStatus.icon;
  const daysRemaining = getDaysRemaining(transaction.inspectionDeadline);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Suivi de transaction</h1>
          <p className="text-muted-foreground">
            Transaction #{transaction.id} • {transaction.car.title}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <StatusIcon className="h-5 w-5" />
                  <span>Statut de la transaction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={currentStatus.color}>
                    {currentStatus.label}
                  </Badge>
                  {transaction.status === 'car_delivered' && (
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                
                <p className="text-muted-foreground">{currentStatus.description}</p>
                
                {transaction.status === 'car_delivered' && (
                  <Alert>
                    <Eye className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Période d'inspection :</strong> Vous avez 7 jours pour inspecter le véhicule 
                      et confirmer qu'il correspond à la description. Passé ce délai, le paiement sera 
                      automatiquement versé au vendeur.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Car Details */}
            <Card>
              <CardHeader>
                <CardTitle>Détails du véhicule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <img 
                    src={transaction.car.images[0]} 
                    alt={transaction.car.title}
                    className="w-24 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{transaction.car.title}</h3>
                    <p className="text-muted-foreground">
                      {transaction.car.year} • {transaction.car.mileage.toLocaleString()} km
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(transaction.carPrice)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inspection Actions */}
            {(transaction.status === 'car_delivered' || transaction.status === 'inspection_period') && (
              <Card>
                <CardHeader>
                  <CardTitle>Inspection du véhicule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="inspection-comments">Commentaires sur l'inspection (optionnel)</Label>
                    <Textarea
                      id="inspection-comments"
                      value={inspectionComments}
                      onChange={(e) => setInspectionComments(e.target.value)}
                      placeholder="Décrivez l'état du véhicule, les points positifs, etc."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button 
                      onClick={handleApproveInspection}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approuver l'inspection
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      onClick={handleDisputeInspection}
                      disabled={isLoading}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Signaler des problèmes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {transaction.messages.map((message) => (
                    <div key={message.id} className="flex space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        message.type === 'system' ? 'bg-blue-100 text-blue-800' :
                        message.type === 'buyer' ? 'bg-green-100 text-green-800' :
                        message.type === 'seller' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {message.type === 'system' ? 'S' :
                         message.type === 'buyer' ? 'A' :
                         message.type === 'seller' ? 'V' : '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium">
                            {message.type === 'system' ? 'Système' :
                             message.type === 'buyer' ? 'Vous' :
                             message.type === 'seller' ? 'Vendeur' : 'Inconnu'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                  >
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transaction Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé financier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Prix du véhicule</span>
                  <span className="font-semibold">{formatPrice(transaction.carPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Commission OccazCar</span>
                  <span>{formatPrice(transaction.commission)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Versé au vendeur</span>
                  <span>{formatPrice(transaction.sellerAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total payé</span>
                  <span className="text-primary">{formatPrice(transaction.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Seller Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact vendeur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">
                    {transaction.seller.firstName} {transaction.seller.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{transaction.seller.email}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Appeler
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            {transaction.delivery && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Livraison</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm">
                        {transaction.delivery.method === 'pickup' && 'Récupération chez le vendeur'}
                        {transaction.delivery.method === 'delivery' && (
                          <>
                            {transaction.delivery.address.street}<br />
                            {transaction.delivery.address.postalCode} {transaction.delivery.address.city}
                          </>
                        )}
                        {transaction.delivery.method === 'meeting_point' && 'Point de rencontre'}
                      </p>
                    </div>
                  </div>
                  
                  {transaction.delivery.trackingNumber && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Suivi: </span>
                      <span className="font-mono">{transaction.delivery.trackingNumber}</span>
                    </div>
                  )}
                  
                  {transaction.deliveryDate && (
                    <div className="text-sm text-muted-foreground">
                      Livré le {formatDate(transaction.deliveryDate)}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Contrat de vente
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Bon de livraison
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Facture
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

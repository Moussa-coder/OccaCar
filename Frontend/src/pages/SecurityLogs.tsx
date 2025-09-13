import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Search,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Activity,
  Download,
  Filter,
  Lock,
  Unlock,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour les logs de sécurité
const mockSecurityLogs = [
  {
    id: "1",
    type: "login_success",
    user: "admin@occazcar.com",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T14:30:00Z",
    details: "Connexion réussie",
    severity: "info"
  },
  {
    id: "2",
    type: "login_failed",
    user: "user@email.com",
    ip: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T14:25:00Z",
    details: "Tentative de connexion avec mot de passe incorrect",
    severity: "warning"
  },
  {
    id: "3",
    type: "user_suspended",
    user: "pierre.martin@email.com",
    ip: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T14:20:00Z",
    details: "Utilisateur suspendu par l'administrateur",
    severity: "warning"
  },
  {
    id: "4",
    type: "admin_action",
    user: "admin@occazcar.com",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T14:15:00Z",
    details: "Modification des paramètres système",
    severity: "info"
  },
  {
    id: "5",
    type: "suspicious_activity",
    user: "unknown@email.com",
    ip: "192.168.1.103",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T14:10:00Z",
    details: "Tentative d'accès non autorisé détectée",
    severity: "error"
  }
];

export default function SecurityLogs() {
  const [logs, setLogs] = useState(mockSecurityLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
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

    loadSecurityLogs();
  }, []);

  const loadSecurityLogs = async () => {
    setIsLoading(true);
    try {
      // API call pour charger les logs de sécurité
      // const response = await axios.get('/api/admin/security/logs/');
      // setLogs(response.data);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les logs de sécurité",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Erreur</Badge>;
      case 'warning':
        return <Badge variant="default" className="bg-orange-100 text-orange-800"><AlertTriangle className="h-3 w-3 mr-1" />Attention</Badge>;
      case 'info':
        return <Badge variant="secondary"><CheckCircle2 className="h-3 w-3 mr-1" />Info</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login_success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'login_failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'user_suspended':
        return <Lock className="h-4 w-4 text-orange-600" />;
      case 'admin_action':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'login_success':
        return 'Connexion réussie';
      case 'login_failed':
        return 'Échec de connexion';
      case 'user_suspended':
        return 'Utilisateur suspendu';
      case 'admin_action':
        return 'Action administrateur';
      case 'suspicious_activity':
        return 'Activité suspecte';
      default:
        return type;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    
    return matchesSearch && matchesSeverity && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const exportLogs = () => {
    toast({
      title: "Export en cours",
      description: "Les logs de sécurité sont en cours d'export...",
    });
    // Implémenter l'export des logs
  };

  const errorCount = logs.filter(log => log.severity === 'error').length;
  const warningCount = logs.filter(log => log.severity === 'warning').length;
  const infoCount = logs.filter(log => log.severity === 'info').length;

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
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Logs de Sécurité</h1>
              </div>
              <p className="text-muted-foreground">
                Surveillez l'activité et les événements de sécurité de la plateforme
              </p>
            </div>
            
            <Button variant="outline" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{errorCount}</div>
                  <div className="text-sm text-muted-foreground">Erreurs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{warningCount}</div>
                  <div className="text-sm text-muted-foreground">Avertissements</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{infoCount}</div>
                  <div className="text-sm text-muted-foreground">Informations</div>
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
                <Input
                  placeholder="Rechercher dans les logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                  aria-label="Filtrer par sévérité"
                >
                  <option value="all">Toutes sévérités</option>
                  <option value="error">Erreurs</option>
                  <option value="warning">Avertissements</option>
                  <option value="info">Informations</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                  aria-label="Filtrer par type"
                >
                  <option value="all">Tous types</option>
                  <option value="login_success">Connexions réussies</option>
                  <option value="login_failed">Échecs de connexion</option>
                  <option value="user_suspended">Utilisateurs suspendus</option>
                  <option value="admin_action">Actions admin</option>
                  <option value="suspicious_activity">Activité suspecte</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Logs de Sécurité ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun log trouvé
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(log.type)}
                        <div>
                          <h3 className="font-medium">{getTypeLabel(log.type)}</h3>
                          <p className="text-sm text-muted-foreground">{log.details}</p>
                        </div>
                        {getSeverityBadge(log.severity)}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{log.user}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-3 w-3" />
                          <span>{log.ip}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
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
            <strong>Logs de Sécurité :</strong> Ces logs contiennent des informations sensibles sur l'activité de la plateforme. 
            Consultez-les régulièrement pour détecter toute activité suspecte.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

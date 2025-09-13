import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Search,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Filter,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data pour les utilisateurs
const mockUsers = [
  {
    id: "1",
    firstName: "Martin",
    lastName: "Dubois",
    email: "martin.dubois@email.com",
    phone: "06 12 34 56 78",
    role: "seller",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20",
    listingsCount: 3,
    totalViews: 127,
    isVerified: true,
    location: "Paris 75015"
  },
  {
    id: "2",
    firstName: "Sophie",
    lastName: "Laurent",
    email: "sophie.laurent@email.com",
    phone: "06 98 76 54 32",
    role: "buyer",
    status: "active",
    joinDate: "2024-01-10",
    lastLogin: "2024-01-19",
    listingsCount: 0,
    totalViews: 0,
    isVerified: false,
    location: "Lyon 69000"
  },
  {
    id: "3",
    firstName: "Pierre",
    lastName: "Martin",
    email: "pierre.martin@email.com",
    phone: "06 55 44 33 22",
    role: "seller",
    status: "suspended",
    joinDate: "2024-01-05",
    lastLogin: "2024-01-18",
    listingsCount: 1,
    totalViews: 45,
    isVerified: true,
    location: "Marseille 13000"
  },
  {
    id: "4",
    firstName: "Marie",
    lastName: "Bernard",
    email: "marie.bernard@email.com",
    phone: "06 11 22 33 44",
    role: "buyer",
    status: "active",
    joinDate: "2024-01-12",
    lastLogin: "2024-01-20",
    listingsCount: 0,
    totalViews: 0,
    isVerified: true,
    location: "Toulouse 31000"
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
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

    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // API call pour charger les utilisateurs
      // const response = await axios.get('/api/admin/users/');
      // setUsers(response.data);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger la liste des utilisateurs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    try {
      // await axios.patch(`/api/admin/users/${id}/`, { status: newStatus });
      
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...user, status: newStatus }
          : user
      ));
      
      toast({
        title: "Statut modifié",
        description: `Utilisateur ${newStatus === 'active' ? 'activé' : 'suspendu'}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  const handleChangeUserRole = async (id: string, newRole: string) => {
    try {
      // await axios.patch(`/api/admin/users/${id}/`, { role: newRole });
      
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...user, role: newRole }
          : user
      ));
      
      toast({
        title: "Rôle modifié",
        description: `Rôle changé vers ${newRole === 'seller' ? 'vendeur' : 'acheteur'}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" />Actif</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Suspendu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'seller':
        return <Badge variant="outline" className="border-blue-200 text-blue-800">Vendeur</Badge>;
      case 'buyer':
        return <Badge variant="outline" className="border-purple-200 text-purple-800">Acheteur</Badge>;
      case 'admin':
        return <Badge variant="default" className="bg-red-100 text-red-800"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;
  const verifiedUsers = users.filter(u => u.isVerified).length;

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
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          </div>
          <p className="text-muted-foreground">
            Gérez tous les utilisateurs de la plateforme OccazCar
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Total utilisateurs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeUsers}</div>
                  <div className="text-sm text-muted-foreground">Utilisateurs actifs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{suspendedUsers}</div>
                  <div className="text-sm text-muted-foreground">Suspendus</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{verifiedUsers}</div>
                  <div className="text-sm text-muted-foreground">Vérifiés</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="suspended">Suspendus</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les rôles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="buyer">Acheteurs</SelectItem>
                    <SelectItem value="seller">Vendeurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        {getStatusBadge(user.status)}
                        {getRoleBadge(user.role)}
                        {user.isVerified && (
                          <Badge variant="outline" className="border-green-200 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Vérifié
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Inscrit le {formatDate(user.joinDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{user.totalViews} vues totales</span>
                        </div>
                        <span>{user.listingsCount} annonces</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleToggleUserStatus(user.id, user.status)}
                          >
                            {user.status === 'active' ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Suspendre
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                          
                          {user.role !== 'admin' && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleChangeUserRole(user.id, 'seller')}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Rôle Vendeur
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleChangeUserRole(user.id, 'buyer')}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Rôle Acheteur
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Envoyer un email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
            <strong>Gestion des Utilisateurs :</strong> Vous pouvez suspendre, activer et modifier les rôles des utilisateurs. 
            Utilisez ces fonctionnalités avec précaution.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

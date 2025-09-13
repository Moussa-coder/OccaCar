import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Car,
  Star,
  MessageSquare,
  Settings,
  Shield,
  LogOut,
  Upload,
  Camera
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour le profil utilisateur
const mockUserData = {
  id: "1",
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean.dupont@email.com",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
  joinDate: "2023-01-15",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  bio: "Passionné d'automobile depuis plus de 10 ans. Je vends des véhicules de qualité avec transparence et honnêteté.",
  preferences: {
    notifications: true,
    emailUpdates: true,
    smsUpdates: false,
    language: "fr"
  },
  stats: {
    totalListings: 12,
    activeListings: 3,
    soldCars: 9,
    totalViews: 2847,
    rating: 4.8,
    reviews: 23
  },
  recentActivity: [
    {
      id: "1",
      type: "listing_created",
      title: "BMW Série 3 320d Luxury",
      date: "2024-01-20",
      status: "active"
    },
    {
      id: "2", 
      type: "listing_sold",
      title: "Audi A4 Avant 2.0 TDI",
      date: "2024-01-18",
      status: "sold"
    },
    {
      id: "3",
      type: "message_received",
      title: "Question sur Peugeot 308",
      date: "2024-01-17",
      status: "unread"
    }
  ]
};

export default function UserProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  });

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Charger les données utilisateur
    loadUserData();
  }, [navigate]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Simulation du chargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        location: userData.location,
        bio: userData.bio
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du profil",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format de fichier invalide",
        description: "Veuillez sélectionner une image (JPG, PNG, WebP)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        title: "Fichier trop volumineux",
        description: "L'image ne doit pas dépasser 2MB",
        variant: "destructive"
      });
      return;
    }

    setAvatarFile(file);
    
    // Créer une prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulation de la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour les données utilisateur
      setUserData(prev => ({
        ...prev,
        ...formData,
        // Mettre à jour l'avatar si une nouvelle image a été sélectionnée
        avatar: avatarPreview || prev.avatar
      }));
      
      // Réinitialiser les états
      setAvatarFile(null);
      setAvatarPreview(null);
      setIsEditing(false);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      bio: userData.bio
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'listing_created':
        return <Car className="h-4 w-4 text-green-500" />;
      case 'listing_sold':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'message_received':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'listing_created':
        return `Nouvelle annonce créée : ${activity.title}`;
      case 'listing_sold':
        return `Véhicule vendu : ${activity.title}`;
      case 'message_received':
        return `Nouveau message : ${activity.title}`;
      default:
        return activity.title;
    }
  };

  if (isLoading && !isEditing) {
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
            <h1 className="text-3xl font-bold">Mon profil</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Modifier le profil
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Vos informations de base et de contact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar et nom */}
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Avatar className="h-20 w-20">
                      <AvatarImage 
                        src={avatarPreview || userData.avatar} 
                        alt={`${userData.firstName} ${userData.lastName}`} 
                      />
                      <AvatarFallback>
                        {userData.firstName[0]}{userData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col items-center gap-1">
                          <label htmlFor="avatar-upload" className="cursor-pointer">
                            <Camera className="h-4 w-4 text-white" />
                          </label>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                          {avatarFile && (
                            <button
                              onClick={removeAvatar}
                              className="text-white hover:text-red-300 transition-colors"
                              title="Supprimer la photo"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold">
                      {userData.firstName} {userData.lastName}
                    </h3>
                    <p className="text-muted-foreground">
                      Membre depuis {formatDate(userData.joinDate)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{userData.stats.rating}</span>
                      <span className="text-sm text-muted-foreground">({userData.stats.reviews} avis)</span>
                    </div>
                    {isEditing && (
                      <div className="mt-2">
                        <label htmlFor="avatar-upload" className="text-sm text-primary cursor-pointer hover:underline flex items-center gap-1">
                          <Upload className="h-3 w-3" />
                          {avatarFile ? "Nouvelle photo sélectionnée" : "Modifier la photo de profil"}
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        {avatarFile && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                              Photo prête à sauvegarder
                            </span>
                            <button
                              onClick={removeAvatar}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Annuler
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Formats acceptés: JPG, PNG, WebP • Max 2MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Formulaire */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Localisation</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Parlez-nous de vous..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  Vos dernières actions sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{getActivityText(activity)}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
                      </div>
                      <Badge variant={activity.status === 'active' ? 'default' : activity.status === 'sold' ? 'secondary' : 'outline'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Annonces totales</span>
                  <span className="font-semibold">{userData.stats.totalListings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Annonces actives</span>
                  <span className="font-semibold text-green-600">{userData.stats.activeListings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Véhicules vendus</span>
                  <span className="font-semibold text-blue-600">{userData.stats.soldCars}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Vues totales</span>
                  <span className="font-semibold">{userData.stats.totalViews.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Note moyenne</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{userData.stats.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/mes-annonces">
                    <Car className="h-4 w-4 mr-2" />
                    Mes annonces
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/deposer">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Nouvelle annonce
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
                <Separator />
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

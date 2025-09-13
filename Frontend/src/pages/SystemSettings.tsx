import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Save,
  RefreshCw,
  Shield,
  Mail,
  Bell,
  Globe,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour les paramètres système
const mockSettings = {
  general: {
    siteName: "OccazCar",
    siteDescription: "Plateforme de vente de véhicules d'occasion",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "noreply@occazcar.com",
    emailFrom: "OccazCar <noreply@occazcar.com>",
    emailNotifications: true,
    welcomeEmailEnabled: true
  },
  notifications: {
    newListingNotification: true,
    newUserNotification: true,
    reportNotification: true,
    systemAlerts: true,
    emailDigest: true,
    digestFrequency: "daily"
  },
  moderation: {
    autoModeration: false,
    requireApproval: true,
    maxListingsPerUser: 5,
    reportThreshold: 3,
    autoSuspendThreshold: 5
  },
  payment: {
    commissionRate: 2.5,
    minimumCommission: 50,
    maximumCommission: 500,
    paymentMethods: ["bank_transfer", "paypal", "stripe"],
    currency: "EUR"
  },
  features: {
    chatEnabled: true,
    imageUploadEnabled: true,
    maxImagesPerListing: 10,
    maxImageSize: 5, // MB
    searchEnabled: true,
    filtersEnabled: true
  }
};

export default function SystemSettings() {
  const [settings, setSettings] = useState(mockSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier les droits admin
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      window.location.href = '/login';
      return;
    }

    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // API call pour charger les paramètres
      // const response = await axios.get('/api/admin/settings/');
      // setSettings(response.data);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les paramètres système",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // API call pour sauvegarder les paramètres
      // await axios.put('/api/admin/settings/', settings);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres système ont été mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings(mockSettings);
    setHasChanges(false);
    toast({
      title: "Paramètres réinitialisés",
      description: "Les paramètres ont été remis à leurs valeurs par défaut",
    });
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
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
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Configuration Système</h1>
              </div>
              <p className="text-muted-foreground">
                Gérez les paramètres et la configuration de la plateforme
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            
            <Button onClick={handleSave} disabled={!hasChanges || isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Paramètres Généraux</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Description du site</Label>
                  <Input
                    id="siteDescription"
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode maintenance</Label>
                    <p className="text-sm text-muted-foreground">
                      Désactive l'accès public au site
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Inscriptions autorisées</Label>
                    <p className="text-sm text-muted-foreground">
                      Permet aux nouveaux utilisateurs de s'inscrire
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.registrationEnabled}
                    onCheckedChange={(checked) => updateSetting('general', 'registrationEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vérification email requise</Label>
                    <p className="text-sm text-muted-foreground">
                      Les utilisateurs doivent vérifier leur email
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.emailVerificationRequired}
                    onCheckedChange={(checked) => updateSetting('general', 'emailVerificationRequired', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Configuration Email</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Serveur SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Port SMTP</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Utilisateur SMTP</Label>
                  <Input
                    id="smtpUser"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailFrom">Email expéditeur</Label>
                  <Input
                    id="emailFrom"
                    value={settings.email.emailFrom}
                    onChange={(e) => updateSetting('email', 'emailFrom', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications email</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer l'envoi d'emails automatiques
                    </p>
                  </div>
                  <Switch
                    checked={settings.email.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('email', 'emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email de bienvenue</Label>
                    <p className="text-sm text-muted-foreground">
                      Envoyer un email de bienvenue aux nouveaux utilisateurs
                    </p>
                  </div>
                  <Switch
                    checked={settings.email.welcomeEmailEnabled}
                    onCheckedChange={(checked) => updateSetting('email', 'welcomeEmailEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moderation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Paramètres de Modération</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxListingsPerUser">Max annonces par utilisateur</Label>
                  <Input
                    id="maxListingsPerUser"
                    type="number"
                    value={settings.moderation.maxListingsPerUser}
                    onChange={(e) => updateSetting('moderation', 'maxListingsPerUser', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reportThreshold">Seuil de signalement</Label>
                  <Input
                    id="reportThreshold"
                    type="number"
                    value={settings.moderation.reportThreshold}
                    onChange={(e) => updateSetting('moderation', 'reportThreshold', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modération automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Utiliser des filtres automatiques pour la modération
                    </p>
                  </div>
                  <Switch
                    checked={settings.moderation.autoModeration}
                    onCheckedChange={(checked) => updateSetting('moderation', 'autoModeration', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Approbation requise</Label>
                    <p className="text-sm text-muted-foreground">
                      Toutes les annonces doivent être approuvées manuellement
                    </p>
                  </div>
                  <Switch
                    checked={settings.moderation.requireApproval}
                    onCheckedChange={(checked) => updateSetting('moderation', 'requireApproval', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Paramètres de Paiement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Taux de commission (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    step="0.1"
                    value={settings.payment.commissionRate}
                    onChange={(e) => updateSetting('payment', 'commissionRate', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimumCommission">Commission minimum (€)</Label>
                  <Input
                    id="minimumCommission"
                    type="number"
                    value={settings.payment.minimumCommission}
                    onChange={(e) => updateSetting('payment', 'minimumCommission', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maximumCommission">Commission maximum (€)</Label>
                  <Input
                    id="maximumCommission"
                    type="number"
                    value={settings.payment.maximumCommission}
                    onChange={(e) => updateSetting('payment', 'maximumCommission', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Méthodes de paiement acceptées</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.payment.paymentMethods.map((method) => (
                    <Badge key={method} variant="outline">
                      {method.replace('_', ' ').toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Fonctionnalités</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxImagesPerListing">Max images par annonce</Label>
                  <Input
                    id="maxImagesPerListing"
                    type="number"
                    value={settings.features.maxImagesPerListing}
                    onChange={(e) => updateSetting('features', 'maxImagesPerListing', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxImageSize">Taille max image (MB)</Label>
                  <Input
                    id="maxImageSize"
                    type="number"
                    value={settings.features.maxImageSize}
                    onChange={(e) => updateSetting('features', 'maxImageSize', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chat activé</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre la communication entre utilisateurs
                    </p>
                  </div>
                  <Switch
                    checked={settings.features.chatEnabled}
                    onCheckedChange={(checked) => updateSetting('features', 'chatEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Upload d'images</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre l'upload d'images pour les annonces
                    </p>
                  </div>
                  <Switch
                    checked={settings.features.imageUploadEnabled}
                    onCheckedChange={(checked) => updateSetting('features', 'imageUploadEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recherche activée</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer la fonctionnalité de recherche
                    </p>
                  </div>
                  <Switch
                    checked={settings.features.searchEnabled}
                    onCheckedChange={(checked) => updateSetting('features', 'searchEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Status */}
        {hasChanges && (
          <Alert className="mt-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Vous avez des modifications non sauvegardées. N'oubliez pas de sauvegarder vos changements.
            </AlertDescription>
          </Alert>
        )}

        {/* Admin Notice */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Configuration Système :</strong> Les modifications de ces paramètres affectent le comportement global de la plateforme. 
            Assurez-vous de bien comprendre les implications avant de sauvegarder.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

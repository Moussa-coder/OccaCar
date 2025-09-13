import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/ui/logo";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [redirectMessage, setRedirectMessage] = useState<string>("");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer le message de redirection depuis l'état de navigation
  useEffect(() => {
    if (location.state?.message) {
      setRedirectMessage(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulation d'un appel API
      // const response = await axios.post('/auth/login/', {
      //   email: formData.email,
      //   password: formData.password,
      // });
      
      // Simulation d'une réponse réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stocker le JWT et le rôle dans localStorage
      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('token', 'mock-jwt-token');
      
      // Déterminer le rôle basé sur l'email (pour la démo)
      const isAdminEmail = formData.email.toLowerCase().includes('admin') || 
                          formData.email.toLowerCase().includes('administrateur');
      const userRole = isAdminEmail ? 'admin' : 'seller';
      localStorage.setItem('userRole', userRole);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur OccazCar !",
      });
      
      // Redirection vers la page appropriée
      const redirectTo = location.state?.redirectTo || '/';
      navigate(redirectTo);
      
      // Recharger la page pour mettre à jour l'état d'authentification
      window.location.reload();
      
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/">
            <Logo size="lg" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Connexion</h1>
            <p className="text-muted-foreground">
              Connectez-vous à votre compte pour gérer vos annonces
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Se connecter</CardTitle>
              <CardDescription>
                Entrez vos identifiants pour accéder à votre compte
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {redirectMessage && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{redirectMessage}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                    }
                  />
                  <Label 
                    htmlFor="rememberMe" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Se souvenir de moi
                  </Label>
                </div>
                
                <Link 
                  to="/mot-de-passe-oublie" 
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Se connecter
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Créer un compte
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        {/* Demo Notice */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground text-center">
              <strong>Mode démo :</strong> Utilisez n'importe quels identifiants pour tester la plateforme.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
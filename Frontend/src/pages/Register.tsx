import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, UserPlus, Check, User, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    acceptTerms: false,
    acceptNewsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!/^(\+33|0)[1-9](\d{8})$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Format de téléphone invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (!Object.values(passwordRequirements).every(Boolean)) {
      newErrors.password = "Le mot de passe ne respecte pas tous les critères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.role) {
      newErrors.role = "Veuillez sélectionner votre rôle";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'un appel API
      // const response = await axios.post('/auth/register/', {
      //   first_name: formData.firstName,
      //   last_name: formData.lastName,
      //   email: formData.email,
      //   phone: formData.phone,
      //   password: formData.password,
      //   role: formData.role,
      // });
      
      // Simulation d'une réponse réussie
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Stocker le rôle sélectionné (simulation)
      localStorage.setItem('userRole', formData.role);
      
      toast({
        title: "Compte créé avec succès",
        description: `Bienvenue ! Vous êtes maintenant inscrit en tant que ${formData.role === 'buyer' ? 'acheteur' : formData.role === 'seller' ? 'vendeur' : 'acheteur et vendeur'}.`,
      });
      
      // Redirection vers la page de connexion
      // navigate('/login');
      
    } catch (error: unknown) {
      console.error('Registration error:', error);
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'status' in error.response &&
          error.response.status === 409) {
        setErrors({ email: "Un compte existe déjà avec cette adresse email" });
      } else {
        toast({
          title: "Erreur lors de l'inscription",
          description: "Une erreur est survenue. Veuillez réessayer.",
          variant: "destructive",
        });
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
            <h1 className="text-2xl font-bold">Créer un compte</h1>
            <p className="text-muted-foreground">
              Rejoignez OccazCar pour vendre et acheter en toute sécurité
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Inscription</CardTitle>
              <CardDescription>
                Créez votre compte en quelques minutes
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              {/* Email */}
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
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>
              
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Je souhaite</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                  <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Acheter des véhicules</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="seller">
                      <div className="flex items-center space-x-2">
                        <Store className="h-4 w-4" />
                        <span>Vendre des véhicules</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="both">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <Store className="h-4 w-4" />
                        <span>Acheter et vendre des véhicules</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Vous pourrez modifier ce choix plus tard dans vos paramètres
                </p>
              </div>
              
              {/* Password */}
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
                    className={errors.password ? "border-destructive" : ""}
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
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Le mot de passe doit contenir :</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className={cn(
                        "flex items-center space-x-1",
                        passwordRequirements.length ? "text-success" : "text-muted-foreground"
                      )}>
                        <Check className="h-3 w-3" />
                        <span>8 caractères min</span>
                      </div>
                      <div className={cn(
                        "flex items-center space-x-1",
                        passwordRequirements.uppercase ? "text-success" : "text-muted-foreground"
                      )}>
                        <Check className="h-3 w-3" />
                        <span>1 majuscule</span>
                      </div>
                      <div className={cn(
                        "flex items-center space-x-1",
                        passwordRequirements.lowercase ? "text-success" : "text-muted-foreground"
                      )}>
                        <Check className="h-3 w-3" />
                        <span>1 minuscule</span>
                      </div>
                      <div className={cn(
                        "flex items-center space-x-1",
                        passwordRequirements.number ? "text-success" : "text-muted-foreground"
                      )}>
                        <Check className="h-3 w-3" />
                        <span>1 chiffre</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
              
              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
              
              {/* Terms & Newsletter */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                    }
                    className={errors.acceptTerms ? "border-destructive" : ""}
                  />
                  <Label 
                    htmlFor="acceptTerms" 
                    className="text-sm font-normal cursor-pointer leading-relaxed"
                  >
                    J'accepte les{" "}
                    <Link to="/conditions" className="text-primary hover:underline">
                      conditions d'utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link to="/confidentialite" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-destructive ml-6">{errors.acceptTerms}</p>
                )}
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptNewsletter"
                    name="acceptNewsletter"
                    checked={formData.acceptNewsletter}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, acceptNewsletter: checked as boolean }))
                    }
                  />
                  <Label 
                    htmlFor="acceptNewsletter" 
                    className="text-sm font-normal cursor-pointer leading-relaxed"
                  >
                    Je souhaite recevoir les dernières offres et actualités par email
                  </Label>
                </div>
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
                    Création du compte...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Créer mon compte
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Déjà un compte ?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
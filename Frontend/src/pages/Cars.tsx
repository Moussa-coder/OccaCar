import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CarCard } from "@/components/ui/car-card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Car as CarIcon, 
  Grid3X3, 
  List,
  SortAsc,
  SortDesc,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Eye,
  Heart,
  Star,
  ArrowLeft
} from "lucide-react";

// Mock data - sera remplacé par des appels API
const mockCars = [
  {
    id: "1",
    title: "BMW Série 3 320d Luxury",
    price: 25900,
    year: 2019,
    mileage: 85000,
    fuel: "Diesel",
    location: "Paris 75",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500",
    isAvailable: true,
    brand: "BMW",
    model: "Série 3",
    power: "190 ch",
    transmission: "Automatique",
    color: "Noir métallisé",
    views: 127,
    likes: 23,
    rating: 4.8,
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    title: "Audi A4 Avant 2.0 TDI S-Line",
    price: 32500,
    year: 2020,
    mileage: 65000,
    fuel: "Diesel", 
    location: "Lyon 69",
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500",
    isAvailable: true,
    brand: "Audi",
    model: "A4 Avant",
    power: "190 ch",
    transmission: "Manuelle",
    color: "Blanc",
    views: 89,
    likes: 15,
    rating: 4.6,
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    title: "Mercedes Classe C 220d AMG Line",
    price: 28750,
    year: 2018,
    mileage: 92000,
    fuel: "Diesel",
    location: "Marseille 13", 
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500",
    isAvailable: false,
    brand: "Mercedes-Benz",
    model: "Classe C",
    power: "194 ch",
    transmission: "Automatique",
    color: "Gris métallisé",
    views: 156,
    likes: 31,
    rating: 4.9,
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    title: "Volkswagen Golf GTI 7.5",
    price: 24900,
    year: 2019,
    mileage: 78000,
    fuel: "Essence",
    location: "Toulouse 31",
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500",
    isAvailable: true,
    brand: "Volkswagen",
    model: "Golf GTI",
    power: "245 ch",
    transmission: "Manuelle",
    color: "Rouge",
    views: 203,
    likes: 42,
    rating: 4.7,
    createdAt: "2024-01-12"
  },
  {
    id: "5",
    title: "Peugeot 308 GT BlueHDi",
    price: 19200,
    year: 2018,
    mileage: 95000,
    fuel: "Diesel",
    location: "Nantes 44",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
    isAvailable: true,
    brand: "Peugeot",
    model: "308 GT",
    power: "130 ch",
    transmission: "Manuelle",
    color: "Bleu",
    views: 78,
    likes: 12,
    rating: 4.4,
    createdAt: "2024-01-11"
  },
  {
    id: "6",
    title: "Renault Clio RS Trophy",
    price: 21500,
    year: 2019,
    mileage: 68000,
    fuel: "Essence",
    location: "Nice 06",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500",
    isAvailable: true,
    brand: "Renault",
    model: "Clio RS",
    power: "220 ch",
    transmission: "Manuelle",
    color: "Jaune",
    views: 134,
    likes: 28,
    rating: 4.5,
    createdAt: "2024-01-10"
  },
  {
    id: "7",
    title: "Toyota Prius Hybride",
    price: 18500,
    year: 2017,
    mileage: 120000,
    fuel: "Hybride",
    location: "Bordeaux 33",
    imageUrl: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=500",
    isAvailable: true,
    brand: "Toyota",
    model: "Prius",
    power: "122 ch",
    transmission: "Automatique",
    color: "Blanc",
    views: 95,
    likes: 18,
    rating: 4.3,
    createdAt: "2024-01-09"
  },
  {
    id: "8",
    title: "Tesla Model 3 Standard",
    price: 45000,
    year: 2021,
    mileage: 25000,
    fuel: "Électrique",
    location: "Lille 59",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500",
    isAvailable: true,
    brand: "Tesla",
    model: "Model 3",
    power: "283 ch",
    transmission: "Automatique",
    color: "Noir",
    views: 312,
    likes: 67,
    rating: 4.9,
    createdAt: "2024-01-08"
  }
];

const sortOptions = [
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "year-desc", label: "Plus récent" },
  { value: "year-asc", label: "Plus ancien" },
  { value: "mileage-asc", label: "Kilométrage croissant" },
  { value: "mileage-desc", label: "Kilométrage décroissant" },
  { value: "views-desc", label: "Plus vues" },
  { value: "rating-desc", label: "Mieux noté" }
];

export default function Cars() {
  const [cars, setCars] = useState(mockCars);
  const [filteredCars, setFilteredCars] = useState(mockCars);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedFuel, setSelectedFuel] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [yearRange, setYearRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("views-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get unique brands for filter
  const brands = Array.from(new Set(mockCars.map(car => car.brand))).sort();

  // Filter and sort logic
  useEffect(() => {
    const filtered = cars.filter(car => {
      const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === "all" || car.brand === selectedBrand;
      const matchesFuel = selectedFuel === "all" || car.fuel === selectedFuel;
      
      // Price range filter
      let matchesPrice = true;
      if (priceRange && priceRange !== "all") {
        const [min, max] = priceRange.split('-').map(Number);
        matchesPrice = car.price >= min && (max ? car.price <= max : true);
      }
      
      // Year range filter
      let matchesYear = true;
      if (yearRange && yearRange !== "all") {
        const [minYear, maxYear] = yearRange.split('-').map(Number);
        matchesYear = car.year >= minYear && (maxYear ? car.year <= maxYear : true);
      }
      
      return matchesSearch && matchesBrand && matchesFuel && matchesPrice && matchesYear;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "year-desc":
          return b.year - a.year;
        case "year-asc":
          return a.year - b.year;
        case "mileage-asc":
          return a.mileage - b.mileage;
        case "mileage-desc":
          return b.mileage - a.mileage;
        case "views-desc":
          return b.views - a.views;
        case "rating-desc":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    
    setFilteredCars(filtered);
  }, [cars, searchTerm, selectedBrand, selectedFuel, priceRange, yearRange, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('fr-FR').format(mileage);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBrand("all");
    setSelectedFuel("all");
    setPriceRange("all");
    setYearRange("all");
    setSortBy("views-desc");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>

      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Nos <span className="gradient-text">Véhicules</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection de véhicules d'occasion vérifiés et garantis
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Filtres</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {showFilters ? "Masquer" : "Afficher"}
              </Button>
            </div>
            
            <Card className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <CardContent className="p-6 space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Marque, modèle..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Marque</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les marques</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Fuel */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Carburant</label>
                  <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les carburants" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les carburants</SelectItem>
                      <SelectItem value="Essence">Essence</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybride">Hybride</SelectItem>
                      <SelectItem value="Électrique">Électrique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Price */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Prix</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les prix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les prix</SelectItem>
                      <SelectItem value="0-15000">Moins de 15 000€</SelectItem>
                      <SelectItem value="15000-25000">15 000€ - 25 000€</SelectItem>
                      <SelectItem value="25000-35000">25 000€ - 35 000€</SelectItem>
                      <SelectItem value="35000-50000">35 000€ - 50 000€</SelectItem>
                      <SelectItem value="50000">Plus de 50 000€</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Year */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Année</label>
                  <Select value={yearRange} onValueChange={setYearRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les années" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les années</SelectItem>
                      <SelectItem value="2020-2024">2020 et plus</SelectItem>
                      <SelectItem value="2015-2019">2015 - 2019</SelectItem>
                      <SelectItem value="2010-2014">2010 - 2014</SelectItem>
                      <SelectItem value="2005-2009">2005 - 2009</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={resetFilters}
                >
                  Réinitialiser
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header with controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">
                  {filteredCars.length} véhicule{filteredCars.length > 1 ? 's' : ''} trouvé{filteredCars.length > 1 ? 's' : ''}
                </h2>
                <Badge variant="secondary">
                  {filteredCars.filter(car => car.isAvailable).length} disponible{filteredCars.filter(car => car.isAvailable).length > 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Cars Display */}
            {filteredCars.length > 0 ? (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredCars.map((car, index) => (
                  <div key={car.id}>
                    {viewMode === "grid" ? (
                      <CarCard {...car} />
                    ) : (
                    <Card key={car.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="w-full md:w-64 h-48 md:h-auto relative">
                            <img
                              src={car.imageUrl}
                              alt={car.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge variant={car.isAvailable ? "default" : "secondary"}>
                                {car.isAvailable ? "Disponible" : "Vendue"}
                              </Badge>
                            </div>
                            <div className="absolute top-3 right-3 flex space-x-2">
                              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">{car.title}</h3>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{car.year}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Gauge className="h-4 w-4" />
                                    <span>{formatMileage(car.mileage)} km</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Fuel className="h-4 w-4" />
                                    <span>{car.fuel}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{car.location}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{car.views} vues</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{car.rating}/5</span>
                                  </div>
                                  <span>Publié le {new Date(car.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary mb-2">
                                  {formatPrice(car.price)}
                                </div>
                                <Button asChild>
                                  <Link to={`/voiture/${car.id}`}>
                                    Voir les détails
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <CarIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold">Aucun véhicule trouvé</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Essayez de modifier vos critères de recherche ou consultez tous nos véhicules disponibles.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={resetFilters}
                  >
                    Voir tous les véhicules
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

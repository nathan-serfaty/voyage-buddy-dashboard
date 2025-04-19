
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import ActivityCard from "@/components/ActivityCard";
import { activities } from "@/data/activities";
import { Activity } from "@/types/activity";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

const Activities = () => {
  const { preferences } = useUserPreferences();
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(150);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Initial setup - pre-select the types from preferences
  useEffect(() => {
    if (preferences.activityTypes.length > 0) {
      setSelectedTypes(preferences.activityTypes);
    }
  }, [preferences.activityTypes]);

  // Filter activities based on search, price and types
  useEffect(() => {
    let result = activities;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        activity => 
          activity.title.toLowerCase().includes(query) || 
          activity.description.toLowerCase().includes(query) ||
          activity.location.toLowerCase().includes(query)
      );
    }
    
    // Price filter
    result = result.filter(activity => activity.price <= maxPrice);
    
    // Type filter
    if (selectedTypes.length > 0) {
      result = result.filter(
        activity => activity.type.some(type => selectedTypes.includes(type))
      );
    }
    
    setFilteredActivities(result);
  }, [searchQuery, maxPrice, selectedTypes]);

  // Toggle activity type selection
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setMaxPrice(150);
    setSelectedTypes([]);
  };

  // Get type label in French
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "cultural": return "Culturel";
      case "adventure": return "Aventure";
      case "relaxation": return "Relaxation";
      case "gastronomy": return "Gastronomie";
      case "nature": return "Nature";
      default: return type;
    }
  };

  // Activity types for filtering
  const activityTypes = [
    { id: "cultural", label: "Culturel" },
    { id: "adventure", label: "Aventure" },
    { id: "relaxation", label: "Relaxation" },
    { id: "gastronomy", label: "Gastronomie" },
    { id: "nature", label: "Nature" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Découvrez nos excursions</h1>
        <p className="text-lg text-gray-600">
          Explorez notre sélection d'activités et d'excursions au Maroc
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher des activités..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto w-full flex items-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          {(searchQuery || maxPrice < 150 || selectedTypes.length > 0) && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="sm:w-auto w-full flex items-center"
            >
              <X className="mr-2 h-4 w-4" />
              Effacer les filtres
            </Button>
          )}
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price filter */}
              <div>
                <Label className="mb-2 block">Prix maximum: {maxPrice}€</Label>
                <Slider
                  defaultValue={[maxPrice]}
                  max={150}
                  step={5}
                  onValueChange={(value) => setMaxPrice(value[0])}
                />
              </div>
              
              {/* Activity types filter */}
              <div className="col-span-1 md:col-span-2">
                <Label className="mb-2 block">Types d'activités</Label>
                <div className="flex flex-wrap gap-2">
                  {activityTypes.map((type) => (
                    <Badge
                      key={type.id}
                      variant={selectedTypes.includes(type.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleType(type.id)}
                    >
                      {type.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Active filters display */}
        {(selectedTypes.length > 0 || maxPrice < 150) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTypes.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {getTypeLabel(type)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleType(type)} 
                />
              </Badge>
            ))}
            {maxPrice < 150 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Prix max: {maxPrice}€
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setMaxPrice(150)} 
                />
              </Badge>
            )}
          </div>
        )}
      </div>
      
      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        {filteredActivities.length} {filteredActivities.length > 1 ? 'activités trouvées' : 'activité trouvée'}
      </p>
      
      {/* Activities grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Aucune activité ne correspond à vos critères</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={clearFilters}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default Activities;

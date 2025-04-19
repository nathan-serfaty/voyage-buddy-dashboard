
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, Clock, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { Activity } from "@/types/activity";
import { cn } from "@/lib/utils";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { preferences, updatePreferences } = useUserPreferences();

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

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "cultural": return "bg-blue-100 text-blue-800";
      case "adventure": return "bg-green-100 text-green-800";
      case "relaxation": return "bg-purple-100 text-purple-800";
      case "gastronomy": return "bg-yellow-100 text-yellow-800";
      case "nature": return "bg-emerald-100 text-emerald-800";
      default: return "";
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    const currentSelections = [...preferences.selectedActivities];
    
    if (!isFavorite) {
      if (!currentSelections.includes(activity.id)) {
        updatePreferences({ 
          selectedActivities: [...currentSelections, activity.id] 
        });
      }
    } else {
      updatePreferences({ 
        selectedActivities: currentSelections.filter(id => id !== activity.id) 
      });
    }
  };

  const getPlaceholderImage = () => {
    const placeholders = [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
    ];
    
    const index = parseInt(activity.id.replace(/[^0-9]/g, ''), 10) % placeholders.length;
    return placeholders[index];
  };

  return (
    <Card className="overflow-hidden destination-card h-full flex flex-col">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {imageError ? (
            <img
              src={getPlaceholderImage()}
              alt={activity.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <img
              src={activity.image || getPlaceholderImage()}
              alt={activity.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}
        </AspectRatio>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90",
            isFavorite ? "text-red-500" : "text-gray-500"
          )}
          onClick={toggleFavorite}
        >
          <Heart className={cn("h-5 w-5", isFavorite ? "fill-current" : "")} />
        </Button>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">{activity.title}</CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{activity.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{activity.location}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {activity.type.map((type) => (
            <Badge key={type} variant="outline" className={cn("text-xs", getTypeBadgeColor(type))}>
              {getTypeLabel(type)}
            </Badge>
          ))}
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {activity.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <Clock className="h-4 w-4 mr-1" />
          <span>{activity.duration}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Users className="h-4 w-4 mr-1" />
          <span>{activity.groupSize.min}-{activity.groupSize.max} personnes</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-lg font-bold text-primary">{activity.price}€</div>
        <Button 
          variant={isFavorite ? "secondary" : "default"} 
          size="sm"
          onClick={toggleFavorite}
        >
          {isFavorite ? "Retiré" : "Ajouter"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;

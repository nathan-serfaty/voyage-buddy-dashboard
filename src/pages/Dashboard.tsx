
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, MapPin, Users, Clock, CalendarDays, Wallet, User2, Mail } from "lucide-react";
import { activities, Activity } from "@/data/activities";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

const Dashboard = () => {
  const { preferences, chatCompleted } = useUserPreferences();
  const navigate = useNavigate();
  
  // Redirect if chat not completed
  useEffect(() => {
    if (!chatCompleted) {
      navigate("/");
    }
  }, [chatCompleted, navigate]);

  // Get selected activities details
  const selectedActivitiesDetails: Activity[] = activities.filter(
    activity => preferences.selectedActivities.includes(activity.id)
  );

  // Get recommended activities based on user preferences
  const recommendedActivities = activities.filter(activity => 
    // Match activity types with user preferences
    activity.type.some(type => preferences.activityTypes.includes(type as any)) &&
    // Exclude already selected activities
    !preferences.selectedActivities.includes(activity.id) &&
    // Match group size requirements
    activity.groupSize.min <= preferences.groupSize &&
    activity.groupSize.max >= preferences.groupSize
  ).slice(0, 3);

  // Get formatted travel dates
  const getFormattedDateRange = () => {
    if (preferences.dateRange.from && preferences.dateRange.to) {
      return `Du ${format(preferences.dateRange.from, 'dd MMMM yyyy', { locale: fr })} au ${format(preferences.dateRange.to, 'dd MMMM yyyy', { locale: fr })}`;
    }
    return "Dates non définies";
  };

  // Translate activity type to French
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Votre tableau de bord de voyage</h1>
        <p className="text-lg text-gray-600">
          Consultez vos préférences et vos activités sélectionnées
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Welcome card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Bienvenue, {preferences.name} !</CardTitle>
              <CardDescription>
                Voici un récapitulatif de votre voyage au Maroc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span className="font-medium">{getFormattedDateRange()}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {preferences.groupSize} {preferences.groupSize > 1 ? 'personnes' : 'personne'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span className="font-medium">Budget: {preferences.budget}</span>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <p className="font-medium mb-2">Types d'activités préférés:</p>
                  <div className="flex flex-wrap gap-2">
                    {preferences.activityTypes.map((type) => (
                      <Badge key={type} variant="secondary">
                        {getTypeLabel(type)}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {preferences.specialRequirements && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Exigences particulières:</p>
                    <p className="text-gray-600 text-sm">{preferences.specialRequirements}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Selected activities preview */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Vos activités sélectionnées</h2>
              <Button size="sm" variant="outline" onClick={() => navigate("/activities")}>
                Voir toutes les activités
              </Button>
            </div>
            
            {selectedActivitiesDetails.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedActivitiesDetails.map((activity) => (
                  <Card key={activity.id}>
                    <div className="h-40 w-full overflow-hidden">
                      <img 
                        src={activity.image} 
                        alt={activity.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{activity.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="mt-2 font-bold">{activity.price}€</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500 mb-3">Vous n'avez pas encore sélectionné d'activités</p>
                <Button onClick={() => navigate("/activities")}>
                  Explorer les activités
                </Button>
              </Card>
            )}
          </div>
          
          {/* Recommended activities */}
          {recommendedActivities.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Recommandations pour vous</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedActivities.map((activity) => (
                  <Card key={activity.id}>
                    <div className="h-40 w-full overflow-hidden">
                      <img 
                        src={activity.image} 
                        alt={activity.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{activity.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="mt-2 font-bold">{activity.price}€</div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={() => navigate("/activities")}
                      >
                        Voir les détails
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vos activités sélectionnées</CardTitle>
              <CardDescription>
                Liste complète des excursions que vous avez ajoutées à votre voyage
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedActivitiesDetails.length > 0 ? (
                <div className="space-y-4">
                  {selectedActivitiesDetails.map((activity) => (
                    <div key={activity.id} className="flex gap-4 border-b pb-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img 
                          src={activity.image} 
                          alt={activity.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{activity.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{activity.duration}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {activity.type.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {getTypeLabel(type)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{activity.price}€</div>
                        <div className="text-sm text-gray-500">par personne</div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total pour votre groupe de {preferences.groupSize}</p>
                      <p className="text-xl font-bold text-primary">
                        {selectedActivitiesDetails.reduce((total, activity) => total + activity.price, 0) * preferences.groupSize}€
                      </p>
                    </div>
                    <Button onClick={() => navigate("/activities")}>
                      Ajouter d'autres activités
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-3">Vous n'avez pas encore sélectionné d'activités</p>
                  <Button onClick={() => navigate("/activities")}>
                    Explorer les activités
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {recommendedActivities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Activités recommandées</CardTitle>
                <CardDescription>
                  Basées sur vos préférences et vos dates de voyage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 border-b pb-4 last:border-0">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img 
                          src={activity.image} 
                          alt={activity.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{activity.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {activity.type.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {getTypeLabel(type)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{activity.price}€</div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => navigate("/activities")}
                        >
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Vos coordonnées et informations de voyage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex gap-4 py-2">
                  <dt className="flex items-center gap-2 font-medium text-gray-500 w-40">
                    <User2 className="h-4 w-4" />
                    Nom
                  </dt>
                  <dd>{preferences.name}</dd>
                </div>
                <div className="flex gap-4 py-2 border-t">
                  <dt className="flex items-center gap-2 font-medium text-gray-500 w-40">
                    <Mail className="h-4 w-4" />
                    Email
                  </dt>
                  <dd>{preferences.email}</dd>
                </div>
                <div className="flex gap-4 py-2 border-t">
                  <dt className="flex items-center gap-2 font-medium text-gray-500 w-40">
                    <Calendar className="h-4 w-4" />
                    Dates de voyage
                  </dt>
                  <dd>{getFormattedDateRange()}</dd>
                </div>
                <div className="flex gap-4 py-2 border-t">
                  <dt className="flex items-center gap-2 font-medium text-gray-500 w-40">
                    <Users className="h-4 w-4" />
                    Taille du groupe
                  </dt>
                  <dd>{preferences.groupSize} {preferences.groupSize > 1 ? 'personnes' : 'personne'}</dd>
                </div>
                <div className="flex gap-4 py-2 border-t">
                  <dt className="flex items-center gap-2 font-medium text-gray-500 w-40">
                    <Wallet className="h-4 w-4" />
                    Budget
                  </dt>
                  <dd>{preferences.budget}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Préférences d'activités</CardTitle>
              <CardDescription>
                Types d'activités que vous préférez
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {preferences.activityTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {getTypeLabel(type)}
                    </Badge>
                  ))}
                </div>
                
                {preferences.specialRequirements && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Exigences particulières:</h3>
                    <p className="text-gray-600">{preferences.specialRequirements}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

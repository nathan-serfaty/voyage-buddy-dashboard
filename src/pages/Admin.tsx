
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCircle, Calendar, Users, Clock } from "lucide-react";
import AdminGroupCreation from "@/components/AdminGroupCreation";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { activities } from "@/data/activities";

const Admin = () => {
  const { preferences } = useUserPreferences();
  
  // Get selected activities details
  const selectedActivitiesDetails = activities.filter(
    activity => preferences.selectedActivities.includes(activity.id)
  );
  
  // Format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Non définie";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interface d'administration</h1>
        <p className="text-lg text-gray-600">
          Gérez les groupes et consultez les préférences des utilisateurs
        </p>
      </div>
      
      <Tabs defaultValue="profiles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profiles">Profils utilisateurs</TabsTrigger>
          <TabsTrigger value="groups">Création de groupes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profiles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil utilisateur</CardTitle>
              <CardDescription>
                Informations détaillées sur les préférences du client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{preferences.name}</h3>
                  <p className="text-gray-500">{preferences.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Dates de voyage
                  </h4>
                  <p>Du {formatDate(preferences.dateRange.from)}</p>
                  <p>au {formatDate(preferences.dateRange.to)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    Informations groupe
                  </h4>
                  <p>{preferences.groupSize} {preferences.groupSize > 1 ? 'personnes' : 'personne'}</p>
                  <p>Budget: {preferences.budget}</p>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Types d'activités
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {preferences.activityTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        {getTypeLabel(type)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {preferences.specialRequirements && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Exigences particulières</h4>
                    <p className="text-gray-600">{preferences.specialRequirements}</p>
                  </div>
                </>
              )}
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-3">Activités sélectionnées</h4>
                <ScrollArea className="h-64 rounded-md border">
                  <div className="p-4 space-y-4">
                    {selectedActivitiesDetails.length > 0 ? (
                      selectedActivitiesDetails.map((activity) => (
                        <div key={activity.id} className="flex gap-3 pb-3 border-b last:border-b-0">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                            <img 
                              src={activity.image} 
                              alt={activity.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h5 className="font-medium">{activity.title}</h5>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{activity.duration}</span>
                              <span className="mx-2">•</span>
                              <span>{activity.price}€</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-gray-500">
                        Aucune activité sélectionnée
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups">
          <AdminGroupCreation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

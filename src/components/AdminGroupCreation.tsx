
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { activities } from "@/data/activities";

type Group = {
  id: string;
  name: string;
  guide: string;
  activity: string;
  date: Date;
  capacity: number;
  notes: string;
};

export const AdminGroupCreation = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [guideName, setGuideName] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [capacity, setCapacity] = useState("10");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleCreateGroup = () => {
    if (!groupName || !guideName || !selectedActivity || !selectedDate) {
      toast({
        title: "Informations incomplètes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName,
      guide: guideName,
      activity: selectedActivity,
      date: selectedDate,
      capacity: parseInt(capacity),
      notes: notes
    };

    setGroups((prev) => [...prev, newGroup]);
    
    // Reset form
    setGroupName("");
    setGuideName("");
    setSelectedActivity("");
    setSelectedDate(undefined);
    setCapacity("10");
    setNotes("");
    
    // Show success feedback
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    
    // Show toast
    toast({
      title: "Groupe créé avec succès",
      description: `Le groupe "${groupName}" a été créé avec ${capacity} places.`,
      duration: 3000
    });
    
    // Close creation form
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des groupes</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>Créer un nouveau groupe</Button>
        )}
      </div>

      {/* Create group form */}
      {isCreating && (
        <Card className="border border-dashed">
          <CardHeader>
            <CardTitle>Créer un nouveau groupe</CardTitle>
            <CardDescription>
              Créez un groupe en fonction des préférences des utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Nom du groupe</Label>
                <Input
                  id="group-name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Ex: Tour de Chefchaouen - Juin 2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guide-name">Nom du guide</Label>
                <Input
                  id="guide-name"
                  value={guideName}
                  onChange={(e) => setGuideName(e.target.value)}
                  placeholder="Ex: Mohammed Alami"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity">Activité</Label>
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une activité" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date de l'activité</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité du groupe</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes supplémentaires</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Précisions sur le groupe, exigences particulières, etc."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateGroup} disabled={success}>
              {success ? (
                <span className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Groupe créé
                </span>
              ) : (
                "Créer le groupe"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Group list */}
      {groups.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Groupes créés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => {
              const activity = activities.find(a => a.id === group.activity);
              return (
                <Card key={group.id}>
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>
                      Guide: {group.guide} • Capacité: {group.capacity} personnes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{activity?.title}</p>
                    <p className="text-sm text-gray-500">
                      Date: {format(group.date, "PPP", { locale: fr })}
                    </p>
                    {group.notes && (
                      <p className="mt-2 text-sm text-gray-600">{group.notes}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Gérer le groupe
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun groupe n'a encore été créé</p>
        </div>
      )}
    </div>
  );
};

export default AdminGroupCreation;

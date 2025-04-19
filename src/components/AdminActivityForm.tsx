
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface ActivityFormData {
  title: string;
  description: string;
  location: string;
  price: number;
  duration: string;
  image: string;
  type: string[];
  groupSizeMin: number;
  groupSizeMax: number;
}

export const AdminActivityForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivityFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: ActivityFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('activities')
        .insert({
          title: data.title,
          description: data.description,
          location: data.location,
          price: data.price,
          duration: data.duration,
          image: data.image,
          type: data.type,
          group_size_min: data.groupSizeMin,
          group_size_max: data.groupSizeMax
        });

      if (error) throw error;

      toast({
        title: "Activité créée avec succès",
        description: "L'activité a été ajoutée à la base de données."
      });
      reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'activité.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Créer une nouvelle activité</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              {...register("title", { required: "Le titre est requis" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: "La description est requise" })}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              {...register("location", { required: "Le lieu est requis" })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€)</Label>
              <Input
                id="price"
                type="number"
                {...register("price", { required: "Le prix est requis" })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée</Label>
              <Input
                id="duration"
                {...register("duration", { required: "La durée est requise" })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL de l'image</Label>
            <Input
              id="image"
              {...register("image", { required: "L'URL de l'image est requise" })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="groupSizeMin">Taille min. du groupe</Label>
              <Input
                id="groupSizeMin"
                type="number"
                {...register("groupSizeMin", { required: "La taille minimale est requise" })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupSizeMax">Taille max. du groupe</Label>
              <Input
                id="groupSizeMax"
                type="number"
                {...register("groupSizeMax", { required: "La taille maximale est requise" })}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Création en cours..." : "Créer l'activité"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminActivityForm;

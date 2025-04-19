
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCircle, Calendar, Users, Clock, FileText, Download } from "lucide-react";
import AdminGroupCreation from "@/components/AdminGroupCreation";
import AdminActivityForm from "@/components/AdminActivityForm";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { activities } from "@/data/activities";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ExportData {
  id: string;
  created_at: string;
  filename: string;
  export_type: string;
  user_name: string | null;
  user_email: string | null;
  selected_city: string | null;
  budget: string | null;
}

const Admin = () => {
  const [exports, setExports] = useState<ExportData[]>([]);
  const { preferences } = useUserPreferences();

  useEffect(() => {
    const fetchExports = async () => {
      const { data, error } = await supabase
        .from('excel_exports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching exports:', error);
        return;
      }

      setExports(data);
    };

    fetchExports();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interface d'administration</h1>
        <p className="text-lg text-gray-600 mb-4">
          Gérez les groupes, les activités et consultez l'historique des exports
        </p>
      </div>
      
      <Tabs defaultValue="exports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="exports">Historique des exports</TabsTrigger>
          <TabsTrigger value="groups">Création de groupes</TabsTrigger>
          <TabsTrigger value="activities">Gestion des activités</TabsTrigger>
        </TabsList>

        <TabsContent value="exports">
          <Card>
            <CardHeader>
              <CardTitle>Historique des exports Excel/CSV</CardTitle>
              <CardDescription>
                Liste de tous les exports générés par les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exports.map((export_) => (
                      <TableRow key={export_.id}>
                        <TableCell>
                          {format(new Date(export_.created_at), "dd MMMM yyyy HH:mm", { locale: fr })}
                        </TableCell>
                        <TableCell>{export_.user_name || 'N/A'}</TableCell>
                        <TableCell>{export_.user_email || 'N/A'}</TableCell>
                        <TableCell>{export_.selected_city || 'N/A'}</TableCell>
                        <TableCell>{export_.budget || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={export_.export_type === 'csv' ? 'outline' : 'default'}>
                            {export_.export_type.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups">
          <AdminGroupCreation />
        </TabsContent>

        <TabsContent value="activities">
          <AdminActivityForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

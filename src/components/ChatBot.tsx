import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send, User, Bot } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useUserPreferences, DateRange, ActivityType } from "@/contexts/UserPreferencesContext";
import { useNavigate } from "react-router-dom";
import { cities } from "@/data/cities";
import { activities } from "@/data/activities";
import { Activity } from "@/types/activity";
import { Textarea } from "@/components/ui/textarea";
import Map from "@/components/Map";

type Message = {
  id: string;
  text: string;
  sender: "bot" | "user";
  inputType?: "cities" | "date" | "activities" | "excursions" | "groupSize" | "runnersCount" | "budget" | "special" | "additionalComments" | "email";
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [chatStep, setChatStep] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [groupSize, setGroupSize] = useState<number>(1);
  const [runnersCount, setRunnersCount] = useState<number>(0);
  const [budget, setBudget] = useState<string>("");
  const [additionalComments, setAdditionalComments] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { updatePreferences, setChatCompleted, preferences } = useUserPreferences();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          text: "Bienvenue chez SGM Tours ! Je suis là pour vous aider à planifier votre expérience parfaite en Tunisie. Quelles régions souhaitez-vous explorer ? (Vous pouvez en sélectionner plusieurs)",
          sender: "bot",
          inputType: "cities"
        }
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    if (chatStep === 9) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  }, [chatStep, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user"
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    
    processUserResponse(newUserMessage);
  };

  const isFormComplete = () => {
    return (
      preferences.selectedCity &&
      preferences.selectedActivities.length > 0 &&
      preferences.budget &&
      preferences.groupSize > 0 &&
      preferences.dateRange.from &&
      preferences.dateRange.to &&
      preferences.specialRequirements !== undefined &&
      preferences.email !== undefined
    );
  };

  const simulateBotTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000);
  };

  const processUserResponse = (message: Message) => {
    switch (chatStep) {
      case 0: // Cities
        simulateBotTyping(() => {
          updatePreferences({ selectedCity: selectedCities.join(",") });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Excellent ! Maintenant, découvrons quelles excursions vous intéressent le plus :",
              sender: "bot",
              inputType: "excursions"
            }
          ]);
          setChatStep(1);
        });
        break;
      
      case 1: // Excursions
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Sur combien de personnes dans votre groupe sont des coureurs ?",
              sender: "bot",
              inputType: "runnersCount"
            }
          ]);
          setChatStep(2);
        });
        break;

      case 2: // Runners count
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Quand souhaitez-vous voyager ? Sélectionnez vos dates préférées :",
              sender: "bot",
              inputType: "date"
            }
          ]);
          setChatStep(3);
        });
        break;

      case 3: // Dates
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Quel type d'expérience recherchez-vous ?",
              sender: "bot",
              inputType: "activities"
            }
          ]);
          setChatStep(4);
        });
        break;

      case 4: // Activities
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Combien de personnes participeront à cette aventure ?",
              sender: "bot",
              inputType: "groupSize"
            }
          ]);
          setChatStep(5);
        });
        break;

      case 5: // Group size
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Quel est votre budget par personne pour cette expérience ?",
              sender: "bot",
              inputType: "budget"
            }
          ]);
          setChatStep(6);
        });
        break;

      case 6: // Special requirements
        simulateBotTyping(() => {
          updatePreferences({ specialRequirements: message.text });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Y a-t-il d'autres choses que vous souhaiteriez nous faire parvenir ?",
              sender: "bot",
              inputType: "additionalComments"
            }
          ]);
          setChatStep(7);
        });
        break;

      case 7: // Additional comments
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Pour finaliser votre demande, pourriez-vous me donner votre email afin que nous puissions vous envoyer les détails de votre circuit personnalisé ?",
              sender: "bot",
              inputType: "email"
            }
          ]);
          setChatStep(8);
        });
        break;

      case 8: // Email
        simulateBotTyping(() => {
          updatePreferences({ 
            email: message.text,
            additionalComments: additionalComments 
          });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Merci ! J'ai recueilli toutes les informations nécessaires pour créer votre expérience tunisienne personnalisée. Vous allez être redirigé vers votre tableau de bord où vous pourrez consulter nos suggestions adaptées à votre voyage.",
              sender: "bot"
            }
          ]);
          setChatStep(9);
          setChatCompleted(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        });
        break;

      default:
        break;
    }
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCities((prev) => {
      const newSelected = prev.includes(cityId)
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId];
      return newSelected;
    });
  };

  const handleCitiesSubmit = () => {
    if (selectedCities.length === 0) return;

    const citiesText = selectedCities
      .map(cityId => cities.find(c => c.id === cityId)?.name)
      .filter(Boolean)
      .join(", ");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `J'aimerais visiter : ${citiesText}`,
        sender: "user"
      }
    ]);

    processUserResponse({
      id: Date.now().toString(),
      text: citiesText,
      sender: "user"
    });
  };

  const handleDateSelect = (range: DateRange) => {
    setDateRange(range);
    updatePreferences({ dateRange: range });
    
    if (range.from && range.to) {
      const formattedFrom = format(range.from, 'dd MMMM yyyy', { locale: fr });
      const formattedTo = format(range.to, 'dd MMMM yyyy', { locale: fr });
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `Du ${formattedFrom} au ${formattedTo}`,
          sender: "user"
        }
      ]);
      
      processUserResponse({
        id: Date.now().toString(),
        text: `Du ${formattedFrom} au ${formattedTo}`,
        sender: "user"
      });
    }
  };

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivities((prev) => {
      const isRemoving = prev.includes(activityId);
      const newSelected = isRemoving
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId];
      
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        const activityTypes: ActivityType[] = activity.type
          .filter(type => 
            ["cultural", "adventure", "relaxation", "gastronomy", "nature"].includes(type)
          ) as ActivityType[];
        
        updatePreferences({ 
          selectedActivities: newSelected,
          activityTypes: activityTypes
        });
        
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: `${activity.title} a été ${isRemoving ? 'retirée de' : 'ajoutée à'} vos activités sélectionnées !`,
            sender: "bot"
          }
        ]);
      }
      
      return newSelected;
    });
  };

  const handleActivitiesSubmit = () => {
    if (selectedActivities.length === 0) return;
    
    const allActivityTypes = new Set<ActivityType>();
    selectedActivities.forEach(activityId => {
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        activity.type.forEach(type => {
          if (["cultural", "adventure", "relaxation", "gastronomy", "nature"].includes(type)) {
            allActivityTypes.add(type as ActivityType);
          }
        });
      }
    });
    
    updatePreferences({ 
      selectedActivities: selectedActivities,
      activityTypes: Array.from(allActivityTypes)
    });
    
    const activitiesText = selectedActivities.map(activityId => {
      const activity = activities.find(a => a.id === activityId);
      return activity ? activity.title : 'Unknown Activity';
    }).join(", ");
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `J'aime: ${activitiesText}`,
        sender: "user"
      }
    ]);
    
    processUserResponse({
      id: Date.now().toString(),
      text: activitiesText,
      sender: "user"
    });
  };

  const handleGroupSizeSubmit = () => {
    updatePreferences({ groupSize });
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `${groupSize} ${groupSize > 1 ? 'personnes' : 'personne'}`,
        sender: "user"
      }
    ]);
    
    processUserResponse({
      id: Date.now().toString(),
      text: groupSize.toString(),
      sender: "user"
    });
  };

  const handleBudgetSubmit = () => {
    if (!budget) return;
    
    updatePreferences({ budget });
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: budget,
        sender: "user"
      }
    ]);
    
    processUserResponse({
      id: Date.now().toString(),
      text: budget,
      sender: "user"
    });
  };

  const handleSpecialSubmit = (text: string) => {
    if (text.trim() === "") text = "Pas d'exigences particulières";
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: text,
        sender: "user"
      }
    ]);
    
    processUserResponse({
      id: Date.now().toString(),
      text: text,
      sender: "user"
    });
  };

  const handleEmailSubmit = (text: string) => {
    updatePreferences({ email: text });
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: text,
        sender: "user"
      }
    ]);
    
    processUserResponse({
      id: Date.now().toString(),
      text: text,
      sender: "user"
    });
  };

  const renderInput = (inputType: string) => {
    switch (inputType) {
      case "cities":
        return (
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {cities.map((city) => (
                <div key={city.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={city.id}
                    checked={selectedCities.includes(city.id)}
                    onCheckedChange={() => handleCitySelect(city.id)}
                  />
                  <Label htmlFor={city.id}>{city.name}</Label>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleCitiesSubmit}
              disabled={selectedCities.length === 0}
            >
              Valider
            </Button>
          </div>
        );

      case "date":
        return (
          <div className="mt-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Sélectionnez les dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={new Date()}
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case "activities":
        return (
          <div className="mt-3">
            <div className="grid grid-cols-2 gap-2">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={activity.id}
                    checked={selectedActivities.includes(activity.id)}
                    onCheckedChange={() => {
                      if (onActivitySelect) {
                        handleActivitySelect(activity.id);
                      }
                    }}
                  />
                  <Label htmlFor={activity.id}>{activity.title}</Label>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleActivitiesSubmit}
              disabled={selectedActivities.length === 0}
              className="mt-4"
            >
              Valider
            </Button>
          </div>
        );

      case "groupSize":
        return (
          <div className="mt-3 space-y-3">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setGroupSize(prev => Math.max(1, prev - 1))}
              >
                -
              </Button>
              <span className="text-xl font-medium">{groupSize}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setGroupSize(prev => prev + 1)}
              >
                +
              </Button>
            </div>
            <Button onClick={handleGroupSizeSubmit}>
              Valider
            </Button>
          </div>
        );

      case "budget":
        return (
          <div className="mt-3 space-y-3">
            <RadioGroup defaultValue="medium" onValueChange={setBudget}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Moins de 50€" id="budget-low" />
                <Label htmlFor="budget-low">Moins de 50€ par personne</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="50€ - 100€" id="budget-medium" />
                <Label htmlFor="budget-medium">50€ - 100€ par personne</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Plus de 100€" id="budget-high" />
                <Label htmlFor="budget-high">Plus de 100€ par personne</Label>
              </div>
            </RadioGroup>
            <Button onClick={handleBudgetSubmit} disabled={!budget}>
              Valider
            </Button>
          </div>
        );

      case "special":
        return (
          <div className="mt-3 space-y-3">
            <Textarea 
              placeholder="Exigences alimentaires, accessibilité, etc."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => handleSpecialSubmit("Pas d'exigences particulières")}
              >
                Passer
              </Button>
              <Button onClick={() => handleSpecialSubmit(inputValue)}>
                Valider
              </Button>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="mt-3 space-y-3">
            <Input
              placeholder="Votre email..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button onClick={() => handleEmailSubmit(inputValue)}>
              Valider
            </Button>
          </div>
        );

      case "excursions":
        return (
          <div className="mt-3 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-4 rounded-lg border">
                  <Checkbox
                    id={activity.id}
                    checked={selectedActivities.includes(activity.id)}
                    onCheckedChange={() => handleActivitySelect(activity.id)}
                  />
                  <div>
                    <Label htmlFor={activity.id} className="font-medium">{activity.title}</Label>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Durée : {activity.duration} | Prix : {activity.price}€ par personne
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleActivitiesSubmit}
              disabled={selectedActivities.length === 0}
            >
              Valider
            </Button>
          </div>
        );

      case "runnersCount":
        return (
          <div className="mt-3 space-y-3">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setRunnersCount(prev => Math.max(0, prev - 1))}
              >
                -
              </Button>
              <span className="text-xl font-medium">{runnersCount}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setRunnersCount(prev => Math.min(groupSize, prev + 1))}
              >
                +
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Le nombre de coureurs ne peut pas dépasser la taille du groupe ({groupSize})
            </p>
            <Button onClick={() => {
              updatePreferences({ runnersCount });
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  text: `${runnersCount} coureur${runnersCount > 1 ? 's' : ''}`,
                  sender: "user"
                }
              ]);
              processUserResponse({
                id: Date.now().toString(),
                text: runnersCount.toString(),
                sender: "user"
              });
            }}>
              Valider
            </Button>
          </div>
        );

      case "additionalComments":
        return (
          <div className="mt-3 space-y-3">
            <Textarea 
              placeholder="Partagez avec nous vos attentes, questions ou besoins spécifiques..."
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => {
                  setAdditionalComments("Pas de commentaires additionnels");
                  processUserResponse({
                    id: Date.now().toString(),
                    text: "Pas de commentaires additionnels",
                    sender: "user"
                  });
                }}
              >
                Passer
              </Button>
              <Button onClick={() => {
                processUserResponse({
                  id: Date.now().toString(),
                  text: additionalComments || "Pas de commentaires additionnels",
                  sender: "user"
                });
              }}>
                Valider
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const onActivitySelect = (activityId: string) => {
    setSelectedActivities((prev) => {
      const isRemoving = prev.includes(activityId);
      const newSelected = isRemoving
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId];
      
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        const activityTypes: ActivityType[] = activity.type
          .filter(type => 
            ["cultural", "adventure", "relaxation", "gastronomy", "nature"].includes(type)
          ) as ActivityType[];
        
        updatePreferences({ 
          selectedActivities: newSelected,
          activityTypes: activityTypes
        });
      }
      
      return newSelected;
    });
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto h-full flex flex-col bg-white rounded-lg shadow-lg">
      <div className="p-4 bg-primary text-white rounded-t-lg">
        <h3 className="text-lg font-semibold">Assistant de voyage SGM</h3>
        <p className="text-sm opacity-80">Je vous aide à planifier votre voyage idéal</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex chat-message",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-md p-3 rounded-lg",
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  {message.sender === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div>
                  {message.text}
                  {renderInput(message.inputType || "")}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-md p-3 rounded-lg bg-muted">
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {chatStep === 8 ? (
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={"Votre email..."}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : chatStep === 9 && isFormComplete() ? (
        <div className="p-4 border-t">
          <p className="text-center text-gray-600 mb-2">Redirection vers votre tableau de bord...</p>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress" style={{ width: '100%' }} />
          </div>
        </div>
      ) : chatStep === 9 ? (
        <div className="p-4 border-t">
          <p className="text-center text-yellow-600">Veuillez compléter toutes les informations avant de continuer.</p>
        </div>
      ) : null}
    </div>
  );
};

export default ChatBot;

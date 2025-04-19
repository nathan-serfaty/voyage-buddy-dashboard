import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import Map from "@/components/Map";

type Message = {
  id: string;
  text: string;
  sender: "bot" | "user";
  inputType?: "text" | "date" | "activities" | "groupSize" | "budget" | "special" | "city";
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [chatStep, setChatStep] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [groupSize, setGroupSize] = useState<number>(1);
  const [budget, setBudget] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { updatePreferences, setChatCompleted, preferences } = useUserPreferences();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          text: "Welcome to SGM Tours! I'm here to help plan your perfect Tunisia experience. Which region would you like to explore? (Tunis, Hammamet, Sousse, Monastir, etc.)",
          sender: "bot",
          inputType: "city"
        }
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    if (chatStep === 8 && isFormComplete()) {
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

  const simulateBotTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000);
  };

  const isFormComplete = () => {
    return (
      preferences.name &&
      preferences.email &&
      preferences.selectedCity &&
      preferences.selectedActivities.length > 0 &&
      preferences.budget &&
      preferences.groupSize > 0 &&
      preferences.dateRange.from &&
      preferences.dateRange.to &&
      preferences.specialRequirements !== undefined
    );
  };

  const processUserResponse = (message: Message) => {
    switch (chatStep) {
      case 0:
        simulateBotTyping(() => {
          updatePreferences({ selectedCity: message.text });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Great choice! To personalize your experience, could you please tell me your name?",
              sender: "bot"
            }
          ]);
          setChatStep(1);
        });
        break;
      
      case 1:
        simulateBotTyping(() => {
          updatePreferences({ name: message.text });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: `Nice to meet you, ${message.text}! Please provide your email so we can send you detailed information about your customized tour.`,
              sender: "bot"
            }
          ]);
          setChatStep(2);
        });
        break;
      
      case 2:
        simulateBotTyping(() => {
          updatePreferences({ email: message.text });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "When would you like to visit Tunisia? You can select your preferred dates:",
              sender: "bot",
              inputType: "date"
            }
          ]);
          setChatStep(3);
        });
        break;
      
      case 3:
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Excellent! What interests you most about Tunisia? Select the experiences that appeal to you:",
              sender: "bot",
              inputType: "activities"
            }
          ]);
          setChatStep(4);
        });
        break;
      
      case 4:
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "How many people will be joining this adventure?",
              sender: "bot",
              inputType: "groupSize"
            }
          ]);
          setChatStep(5);
        });
        break;
      
      case 5:
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "What's your budget per person for activities and experiences? This helps us suggest the most suitable options:",
              sender: "bot",
              inputType: "budget"
            }
          ]);
          setChatStep(6);
        });
        break;
      
      case 6:
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Do you have any special requirements or preferences? (e.g., dietary restrictions, accessibility needs, specific interests in culture/history)",
              sender: "bot",
              inputType: "special"
            }
          ]);
          setChatStep(7);
        });
        break;
      
      case 7:
        simulateBotTyping(() => {
          updatePreferences({ specialRequirements: message.text });
          if (isFormComplete()) {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                text: "Thank you for sharing your preferences! I've gathered all the information needed to create your personalized Tunisian experience. You'll be redirected to your dashboard where you can view our tailored suggestions for your journey.",
                sender: "bot"
              }
            ]);
            setChatStep(8);
            setChatCompleted(true);
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                text: "It seems we're missing some information. Would you mind if we start over to ensure we create the perfect itinerary for you?",
                sender: "bot"
              }
            ]);
            setChatStep(0);
          }
        });
        break;
      
      default:
        break;
    }
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

  const handleGoToDashboard = () => {
    navigate("/dashboard");
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
                  
                  {message.inputType === "city" && (
                    <div className="mt-3">
                      <div className="grid grid-cols-2 gap-2">
                        {cities.map((city) => (
                          <Button
                            key={city.id}
                            variant="outline"
                            onClick={() => {
                              setMessages((prev) => [
                                ...prev,
                                {
                                  id: Date.now().toString(),
                                  text: city.name,
                                  sender: "user"
                                }
                              ]);
                              processUserResponse({
                                id: Date.now().toString(),
                                text: city.id,
                                sender: "user"
                              });
                            }}
                            className="flex flex-col items-start p-4"
                          >
                            <span className="font-bold">{city.name}</span>
                            <span className="text-sm text-gray-500">{city.description}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.inputType === "date" && (
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
                  )}
                  
                  {message.inputType === "activities" && (
                    <div className="mt-3">
                      <div className="w-full h-[400px] rounded-lg overflow-hidden mb-4">
                        <Map 
                          selectedCity={preferences.selectedCity}
                          onActivitySelect={handleActivitySelect}
                          className="w-full h-full"
                        />
                      </div>
                      {selectedActivities.length > 0 && (
                        <div className="mt-4">
                          <h3 className="font-semibold mb-2">Activités sélectionnées:</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedActivities.map((activityId) => {
                              const activity = activities.find(a => a.id === activityId);
                              if (!activity) return null;
                              return (
                                <div key={activity.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                  <img 
                                    src={activity.image} 
                                    alt={activity.title} 
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-sm">{activity.title}</p>
                                    <p className="text-xs text-gray-500">{activity.price}€</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <Button 
                        onClick={handleActivitiesSubmit}
                        disabled={selectedActivities.length === 0}
                        className="mt-4"
                      >
                        Valider
                      </Button>
                    </div>
                  )}
                  
                  {message.inputType === "groupSize" && (
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
                  )}
                  
                  {message.inputType === "budget" && (
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
                  )}
                  
                  {message.inputType === "special" && (
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
                  )}
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
      
      {chatStep === 1 || chatStep === 2 ? (
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
              placeholder={chatStep === 1 ? "Votre nom..." : "Votre email..."}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : chatStep === 8 && isFormComplete() ? (
        <div className="p-4 border-t">
          <p className="text-center text-gray-600 mb-2">Redirection vers votre tableau de bord...</p>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress" style={{ width: '100%' }} />
          </div>
        </div>
      ) : chatStep === 8 ? (
        <div className="p-4 border-t">
          <p className="text-center text-yellow-600">Veuillez compléter toutes les informations avant de continuer.</p>
        </div>
      ) : null}
    </div>
  );
};

export default ChatBot;

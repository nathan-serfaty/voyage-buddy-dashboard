import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send, User, Bot } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useUserPreferences, ActivityType, DateRange } from "@/contexts/UserPreferencesContext";
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

  // Initial message
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          text: "Bonjour ! Je suis votre assistant de voyage SGM. Pour commencer, quelle ville souhaitez-vous visiter ?",
          sender: "bot",
          inputType: "city"
        }
      ]);
    }, 500);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending text message
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user"
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    
    // Process user response based on current chat step
    processUserResponse(newUserMessage);
  };

  // Simulate bot typing
  const simulateBotTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000);
  };

  // Process user response and continue chat flow
  const processUserResponse = (message: Message) => {
    switch (chatStep) {
      case 0: // City selection
        simulateBotTyping(() => {
          updatePreferences({ selectedCity: message.text });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: `Excellent choix ! Maintenant, pouvez-vous me donner votre nom ?`,
              sender: "bot"
            }
          ]);
          setChatStep(1);
        });
        break;
      
      case 1: // Name input
        simulateBotTyping(() => {
          updatePreferences({ name: message.text });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: `Ravi de vous rencontrer, ${message.text} ! Pouvez-vous me donner votre email pour que nous puissions vous contacter concernant votre voyage ?`,
              sender: "bot"
            }
          ]);
          setChatStep(2);
        });
        break;
      
      case 2: // Email input
        simulateBotTyping(() => {
          updatePreferences({ email: message.text });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Super ! Maintenant, parlons des dates de votre voyage. Quand prévoyez-vous de voyager ?",
              sender: "bot",
              inputType: "date"
            }
          ]);
          setChatStep(3);
        });
        break;
      
      case 3: // Date has been selected in calendar component
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Parlons maintenant du type d'activités qui vous intéressent. Vous pouvez sélectionner plusieurs options :",
              sender: "bot",
              inputType: "activities"
            }
          ]);
          setChatStep(4);
        });
        break;
      
      case 4: // Activities have been selected
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Parfait ! Combien de personnes participeront à ce voyage ?",
              sender: "bot",
              inputType: "groupSize"
            }
          ]);
          setChatStep(5);
        });
        break;
      
      case 5: // Group size has been selected
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Quel est votre budget approximatif par personne pour ces activités ?",
              sender: "bot",
              inputType: "budget"
            }
          ]);
          setChatStep(6);
        });
        break;
      
      case 6: // Budget has been selected
        simulateBotTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Avez-vous des exigences particulières ou des informations supplémentaires à nous communiquer ?",
              sender: "bot",
              inputType: "special"
            }
          ]);
          setChatStep(7);
        });
        break;
      
      case 7: // Special requirements
        simulateBotTyping(() => {
          updatePreferences({ specialRequirements: message.text });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Merci pour toutes ces informations ! Nous avons tout ce qu'il nous faut pour vous proposer un voyage sur mesure. Vous pouvez maintenant accéder à votre tableau de bord personnalisé pour voir nos recommandations.",
              sender: "bot"
            }
          ]);
          setChatStep(8);
          setChatCompleted(true);
        });
        break;
      
      default:
        break;
    }
  };

  // Handle date selection
  const handleDateSelect = (range: DateRange) => {
    setDateRange(range);
    updatePreferences({ dateRange: range });
    
    // If both dates are selected
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
      
      // Move to next step
      processUserResponse({
        id: Date.now().toString(),
        text: `Du ${formattedFrom} au ${formattedTo}`,
        sender: "user"
      });
    }
  };

  // Handle activity selection
  const handleActivitySelect = (activityId: string) => {
    setSelectedActivities((prev) => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      }
      return [...prev, activityId];
    });
    
    updatePreferences({ selectedActivities: [...selectedActivities, activityId] });
    
    // Add confirmation message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `Activité ajoutée à votre programme !`,
        sender: "bot"
      }
    ]);
  };

  // Handle activity submission
  const handleActivitiesSubmit = () => {
    if (selectedActivities.length === 0) return;
    
    updatePreferences({ selectedActivities: selectedActivities });
    
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
    
    // Move to next step
    processUserResponse({
      id: Date.now().toString(),
      text: activitiesText,
      sender: "user"
    });
  };

  // Handle group size selection
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
    
    // Move to next step
    processUserResponse({
      id: Date.now().toString(),
      text: groupSize.toString(),
      sender: "user"
    });
  };

  // Handle budget selection
  const handleBudgetSubmit = () => {
    updatePreferences({ budget });
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: budget,
        sender: "user"
      }
    ]);
    
    // Move to next step
    processUserResponse({
      id: Date.now().toString(),
      text: budget,
      sender: "user"
    });
  };

  // Handle special requirements submission
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
    
    // Move to next step
    processUserResponse({
      id: Date.now().toString(),
      text: text,
      sender: "user"
    });
  };

  // Go to dashboard after completing chat
  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  // Update the render to include Map for activity selection when needed
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
      ) : chatStep === 8 ? (
        <div className="p-4 border-t">
          <Button 
            onClick={handleGoToDashboard} 
            className="w-full"
          >
            Voir mon tableau de bord personnalisé
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ChatBot;

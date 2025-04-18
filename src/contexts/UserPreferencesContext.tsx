
import { createContext, useContext, useState, ReactNode } from "react";

// Types for user preferences
export type ActivityType = "cultural" | "adventure" | "relaxation" | "gastronomy" | "nature";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface UserPreferences {
  name: string;
  email: string;
  activityTypes: ActivityType[];
  budget: string;
  groupSize: number;
  dateRange: DateRange;
  selectedActivities: string[];
  specialRequirements: string;
}

// Default empty preferences
const defaultPreferences: UserPreferences = {
  name: "",
  email: "",
  activityTypes: [],
  budget: "",
  groupSize: 1,
  dateRange: { from: undefined, to: undefined },
  selectedActivities: [],
  specialRequirements: ""
};

// Context type
interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  chatCompleted: boolean;
  setChatCompleted: (completed: boolean) => void;
}

// Create context
const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// Provider component
export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [chatCompleted, setChatCompleted] = useState(false);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    setChatCompleted(false);
  };

  return (
    <UserPreferencesContext.Provider value={{ 
      preferences, 
      updatePreferences, 
      resetPreferences,
      chatCompleted,
      setChatCompleted
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Hook for using the context
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
  }
  return context;
};

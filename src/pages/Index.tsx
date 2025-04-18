
import { Hero } from "@/components/ui/hero";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative h-[40vh] bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Voyagez avec SGM
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Découvrez nos excursions uniques en Tunisie et créez votre voyage sur mesure
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10 flex-1 flex flex-col">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Comment pouvons-nous vous aider à explorer la Tunisie ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Notre assistant de voyage interactif est prêt à vous aider à planifier votre aventure idéale. Partagez vos préférences et nous vous proposerons des expériences adaptées.
          </p>
        </div>
        
        <div className="flex-1 chatbot-container">
          <ChatBot />
        </div>
      </div>
    </div>
  );
};

export default Index;

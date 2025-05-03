
import { useTheme } from '@/contexts/ThemeContext';

const LoadingScreen = () => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="relative w-36 h-36 mb-4">
        <img 
          src="/lovable-uploads/453620d9-01b8-4040-aec4-9f948e52aae1.png" 
          alt="Didiz Closet" 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="mt-8 flex flex-col items-center">
        <div className="h-2 w-48 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-2/3 rounded-full animate-pulse"></div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

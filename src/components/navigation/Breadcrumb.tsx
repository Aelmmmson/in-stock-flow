
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { 
  Breadcrumb as UIBreadcrumb,
  BreadcrumbList, 
  BreadcrumbItem,
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

interface BreadcrumbProps {
  currentPageTitle?: string;
}

const Breadcrumb = ({ currentPageTitle }: BreadcrumbProps) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Don't show breadcrumbs on the main page
  if (pathSegments.length === 0) return null;

  const getPathForSegment = (index: number) => {
    return '/' + pathSegments.slice(0, index + 1).join('/');
  };

  const formatTitle = (segment: string) => {
    // Handle special cases like IDs
    if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return currentPageTitle || 'Detail';
    }

    // Capitalize first letter and replace hyphens with spaces
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  };

  return (
    <UIBreadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center hover:text-pink-500 transition-colors">
              <Home className="h-4 w-4 mr-1" />
              <span className="sr-only md:not-sr-only md:inline">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      
        {pathSegments.map((segment, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbSeparator />
            {index === pathSegments.length - 1 ? (
              <BreadcrumbPage>
                {currentPageTitle || formatTitle(segment)}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link 
                  to={getPathForSegment(index)}
                  className="hover:text-pink-500 truncate transition-colors"
                >
                  {formatTitle(segment)}
                </Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </UIBreadcrumb>
  );
};

export default Breadcrumb;

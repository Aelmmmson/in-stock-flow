
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, subMonths, subWeeks, subYears, subQuarters } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateFilterType } from '@/types';

interface DateRangeFilterProps {
  onFilterChange: (startDate: Date, endDate: Date, filterType: DateFilterType) => void;
}

const DateRangeFilter = ({ onFilterChange }: DateRangeFilterProps) => {
  const [activeFilter, setActiveFilter] = useState<DateFilterType>('month');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  
  const applyFilter = (filterType: DateFilterType) => {
    let newStartDate: Date;
    let newEndDate: Date = new Date();
    
    switch (filterType) {
      case 'week':
        newStartDate = startOfWeek(new Date());
        newEndDate = endOfWeek(new Date());
        break;
      case 'month':
        newStartDate = startOfMonth(new Date());
        newEndDate = endOfMonth(new Date());
        break;
      case 'year':
        newStartDate = startOfYear(new Date());
        newEndDate = endOfYear(new Date());
        break;
      case 'quarter':
        // Set to start of current quarter
        const currentMonth = new Date().getMonth();
        const currentQuarter = Math.floor(currentMonth / 3);
        newStartDate = new Date(new Date().getFullYear(), currentQuarter * 3, 1);
        // End date is the last day of the quarter's final month
        newEndDate = new Date(new Date().getFullYear(), currentQuarter * 3 + 3, 0);
        break;
      default:
        newStartDate = startDate;
        newEndDate = endDate;
    }
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setActiveFilter(filterType);
    onFilterChange(newStartDate, newEndDate, filterType);
  };
  
  const handleQuarterSelect = (quarter: number) => {
    const currentYear = new Date().getFullYear();
    const quarterStartDate = new Date(currentYear, (quarter - 1) * 3, 1);
    const quarterEndDate = new Date(currentYear, quarter * 3, 0);
    
    setStartDate(quarterStartDate);
    setEndDate(quarterEndDate);
    setActiveFilter('quarter');
    onFilterChange(quarterStartDate, quarterEndDate, 'quarter');
  };
  
  const applyCustomDateRange = () => {
    if (startDate && endDate) {
      onFilterChange(startDate, endDate, 'custom');
      setActiveFilter('custom');
      setIsDatePickerOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeFilter === 'week' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => applyFilter('week')}
        >
          This Week
        </Button>
        
        <Button 
          variant={activeFilter === 'month' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => applyFilter('month')}
        >
          This Month
        </Button>
        
        <Button 
          variant={activeFilter === 'year' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => applyFilter('year')}
        >
          This Year
        </Button>
        
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant={activeFilter === 'custom' ? 'default' : 'outline'} 
              size="sm"
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" /> 
              {activeFilter === 'custom' 
                ? `${format(startDate, 'PP')} - ${format(endDate, 'PP')}`
                : 'Custom Range'
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-col sm:flex-row">
              <div className="border-r p-2">
                <div className="px-2 py-1 text-sm font-medium">Start Date</div>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={date => date && setStartDate(date)}
                  disabled={(date) => date > new Date() || date > endDate}
                  initialFocus
                />
              </div>
              <div className="p-2">
                <div className="px-2 py-1 text-sm font-medium">End Date</div>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={date => date && setEndDate(date)}
                  disabled={(date) => date > new Date() || date < startDate}
                  initialFocus
                />
              </div>
            </div>
            <div className="border-t p-2 flex justify-end">
              <Button size="sm" onClick={applyCustomDateRange}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <div className="text-sm font-medium mr-2">Quarters:</div>
        {[1, 2, 3, 4].map(quarter => (
          <Button
            key={quarter}
            variant={activeFilter === 'quarter' && 
                   startDate.getMonth() === (quarter - 1) * 3 ? 
                   'default' : 'outline'}
            size="sm"
            onClick={() => handleQuarterSelect(quarter)}
          >
            Q{quarter}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DateRangeFilter;

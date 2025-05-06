
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { Check, ShoppingBag, AlertTriangle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notification } from '@/types';
import { useInventory } from '@/contexts/InventoryContext';

interface NotificationsDropdownProps {
  onClose: () => void;
}

const NotificationsDropdown = ({ onClose }: NotificationsDropdownProps) => {
  const { getLowStockProducts, transactions } = useInventory();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Generate notifications based on app state
  useEffect(() => {
    const lowStockProducts = getLowStockProducts();
    const recentTransactions = transactions.slice(0, 3);
    
    const newNotifications: Notification[] = [
      ...lowStockProducts.map((product): Notification => ({
        id: `lowstock-${product.id}`,
        title: "Low Stock Alert",
        description: `${product.name} is running low (${product.quantity} left)`,
        date: new Date().toISOString(),
        read: false,
        type: 'lowStock',
        linkTo: `/inventory/${product.id}`
      })),
      ...recentTransactions.map((transaction): Notification => ({
        id: `transaction-${transaction.id}`,
        title: "New Sale",
        description: `Transaction completed for GH₵${transaction.totalAmount.toFixed(2)}`,
        date: transaction.createdAt,
        read: false,
        type: 'sale',
        linkTo: `/transactions/${transaction.id}`
      })),
      {
        id: 'system-1',
        title: 'Welcome to Didiz Closet',
        description: 'Get started by adding products to your inventory',
        date: new Date().toISOString(),
        read: true,
        type: 'system'
      }
    ];
    
    setNotifications(newNotifications.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, [getLowStockProducts, transactions]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'lowStock':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'sale':
        return <ShoppingBag className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <Card className="absolute right-0 top-12 w-80 z-50 shadow-lg border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold">Notifications</h3>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          <Check className="h-4 w-4 mr-1" />
          Mark all read
        </Button>
      </div>
      
      <ScrollArea className="max-h-[350px]">
        <div className="p-1">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <Link
                key={notification.id}
                to={notification.linkTo || '#'}
                onClick={() => {
                  if (!notification.linkTo) return;
                  onClose();
                }}
                className="block"
              >
                <div className={`flex p-3 gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-800 flex items-center justify-center h-9 w-9">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{notification.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(notification.date)}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-pink-500 rounded-full self-start mt-2"></div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No notifications
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <Link to="/notifications" onClick={onClose}>
          <Button variant="outline" className="w-full">
            View All Notifications
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default NotificationsDropdown;

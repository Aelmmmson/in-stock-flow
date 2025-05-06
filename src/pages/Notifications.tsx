
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { Check, ShoppingBag, AlertTriangle, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Notification } from '@/types';
import { useInventory } from '@/contexts/InventoryContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Notifications = () => {
  const { getLowStockProducts, transactions } = useInventory();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Generate notifications based on app state
  useEffect(() => {
    const lowStockProducts = getLowStockProducts();
    const allTransactions = transactions;
    
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
      ...allTransactions.map((transaction): Notification => ({
        id: `transaction-${transaction.id}`,
        title: "New Sale",
        description: `Transaction completed for GH₵${transaction.totalAmount.toFixed(2)}`,
        date: transaction.createdAt,
        read: Math.random() > 0.5, // Randomly mark some as read for demo
        type: 'sale',
        linkTo: `/transactions/${transaction.id}`
      })),
      {
        id: 'system-1',
        title: 'Welcome to Didiz Closet',
        description: 'Get started by adding products to your inventory',
        date: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
        read: true,
        type: 'system'
      },
      {
        id: 'system-2',
        title: 'System Update',
        description: 'Didiz Closet has been updated to version 1.0.0',
        date: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
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

  const filteredNotifications = notifications
    .filter(n => {
      // Filter by search query
      if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !n.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by tab
      if (activeTab === 'unread' && n.read) {
        return false;
      } else if (activeTab === 'lowStock' && n.type !== 'lowStock') {
        return false;
      } else if (activeTab === 'sales' && n.type !== 'sale') {
        return false;
      } else if (activeTab === 'system' && n.type !== 'system') {
        return false;
      }
      
      return true;
    });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          <Check className="h-4 w-4 mr-2" />
          Mark all as read
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input 
          type="search" 
          placeholder="Search notifications..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">
            All
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && <span className="ml-1 bg-pink-500 text-white rounded-full px-1.5 py-0.5 text-xs">{unreadCount}</span>}
          </TabsTrigger>
          <TabsTrigger value="lowStock">Low Stock</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              {filteredNotifications.length > 0 ? (
                <ScrollArea className="h-[70vh]">
                  {filteredNotifications.map(notification => (
                    <Link
                      key={notification.id}
                      to={notification.linkTo || '#'}
                      onClick={() => {
                        if (!notification.linkTo) return;
                      }}
                    >
                      <div className={`flex p-4 gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                        <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-800 flex items-center justify-center h-10 w-10">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-gray-400">{formatDate(notification.date)}</p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.description}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-pink-500 rounded-full self-start mt-2"></div>
                        )}
                      </div>
                    </Link>
                  ))}
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Bell className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">No notifications found</p>
                  {searchQuery && <p className="text-gray-400 text-sm mt-1">Try using different search terms</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;

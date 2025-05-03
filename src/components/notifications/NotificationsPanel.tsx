
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  link: string;
  time: string;
  read: boolean;
}

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel = ({ onClose }: NotificationsPanelProps) => {
  // This would ideally come from a context or API
  const notifications: NotificationProps[] = [
    {
      id: '1',
      title: 'Low Stock Alert',
      message: 'Beaded Statement Necklace is running low on stock',
      type: 'warning',
      link: '/inventory/item-1',
      time: '1h ago',
      read: false
    },
    {
      id: '2',
      title: 'New Sale Completed',
      message: 'Sale #TR17463 has been completed',
      type: 'success',
      link: '/transactions/TR17463',
      time: '2h ago',
      read: false
    },
    {
      id: '3',
      title: 'New Product Added',
      message: 'African Print Men\'s Shirt has been added to inventory',
      type: 'info',
      link: '/inventory/item-3',
      time: '1d ago',
      read: true
    },
    {
      id: '4',
      title: 'Price Updated',
      message: 'Floral Summer Dress price has been updated',
      type: 'info',
      link: '/inventory/item-2',
      time: '2d ago',
      read: true
    }
  ];

  const getIconForType = (type: string) => {
    switch(type) {
      case 'warning':
        return (
          <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="w-full max-w-xs bg-white dark:bg-gray-800 h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium text-lg">Notifications</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map(notification => (
                <Link
                  key={notification.id}
                  to={notification.link}
                  onClick={onClose}
                  className={`block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    notification.read ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex items-start">
                    {getIconForType(notification.type)}
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium block mb-1">
                          {notification.title}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;

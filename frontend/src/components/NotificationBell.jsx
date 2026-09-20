import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) markAllRead();
        }}
        className="relative text-gray-400 hover:text-white px-2 py-1"
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-40 max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm p-3">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="px-3 py-2 text-sm border-b border-gray-800 last:border-0">
                <p>{n.message}</p>
                <p className="text-xs text-gray-500">
                  {n.at.toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

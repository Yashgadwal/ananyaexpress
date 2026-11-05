'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Car, 
  CalendarRange, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Star, 
  MapPin, 
  HelpCircle,
  TrendingUp,
  Image,
  UserCheck
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('Ananya Admin');
  const pathname = usePathname();
  const router = useRouter();

  // If we are on the login page, don't show the layout header/sidebar!
  const isLoginPage = pathname === '/admin/login';

  const menuItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', href: '/admin/bookings', icon: CalendarRange },
    { label: 'Leads CRM', href: '/admin/leads', icon: TrendingUp },
    { label: 'Vehicles Fleet', href: '/admin/vehicles', icon: Car },
    { label: 'Drivers DB', href: '/admin/drivers', icon: UserCheck },
    { label: 'Tour Packages', href: '/admin/packages', icon: MapPin },
    { label: 'Reviews Approval', href: '/admin/reviews', icon: Star },
    { label: 'Promo Banners', href: '/admin/banners', icon: Image },
    { label: 'FAQs CRUD', href: '/admin/faqs', icon: HelpCircle },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="bg-slate-900 text-white py-4 px-4 flex items-center justify-between md:hidden shadow-md">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Ananya Express" className="h-7 w-7 object-contain rounded bg-white p-0.5 shadow-sm" />
          <span className="font-bold text-sm tracking-tight uppercase font-display">Ananya Express</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded bg-slate-800 text-white hover:text-accent focus:outline-none"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`bg-slate-900 text-slate-300 w-64 shrink-0 flex flex-col justify-between transition-all duration-300 fixed inset-y-0 left-0 z-50 md:sticky md:block ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center space-x-2.5">
              <img src="/images/logo.png" alt="Ananya Express" className="h-9 w-9 object-contain rounded-lg bg-white p-0.5 shadow" />
              <div>
                <span className="font-bold text-base text-white font-display block leading-none">Ananya</span>
                <span className="text-[10px] font-semibold tracking-wider text-accent uppercase">Express</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-secondary text-white shadow'
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-accent' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-accent text-sm">
              M
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-bold text-white truncate">{adminName}</span>
              <span className="block text-[10px] text-slate-500 font-semibold uppercase">Administrator</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden md:flex bg-white border-b border-gray-200 py-4 px-8 items-center justify-between shadow-sm">
          <h2 className="text-lg font-bold text-primary font-display uppercase tracking-wider">
            Control Center
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold text-gray-500 bg-slate-100 py-1 px-3 rounded-full">
              System Live • SQLite DB
            </span>
            <span className="text-sm font-bold text-primary">
              Welcome, {adminName}
            </span>
          </div>
        </header>

        {/* Dynamic Inner Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

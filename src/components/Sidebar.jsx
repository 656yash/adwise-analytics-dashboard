import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Megaphone, Users, Package } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
    { to: '/dashboard/revenue', icon: TrendingUp, label: 'Revenue' },
    { to: '/dashboard/marketing', icon: Megaphone, label: 'Marketing' },
    { to: '/dashboard/customers', icon: Users, label: 'Customers' },
    { to: '/dashboard/products', icon: Package, label: 'Products' },
  ];

  return (
    <aside className="!fixed left-6 top-6 bottom-6 w-64 sidebar-gradient glass-panel p-6 flex flex-col z-50">
      <div className="mb-12 flex items-center gap-3 px-2">
        <img src="/adwise-logo.svg" alt="Adwise Logo" className="w-8 h-8 object-contain" onError={(e) => e.target.style.display='none'} />
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Adwise</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium',
                isActive
                  ? 'sidebar-active text-slate-900'
                  : 'text-slate-700 hover:bg-white/20 hover:text-slate-900'
              )
            }
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/20">
        <div className="flex items-center gap-3 px-4 py-3">
          <img src="/adwise-logo.svg" alt="Admin" className="w-10 h-10 rounded-full object-contain bg-white shadow-sm p-1" onError={(e) => e.target.style.display='none'} />
          <div>
            <p className="text-sm font-bold text-slate-800">Admin User</p>
            <p className="text-xs text-slate-600">admin@adwise.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

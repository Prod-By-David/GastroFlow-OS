\'use client\';

import React from \'react\';
import { useRestaurant } from \'@/context/RestaurantContext\';
import { LayoutGrid, ChefHat, Settings } from \'lucide-react\';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, kdsOrders } = useRestaurant();

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl text-slate-950 font-black shadow-lg shadow-emerald-500/20">
          🍽️
        </div>
        <span className="text-xl font-bold tracking-tight text-white">GastroFlow <span className="text-emerald-400 font-light">OS</span></span>
      </div>

      <nav className="flex space-x-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab(\'salon\')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl font-medium transition-all ${
            activeTab === \'salon\' ? \'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20\' : \'text-slate-400 hover:text-white\'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Salón y Mesas</span>
        </button>

        <button
          onClick={() => setActiveTab(\'kds\')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl font-medium transition-all relative ${
            activeTab === \'kds\' ? \'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20\' : \'text-slate-400 hover:text-white\'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Cocina (KDS)</span>
          {kdsOrders.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
              {kdsOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab(\'config\')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl font-medium transition-all ${
            activeTab === \'config\' ? \'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20\' : \'text-slate-400 hover:text-white\'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configuración</span>
        </button>
      </nav>
    </header>
  );
};
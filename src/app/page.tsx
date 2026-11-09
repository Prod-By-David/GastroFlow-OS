\'use client\';

import React from \'react\';
import { useRestaurant } from \'@/context/RestaurantContext\';
import { Navbar } from \'@/components/Navbar\';
import { SalonView } from \'@/components/SalonView\';
import { KdsView } from \'@/components/KdsView\';
import { ConfigView } from \'@/components/ConfigView\';

export default function Home() {
  const { activeTab } = useRestaurant();

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === \'salon\' && <SalonView />}
        {activeTab === \'kds\' && <KdsView />}
        {activeTab === \'config\' && <ConfigView />}
      </div>
    </main>
  );
}
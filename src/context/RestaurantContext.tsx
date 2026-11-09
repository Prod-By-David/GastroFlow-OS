\'use client\';

import React, { createContext, useContext, useState, useEffect } from \'react\';
import { Zone, Table, Dish, KdsOrder, OrderItem } from \'@/types\';

interface RestaurantContextType {
  zones: Zone[];
  tables: Table[];
  menu: Dish[];
  kdsOrders: KdsOrder[];
  activeTab: \'salon\' | \'kds\' | \'config\';
  setActiveTab: (tab: \'salon\' | \'kds\' | \'config\') => void;
  addZone: (name: string) => void;
  updateZone: (id: string, name: string) => void;
  deleteZone: (id: string) => void;
  addTable: (number: number, zoneId: string, capacity: number) => void;
  updateTable: (id: string, number: number, zoneId: string, capacity: number) => void;
  deleteTable: (id: string) => void;
  addDish: (dish: Omit<Dish, \'id\'>) => void;
  updateDish: (dish: Dish) => void;
  deleteDish: (id: string) => void;
  updateTableOrder: (tableId: string, items: OrderItem[], status: \'libre\' | \'ocupada\') => void;
  updateKdsStatus: (orderId: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zones, setZones] = useState<Zone[]>([
    { id: \'1\', name: \'Salón Principal\' },
    { id: \'2\', name: \'Terraza\' },
  ]);

  const [tables, setTables] = useState<Table[]>([
    { id: \'t1\', number: 1, zoneId: \'1\', status: \'libre\', capacity: 4 },
    { id: \'t2\', number: 2, zoneId: \'1\', status: \'ocupada\', capacity: 2, activeOrder: [{ dishId: \'d1\', name: \'Croquetas Caseras\', price: 8.5, quantity: 2 }] },
    { id: \'t3\', number: 3, zoneId: \'2\', status: \'libre\', capacity: 6 },
  ]);

  const [menu, setMenu] = useState<Dish[]>([
    { id: \'d1\', name: \'Croquetas Caseras\', category: \'entrantes\', price: 8.5, description: \'Croquetas cremosas de jamón ibérico.\' },
    { id: \'d2\', name: \'Entrecot de Vaca\', category: \'principales\', price: 22.0, description: \'Maduración de 45 días con patatas rústicas.\' },
    { id: \'d3\', name: \'Tarta de Queso\', category: \'postres\', price: 6.5, description: \'Horneada al estilo de la casa.\' },
    { id: \'d4\', name: \'Vino Tinto Crianza\', category: \'bebidas\', price: 15.0, description: \'Denominación de Origen Rioja.\' },
  ]);

  const [kdsOrders, setKdsOrders] = useState<KdsOrder[]>([
    { id: \'k1\', tableNumber: 2, items: [{ dishId: \'d1\', name: \'Croquetas Caseras\', price: 8.5, quantity: 2 }], time: \'Hace 5 min\', status: \'pendiente\' }
  ]);

  const [activeTab, setActiveTab] = useState<\'salon\' | \'kds\' | \'config\'>(\'salon\');

  useEffect(() => {
    const savedZones = localStorage.getItem(\'gastro_zones\');
    const savedTables = localStorage.getItem(\'gastro_tables\');
    const savedMenu = localStorage.getItem(\'gastro_menu\');
    if (savedZones) setZones(JSON.parse(savedZones));
    if (savedTables) setTables(JSON.parse(savedTables));
    if (savedMenu) setMenu(JSON.parse(savedMenu));
  }, []);

  useEffect(() => {
    localStorage.setItem(\'gastro_zones\', JSON.stringify(zones));
    localStorage.setItem(\'gastro_tables\', JSON.stringify(tables));
    localStorage.setItem(\'gastro_menu\', JSON.stringify(menu));
  }, [zones, tables, menu]);

  const addZone = (name: string) => {
    if (!name.trim()) return;
    setZones(prev => [...prev, { id: Date.now().toString(), name }]);
  };

  const updateZone = (id: string, name: string) => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, name } : z));
  };

  const deleteZone = (id: string) => {
    setZones(prev => prev.filter(z => z.id !== id));
    setTables(prev => prev.filter(t => t.zoneId !== id));
  };

  const addTable = (number: number, zoneId: string, capacity: number) => {
    setTables(prev => [...prev, { id: Date.now().toString(), number, zoneId, status: \'libre\', capacity }]);
  };

  const updateTable = (id: string, number: number, zoneId: string, capacity: number) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, number, zoneId, capacity } : t));
  };

  const deleteTable = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
  };

  const addDish = (dish: Omit<Dish, \'id\'>) => {
    setMenu(prev => [...prev, { id: Date.now().toString(), ...dish }]);
  };

  const updateDish = (updatedDish: Dish) => {
    setMenu(prev => prev.map(d => d.id === updatedDish.id ? updatedDish : d));
  };

  const deleteDish = (id: string) => {
    setMenu(prev => prev.filter(d => d.id !== id));
  };

  const updateTableOrder = (tableId: string, items: OrderItem[], status: \'libre\' | \'ocupada\') => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status, activeOrder: status === \'ocupada\' ? items : undefined } : t));

    if (status === \'ocupada\' && items.length > 0) {
      const newOrder: KdsOrder = {
        id: Date.now().toString(),
        tableNumber: table.number,
        items,
        time: \'Justo ahora\',
        status: \'pendiente\'
      };
      setKdsOrders(prev => [newOrder, ...prev]);
    }
  };

  const updateKdsStatus = (orderId: string) => {
    setKdsOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <RestaurantContext.Provider value={{
      zones, tables, menu, kdsOrders, activeTab, setActiveTab,
      addZone, updateZone, deleteZone, addTable, updateTable, deleteTable,
      addDish, updateDish, deleteDish, updateTableOrder, updateKdsStatus
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) throw new Error(\'useRestaurant debe usarse dentro de un RestaurantProvider\');
  return context;
};
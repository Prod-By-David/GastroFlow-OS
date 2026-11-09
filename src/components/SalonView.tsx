\'use client\';

import React, { useState } from \'react\';
import { useRestaurant } from \'@/context/RestaurantContext\';
import { Table, OrderItem } from \'@/types\';
import { Users, Plus, Trash2, CheckCircle2, X } from \'lucide-react\';

export const SalonView: React.FC = () => {
  const { zones, tables, menu, updateTableOrder } = useRestaurant();
  const [selectedZone, setSelectedZone] = useState<string>(zones[0]?.id || \'\');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);

  const filteredTables = tables.filter(t => t.zoneId === (selectedZone || zones[0]?.id));

  const handleOpenTable = (table: Table) => {
    setSelectedTable(table);
    setCurrentOrder(table.activeOrder ? [...table.activeOrder] : []);
  };

  const handleAddDishToOrder = (dishId: string) => {
    const dish = menu.find(d => d.id === dishId);
    if (!dish) return;

    setCurrentOrder(prev => {
      const existing = prev.find(item => item.dishId === dishId);
      if (existing) {
        return prev.map(item => item.dishId === dishId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { dishId: dish.id, name: dish.name, price: dish.price, quantity: 1 }];
    });
  };

  const handleRemoveItem = (dishId: string) => {
    setCurrentOrder(prev => {
      const existing = prev.find(item => item.dishId === dishId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.dishId === dishId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.dishId !== dishId);
    });
  };

  const handleSaveOrder = (status: \'libre\' | \'ocupada\') => {
    if (!selectedTable) return;
    updateTableOrder(selectedTable.id, currentOrder, status);
    setSelectedTable(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        {zones.map(zone => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            className={`px-5 py-2.5 rounded-2xl font-semibold transition-all text-sm whitespace-nowrap ${
              (selectedZone || zones[0]?.id) === zone.id
                ? \'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20\'
                : \'bg-slate-900 text-slate-400 hover:text-white border border-slate-800\'
            }`}
          >
            {zone.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map(table => {
          const isOccupied = table.status === \'ocupada\';
          const total = table.activeOrder?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

          return (
            <div
              key={table.id}
              onClick={() => handleOpenTable(table)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-48 shadow-lg relative overflow-hidden group ${
                isOccupied
                  ? \'bg-amber-950/20 border-amber-500/50 hover:border-amber-400 shadow-amber-950/20\'
                  : \'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 shadow-slate-950/40\'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white">Mesa {table.number}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isOccupied ? \'bg-amber-500/20 text-amber-400 border border-amber-500/30\' : \'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30\'
                }`}>
                  {table.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-slate-400 text-sm space-x-1.5">
                  <Users className="w-4 h-4" />
                  <span>Capacidad: {table.capacity} comensales</span>
                </div>
                {isOccupied && (
                  <div className="text-emerald-400 font-bold text-lg">
                    {total.toFixed(2)} €
                  </div>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity from-emerald-500 to-teal-400" />
            </div>
          );
        })}

        {filteredTables.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-3xl">
            No hay mesas registradas en esta zona. Ve a Configuración para añadir mesas.
          </div>
        )}
      </div>

      {selectedTable && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div>
                <h3 className="text-xl font-bold text-white">Mesa {selectedTable.number}</h3>
                <p className="text-slate-400 text-sm">Gestionar comanda y estado</p>
              </div>
              <button
                onClick={() => setSelectedTable(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-hidden">
              <div className="p-6 border-r border-slate-800 overflow-y-auto space-y-4">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">Carta Rápida</h4>
                <div className="space-y-2">
                  {menu.map(dish => (
                    <div
                      key={dish.id}
                      onClick={() => handleAddDishToOrder(dish.id)}
                      className="p-3 bg-slate-950/40 border border-slate-800 hover:border-emerald-500/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">{dish.name}</div>
                        <div className="text-xs text-slate-500">{dish.price.toFixed(2)} €</div>
                      </div>
                      <div className="bg-slate-800 p-2 rounded-xl text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between overflow-y-auto bg-slate-950/20">
                <div className="space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider">Comanda Actual</h4>
                  {currentOrder.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      Ningún plato añadido todavía.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentOrder.map(item => (
                        <div key={item.dishId} className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
                          <div>
                            <div className="font-semibold text-white text-sm">{item.name}</div>
                            <div className="text-xs text-emerald-400">{(item.price * item.quantity).toFixed(2)} €</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-bold text-slate-300">x{item.quantity}</span>
                            <button
                              onClick={() => handleRemoveItem(item.dishId)}
                              className="text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-800 space-y-4 mt-6">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-emerald-400">
                      {currentOrder.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)} €
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSaveOrder(\'libre\')}
                      className="py-3 px-4 rounded-2xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm"
                    >
                      Liberar Mesa
                    </button>
                    <button
                      onClick={() => handleSaveOrder(\'ocupada\')}
                      disabled={currentOrder.length === 0}
                      className="py-3 px-4 rounded-2xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors disabled:opacity-55 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enviar a Cocina</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
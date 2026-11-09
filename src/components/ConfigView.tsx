\'use client\';

import React, { useState } from \'react\';
import { useRestaurant } from \'@/context/RestaurantContext\';
import { Plus, Trash2, Utensils, LayoutGrid, Layers } from \'lucide-react\';
import { DishCategory } from \'@/types\';

export const ConfigView: React.FC = () => {
  const {
    zones, tables, menu,
    addZone, deleteZone,
    addTable, deleteTable,
    addDish, deleteDish
  } = useRestaurant();

  const [newZoneName, setNewZoneName] = useState(\'\');
  const [newTableNumber, setNewTableNumber] = useState(\'\');
  const [newTableZoneId, setNewTableZoneId] = useState(zones[0]?.id || \'\');
  const [newTableCapacity, setNewTableCapacity] = useState(\'4\');

  const [newDishName, setNewDishName] = useState(\'\');
  const [newDishCategory, setNewDishCategory] = useState<DishCategory>(\'entrantes\');
  const [newDishPrice, setNewDishPrice] = useState(\'\');
  const [newDishDesc, setNewDishDesc] = useState(\'\');

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;
    addZone(newZoneName);
    setNewZoneName(\'\');
  };

  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(newTableNumber);
    const cap = parseInt(newTableCapacity);
    const zoneId = newTableZoneId || zones[0]?.id;
    if (isNaN(num) || !zoneId) return;
    addTable(num, zoneId, cap);
    setNewTableNumber(\'\');
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newDishPrice);
    if (!newDishName.trim() || isNaN(price)) return;
    addDish({
      name: newDishName,
      category: newDishCategory,
      price,
      description: newDishDesc
    });
    setNewDishName(\'\');
    setNewDishPrice(\'\');
    setNewDishDesc(\'\');
  };

  return (
    <div className="space-y-10 pb-12">
      <div>
        <h2 className="text-2xl font-black text-white">Configuración del Sistema</h2>
        <p className="text-slate-400 text-sm">Gestiona zonas, mesas y carta del restaurante</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Zonas del Local</h3>
          </div>

          <form onSubmit={handleCreateZone} className="space-y-3">
            <input
              type="text"
              placeholder="Nombre de la zona (ej. Terraza)"
              value={newZoneName}
              onChange={e => setNewZoneName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all text-sm flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Zona</span>
            </button>
          </form>

          <div className="space-y-2">
            {zones.map(zone => (
              <div key={zone.id} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                <span className="font-medium text-slate-200 text-sm">{zone.name}</span>
                <button
                  onClick={() => deleteZone(zone.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Mesas</h3>
          </div>

          <form onSubmit={handleCreateTable} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Nº Mesa"
                value={newTableNumber}
                onChange={e => setNewTableNumber(e.target.value)}
                className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                placeholder="Capacidad"
                value={newTableCapacity}
                onChange={e => setNewTableCapacity(e.target.value)}
                className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <select
              value={newTableZoneId || zones[0]?.id}
              onChange={e => setNewTableZoneId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all text-sm flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Mesa</span>
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {tables.map(table => {
              const zone = zones.find(z => z.id === table.zoneId);
              return (
                <div key={table.id} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200 text-sm">Mesa {table.number}</div>
                    <div className="text-xs text-slate-500">{zone?.name || \'Sin zona\'} · {table.capacity} comensales</div>
                  </div>
                  <button
                    onClick={() => deleteTable(table.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Carta</h3>
          </div>

          <form onSubmit={handleCreateDish} className="space-y-3">
            <input
              type="text"
              placeholder="Nombre del plato"
              value={newDishName}
              onChange={e => setNewDishName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={newDishCategory}
                onChange={e => setNewDishCategory(e.target.value as DishCategory)}
                className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="entrantes">Entrantes</option>
                <option value="principales">Principales</option>
                <option value="postres">Postres</option>
                <option value="bebidas">Bebidas</option>
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Precio (€)"
                value={newDishPrice}
                onChange={e => setNewDishPrice(e.target.value)}
                className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all text-sm flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Plato</span>
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {menu.map(dish => (
              <div key={dish.id} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                <div>
                  <div className="font-medium text-slate-200 text-sm">{dish.name}</div>
                  <div className="text-xs text-emerald-400">{dish.price.toFixed(2)} € · <span className="capitalize">{dish.category}</span></div>
                </div>
                <button
                  onClick={() => deleteDish(dish.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
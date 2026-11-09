\'use client\';

import React from \'react\';
import { useRestaurant } from \'@/context/RestaurantContext\';
import { CheckCircle2, Clock } from \'lucide-react\';

export const KdsView: React.FC = () => {
  const { kdsOrders, updateKdsStatus } = useRestaurant();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Pantalla de Cocina (KDS)</h2>
          <p className="text-slate-400 text-sm">Comandas activas en tiempo real</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl text-slate-300 text-sm font-semibold">
          Pendientes: <span className="text-emerald-400">{kdsOrders.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kdsOrders.map(order => (
          <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xl font-bold text-white">Mesa {order.tableNumber}</span>
              <div className="flex items-center space-x-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{order.time}</span>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                  <span className="font-semibold text-slate-200 text-sm">{item.name}</span>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    x{item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => updateKdsStatus(order.id)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Marcar como Listo</span>
            </button>
          </div>
        ))}

        {kdsOrders.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 border border-dashed border-slate-800 rounded-3xl">
            No hay comandas pendientes en cocina. ¡Todo al día!
          </div>
        )}
      </div>
    </div>
  );
};
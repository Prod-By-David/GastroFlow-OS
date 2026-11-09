export type Zone = {
  id: string;
  name: string;
};

export type TableStatus = 'libre' | 'ocupada';

export type OrderItem = {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
};

export type Table = {
  id: string;
  number: number;
  zoneId: string;
  status: TableStatus;
  capacity: number;
  activeOrder?: OrderItem[];
};

export type DishCategory = 'entrantes' | 'principales' | 'postres' | 'bebidas';

export type Dish = {
  id: string;
  name: string;
  category: DishCategory;
  price: number;
  description: string;
};

export type KdsOrder = {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  time: string;
  status: 'pendiente' | 'listo';
};
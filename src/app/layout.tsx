import type { Metadata } from \'next\';
import { Inter } from \'next/font/google\';
import \'./globals.css\';
import { RestaurantProvider } from \'@/context/RestaurantContext\';

const inter = Inter({ subsets: [\'latin\'] });

export const metadata: Metadata = {
  title: \'GastroFlow OS - Sistema de Comandas y Mesas\',
  description: \'Sistema operativo de hostelería de ultra baja latencia\',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <RestaurantProvider>
          {children}
        </RestaurantProvider>
      </body>
    </html>
  );
}
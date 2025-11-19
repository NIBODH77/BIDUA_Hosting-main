import { Outlet } from 'react-router-dom';
import { Header } from '../components/public/Header';
import { Footer } from '../components/public/Footer';
import { MobileBottomNav } from '../components/public/MobileBottomNav';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.tsx';
import { Footer } from './Footer.tsx';
import { MobileBottomNav } from './MobileBottomNav.tsx';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-screen bg-[#08090d] pb-16 md:pb-0">
    <Navbar />
    <main>{children ?? <Outlet />}</main>
    <Footer />
    <MobileBottomNav />
  </div>
);

export default Layout;
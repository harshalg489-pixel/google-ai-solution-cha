import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Layout({ children, activeSection, setActiveSection }: LayoutProps) {
  return (
    <div className="flex h-screen bg-bg text-text-main font-sans selection:bg-accent-high/30">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeSection={activeSection} />
        <main className="flex-1 overflow-y-auto p-4 gap-4 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

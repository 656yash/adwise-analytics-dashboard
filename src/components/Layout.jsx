import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-pink-soft/40 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-sky/40 rounded-full blur-3xl pointer-events-none" />
      
      <Sidebar />
      
      <main className="pl-[20rem] pr-6 py-6 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileMenu from "../components/MobileMenu";
import CommandPalette from "../components/CommandPalette";

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">

      {/* Top Navbar */}
      <Navbar
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="min-w-0 overflow-x-hidden">
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
          <Outlet />
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette />

    </div>
  );
}
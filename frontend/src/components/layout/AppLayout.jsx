import React from 'react';
import { Outlet } from 'react-router-dom';
import { GovTopBar } from './GovTopBar';
import { GovHeader } from './GovHeader';
import { GovNavbar } from './GovNavbar';
import { GovFooter } from './GovFooter';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      <GovTopBar />
      <GovHeader />
      <GovNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      <GovFooter />
    </div>
  );
};

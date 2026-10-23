import { Outlet, createRootRoute, Link } from '@tanstack/react-router'

import '../styles.css'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2 mb-6">
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
            PDF Tools Kit
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
            Fitur Analisis Dokumen
          </h1>
          <p className="text-zinc-500 max-w-md mx-auto text-sm">
            Olah dokumen PDF secara aman dan mudah menggunakan utilitas berbasis browser dan AI.
          </p>
        </header>

        {/* Tab Navigation */}
        <nav className="flex justify-center gap-2 p-1 bg-zinc-200/60 rounded-xl max-w-md mx-auto">
          <Link
            to="/compare"
            className="flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all text-zinc-600 [&.active]:bg-white [&.active]:text-zinc-900 [&.active]:shadow-sm"
          >
            Bandingkan PDF
          </Link>
          <Link
            to="/analyze"
            className="flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all text-zinc-600 [&.active]:bg-white [&.active]:text-zinc-900 [&.active]:shadow-sm"
          >
            Analisis AI
          </Link>
        </nav>

        {/* Dynamic Route Content */}
        <main className="space-y-6">
          <Outlet />
        </main>

      </div>
    </div>
  ),
})

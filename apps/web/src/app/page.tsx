import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-6xl">&#9971;</div>
        <h1 className="text-4xl font-bold text-dark-50 mb-3">
          GolfBet <span className="text-golf-400">Pro</span>
        </h1>
        <p className="text-lg text-dark-400 mb-8 max-w-md">
          Apuestas sociales de golf entre amigos. Nassau, Skins, Match Play y mas.
        </p>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/auth?mode=register" className="btn-primary text-center text-lg">
            Crear Cuenta
          </Link>
          <Link href="/auth?mode=login" className="btn-secondary text-center">
            Iniciar Sesion
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-golf-600/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-golf-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xs text-dark-400 text-center">Tiempo Real</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-dark-400 text-center">Auto Liquidacion</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs text-dark-400 text-center">Funciona Offline</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-dark-600 text-xs">
        GolfBet Pro v1.0 &copy; 2026
      </footer>
    </div>
  );
}

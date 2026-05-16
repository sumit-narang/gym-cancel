import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 text-lg no-underline">
          <span className="text-2xl">🏋️</span>
          GymCancel
          <span className="text-xs font-normal text-slate-400 ml-1">Dublin</span>
        </Link>
        <p className="text-sm text-slate-500 hidden sm:block">
          Find out how hard it is to leave your gym before you join.
        </p>
      </div>
    </header>
  )
}

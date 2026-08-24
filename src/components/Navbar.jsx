import { useState, useRef, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { HelpCircle, User, LogIn, LogOut, Menu, X, HeartHandshake } from 'lucide-react'
import logo from '../assests/TrustLogo.png'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/platform', label: 'C³ Platform' },
  { to: '/events', label: 'News & Events' },
  {to:'/donate', label:'Donate'},
]

export default function Navbar() {
  const { user, loading, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinkClasses = ({ isActive }) =>
    `relative py-2 transition-colors ${isActive ? 'text-brand-navy' : 'text-brand-text/80 hover:text-brand-navy'} ` +
    `after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-red after:transition-all ` +
    (isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full')

  return (
    <header
      className={`bg-white/95 backdrop-blur-sm border-b transition-shadow ${
        scrolled ? 'border-brand-border shadow-[0_1px_12px_rgba(23,35,60,0.06)]' : 'border-brand-border/70'
      }`}
    >
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center shrink-0">
          <img src={logo} alt="NextGen Education Trust" className="h-14 w-[84px] object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-[0.9rem] font-medium tracking-wide">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">

            {!loading && (
              user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full p-0.5 pr-2 hover:bg-brand-surface transition-colors"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    title={user.email}
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-navy/10 flex items-center justify-center text-brand-navy">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-56 bg-white border border-brand-border rounded-xl shadow-lg py-2 z-20"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        role="menuitem"
                        className="block px-4 py-2 border-b border-brand-border hover:bg-brand-surface transition-colors"
                      >
                        <p className="text-sm font-semibold text-brand-text truncate">
                          {user.user_metadata?.full_name || 'Profile'}
                        </p>
                        <p className="text-xs text-brand-muted truncate">{user.email}</p>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false)
                          signOut()
                        }}
                        role="menuitem"
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-text hover:bg-brand-surface hover:text-brand-red transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy border border-brand-navy/30 px-3.5 py-1.5 rounded-full hover:border-brand-navy hover:bg-brand-surface transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
              )
            )}
          </div>

          <Link
            to="/contact"
            className="hidden md:inline-flex bg-brand-red text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm hover:bg-brand-redDark hover:shadow-md transition-all"
          >
            Contact Us
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-brand-text hover:bg-brand-surface transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-brand-border bg-white px-6 py-4 space-y-4">
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 transition-colors ${
                    isActive ? 'bg-brand-surface text-brand-navy' : 'text-brand-text/80 hover:bg-brand-surface'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {!loading && user && (
            <div className="pt-2 border-t border-brand-border">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-2 rounded-lg hover:bg-brand-surface transition-colors"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-navy/10 flex items-center justify-center text-brand-navy shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-text truncate">
                    {user.user_metadata?.full_name || 'Profile'}
                  </p>
                  <p className="text-xs text-brand-muted truncate">{user.email}</p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  signOut()
                }}
                className="w-full flex items-center gap-2 py-2 text-sm font-medium text-brand-text hover:text-brand-red transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-brand-border">
            {!loading && !user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-navy border border-brand-navy/30 px-3.5 py-2 rounded-full"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            )}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex-1 inline-flex items-center justify-center bg-brand-red text-white text-sm font-semibold px-5 py-2 rounded-full"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

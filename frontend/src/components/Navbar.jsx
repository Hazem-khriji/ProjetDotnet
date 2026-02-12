import { useState, useEffect } from 'react'
import logo from '/assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="absolute top-0 left-0 w-full z-10">
      <div className="w-full flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-gray-900">
        <img src={logo} alt="logo"/>
        <ul className="hidden md:flex gap-7 text-white">
          <a href="#Header" className="cursor-pointer hover:text-gray-400">Home</a>
          <a href="#About" className="cursor-pointer hover:text-gray-400">About</a>
          <Link to="/properties" className="cursor-pointer hover:text-gray-400">Properties</Link>
          <a href="#Testimonials" className="cursor-pointer hover:text-gray-400">Testimonials</a>
        </ul>
        {isAuthenticated && user ? (
          <div className="hidden md:flex items-center gap-4 text-white">
            <span className="text-sm">Welcome, {user.firstName}!</span>
            <button 
              onClick={handleLogout}
              className="bg-white text-gray-900 px-6 py-2 rounded-full cursor-pointer hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden md:flex gap-3">
            <Link to="/signin">
              <button className="bg-transparent border border-white text-white px-6 py-2 rounded-full cursor-pointer hover:bg-white hover:text-gray-900">
                Sign in
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-white text-gray-900 px-6 py-2 rounded-full cursor-pointer hover:bg-gray-200">
                Sign up
              </button>
            </Link>
          </div>
        )}
        
      </div>
      <div className={`md:hidden ${showMobileMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 overflow-hidden bg-white transition-all`}>
        <div className="flex justify-end p-6 cursor-pointer">
          <img
            src="data:image/svg+xml,%3csvg%20width='50'%20height='50'%20viewBox='0%200%2050%2050'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_7625_1251)'%3e%3cpath%20d='M46.6175%200L25%2021.6902L3.38257%200L0.0722656%203.29969L21.7009%2025.0004L0.0722656%2046.7018L3.38257%2050L25%2028.3105L46.6175%2050L49.9278%2046.7018L28.2991%2025.0004L49.9278%203.29969L46.6175%200Z'%20fill='black'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_7625_1251'%3e%3crect%20width='50'%20height='50'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
            className="w-6" 
            alt="close"
            onClick={() => setShowMobileMenu(false)}
          />
        </div>
        <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
          <a href="#Header" className="px-4 py2 rounded-full inline-block" onClick={() => setShowMobileMenu(false)}>Home</a>
          <a href="#About" className="px-4 py2 rounded-full inline-block" onClick={() => setShowMobileMenu(false)}>About</a>
          <a href="#Projects" className="px-4 py2 rounded-full inline-block" onClick={() => setShowMobileMenu(false)}>Projects</a>
          <a href="#Testimonials" className="px-4 py2 rounded-full inline-block" onClick={() => setShowMobileMenu(false)}>Testimonials</a>
        </ul>
      </div>
    </div>
  )
}

export default Navbar


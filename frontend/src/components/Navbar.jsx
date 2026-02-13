import { useState, useEffect } from 'react'
import logo from '/assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { inquiryService } from '@/lib/api'

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [inquiryCount, setInquiryCount] = useState(0)
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    // Fetch inquiry count for agents
    if (isAuthenticated && user?.roles?.includes('Agent')) {
      fetchInquiryCount()
      // Refresh count every 30 seconds
      const interval = setInterval(fetchInquiryCount, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, user])

  const fetchInquiryCount = async () => {
    try {
      const response = await inquiryService.getMyPropertyInquiries({ pageSize: 1 })
      setInquiryCount(response.totalCount || 0)
    } catch (error) {
      console.error('Failed to fetch inquiry count:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isAgent = user?.roles?.includes('Agent')

  return (
    <div className="absolute top-0 left-0 w-full z-10">
      <div className="w-full flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-gray-900">
        <img src={logo} alt="logo"/>
        <ul className="hidden md:flex gap-7 text-white">
          <Link to="/" className="cursor-pointer hover:text-gray-400">Home</Link>
          <a href="#About" className="cursor-pointer hover:text-gray-400">About</a>
          <Link to="/properties" className="cursor-pointer hover:text-gray-400">Properties</Link>
          <a href="#Testimonials" className="cursor-pointer hover:text-gray-400">Testimonials</a>
        </ul>
        {isAuthenticated && user ? (
          <div className="hidden md:flex items-center gap-4 text-white">
            {isAgent && (
              <>
                <Link to="/agent/properties" className="relative hover:opacity-80 transition-opacity" title="My Properties">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-6 h-6"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" 
                    />
                  </svg>
                </Link>
                <Link to="/agent/inquiries" className="relative hover:opacity-80 transition-opacity" title="Inquiries">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-6 h-6"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" 
                    />
                  </svg>
                  {inquiryCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {inquiryCount > 99 ? '99+' : inquiryCount}
                    </span>
                  )}
                </Link>
              </>
            )}
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
          <Link to="/properties" className="px-4 py2 rounded-full inline-block" onClick={() => setShowMobileMenu(false)}>Properties</Link>
          <a href="#Testimonials" className="px-4 py2 rounded-full inline-block" onClick={() => setShowMobileMenu(false)}>Testimonials</a>
          {isAuthenticated &&    (
            <Link to="/admin/statistics" className="px-4 py-2 rounded-full inline-block flex items-center gap-2" onClick={() => setShowMobileMenu(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Admin Dashboard
            </Link>
          )}
          {isAuthenticated && isAgent && (
            <>
              <Link to="/agent/properties" className="px-4 py-2 rounded-full inline-block flex items-center gap-2" onClick={() => setShowMobileMenu(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                My Properties
              </Link>
              <Link to="/agent/inquiries" className="px-4 py-2 rounded-full inline-block flex items-center gap-2" onClick={() => setShowMobileMenu(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Inquiries {inquiryCount > 0 && `(${inquiryCount})`}
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Navbar


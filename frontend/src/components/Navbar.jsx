import { useState } from 'react'
import logo from '/assets/logo.svg'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <div className="absolute top-0 left-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-transparent">
        <img src={logo} alt="logo"/>
        <ul className="hidden md:flex gap-7 text-white">
          <a href="#Header" className="cursor-pointer hover:text-gray-400">Home</a>
          <a href="#About" className="cursor-pointer hover:text-gray-400">About</a>
          <a href="#Projects" className="cursor-pointer hover:text-gray-400">Projects</a>
          <a href="#Testimonials" className="cursor-pointer hover:text-gray-400">Testimonials</a>
        </ul>
        <Link to="/signup"><button className="hidden md:block bg-white px-8 py-2 rounded-full cursor-pointer">Sign up</button></Link>
        
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


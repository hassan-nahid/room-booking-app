import { Outlet, useLocation } from "react-router"
import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer";

const MainLayouts = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Dynamic padding based on navbar state
  const showLargeNavbar = isHomePage && !scrolled;
  const paddingClass = showLargeNavbar ? "pt-40" : "pt-20";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Navbar/>
      <div className={`${paddingClass} min-h-dvh transition-all duration-300`}>
        <Outlet></Outlet>
      </div>
      <Footer/>
    </div>
  )
}

export default MainLayouts
 
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [toggleNav, setToggleNav] = useState(true);
  useEffect(() => {
    const handleToggle = () => {
      window.scrollY > 50 ? setToggleNav(true) : setToggleNav(false);
    };

    window.addEventListener("scroll", handleToggle);

    return () => {
      window.removeEventListener("scroll", handleToggle);
    };
  }, []);

  if (location.pathname === "/login" || location.pathname === "/signup")
    return (
      <div
        className={`w-full container ${
          toggleNav ? "h-20 bg-zinc-900 opactiy-75" : "h-28"
        }  flex items-center justify-center fixed transition-all ease-in-out duration-300 z-50`}
      >
        <div className="flex items-center justify-center gap-3">
          <img width={50} src={logo} alt="logo" />
          <p className="nunito text-3xl mb-3">pingme</p>
        </div>
      </div>
    );
}

export default Navbar;

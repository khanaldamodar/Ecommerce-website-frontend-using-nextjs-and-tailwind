"use client";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "All Products", href: "/products" },
    { name: "Bastu Saman", href: "/bastu-samagri" },
    { name: "Gems", href: "/gems" },
    { name: "Jyotish Sewa", href: "/jyotish-sewa" },
  ];

  // Helper to read cookies on client side
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  useEffect(() => {
    const cartCookie = getCookie("cart");
    if (cartCookie) {
      try {
        const cart = JSON.parse(decodeURIComponent(cartCookie));
        // Sum all quantities if structure is [{productId, quantity}, ...]
        const totalCount = cart.reduce(
          (sum: number, item: { quantity: number }) => sum + (item.quantity || 1),
          0
        );
        setCartCount(totalCount);
      } catch (error) {
        console.error("Failed to parse cart cookie", error);
      }
    } else {
      setCartCount(0);
    }
  }, []);

  return (
    <nav className="bg-brand shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-xl font-bold text-white">Jyotish Shop</div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block ">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:bg-white hover:text-brand px-3 py-2 rounded-md text-medium font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className=" relative md:block hidden">
            <a
              href="/cart"
              className="text-white hover:bg-white hover:text-brand px-3 py-2 rounded-md text-medium font-medium transition-colors duration-200 inline-flex items-center"
            >
              <svg
                className="h-6 w-6 inline-block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l1.4-7H5.6L7 13zm-4 0a2 2 0 11-4 0 2 2 0 014 0zm16 0a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Cart count badge */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </a>
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white hover:text-brand focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            {/* Cart for the Mobile  */}
             <div className=" relative md:hidden ">
            <a
              href="/cart"
              className="text-white hover:bg-white hover:text-brand px-3 py-2 rounded-md text-medium font-medium transition-colors duration-200 inline-flex items-center"
            >
              <svg
                className="h-6 w-6 inline-block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l1.4-7H5.6L7 13zm-4 0a2 2 0 11-4 0 2 2 0 014 0zm16 0a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Cart count badge */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </a>
          </div>
             

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-orange-200">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-brand hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 font-poppins "
              onClick={() => setIsOpen(false)} // Close menu when item is clicked
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { m } from "framer-motion";
import {
  Menu,
  X,
  Heart,
  Plus,
  User,
  LogOut,
  Search,
  Home,
  Package,
  Upload,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navigationLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/display", label: "Browse", icon: Package },
    { href: "/upload", label: "Sell", icon: Upload, primary: true },
  ];

  const userMenuItems = [
    { href: "/Profile", label: "My Profile", icon: User },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    { href: "/upload", label: "Sell Item", icon: Plus },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  const isActivePath = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Sell it Dude Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 lg:w-12 lg:h-12 transition-transform duration-200 group-hover:scale-105"
                  priority
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
                Sell it Dude!
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActivePath(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      link.primary
                        ? "bg-primary text-white hover:bg-primary-dark shadow-sm"
                        : isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* User Menu / Auth */}
            <div className="hidden lg:flex items-center gap-4">
              {status === "loading" ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full skeleton" />
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                      {session.user?.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <m.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </m.div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/sign-in"
                    className="text-gray-600 hover:text-primary font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link href="/sign-in" className="btn btn-primary px-4 py-2">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-2">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isActivePath(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        link.primary
                          ? "bg-primary text-white"
                          : isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}

                {session ? (
                  <>
                    <hr className="my-4" />
                    <div className="px-4 py-2">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          {session.user?.image ? (
                            <Image
                              src={session.user.image}
                              alt="Profile"
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {session.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.user?.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      );
                    })}

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <hr className="my-4" />
                    <Link
                      href="/sign-in"
                      className="flex items-center justify-center w-full py-3 text-primary font-medium border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </m.div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;

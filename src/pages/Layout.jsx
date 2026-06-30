import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Settings, Globe, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/entities/User";
import { AppSettings } from "@/entities/AppSettings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageContext } from "@/components/LanguageContext";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    loadUser();
    loadCompanyDetails();
  }, []);

  const loadUser = async () => {
    try {
      const user = await UserEntity.me();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    }
  };

  const loadCompanyDetails = async () => {
    try {
      const settings = await AppSettings.filter({ key: "company_details" });
      if (settings.length > 0) {
        setCompanyDetails(settings[0].value);
      }
    } catch (error) {
      console.error("Error loading company details:", error);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'he' : 'en');
  };

  const navigationItems = [
    {
      title: language === 'he' ? 'נכסים' : 'Properties',
      url: createPageUrl("Properties"),
      icon: Building2,
    },
    ...(isAdmin ? [{
      title: language === 'he' ? 'ניהול' : 'Admin',
      url: createPageUrl("Admin"),
      icon: Settings,
    }] : [])
  ];

  const handleLogin = () => {
    // Send the user to the admin area, which shows the username/password form.
    navigate(createPageUrl("Admin"));
  };

  const handleLogout = async () => {
    await UserEntity.logout();
    setCurrentUser(null);
    navigate(createPageUrl("Properties"));
  };

  const languageValue = { language, toggleLanguage };

  if (!companyDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={languageValue}>
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${language === 'he' ? 'rtl' : 'ltr'}`}>
        <style>
          {`
            .rtl {
              direction: rtl;
            }
            .ltr {
              direction: ltr;
            }
          `}
        </style>

        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to={createPageUrl("Properties")} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    {language === 'he' ? companyDetails.company_name_he : companyDetails.company_name}
                  </h1>
                  <p className="text-xs text-slate-500">
                    {language === 'he' ? companyDetails.tagline_he : companyDetails.tagline}
                  </p>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === item.url
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </nav>

              {/* Language & User Menu */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'he' ? 'עברית' : 'English'}</span>
                </Button>

                {currentUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">{currentUser.full_name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleLogout}>
                        {language === 'he' ? 'התנתק' : 'Logout'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button size="sm" onClick={handleLogin}>
                    {language === 'he' ? 'התחבר' : 'Login'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">
                    {language === 'he' ? companyDetails.company_name_he : companyDetails.company_name}
                  </h3>
                </div>
                <p className="text-slate-300 text-sm">
                  {language === 'he'
                    ? companyDetails.tagline_he
                    : companyDetails.tagline
                  }
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">
                  {language === 'he' ? 'שירותים' : 'Services'}
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>{language === 'he' ? 'מכירת נכסים' : 'Property Sales'}</li>
                  <li>{language === 'he' ? 'השכרת נכסים' : 'Property Rentals'}</li>
                  <li>{language === 'he' ? 'ייעוץ נדל"ן' : 'Real Estate Consulting'}</li>
                  <li>{language === 'he' ? 'שיווק נכסים' : 'Property Marketing'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">
                  {language === 'he' ? 'צור קשר' : 'Contact'}
                </h4>
                <div className="text-sm text-slate-300 space-y-2">
                  <p><span dir="ltr">{companyDetails.contact_email}</span></p>
                  <p><span dir="ltr">{companyDetails.contact_phone}</span></p>
                  <p>{language === 'he' ? companyDetails.address_he : companyDetails.address}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
              <p>© 2024 {companyDetails.company_name}. {language === 'he' ? 'כל הזכויות שמורות' : 'All rights reserved'}.</p>
            </div>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
}

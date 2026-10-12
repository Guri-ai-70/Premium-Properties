import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Settings, Globe, User, Building2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/entities/User";
import { AppSettings } from "@/entities/AppSettings";
import { displayPhone, telHref } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageContext } from "@/components/LanguageContext";

const LANGUAGE_KEY = "pp_language";

// Quiet header controls: text-weight, 44px tall, no filled buttons competing with the page.
const headerControl =
  "inline-flex min-h-11 items-center gap-2 rounded-[4px] px-3 text-[15px] font-medium text-stone-700 transition-colors hover:bg-stone-200/60 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  // Default to Hebrew; remember the visitor's last choice across reloads.
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      return saved === 'en' || saved === 'he' ? saved : 'he';
    } catch {
      return 'he';
    }
  });
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    loadUser();
    loadCompanyDetails();
  }, []);

  // Keep <html lang/dir> in sync so the browser, screen readers and native
  // controls (select lists, scrollbars) all follow the chosen language.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // Storage unavailable (private mode) — language just won't persist.
    }
  }, [language]);

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

  const siteName = companyDetails
    ? (language === 'he' ? companyDetails.company_name_he : companyDetails.company_name)
    : '';
  const languageValue = { language, toggleLanguage, siteName };

  if (!companyDetails) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-100 text-stone-600" role="status">
        {language === 'he' ? 'טוען...' : 'Loading...'}
      </div>
    );
  }

  const t = (en, he) => (language === 'he' ? he : en);

  return (
    <LanguageContext.Provider value={languageValue}>
      <div className={`min-h-screen bg-stone-100 text-ink ${language === 'he' ? 'rtl' : 'ltr'}`}>
        {/* Skip link: first Tab stop, jumps past the header to the page content */}
        <a
          href="#main-content"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('main-content')?.focus();
          }}
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[60] focus:rounded-[4px] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-panel focus:outline-none focus:ring-2 focus:ring-brass"
        >
          {t('Skip to main content', 'מעבר לתוכן הראשי')}
        </a>

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-100/95 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* Wordmark */}
            <Link
              to={createPageUrl("Properties")}
              className="rounded-[4px] font-display text-[22px] font-bold leading-none text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:text-2xl"
            >
              {siteName}
            </Link>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Navigation */}
              <nav className="hidden items-center gap-1 md:flex" aria-label={t('Main', 'ראשי')}>
                {navigationItems.map((item) => {
                  const active = location.pathname === item.url.replace(/^#/, '');
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      aria-current={active ? 'page' : undefined}
                      className={`${headerControl} ${active ? 'text-ink underline decoration-brass decoration-2 underline-offset-[10px]' : ''}`}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </nav>

              <span className="mx-1 hidden h-5 w-px bg-stone-300 md:block" aria-hidden="true" />

              <button type="button" onClick={toggleLanguage} className={headerControl}>
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span lang={language === 'he' ? 'en' : 'he'}>{language === 'he' ? 'English' : 'עברית'}</span>
              </button>

              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={headerControl}
                      aria-label={`${currentUser.full_name} – ${t('user menu', 'תפריט משתמש')}`}
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{currentUser.full_name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate(createPageUrl("Admin"))} className="md:hidden">
                        {t('Admin', 'ניהול')}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      {t('Logout', 'התנתקות')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  type="button"
                  onClick={handleLogin}
                  className={headerControl}
                  aria-label={t('Admin login', 'כניסת מנהל')}
                >
                  <LogIn className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                  <span className="hidden sm:inline">{t('Login', 'התחברות')}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-ink text-stone-300">
          <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
            <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <p className="font-display text-3xl font-bold text-stone-50">{siteName}</p>
                <p className="mt-3 max-w-xs text-stone-400">
                  {t(companyDetails.tagline, companyDetails.tagline_he)}
                </p>
              </div>
              <div>
                <h2 className="mb-4 text-sm font-semibold text-brass-light">
                  {t('Contact', 'צרו קשר')}
                </h2>
                <ul className="space-y-1">
                  <li>
                    <a
                      href={`mailto:${companyDetails.contact_email}`}
                      dir="ltr"
                      className="inline-flex min-h-11 items-center underline-offset-4 hover:text-stone-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-light"
                    >
                      {companyDetails.contact_email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={telHref(companyDetails.contact_phone)}
                      dir="ltr"
                      className="inline-flex min-h-11 items-center tabular-nums underline-offset-4 hover:text-stone-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-light"
                    >
                      {displayPhone(companyDetails.contact_phone, language)}
                    </a>
                  </li>
                  <li className="pt-2 text-stone-400">{t(companyDetails.address, companyDetails.address_he)}</li>
                </ul>
              </div>
              <div>
                <h2 className="mb-4 text-sm font-semibold text-brass-light">
                  {t('Services', 'שירותים')}
                </h2>
                <ul className="space-y-3 text-stone-400">
                  <li>{t('Property Sales', 'מכירת נכסים')}</li>
                  <li>{t('Property Rentals', 'השכרת נכסים')}</li>
                  <li>{t('Real Estate Consulting', 'ייעוץ נדל"ן')}</li>
                  <li>{t('Property Marketing', 'שיווק נכסים')}</li>
                </ul>
              </div>
            </div>
            <div className="mt-14 flex flex-col gap-2 border-t border-stone-700/60 pt-6 text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} {siteName}. {t('All rights reserved', 'כל הזכויות שמורות')}.</p>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  to={createPageUrl("Accessibility")}
                  className="inline-flex min-h-11 items-center font-medium text-stone-200 underline decoration-stone-600 underline-offset-4 hover:text-white hover:decoration-brass-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-light"
                >
                  {t('Accessibility statement', 'הצהרת נגישות')}
                </Link>
                <p>{t('Demo site: all listings and details are fictional.', 'אתר הדגמה: כל הנכסים והפרטים באתר בדויים.')}</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
}

import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/pages/Layout";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import Admin from "@/pages/Admin";
import Accessibility from "@/pages/Accessibility";
import ScrollManager from "@/components/ScrollManager";

// Let ScrollManager own scroll position instead of the browser's own restore.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Derives the current page name from the path so Layout can highlight nav.
function currentPageName(pathname) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg || "Properties";
}

export default function App() {
  const location = useLocation();
  return (
    <Layout currentPageName={currentPageName(location.pathname)}>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Navigate to="/Properties" replace />} />
        <Route path="/Properties" element={<Properties />} />
        <Route path="/PropertyDetail" element={<PropertyDetail />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Accessibility" element={<Accessibility />} />
        <Route path="*" element={<Navigate to="/Properties" replace />} />
      </Routes>
    </Layout>
  );
}

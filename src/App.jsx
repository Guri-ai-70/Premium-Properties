import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/pages/Layout";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import Admin from "@/pages/Admin";

// Derives the current page name from the path so Layout can highlight nav.
function currentPageName(pathname) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg || "Properties";
}

export default function App() {
  const location = useLocation();
  return (
    <Layout currentPageName={currentPageName(location.pathname)}>
      <Routes>
        <Route path="/" element={<Navigate to="/Properties" replace />} />
        <Route path="/Properties" element={<Properties />} />
        <Route path="/PropertyDetail" element={<PropertyDetail />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/Properties" replace />} />
      </Routes>
    </Layout>
  );
}

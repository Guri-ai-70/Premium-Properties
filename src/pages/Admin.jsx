import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Property } from "@/entities/Property";
import { User } from "@/entities/User";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/components/LanguageContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Lock,
  Upload,
  ImagePlus,
  AlertTriangle,
} from "lucide-react";

const EMPTY = {
  title: "",
  title_he: "",
  description: "",
  description_he: "",
  price: "",
  currency: "₪",
  listing_type: "sale",
  property_type: "apartment",
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  city: "",
  city_he: "",
  address: "",
  address_he: "",
  images: [],
  featured: false,
  exclusive: false,
  status: "available",
};

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB per uploaded image

export default function Admin() {
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);

  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [properties, setProperties] = useState([]);
  const [editing, setEditing] = useState(null); // null = list, "new" or id = form
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // property pending deletion

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);

  const load = async () => setProperties(await Property.list("-created_date"));

  useEffect(() => {
    (async () => {
      try {
        const user = await User.me();
        setIsAdmin(user.role === "admin");
      } catch {
        setIsAdmin(false);
      }
      setAuthChecked(true);
      load();
    })();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      await User.login(username, password);
      // Reload so the header (Layout) also reflects the logged-in admin.
      window.location.reload();
    } catch (err) {
      setLoginError(t("Invalid username or password.", "שם משתמש או סיסמה שגויים."));
      setLoggingIn(false);
    }
  };

  if (!authChecked) {
    return <div className="py-20 text-center text-slate-500">{t("Loading...", "טוען...")}</div>;
  }

  // ---- Login gate ----
  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t("Admin Login", "כניסת מנהל")}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t("Sign in to manage properties.", "התחברו לניהול הנכסים.")}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t("Username", "שם משתמש")}</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Password", "סיסמה")}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {loginError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loggingIn}>
              {loggingIn ? t("Signing in...", "מתחבר...") : t("Sign In", "התחברות")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to={createPageUrl("Properties")} className="text-sm text-slate-500 hover:text-slate-700">
              {t("← Back to Properties", "← חזרה לנכסים")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---- Form helpers ----
  const openNew = () => {
    setForm({ ...EMPTY, images: [] });
    setEditing("new");
  };

  const openEdit = (p) => {
    setForm({ ...EMPTY, ...p, images: Array.isArray(p.images) ? [...p.images] : [] });
    setEditing(p.id);
  };

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const addImageUrl = () => {
    const url = (urlInputRef.current?.value || "").trim();
    if (!url) return;
    set("images", [...form.images, url]);
    if (urlInputRef.current) urlInputRef.current.value = "";
  };

  const addImageFiles = (fileList) => {
    const files = Array.from(fileList || []);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > MAX_IMAGE_BYTES) {
        window.alert(
          t(
            `"${file.name}" is larger than 2 MB. Please use a smaller image or paste a URL instead.`,
            `"${file.name}" גדול מ-2 מ"ב. השתמשו בתמונה קטנה יותר או הדביקו קישור.`
          )
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = () =>
        setForm((f) => ({ ...f, images: [...f.images, reader.result] }));
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      area: Number(form.area) || 0,
      images: Array.isArray(form.images) ? form.images : [],
    };
    try {
      if (editing === "new") await Property.create(payload);
      else await Property.update(editing, payload);
      setEditing(null);
      load();
    } catch (err) {
      const quota =
        err?.name === "QuotaExceededError" ||
        /quota/i.test(err?.message || "");
      window.alert(
        quota
          ? t(
              "Storage is full — uploaded photos are too large to save. Remove a few images or use image URLs instead.",
              "האחסון מלא — התמונות שהועלו גדולות מדי. הסירו כמה תמונות או השתמשו בקישורים."
            )
          : t("Could not save the property.", "לא ניתן היה לשמור את הנכס.")
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await Property.delete(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  // ---- Form view ----
  if (editing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            {editing === "new" ? t("New Property", "נכס חדש") : t("Edit Property", "עריכת נכס")}
          </h1>
          <Button variant="ghost" size="icon" onClick={() => setEditing(null)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("Title (EN)", "כותרת (אנגלית)")}>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </Field>
            <Field label={t("Title (HE)", "כותרת (עברית)")}>
              <Input value={form.title_he} onChange={(e) => set("title_he", e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("Description (EN)", "תיאור (אנגלית)")}>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
            <Field label={t("Description (HE)", "תיאור (עברית)")}>
              <Textarea value={form.description_he} onChange={(e) => set("description_he", e.target.value)} />
            </Field>
          </div>

          {/* Price / Listing / Type row (dropdowns unchanged) */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t("Price", "מחיר")}>
              <Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} required />
            </Field>
            <Field label={t("Listing", "סוג עסקה")}>
              <Select
                value={form.listing_type}
                onChange={(e) => set("listing_type", e.target.value)}
                options={[
                  { value: "sale", label: t("For Sale", "למכירה") },
                  { value: "rent", label: t("For Rent", "להשכרה") },
                ]}
              />
            </Field>
            <Field label={t("Type", "סוג נכס")}>
              <Select
                value={form.property_type}
                onChange={(e) => set("property_type", e.target.value)}
                options={[
                  { value: "apartment", label: t("Apartment", "דירה") },
                  { value: "house", label: t("House", "בית") },
                  { value: "villa", label: t("Villa", "וילה") },
                  { value: "commercial", label: t("Commercial", "מסחרי") },
                  { value: "land", label: t("Land", "קרקע") },
                ]}
              />
            </Field>
          </div>

          {/* Exclusive (בבלעדיות) — sits with the Price/Listing/Type row */}
          <label className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <input
              type="checkbox"
              checked={!!form.exclusive}
              onChange={(e) => set("exclusive", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-amber-500"
            />
            <span className="text-sm font-semibold text-amber-800">
              {t("Exclusive listing", "נכס בבלעדיות")}{" "}
              <span className="font-normal text-amber-600">
                {t("(בבלעדיות — shown as a gold badge)", "(מוצג כתג זהב)")}
              </span>
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t("Bedrooms", "חדרי שינה")}>
              <Input type="number" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
            </Field>
            <Field label={t("Bathrooms", "חדרי רחצה")}>
              <Input type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
            </Field>
            <Field label={t("Area (m²)", "שטח (מ\"ר)")}>
              <Input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("City (EN)", "עיר (אנגלית)")}>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label={t("City (HE)", "עיר (עברית)")}>
              <Input value={form.city_he} onChange={(e) => set("city_he", e.target.value)} />
            </Field>
            <Field label={t("Address (EN)", "כתובת (אנגלית)")}>
              <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field label={t("Address (HE)", "כתובת (עברית)")}>
              <Input value={form.address_he} onChange={(e) => set("address_he", e.target.value)} />
            </Field>
          </div>

          {/* Image manager: upload from computer + add by URL, each removable */}
          <div className="space-y-3">
            <Label>{t("Photos", "תמונות")}</Label>

            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {form.images.map((src, i) => (
                  <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      title={t("Remove", "הסרה")}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white opacity-90 shadow hover:bg-red-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {t("Cover", "ראשי")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addImageFiles(e.target.files)}
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                {t("Upload from computer", "העלאה מהמחשב")}
              </Button>
              <div className="flex flex-1 items-center gap-2">
                <Input
                  ref={urlInputRef}
                  placeholder={t("…or paste an image URL", "…או הדביקו קישור לתמונה")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addImageUrl}>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {t("Add", "הוספה")}
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {t(
                "The first photo is used as the cover. Uploaded images are stored in the browser (keep them under ~2 MB).",
                "התמונה הראשונה משמשת כתמונה ראשית. תמונות שהועלו נשמרות בדפדפן (עד כ-2 מ\"ב)."
              )}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("Status", "סטטוס")}>
              <Select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                options={[
                  { value: "available", label: t("Available", "זמין") },
                  { value: "sold", label: t("Sold", "נמכר") },
                  { value: "rented", label: t("Rented", "הושכר") },
                ]}
              />
            </Field>
            <label className="flex items-end gap-2 pb-2">
              <input
                type="checkbox"
                checked={!!form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">
                {t("Featured property", "נכס מומלץ")}
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? t("Saving...", "שומר...") : t("Save Property", "שמירת נכס")}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              {t("Cancel", "ביטול")}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // ---- List view ----
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t("Manage Properties", "ניהול נכסים")}
          </h1>
          <p className="text-sm text-slate-500">
            {properties.length} {t("total listings", "נכסים בסך הכל")}
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t("Add Property", "הוספת נכס")}
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">{t("Property", "נכס")}</th>
                <th className="px-4 py-3">{t("Type", "סוג")}</th>
                <th className="px-4 py-3">{t("Price", "מחיר")}</th>
                <th className="px-4 py-3">{t("Status", "סטטוס")}</th>
                <th className="px-4 py-3 text-right">{t("Actions", "פעולות")}</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=200&q=60"}
                        alt=""
                        className="h-10 w-14 rounded object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{p.title}</span>
                          {p.exclusive && <Badge variant="exclusive">{t("Exclusive", "בבלעדיות")}</Badge>}
                        </div>
                        <div className="text-xs text-slate-500">{p.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">{p.property_type}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {formatPrice(p.price, p.currency, p.listing_type, language)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === "available" ? "success" : "secondary"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteTarget(p)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete confirmation frame */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">
              {t("Are you sure you want to delete?", "האם אתה בטוח שברצונך למחוק?")}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {t(
                `"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`,
                `"${deleteTarget?.title}" יימחק לצמיתות. לא ניתן לבטל פעולה זו.`
              )}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            {t("Cancel", "ביטול")}
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("Delete", "מחיקה")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

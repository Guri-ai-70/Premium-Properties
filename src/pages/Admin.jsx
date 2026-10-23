import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Property } from "@/entities/Property";
import { User } from "@/entities/User";
import { createPageUrl } from "@/utils";
import { useLanguage, usePageTitle } from "@/components/LanguageContext";
import StatusBadges from "@/components/StatusBadges";
import { formatPrice, sizedImage } from "@/lib/utils";
import { getRooms, FEATURES, propertyTypeLabel, PLACEHOLDER_IMAGE } from "@/lib/propertyFeatures";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  ImagePlus,
  AlertTriangle,
  ArrowLeft,
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
  rooms: "",
  bathrooms: 0,
  area: 0,
  floor: "",
  total_floors: "",
  parking: "",
  master_suite: false,
  elevator: false,
  balcony: false,
  safe_room: false,
  storage: false,
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

// Native checkboxes, sized up and tinted to the palette.
const checkbox = "h-5 w-5 shrink-0 rounded-[2px] border-stone-400 accent-ink";

// A titled group of form fields.
function FormSection({ title, children }) {
  return (
    <fieldset className="border-t border-stone-300 pt-6">
      <legend className="float-start mb-5 w-full font-display text-xl font-bold text-ink">{title}</legend>
      <div className="clear-both space-y-5">{children}</div>
    </fieldset>
  );
}

export default function Admin() {
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);

  const statusLabel = (v) =>
    ({
      available: t("Available", "זמין"),
      sold: t("Sold", "נמכר"),
      rented: t("Rented", "הושכר"),
    }[v] || v);

  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [properties, setProperties] = useState([]);
  const [editing, setEditing] = useState(null); // null = list, "new" or id = form
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({}); // field key -> message, shown inline
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // property pending deletion
  const [notice, setNotice] = useState(""); // message shown in an in-page dialog

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);
  const formRef = useRef(null);

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

  usePageTitle(
    !authChecked
      ? ""
      : !isAdmin
      ? t("Admin Login", "כניסת מנהל")
      : editing === "new"
      ? t("New Property", "נכס חדש")
      : editing
      ? t("Edit Property", "עריכת נכס")
      : t("Manage Properties", "ניהול נכסים")
  );

  if (!authChecked) {
    return (
      <div className="py-20 text-center text-stone-600" role="status">
        {t("Loading...", "טוען...")}
      </div>
    );
  }

  // ---- Login gate ----
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="font-display text-4xl font-bold text-ink">
          {t("Admin Login", "כניסת מנהל")}
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          {t("Sign in to manage properties.", "התחברו לניהול הנכסים.")}
        </p>

        <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5 border-t border-stone-300 pt-8">
          <div className="space-y-1.5">
            <Label htmlFor="admin-username">{t("Username", "שם משתמש")}</Label>
            <Input
              id="admin-username"
              dir="ltr"
              aria-invalid={loginError ? true : undefined}
              aria-describedby={loginError ? "login-error" : undefined}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">{t("Password", "סיסמה")}</Label>
            <Input
              id="admin-password"
              dir="ltr"
              aria-invalid={loginError ? true : undefined}
              aria-describedby={loginError ? "login-error" : undefined}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {loginError && (
            <p id="login-error" role="alert" className="flex items-center gap-2 rounded-[4px] bg-red-50 px-3 py-2.5 text-red-800 ring-1 ring-inset ring-red-200">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {loginError}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loggingIn}>
            {loggingIn ? t("Signing in...", "מתחברים...") : t("Sign In", "התחברות")}
          </Button>
        </form>

        <Link
          to={createPageUrl("Properties")}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[4px] text-[15px] font-medium text-stone-600 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          {t("Back to properties", "חזרה לנכסים")}
        </Link>
      </div>
    );
  }

  // ---- Form helpers ----
  const openNew = () => {
    setForm({ ...EMPTY, images: [] });
    setErrors({});
    setEditing("new");
  };

  const openEdit = (p) => {
    setForm({
      ...EMPTY,
      ...p,
      // Older properties have no room count yet: suggest bedrooms + 1.
      rooms: p.rooms ?? getRooms(p) ?? "",
      images: Array.isArray(p.images) ? [...p.images] : [],
    });
    setErrors({});
    setEditing(p.id);
  };

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear a field's error as soon as it is edited.
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

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
        setNotice(
          t(
            `"${file.name}" is larger than 2 MB. Please use a smaller image or paste a URL instead.`,
            `"⁨${file.name}⁩" גדול מ-2 מ"ב. השתמשו בתמונה קטנה יותר או הדביקו קישור.`
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

  // Required fields, checked in the page language (replaces the browser's own bubbles).
  const validate = () => {
    const next = {};
    if (!String(form.title || "").trim()) {
      next.title = t("Enter a title in English.", "יש להזין כותרת באנגלית.");
    }
    if (form.price === "" || form.price === null || Number.isNaN(Number(form.price))) {
      next.price = t("Enter a price in numbers.", "יש להזין מחיר במספרים.");
    } else if (Number(form.price) < 0) {
      next.price = t("The price cannot be negative.", "המחיר לא יכול להיות שלילי.");
    }
    return next;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Move focus to the first field with an error so it is announced.
      requestAnimationFrame(() => {
        formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      rooms: form.rooms === "" ? null : Number(form.rooms),
      floor: form.floor === "" ? null : Number(form.floor),
      total_floors: form.total_floors === "" ? null : Number(form.total_floors),
      parking: form.parking === "" ? null : Number(form.parking),
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
      setNotice(
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

  // Message dialog (replaces browser alerts, follows the page language/direction)
  const noticeDialog = (
    <Modal open={!!notice} onClose={() => setNotice("")} labelledBy="notice-text">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-stone-200 text-brass-dark">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <p id="notice-text" className="flex-1 pt-2 text-stone-700">{notice}</p>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={() => setNotice("")}>{t("OK", "אישור")}</Button>
      </div>
    </Modal>
  );

  const errorCount = Object.values(errors).filter(Boolean).length;

  // ---- Form view ----
  if (editing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="inline-flex min-h-11 items-center gap-2 rounded-[4px] text-[15px] font-medium text-stone-600 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              {t("All listings", "כל הנכסים")}
            </button>
            <h1 className="mt-2 font-display text-4xl font-bold text-ink">
              {editing === "new" ? t("New Property", "נכס חדש") : t("Edit Property", "עריכת נכס")}
            </h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setEditing(null)} aria-label={t("Close", "סגירה")}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {errorCount > 0 && (
          <p role="alert" className="mb-6 flex items-center gap-2 rounded-[4px] bg-red-50 px-4 py-3 font-medium text-red-800 ring-1 ring-inset ring-red-200">
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
            {errorCount === 1
              ? t("1 field needs attention.", "שדה אחד דורש תיקון.")
              : t(`${errorCount} fields need attention.`, `${errorCount} שדות דורשים תיקון.`)}
          </p>
        )}

        <form ref={formRef} onSubmit={handleSave} noValidate className="space-y-10">
          <FormSection title={t("Listing details", "פרטי הנכס")}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("Title (EN)", "כותרת (אנגלית)")} required error={errors.title} t={t}>
                <Input dir="ltr" value={form.title} onChange={(e) => set("title", e.target.value)} />
              </Field>
              <Field label={t("Title (HE)", "כותרת (עברית)")}>
                <Input dir="rtl" value={form.title_he} onChange={(e) => set("title_he", e.target.value)} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("Description (EN)", "תיאור (אנגלית)")}>
                <Textarea dir="ltr" value={form.description} onChange={(e) => set("description", e.target.value)} />
              </Field>
              <Field label={t("Description (HE)", "תיאור (עברית)")}>
                <Textarea dir="rtl" value={form.description_he} onChange={(e) => set("description_he", e.target.value)} />
              </Field>
            </div>
          </FormSection>

          <FormSection title={t("Deal and price", "עסקה ומחיר")}>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label={t("Price (₪)", "מחיר (₪)")} required error={errors.price} t={t}>
                <Input type="number" dir="ltr" min="0" inputMode="numeric" value={form.price} onChange={(e) => set("price", e.target.value)} />
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
                    { value: "garden_apartment", label: t("Garden Apartment", "דירת גן") },
                    { value: "duplex", label: t("Duplex", "דופלקס") },
                    { value: "penthouse", label: t("Penthouse", "פנטהאוז") },
                    { value: "mini_penthouse", label: t("Mini Penthouse", "מיני פנטהאוז") },
                    { value: "house", label: t("House", "בית") },
                    { value: "villa", label: t("Villa", "וילה") },
                    { value: "commercial", label: t("Commercial", "מסחרי") },
                    { value: "plot", label: t("Plot", "מגרש") },
                  ]}
                />
              </Field>
            </div>

            {/* Exclusive (בבלעדיות) */}
            <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[4px] bg-white px-4 py-3 ring-1 ring-inset ring-brass/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brass">
              <input
                type="checkbox"
                checked={!!form.exclusive}
                onChange={(e) => set("exclusive", e.target.checked)}
                className={`${checkbox} accent-brass-dark`}
              />
              <span className="font-semibold text-ink">
                {t("Exclusive listing", "נכס בבלעדיות")}{" "}
                <span className="font-normal text-stone-600">
                  {t("(shown as a brass “Exclusive” badge)", "(מוצג בתג ״בבלעדיות״ בצבע נחושת)")}
                </span>
              </span>
            </label>
          </FormSection>

          <FormSection title={t("Size and layout", "גודל וחלוקה")}>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label={t("Rooms (incl. living room)", "חדרים (כולל סלון)")}>
                <Input type="number" dir="ltr" min="0" step="0.5" value={form.rooms} onChange={(e) => set("rooms", e.target.value)} />
              </Field>
              <Field label={t("Bathrooms", "חדרי רחצה")}>
                <Input type="number" dir="ltr" min="0" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
              </Field>
              <Field label={t("Area (m²)", "שטח (מ\"ר)")}>
                <Input type="number" dir="ltr" min="0" value={form.area} onChange={(e) => set("area", e.target.value)} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label={t("Floor (0 = ground)", "קומה (0 = קרקע)")}>
                <Input type="number" dir="ltr" min="0" value={form.floor} onChange={(e) => set("floor", e.target.value)} />
              </Field>
              <Field label={t("Floors in building", "מספר קומות בבניין")}>
                <Input type="number" dir="ltr" min="0" value={form.total_floors} onChange={(e) => set("total_floors", e.target.value)} />
              </Field>
              <Field label={t("Parking spots", "חניות")}>
                <Input type="number" dir="ltr" min="0" value={form.parking} onChange={(e) => set("parking", e.target.value)} />
              </Field>
            </div>

            <fieldset>
              <legend className="mb-2 text-[15px] font-medium text-stone-700">{t("Features", "מאפיינים")}</legend>
              <div className="grid gap-x-6 sm:grid-cols-3">
                {FEATURES.map((f) => (
                  <label key={f.key} className="flex min-h-11 cursor-pointer items-center gap-3 text-ink">
                    <input
                      type="checkbox"
                      checked={!!form[f.key]}
                      onChange={(e) => set(f.key, e.target.checked)}
                      className={checkbox}
                    />
                    {t(f.en, f.he)}
                  </label>
                ))}
              </div>
            </fieldset>
          </FormSection>

          <FormSection title={t("Location", "מיקום")}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("City (EN)", "עיר (אנגלית)")}>
                <Input dir="ltr" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </Field>
              <Field label={t("City (HE)", "עיר (עברית)")}>
                <Input dir="rtl" value={form.city_he} onChange={(e) => set("city_he", e.target.value)} />
              </Field>
              <Field label={t("Address (EN)", "כתובת (אנגלית)")}>
                <Input dir="ltr" value={form.address} onChange={(e) => set("address", e.target.value)} />
              </Field>
              <Field label={t("Address (HE)", "כתובת (עברית)")}>
                <Input dir="rtl" value={form.address_he} onChange={(e) => set("address_he", e.target.value)} />
              </Field>
            </div>
          </FormSection>

          {/* Image manager: upload from computer + add by URL, each removable */}
          <FormSection title={t("Photos", "תמונות")}>
            {form.images.length > 0 && (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {form.images.map((src, i) => (
                  <li key={i} className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-stone-200">
                    <img src={sizedImage(src, 400)} alt="" className="h-full w-full object-cover" />
                    <Button
                      type="button"
                      variant="overlay"
                      size="icon"
                      onClick={() => removeImage(i)}
                      aria-label={t(`Remove photo ${i + 1}`, `הסרת תמונה ${i + 1}`)}
                      // Keeps its darker fill, red "remove" hover and light-brass ring with no gap on the photo.
                      className="absolute end-1.5 top-1.5 bg-ink/80 hover:bg-red-700 focus-visible:ring-brass-light focus-visible:ring-offset-0"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 start-1.5 rounded-[2px] bg-ink/90 px-2 py-0.5 text-[13px] font-semibold text-white">
                        {t("Cover", "ראשית")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addImageFiles(e.target.files)}
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="me-2 h-4 w-4" aria-hidden="true" />
                {t("Upload from computer", "העלאה מהמחשב")}
              </Button>
              <div className="flex min-w-[16rem] flex-1 items-center gap-2">
                <Input
                  dir="auto"
                  ref={urlInputRef}
                  aria-label={t("Image URL", "קישור לתמונה")}
                  placeholder={t("…or paste an image URL", "…או הדביקו קישור לתמונה")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addImageUrl}>
                  <ImagePlus className="me-2 h-4 w-4" aria-hidden="true" />
                  {t("Add", "הוספה")}
                </Button>
              </div>
            </div>
            <p className="text-[15px] text-stone-600">
              {t(
                "The first photo is used as the cover. Uploaded images are stored in the browser (keep them under ~2 MB).",
                "התמונה הראשונה משמשת כתמונה ראשית. תמונות שהועלו נשמרות בדפדפן (עד כ-2 מ\"ב)."
              )}
            </p>
          </FormSection>

          <FormSection title={t("Publishing", "פרסום")}>
            <div className="max-w-xs">
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
            </div>
          </FormSection>

          <div className="flex flex-wrap gap-3 border-t border-stone-300 pt-6">
            <Button type="submit" size="lg" disabled={saving}>
              {saving ? t("Saving...", "שומרים...") : t("Save Property", "שמירת נכס")}
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={() => setEditing(null)}>
              {t("Cancel", "ביטול")}
            </Button>
          </div>
        </form>
        {noticeDialog}
      </div>
    );
  }

  // ---- List view ----
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-stone-300 pb-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-ink">
            {t("Manage Properties", "ניהול נכסים")}
          </h1>
          <p className="mt-1 tabular-nums text-stone-600">
            {properties.length} {t("total listings", "נכסים בסך הכל")}
          </p>
        </div>
        <Button size="lg" onClick={openNew}>
          <Plus className="me-2 h-5 w-5" aria-hidden="true" />
          {t("Add Property", "הוספת נכס")}
        </Button>
      </div>

      {/* On the page ground, ruled like the rest of the site: no boxed card */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-start">
          <caption className="sr-only">
            {t(
              "All listings, with type, price, status and edit and delete actions",
              "כל הנכסים, עם סוג, מחיר, סטטוס ופעולות עריכה ומחיקה"
            )}
          </caption>
          <thead className="border-b border-stone-400 text-[15px] text-stone-600">
            <tr>
              <th scope="col" className="px-4 py-3 text-start font-medium">{t("Property", "נכס")}</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">{t("Type", "סוג")}</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">{t("Price", "מחיר")}</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">{t("Status", "סטטוס")}</th>
              <th scope="col" className="px-4 py-3 text-end font-medium">{t("Actions", "פעולות")}</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => {
              const title = language === "he" ? p.title_he || p.title : p.title;
              return (
                <tr key={p.id} className="border-b border-stone-300 hover:bg-stone-200/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={sizedImage(p.images?.[0] || PLACEHOLDER_IMAGE, 200)}
                        alt=""
                        className="h-14 w-20 shrink-0 rounded-[2px] object-cover"
                      />
                      <div>
                        <div className="font-semibold text-ink">{title}</div>
                        <div className="text-[15px] text-stone-600">
                          {language === "he" ? p.city_he || p.city : p.city}
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <StatusBadges property={p} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-700">{propertyTypeLabel(p.property_type, language)}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-ink">
                    {formatPrice(p.price, p.currency, p.listing_type, language)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-[15px] text-ink">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${p.status === "available" ? "bg-olive" : "bg-stone-400"}`}
                      />
                      {statusLabel(p.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(p)}
                        aria-label={t(`Edit ${p.title}`, `עריכת ${p.title_he || p.title}`)}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-700 hover:bg-red-50 hover:text-red-800"
                        onClick={() => setDeleteTarget(p)}
                        aria-label={t(`Delete ${p.title}`, `מחיקת ${p.title_he || p.title}`)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation frame */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        labelledBy="delete-title"
        describedBy="delete-desc"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 id="delete-title" className="font-display text-2xl font-bold text-ink">
              {t("Are you sure you want to delete?", "בטוחים שרוצים למחוק?")}
            </h2>
            <p id="delete-desc" className="mt-2 text-stone-700">
              {t(
                `"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`,
                `"${deleteTarget?.title_he || deleteTarget?.title}" יימחק לצמיתות. לא ניתן לבטל פעולה זו.`
              )}
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            {t("Cancel", "ביטול")}
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            <Trash2 className="me-2 h-4 w-4" aria-hidden="true" />
            {t("Delete", "מחיקה")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, children, required = false, error, t }) {
  // Links the visible label to its field so screen readers announce it, and
  // ties an inline error (page language) to the field via aria-describedby.
  const id = React.useId();
  const errorId = `${id}-error`;
  const child = React.isValidElement(children)
    ? React.cloneElement(children, {
        id,
        "aria-required": required || undefined,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })
    : children;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="ms-1 text-stone-600">{t ? t("(required)", "(חובה)") : "*"}</span>
        )}
      </Label>
      {child}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-[15px] font-medium text-red-800">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

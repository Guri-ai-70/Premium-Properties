import { BedDouble, ArrowUpDown, Sun, ShieldCheck, Warehouse } from "lucide-react";

// Israeli listings count total rooms, including the living room (3.5, 4, 5…).
// Older properties only have a bedroom count, so fall back to bedrooms + 1.
export function getRooms(property) {
  const rooms = Number(property?.rooms);
  if (property?.rooms !== undefined && property?.rooms !== null && property?.rooms !== "" && !Number.isNaN(rooms)) {
    return rooms;
  }
  const bedrooms = Number(property?.bedrooms);
  return bedrooms > 0 ? bedrooms + 1 : null;
}

// Properties that have a room count (commercial units and plots don't).
export function hasRooms(property) {
  return property?.property_type !== "commercial" && property?.property_type !== "plot";
}

// "3 of 8" / "3 מתוך 8"; floor 0 is the ground floor.
export function formatFloor(property, lang) {
  const floor = property?.floor;
  if (floor === undefined || floor === null || floor === "") return null;
  const n = Number(floor);
  const he = lang === "he";
  const label = n === 0 ? (he ? "קרקע" : "Ground") : String(n);
  const total = Number(property?.total_floors);
  if (total > 0) return he ? `${label} מתוך ${total}` : `${label} of ${total}`;
  return label;
}

// Yes/no features, in display order.
export const FEATURES = [
  { key: "master_suite", icon: BedDouble, en: "Master suite", he: "יחידת הורים" },
  { key: "elevator", icon: ArrowUpDown, en: "Elevator", he: "מעלית" },
  { key: "balcony", icon: Sun, en: "Balcony", he: "מרפסת" },
  { key: "safe_room", icon: ShieldCheck, en: "Safe room (Mamad)", he: "ממ\"ד" },
  { key: "storage", icon: Warehouse, en: "Storage room", he: "מחסן" },
];

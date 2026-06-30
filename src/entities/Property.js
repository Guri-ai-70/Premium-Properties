import { createEntity } from "./localDB";

// Real-estate listing records.
// Shape:
//   id, title, title_he, description, description_he,
//   price, currency, listing_type ("sale" | "rent"),
//   property_type ("apartment" | "house" | "villa" | "commercial" | "land"),
//   bedrooms, bathrooms, area (m2),
//   city, city_he, address, address_he,
//   images: string[] (URLs or uploaded data URLs),
//   featured: boolean, exclusive: boolean (exclusivity / "exclusive"),
//   status ("available" | "sold" | "rented"), created_date
export const Property = createEntity("properties");

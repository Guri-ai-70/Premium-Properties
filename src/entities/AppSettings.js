import { createEntity } from "./localDB";

// Stores app-wide settings as { key, value } records, matching the
// Layout's `AppSettings.filter({ key: "company_details" })` usage.
export const AppSettings = createEntity("app_settings");

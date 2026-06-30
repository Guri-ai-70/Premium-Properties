import { AppSettings } from "./AppSettings";
import { Property } from "./Property";

// Seeds first-run demo data. Safe to call on every boot: each entity only
// writes when its collection is empty.
export function seedData() {
  AppSettings._seed([
    {
      id: "SET_COMPANY",
      key: "company_details",
      value: {
        company_name: "Premium Properties",
        company_name_he: "נכסים פרימיום",
        tagline: "Luxury Real Estate, Redefined",
        tagline_he: "נדל\"ן יוקרתי, מוגדר מחדש",
        contact_email: "hello@premiumproperties.com",
        contact_phone: "+972 3-555-0199",
        address: "12 Rothschild Blvd, Tel Aviv, Israel",
        address_he: "שדרות רוטשילד 12, תל אביב, ישראל",
      },
      created_date: new Date().toISOString(),
    },
  ]);

  Property._seed([
    {
      id: "PROP_001",
      title: "Penthouse with Sea View",
      title_he: "פנטהאוז עם נוף לים",
      description:
        "A breathtaking penthouse on the Tel Aviv coastline featuring floor-to-ceiling windows, a private rooftop terrace, and panoramic Mediterranean views. Finished with imported marble and smart-home automation throughout.",
      description_he:
        "פנטהאוז עוצר נשימה על קו החוף של תל אביב עם חלונות מהרצפה עד התקרה, מרפסת גג פרטית ונוף פנורמי לים התיכון. גמור בשיש מיובא ומערכת בית חכם.",
      price: 8500000,
      currency: "₪",
      listing_type: "sale",
      property_type: "apartment",
      bedrooms: 4,
      bathrooms: 3,
      area: 220,
      city: "Tel Aviv",
      city_he: "תל אביב",
      address: "5 HaYarkon St",
      address_he: "הירקון 5",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: true,
      status: "available",
      created_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: "PROP_002",
      title: "Modern Garden Villa",
      title_he: "וילה מודרנית עם גינה",
      description:
        "Spacious family villa in a quiet Herzliya Pituach neighborhood. Open-plan living, a landscaped garden with a heated pool, and a separate guest suite. Minutes from the beach and international schools.",
      description_he:
        "וילה משפחתית מרווחת בשכונה שקטה בהרצליה פיתוח. מרחב מחיה פתוח, גינה מעוצבת עם בריכה מחוממת ויחידת אירוח נפרדת. דקות מהחוף ובתי ספר בינלאומיים.",
      price: 14900000,
      currency: "₪",
      listing_type: "sale",
      property_type: "villa",
      bedrooms: 6,
      bathrooms: 4,
      area: 380,
      city: "Herzliya",
      city_he: "הרצליה",
      address: "18 Galei Tchelet",
      address_he: "גלי תכלת 18",
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: true,
      exclusive: true,
      status: "available",
      created_date: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "PROP_003",
      title: "City-Center Loft for Rent",
      title_he: "לופט להשכרה במרכז העיר",
      description:
        "A stylish industrial loft in the heart of Jerusalem's German Colony. Exposed brick, high ceilings, and a fully equipped kitchen. Ideal for professionals seeking character and convenience.",
      description_he:
        "לופט תעשייתי מסוגנן בלב המושבה הגרמנית בירושלים. לבנים חשופות, תקרות גבוהות ומטבח מאובזר. אידיאלי לאנשי מקצוע המחפשים אופי ונוחות.",
      price: 9500,
      currency: "₪",
      listing_type: "rent",
      property_type: "apartment",
      bedrooms: 2,
      bathrooms: 1,
      area: 95,
      city: "Jerusalem",
      city_he: "ירושלים",
      address: "7 Emek Refaim",
      address_he: "עמק רפאים 7",
      images: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: false,
      status: "available",
      created_date: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: "PROP_004",
      title: "Prime Retail Space",
      title_he: "שטח מסחרי במיקום מנצח",
      description:
        "Ground-floor commercial unit on a high-footfall street in central Haifa. Large display frontage, storage area, and dedicated parking. Suited to retail, hospitality, or a flagship showroom.",
      description_he:
        "יחידה מסחרית בקומת קרקע ברחוב הומה אדם במרכז חיפה. חזית תצוגה גדולה, אזור אחסון וחניה ייעודית. מתאים לקמעונאות, אירוח או אולם תצוגה.",
      price: 4200000,
      currency: "₪",
      listing_type: "sale",
      property_type: "commercial",
      bedrooms: 0,
      bathrooms: 1,
      area: 160,
      city: "Haifa",
      city_he: "חיפה",
      address: "44 HaNevi'im",
      address_he: "הנביאים 44",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: false,
      status: "available",
      created_date: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
    {
      id: "PROP_005",
      title: "Family Apartment near the Park",
      title_he: "דירת משפחה ליד הפארק",
      description:
        "Bright, renovated 4-room apartment overlooking the park in Ramat Gan. New kitchen and bathrooms, a sunny balcony, elevator, and parking. Move-in ready in a sought-after location.",
      description_he:
        "דירת 4 חדרים מוארת ומשופצת המשקיפה לפארק ברמת גן. מטבח וחדרי רחצה חדשים, מרפסת שמש, מעלית וחניה. מוכנה לכניסה במיקום מבוקש.",
      price: 6500,
      currency: "₪",
      listing_type: "rent",
      property_type: "apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: 105,
      city: "Ramat Gan",
      city_he: "רמת גן",
      address: "21 Bialik",
      address_he: "ביאליק 21",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: false,
      status: "available",
      created_date: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
    {
      id: "PROP_006",
      title: "Hillside Stone House",
      title_he: "בית אבן על המדרון",
      description:
        "A characterful stone house nestled in the Galilee hills with sweeping valley views. Three levels, a wood-burning fireplace, mature olive grove, and a wraparound veranda. A rare countryside retreat.",
      description_he:
        "בית אבן בעל אופי בגבעות הגליל עם נוף עמק מרהיב. שלוש קומות, אח עצים, מטע זיתים ותיק ומרפסת היקפית. נחלה כפרית נדירה.",
      price: 3950000,
      currency: "₪",
      listing_type: "sale",
      property_type: "house",
      bedrooms: 5,
      bathrooms: 3,
      area: 240,
      city: "Rosh Pina",
      city_he: "ראש פינה",
      address: "3 HaHalutzim",
      address_he: "החלוצים 3",
      images: [
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: true,
      exclusive: true,
      status: "available",
      created_date: new Date(Date.now() - 16 * 86400000).toISOString(),
    },
  ]);
}

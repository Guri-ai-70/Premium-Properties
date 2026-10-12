import React from "react";
import { useLanguage, usePageTitle } from "@/components/LanguageContext";
import { AlertTriangle, Mail, Phone } from "lucide-react";

// DEMO DRAFT. Placeholder contacts only. Before this site serves a real
// business, the statement must be completed with the operator's real details
// and reviewed by a certified accessibility expert (מורשה נגישות).
const STATEMENT_CONTACT = {
  email: "demo@example.com",
  phone: "+972-3-1234567",
  phoneLocal: "03-1234567",
};
const LAST_UPDATED = new Date(2026, 9, 12); // 12 October 2026

const linkClass =
  "inline-flex min-h-11 items-center gap-2 rounded-[4px] font-semibold text-ink underline decoration-brass underline-offset-4 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";

function Section({ title, children }) {
  return (
    <section className="border-t border-stone-300 pt-8">
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-lg leading-relaxed text-stone-700">{children}</div>
    </section>
  );
}

export default function Accessibility() {
  const { language } = useLanguage();
  const he = language === "he";
  const t = (en, heText) => (he ? heText : en);
  usePageTitle(t("Accessibility statement", "הצהרת נגישות"));

  const updated = new Intl.DateTimeFormat(he ? "he-IL" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(LAST_UPDATED);

  const bullets = (items) => (
    <ul className="list-disc space-y-2 ps-6 marker:text-brass">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
        {t("Accessibility statement", "הצהרת נגישות")}
      </h1>

      <div
        role="note"
        className="mt-6 flex gap-3 rounded-[4px] bg-white px-4 py-4 text-ink ring-1 ring-inset ring-brass/60"
      >
        <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-brass-dark" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>{t("Demo draft.", "טיוטת הדגמה.")}</strong>{" "}
          {t(
            "This is a demonstration site and this statement is a draft. The contact details below are placeholders. It has not been reviewed by a certified accessibility expert.",
            "זהו אתר הדגמה וההצהרה היא טיוטה. פרטי הקשר שלהלן הם לדוגמה בלבד. ההצהרה טרם נבדקה על ידי מורשה נגישות."
          )}
        </p>
      </div>

      <p className="mt-8 text-lg leading-relaxed text-stone-700">
        {he ? (
          <>
            חשוב לנו שכל אחד ואחת, כולל אנשים עם מוגבלות, יוכלו לעיין בנכסים וליצור איתנו קשר. האתר נבנה בהתאם לתקן הישראלי ת״י 5568 (המבוסס על <bdi dir="ltr">WCAG 2.0</bdi>) ברמה <bdi dir="ltr">AA</bdi>, כנדרש בתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013.
          </>
        ) : (
          "We want everyone, including people with disabilities, to be able to browse our listings and contact us. The site is being built to meet Israeli Standard IS 5568 (based on WCAG 2.0) at level AA, as required by the Equal Rights for Persons with Disabilities (Service Accessibility Accommodations) Regulations, 2013."
        )}
      </p>

      <div className="mt-10 space-y-10">
        <Section title={t("What we have made accessible", "מה הונגש באתר")}>
          {bullets(
            he
              ? [
                  "האתר בעברית מימין לשמאל, עם אפשרות מעבר לאנגלית; שפת הדף וכיוונו מוגדרים בהתאם.",
                  "ניווט מלא במקלדת, קישור ״מעבר לתוכן הראשי״ וסימון פוקוס ברור.",
                  "כותרות במבנה היררכי, ולכל דף כותרת ייחודית.",
                  "טקסט חלופי לתמונות, ותוויות לכל שדות הטפסים.",
                  "הודעות שגיאה בשפת הדף, ליד השדה הרלוונטי, המוקראות לקוראי מסך.",
                  "ניגודיות צבעים בהתאם לדרישות התקן, והמידע אינו מועבר בצבע בלבד.",
                  "כיבוד הגדרת ״הפחתת תנועה״ של מערכת ההפעלה.",
                  "האתר אינו משתמש בתוסף נגישות חיצוני (overlay).",
                ]
              : [
                  "Hebrew right-to-left with an English option; page language and direction are set accordingly.",
                  "Full keyboard navigation, a “skip to main content” link and a clear focus indicator.",
                  "Hierarchical headings, and a unique title on every page.",
                  "Text alternatives for images, and labels on every form field.",
                  "Error messages in the page language, next to the field, announced to screen readers.",
                  "Colour contrast that meets the standard; information is never conveyed by colour alone.",
                  "The operating system's “reduce motion” setting is respected.",
                  "The site does not use an accessibility overlay plug-in.",
                ]
          )}
        </Section>

        <Section title={t("Known limitations", "מגבלות נגישות ידועות")}>
          <p>
            {t("The site was checked with automated tools and a keyboard review. A full check with screen readers (", "האתר נבדק בכלים אוטומטיים ובבדיקת מקלדת. בדיקה מלאה עם קוראי מסך (")}
            {/* Latin names isolated so the comma and brackets stay in order inside Hebrew text */}
            <bdi dir="ltr">NVDA, VoiceOver</bdi>
            {t(
              ") has not been completed yet. If you find anything that is hard to use, please tell us.",
              ") טרם הושלמה. אם נתקלתם ברכיב שקשה להשתמש בו, נשמח שתעדכנו אותנו."
            )}
          </p>
        </Section>

        <Section title={t("Report a problem or ask for an accommodation", "דיווח על בעיית נגישות או בקשת התאמה")}>
          <p>
            {t(
              "Found something that is not accessible, or need information in another format? Contact us by email or by phone:",
              "נתקלתם ברכיב שאינו נגיש, או צריכים מידע בפורמט אחר? אפשר לפנות אלינו באימייל או בטלפון:"
            )}
          </p>
          <ul className="space-y-1">
            <li>
              <a href={`mailto:${STATEMENT_CONTACT.email}`} className={linkClass}>
                <Mail className="h-5 w-5 text-brass-dark" aria-hidden="true" />
                <span dir="ltr">{STATEMENT_CONTACT.email}</span>
              </a>
            </li>
            <li>
              <a href={`tel:${STATEMENT_CONTACT.phone}`} className={linkClass}>
                <Phone className="h-5 w-5 text-brass-dark" aria-hidden="true" />
                <span dir="ltr" className="tabular-nums">
                  {he ? STATEMENT_CONTACT.phoneLocal : STATEMENT_CONTACT.phone}
                </span>
              </a>
            </li>
          </ul>
          <p>
            {t(
              "Please describe the problem, the page where it happened, and the browser and assistive technology you use.",
              "נשמח לתיאור הבעיה, הדף שבו נתקלתם בה, והדפדפן והטכנולוגיה המסייעת שבהם השתמשתם."
            )}
          </p>
        </Section>

        <Section title={t("Accessibility coordinator", "רכז/ת נגישות")}>
          <p>
            {t(
              "Not applicable to this demo site. A business required to appoint an accessibility coordinator lists their name and contact details here.",
              "לא רלוונטי לאתר ההדגמה. עסק המחויב במינוי רכז/ת נגישות יפרסם כאן את שמו/ה ופרטי הקשר."
            )}
          </p>
        </Section>
      </div>

      <p className="mt-12 border-t border-stone-300 pt-6 text-stone-600">
        {t("Statement last updated: ", "תאריך עדכון ההצהרה: ")}
        <span className="tabular-nums">{updated}</span>
      </p>
    </article>
  );
}

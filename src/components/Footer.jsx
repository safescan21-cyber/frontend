// PharmaMachineFooter.jsx
// Requirements: react-router-dom, tailwindcss, axios
// Add to tailwind.config.js => fontFamily: { barlow: ['"Barlow"','sans-serif'], barlowC: ['"Barlow Condensed"','sans-serif'] }

import { Link } from "react-router-dom";
import { useFetchAllProductsQuery } from "../components/store/products/productsApi"; // ✅ adjust path
import { useState, useEffect } from "react";
import axios from "axios";

/* ─── SVG Icons ─────────────────────────────────────────── */
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M6.62 10.79a15.45 15.45 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.59.57A1 1 0 0121 16.5v3.51A1 1 0 0120 21 17 17 0 013 4a1 1 0 011-.99H7.5A1 1 0 018.5 4a11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01L6.62 10.79z" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" />
  </svg>
);
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.486a.5.5 0 00.613.601l5.76-1.508A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.574 9.574 0 01-4.895-1.345l-.351-.208-3.62.948.972-3.51-.228-.362A9.555 9.555 0 012.4 12C2.4 6.698 6.698 2.4 12 2.4S21.6 6.698 21.6 12 17.302 21.6 12 21.6z" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </svg>
);

/* ─── Data ─────────────────────────────────────────────────── */
const NAV_PRODUCTS_FALLBACK = [
  { label: "Tablet Press Machines", to: "/products/tablet-press" },
  { label: "Capsule Filling Machines", to: "/products/capsule-filling" },
  { label: "Blister Packaging Machines", to: "/products/blister-packaging" },
];

const NAV_SERVICES = [
  { label: "Turnkey Projects", to: "/services/turnkey" },
  { label: "Custom Machine Design", to: "/services/custom-design" },
  { label: "Validation & Compliance", to: "/services/validation" },
  { label: "Installation & Commissioning", to: "/services/installation" },
  { label: "Technical Support", to: "/services/support" },
  { label: "After-Sales Service", to: "/services/aftersales" },
];

const NAV_COMPANY = [
  { label: "About PharmaMachine", to: "/about" },
  { label: "Careers", to: "/career" },
  { label: "Press & Media", to: "/press" },
];

const CERTIFICATIONS = ["ISO 9001:2015", "cGMP Compliant", "CE Marked", "FDA Approved", "GAMP 5"];

const HOURS = [
  { day: "Mon – Fri", time: "08:00 – 18:00 EST", open: true },
  { day: "Saturday", time: "09:00 – 13:00 EST", open: true },
  { day: "Sunday", time: "Emergency Support", open: false },
];

/* ─── Sub-components ──────────────────────────────────────── */
const ColHeading = ({ children }) => (
  <h2 className="font-barlowC font-bold text-[11px] tracking-[0.2em] uppercase text-orange-500 mb-5 flex items-center gap-2">
    <span className="inline-block w-5 h-[2px] bg-orange-500 shrink-0" aria-hidden="true" />
    {children}
  </h2>
);

const FooterLink = ({ to, children, external }) => {
  const cls =
    "group flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-200 transition-colors duration-200 leading-snug py-0.5";

  return external ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
      <span className="text-orange-600 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform duration-150">
        <IconArrow />
      </span>
      {children}
    </a>
  ) : (
    <Link to={to} className={cls}>
      <span className="text-orange-600 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform duration-150">
        <IconArrow />
      </span>
      {children}
    </Link>
  );
};

const ContactRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3">
    <div
      className="w-8 h-8 shrink-0 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-500"
      aria-hidden="true"
    >
      <Icon />
    </div>
    <div>
      <p className="font-barlowC font-bold text-[10px] tracking-[0.14em] uppercase text-slate-600 mb-0.5">{label}</p>
      <div className="text-[13.5px] text-slate-400 leading-snug">{children}</div>
    </div>
  </div>
);

/* ─── Main Footer ─────────────────────────────────────────── */
export default function PharmaMachineFooter() {
  // ── Product query ──
  const { data: apiData, isLoading: productsLoading } = useFetchAllProductsQuery({
    page: 1,
    limit: 1000,
  });
  const allProducts = apiData?.products || [];

  const navProducts = (() => {
    if (allProducts.length === 0) return NAV_PRODUCTS_FALLBACK;
    const seen = new Set();
    const items = [];
    allProducts.forEach((p) => {
      const cat = p.category || "uncategorized";
      if (seen.has(cat)) return;
      seen.add(cat);
      items.push({
        label: cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        to: `/shop?category=${cat}`,
      });
    });
    return items.slice(0, 12);
  })();

  // ── Fetch press releases ──
  const [pressReleases, setPressReleases] = useState([]);
  const [pressLoading, setPressLoading] = useState(true);

  useEffect(() => {
    const fetchPress = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get('/api/press', {
          params: { active: true, limit: 3, page: 1 },
          headers,
        });
        setPressReleases(res.data.data || []);
      } catch (err) {
        setPressReleases([]);
      } finally {
        setPressLoading(false);
      }
    };
    fetchPress();
  }, []);

  // ── Newsletter subscription ──
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setSubscribeStatus({ type: 'error', message: 'Please enter a valid email address.' });
      setTimeout(() => setSubscribeStatus(null), 5000);
      return;
    }

    setSubscribing(true);
    try {
      const response = await axios.post('/api/newsletter/subscribe', { email });
      setSubscribeStatus({ type: 'success', message: response.data.message || 'Subscription successful!' });
      setEmail('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Subscription failed. Please try again.';
      setSubscribeStatus({ type: 'error', message: msg });
    } finally {
      setSubscribing(false);
      setTimeout(() => setSubscribeStatus(null), 5000);
    }
  };

  const MediaTypeIcon = ({ type }) => {
    switch (type) {
      case 'video': return <span className="text-purple-500 text-[10px]">🎬</span>;
      case 'document': return <span className="text-orange-500 text-[10px]">📄</span>;
      default: return <span className="text-blue-500 text-[10px]">🖼️</span>;
    }
  };

  return (
    <footer
      itemScope
      itemType="https://schema.org/Organization"
      className="bg-[#0d1017] text-slate-400 font-barlow w-full"
      aria-label="Site footer"
    >
      <meta itemProp="name" content="PharmaMachine Pharmaceutical Machinery" />
      <meta itemProp="url" content="https://pharmamachine.com" />

      {/* Top orange bar */}
      <div className="bg-orange-600 px-5 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="font-barlowC font-semibold text-[12px] tracking-widest uppercase text-white">
          ⚙ Pharmaceutical machinery solutions since 1987 — trusted by 3,000+ manufacturers worldwide
        </p>
        <div className="flex flex-wrap gap-4">
          {[
            { label: "Request a Quote", to: "/quote" },
            { label: "Turnkey Projects", to: "/turnkey" },
            { label: "Client Portal", to: "/login" },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="font-barlowC font-bold text-[11px] tracking-wider uppercase text-white/80 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-slate-800">

        {/* Column 1: Brand */}
        <div className="p-8 sm:border-r border-slate-800 lg:col-span-1">
          <Link to="/" aria-label="PharmaMachine — Home">
            <div className="flex items-end gap-2 mb-1">
              <span className="font-barlowC font-bold text-[32px] leading-none text-white tracking-tight">
                PHARMA<span className="text-orange-500">MACHINE</span>
              </span>
            </div>
          </Link>
          <p className="font-barlowC text-[11px] tracking-[0.18em] uppercase text-slate-600 mb-4">
            Pharmaceutical Machinery
          </p>
          <p
            itemProp="description"
            className="text-[13.5px] leading-relaxed text-slate-500 mb-5 max-w-xs"
          >
            Engineering high‑precision pharmaceutical processing and packaging equipment for
            solid dose, liquid, and sterile applications — built to cGMP, delivered on time.
          </p>
          <div className="flex flex-wrap gap-2 mb-6" aria-label="Certifications">
            {CERTIFICATIONS.map((c) => (
              <span
                key={c}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[10px] font-barlowC font-bold tracking-wide uppercase text-slate-400"
              >
                {c}
              </span>
            ))}
          </div>
          {/* Social media section removed */} 
        </div>

        {/* Column 2: Products + Services */}
        <div className="p-8 border-t sm:border-t-0 sm:border-r border-slate-800">
          <ColHeading>Products</ColHeading>
          <nav aria-label="Product categories">
            {productsLoading ? (
              <p className="text-[12px] text-slate-600">Loading…</p>
            ) : (
              <ul className="space-y-1" role="list">
                {navProducts.map(({ label, to }) => (
                  <li key={to}>
                    <FooterLink to={to}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            )}
          </nav>
          <div className="mt-7">
            <ColHeading>Services</ColHeading>
            <nav aria-label="Services">
              <ul className="space-y-1" role="list">
                {NAV_SERVICES.map(({ label, to }) => (
                  <li key={to}>
                    <FooterLink to={to}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Column 3: Contact */}
        <div className="p-8 border-t lg:border-t-0 border-slate-800 sm:border-r-0 lg:border-r">
          <ColHeading>Contact Us</ColHeading>
          <address className="not-italic space-y-4">
            {/* ─── UPDATED ADDRESS BLOCK ─── */}
            <ContactRow icon={IconPin} label="Office Locations">
              <div className="space-y-1.5">
                <div>
                  <span className="font-semibold text-slate-300">Main Office:</span> Shivalik Nagar, Haridwar, Uttarakhand 249403, India
                </div>
                <div>
                  <span className="font-semibold text-slate-300">East India:</span> Lokhra, Jyotikuchhi, Guwahati, Assam, India
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Mumbai:</span> Thane, Mumbai, Maharashtra, India
                </div>
              </div>
            </ContactRow>

            <ContactRow icon={IconPhone} label="Sales Hotline">
              <a
                href="tel:9773910846"
                itemProp="telephone"
                className="hover:text-orange-400 transition-colors"
                aria-label="Call our sales line"
              >
                9773910846
              </a>
              <br />
              <a
                href="tel:+18005550100"
                className="text-[12px] text-slate-600 hover:text-orange-400 transition-colors"
                aria-label="Call our toll-free number"
              >
                Toll-free: 9773910846
              </a>
            </ContactRow>
            <ContactRow icon={IconMail} label="Email">
              <a
                href="mailto:sales@pharmamachine.com"
                itemProp="email"
                className="hover:text-orange-400 transition-colors"
              >
                 safescan21@gmail.com
              </a>
              <br />
              <a
                href="mailto:safescan21@gmail.com"
                className="text-[12px] text-slate-600 hover:text-orange-400 transition-colors"
              >
                safescan21@gmail.com
              </a>
            </ContactRow>
            <ContactRow icon={IconClock} label="Business Hours">
              <div
                className="mt-1 bg-slate-900 border-l-2 border-orange-600 rounded-r p-3 space-y-1.5"
                itemProp="openingHours"
              >
                {HOURS.map(({ day, time, open }) => (
                  <div key={day} className="flex justify-between text-[12px]">
                    <span className="text-slate-600">{day}</span>
                    <span className={open ? "text-emerald-500" : "text-slate-600"}>{time}</span>
                  </div>
                ))}
              </div>
            </ContactRow>
          </address>
        </div>

        {/* Column 4: Newsletter + Company + Press */}
        <div className="p-8 border-t lg:border-t-0 border-slate-800">
          <ColHeading>Newsletter</ColHeading>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-3">
            Regulatory updates, machine specs, and pharma tech news — no spam, unsubscribe anytime.
          </p>

          {/* Newsletter Input Group */}
          <div className="flex rounded overflow-hidden border border-slate-700 bg-slate-900 focus-within:border-orange-600 transition-colors">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="your@pharma.com"
              autoComplete="email"
              className="flex-1 bg-transparent px-3 py-2.5 text-[13px] text-slate-300 placeholder-slate-600 outline-none min-w-0"
              aria-label="Enter your email to subscribe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribing}
            />
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={subscribing}
              className={`bg-orange-600 hover:bg-orange-500 active:bg-orange-700 px-4 text-white font-barlowC font-bold text-[11px] tracking-widest uppercase transition-colors shrink-0 ${
                subscribing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              aria-label="Subscribe to newsletter"
            >
              {subscribing ? 'Subscribing…' : 'Subscribe'}
            </button>
          </div>

          {/* Status Message */}
          {subscribeStatus && (
            <p
              className={`mt-2 text-sm ${
                subscribeStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {subscribeStatus.message}
            </p>
          )}

          <a
            href="https://wa.me/12135550182"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded border border-green-700/40 bg-green-900/20 text-green-400 hover:bg-green-900/40 hover:border-green-600 transition-all text-[12.5px] font-barlowC font-bold tracking-wider uppercase"
            aria-label="Chat with us on WhatsApp"
          >
            <IconWhatsApp />
            Chat on WhatsApp
          </a>

          <div className="mt-7">
            <ColHeading>Company</ColHeading>
            <nav aria-label="Company pages">
              <ul className="space-y-1" role="list">
                {NAV_COMPANY.map(({ label, to }) => (
                  <li key={to}>
                    <FooterLink to={to}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ─── Latest Press Releases ─── */}
            {!pressLoading && pressReleases.length > 0 && (
              <div className="mt-6">
                <h3 className="font-barlowC font-bold text-[10px] tracking-[0.18em] uppercase text-orange-500 mb-3">
                  Latest Press Releases
                </h3>
                <ul className="space-y-2.5">
                  {pressReleases.map((item) => (
                    <li key={item._id} className="border-b border-slate-800/50 pb-2 last:border-0">
                      <Link
                        to={`/press/${item._id}`}
                        className="group flex flex-col gap-0.5 text-[12px] text-slate-500 hover:text-slate-200 transition-colors leading-tight"
                      >
                        <span className="flex items-start gap-2">
                          <span className="text-orange-600 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform duration-150 mt-1 shrink-0">
                            <IconArrow />
                          </span>
                          <span className="font-medium">{item.title}</span>
                        </span>
                        <div className="flex items-center gap-3 text-[10px] text-slate-600 ml-5">
                          {item.publishedDate && (
                            <span>{new Date(item.publishedDate).toLocaleDateString()}</span>
                          )}
                          {item.media && item.media.length > 0 && (
                            <span className="flex items-center gap-1">
                              {item.media.slice(0, 3).map((m, idx) => (
                                <MediaTypeIcon key={idx} type={m.type} />
                              ))}
                              {item.media.length > 3 && <span>+{item.media.length - 3}</span>}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/press"
                  className="inline-block mt-3 text-[10px] font-barlowC font-bold tracking-widest uppercase text-orange-500 hover:text-orange-400 transition-colors"
                >
                  View all →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-b border-slate-800 px-5 sm:px-8 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        {[
          "3,000+ Satisfied Clients",
          "80+ Countries Served",
          "cGMP Compliant",
          "24/7 Technical Support",
          "On‑Site Validation",
        ].map((item) => (
          <span key={item} className="flex items-center gap-1.5 text-[12px] text-slate-600 font-barlowC font-semibold tracking-wide uppercase">
            <span className="text-orange-600"><IconShield /></span>
            {item}
          </span>
        ))}
      </div>

      {/* Legal footer */}
      <div className="px-5 sm:px-8 py-4 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 bg-[#090b0f]">
        <p className="text-[12px] text-slate-700 order-3 sm:order-1">
          &copy; {new Date().getFullYear()} PharmaMachine. All rights reserved.
        </p>
        <nav aria-label="Legal links" className="order-2 flex flex-wrap justify-center gap-x-5 gap-y-1">
          {[
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Terms of Sale", to: "/terms" },
            { label: "Cookie Settings", to: "/cookies" },
            { label: "Sitemap", to: "/sitemap.xml" },
            { label: "Accessibility", to: "/accessibility" },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-[12px] text-slate-700 hover:text-slate-400 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="order-1 sm:order-3 flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
          {["VISA", "MC", "AMEX", "Wire", "NET 30", "PayPal"].map((m) => (
            <span
              key={m}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-[10px] font-barlowC font-bold tracking-wide text-slate-500"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
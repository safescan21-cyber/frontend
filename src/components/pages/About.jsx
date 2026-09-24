import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Shield, Award, Users, Globe, Clock, Zap,
  CheckCircle, TrendingUp, Eye, Settings, HeartHandshake
} from 'lucide-react';

const About = () => {
  // JSON‑LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PharmaMachine',
    url: 'https://pharmamachine.com',
    logo: 'https://pharmamachine.com/logo.png', // replace with your actual logo URL
    description:
      'PharmaMachine is a premier B2B provider of pharmaceutical machinery, offering cGMP‑compliant equipment for solid dose, liquid, and sterile processing.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '212 Innovation Drive',
      addressLocality: 'Philadelphia',
      addressRegion: 'PA',
      postalCode: '19103',
      addressCountry: 'USA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-555-0100',
      contactType: 'Sales',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://linkedin.com/company/pharmamachine',
      'https://twitter.com/pharmamachine',
      'https://youtube.com/@pharmamachine',
    ],
  };

  const aboutPageData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About PharmaMachine – B2B Pharmaceutical Machinery Supplier',
    description:
      'Learn about PharmaMachine, your trusted B2B partner for pharmaceutical machinery. We engineer cGMP‑compliant equipment for the pharma industry.',
    url: 'https://pharmamachine.com/about',
    mainEntity: structuredData,
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>About PharmaMachine – B2B Pharmaceutical Machinery Supplier</title>
        <meta
          name="description"
          content="PharmaMachine is a trusted B2B provider of pharmaceutical machinery. We supply cGMP‑compliant equipment for solid dose, liquid, and sterile processing. Learn about our mission, values, and global impact."
        />
        <meta
          name="keywords"
          content="pharmaceutical machinery, B2B pharma equipment, cGMP compliant machines, tablet press, capsule filling, blister packaging, pharma manufacturing"
        />
        <link rel="canonical" href="https://pharmamachine.com/about" />

        {/* Open Graph / Social Media */}
        <meta property="og:title" content="About PharmaMachine – B2B Pharmaceutical Machinery Supplier" />
        <meta
          property="og:description"
          content="PharmaMachine is a premier B2B provider of pharmaceutical machinery, serving manufacturers worldwide with cGMP‑compliant equipment."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pharmamachine.com/about" />
        <meta property="og:image" content="https://pharmamachine.com/og-about.jpg" /> {/* replace with actual image */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About PharmaMachine – B2B Pharmaceutical Machinery Supplier" />
        <meta
          name="twitter:description"
          content="PharmaMachine is a premier B2B provider of pharmaceutical machinery, offering cGMP‑compliant equipment for the pharma industry."
        />
      </Helmet>

      {/* JSON‑LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(aboutPageData)}</script>

      <div className="bg-slate-900 text-slate-300 min-h-screen">
        {/* ─── HERO ─────────────────────────────────────────── */}
        <header className="relative bg-gradient-to-br from-slate-800 to-slate-900 py-20 px-4 md:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMTBhMTAgMTAgMCAxIDAgMCAyMCAxMCAxMCAwIDAgMCAwLTIweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-repeat"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Your Trusted <span className="text-orange-500">B2B Partner</span> in<br />
              Pharmaceutical Machinery
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
              We engineer, manufacture, and supply high‑precision equipment for solid dose,
              liquid, and sterile processing – built to cGMP standards and delivered globally.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
              >
                Get a Quote
              </Link>
              <Link
                to="/shop"
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full transition"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </header>

        {/* ─── COMPANY OVERVIEW ────────────────────────────── */}
        <section className="py-16 px-4 max-w-6xl mx-auto" aria-labelledby="who-we-are">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <article>
              <h2 id="who-we-are" className="text-3xl md:text-4xl font-bold text-white">
                Who We Are
              </h2>
              <div className="w-16 h-1 bg-orange-500 mt-2 mb-6" aria-hidden="true"></div>
              <p className="text-slate-400 text-lg leading-relaxed">
                PharmaMachine is a premier <strong>B2B provider of pharmaceutical machinery</strong>, serving
                manufacturers across the globe. With over 30 years of industry expertise, we
                deliver turnkey solutions – from single machines to complete production lines.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed mt-4">
                Our equipment is engineered for precision, reliability, and compliance with
                the strictest regulatory standards (<abbr title="Current Good Manufacturing Practice">cGMP</abbr>, FDA, CE). We partner with you at
                every stage – from concept to commissioning – ensuring seamless integration
                and maximum ROI.
              </p>
            </article>
            <div className="grid grid-cols-2 gap-4" role="list">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700" role="listitem">
                <Shield className="text-orange-500 w-10 h-10 mb-3" aria-hidden="true" />
                <h3 className="text-white font-bold text-lg">ISO 9001:2015</h3>
                <p className="text-slate-500 text-sm">Quality management certified</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700" role="listitem">
                <Award className="text-orange-500 w-10 h-10 mb-3" aria-hidden="true" />
                <h3 className="text-white font-bold text-lg">cGMP Compliant</h3>
                <p className="text-slate-500 text-sm">Current Good Manufacturing Practices</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700" role="listitem">
                <Globe className="text-orange-500 w-10 h-10 mb-3" aria-hidden="true" />
                <h3 className="text-white font-bold text-lg">80+ Countries</h3>
                <p className="text-slate-500 text-sm">Global reach, local support</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700" role="listitem">
                <Users className="text-orange-500 w-10 h-10 mb-3" aria-hidden="true" />
                <h3 className="text-white font-bold text-lg">3,000+ Clients</h3>
                <p className="text-slate-500 text-sm">Trusted by industry leaders</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MISSION, VISION, VALUES ──────────────────────── */}
        <section className="bg-slate-800/50 py-16 px-4" aria-labelledby="core-principles">
          <div className="max-w-6xl mx-auto">
            <h2 id="core-principles" className="text-3xl md:text-4xl font-bold text-white text-center">
              Our <span className="text-orange-500">Core</span> Principles
            </h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto mt-2 mb-10" aria-hidden="true"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <article className="bg-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-orange-500 transition">
                <div className="bg-orange-600/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="text-orange-500 w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Mission</h3>
                <p className="text-slate-400 leading-relaxed">
                  To empower pharmaceutical manufacturers with cutting‑edge machinery that
                  enhances productivity, ensures product quality, and reduces time‑to‑market.
                </p>
              </article>
              <article className="bg-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-orange-500 transition">
                <div className="bg-orange-600/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Eye className="text-orange-500 w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Vision</h3>
                <p className="text-slate-400 leading-relaxed">
                  To be the global benchmark for pharmaceutical machinery innovation –
                  driving sustainable growth and healthcare advancement worldwide.
                </p>
              </article>
              <article className="bg-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-orange-500 transition">
                <div className="bg-orange-600/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <HeartHandshake className="text-orange-500 w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Values</h3>
                <ul className="text-slate-400 space-y-2" role="list">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-orange-500 w-4 h-4 mt-1" aria-hidden="true" />
                    Integrity &amp; transparency
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-orange-500 w-4 h-4 mt-1" aria-hidden="true" />
                    Customer‑centric innovation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-orange-500 w-4 h-4 mt-1" aria-hidden="true" />
                    Uncompromising quality
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-orange-500 w-4 h-4 mt-1" aria-hidden="true" />
                    Sustainability &amp; safety
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ─── WHY CHOOSE US ────────────────────────────────── */}
        <section className="py-16 px-4 max-w-6xl mx-auto" aria-labelledby="why-choose">
          <h2 id="why-choose" className="text-3xl md:text-4xl font-bold text-white text-center">
            Why <span className="text-orange-500">Choose Us</span>
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-2 mb-10" aria-hidden="true"></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Settings, title: 'Custom Engineering', desc: 'We design machines tailored to your specific production requirements.' },
              { icon: Zap, title: 'End‑to‑End Support', desc: 'From feasibility studies to installation, validation, and after‑sales.' },
              { icon: Clock, title: 'On‑Time Delivery', desc: 'Projects delivered on schedule, minimising downtime for your facility.' },
              { icon: Shield, title: 'Compliance First', desc: 'All equipment meets cGMP, FDA, CE and other global standards.' },
              { icon: Users, title: 'Expert Team', desc: 'Our engineers bring decades of pharma industry experience to every project.' },
              { icon: Globe, title: 'Global Presence', desc: 'Local service hubs in 20+ countries for rapid response.' },
            ].map((item, idx) => (
              <article key={idx} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-orange-500 transition group">
                <div className="bg-orange-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-600/40 transition">
                  <item.icon className="text-orange-500 w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ─── STATS / TRUST BAR ────────────────────────────── */}
        <section className="bg-orange-600/10 border-y border-orange-600/20 py-12 px-4" aria-labelledby="stats">
          <h2 id="stats" className="sr-only">Company Statistics</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Years of Experience', value: '30+' },
              { label: 'Clients Worldwide', value: '3,000+' },
              { label: 'Countries Served', value: '80+' },
              { label: 'Machines Installed', value: '10,000+' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl md:text-4xl font-extrabold text-orange-500">{stat.value}</div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CALL TO ACTION ────────────────────────────────── */}
        <section className="py-16 px-4" aria-labelledby="cta">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-10 text-center border border-slate-700">
            <h2 id="cta" className="text-3xl font-bold text-white">Ready to <span className="text-orange-500">Partner</span> With Us?</h2>
            <p className="text-slate-400 text-lg mt-2 max-w-2xl mx-auto">
              Let’s discuss your project – whether it’s a single machine or a full turnkey plant.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
              >
                Contact Sales
              </Link>
              <Link
                to="/shop"
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full transition"
              >
                View Our Products
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  emoji: string;
  tag?: string;
};
type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  createdAt: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Butter Croissant",
    category: "Pastries",
    price: 2.8,
    description: "Golden, flaky layers made fresh every morning.",
    emoji: "🥐",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Chocolate Brownie",
    category: "Treats",
    price: 3.2,
    description: "Rich chocolate centre with a delicate crisp top.",
    emoji: "🍫",
  },
  {
    id: 3,
    name: "Strawberry Cake",
    category: "Cakes",
    price: 28,
    description: "Vanilla sponge, fresh cream and seasonal berries.",
    emoji: "🍰",
    tag: "Popular",
  },
  {
    id: 4,
    name: "Sourdough Loaf",
    category: "Bread",
    price: 4.5,
    description: "Slow-fermented loaf with a crisp golden crust.",
    emoji: "🍞",
  },
  {
    id: 5,
    name: "Cinnamon Roll",
    category: "Pastries",
    price: 3.5,
    description: "Soft swirl with cinnamon sugar and vanilla glaze.",
    emoji: "🌀",
  },
  {
    id: 6,
    name: "Celebration Cupcakes",
    category: "Cakes",
    price: 18,
    description: "A box of six, finished with our signature buttercream.",
    emoji: "🧁",
  },
];

const categories = ["All", "Cakes", "Pastries", "Bread", "Treats"];
const BUSINESS_WHATSAPP = "447887159903"; // Replace with the bakery's real WhatsApp number, digits only.

export default function Home() {
  const [category, setCategory] = useState("All");
  const [activeView, setActiveView] = useState<"site" | "admin">("site");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "General enquiry",
    message: "",
  });

  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [apiError, setApiError] = useState("");

  async function loadEnquiries() {
    setLoadingEnquiries(true);
    setApiError("");
    try {
      const response = await fetch("/api/enquiries", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not load enquiries.");
      setEnquiries(data.enquiries);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoadingEnquiries(false);
    }
  }

  useEffect(() => {
    if (activeView === "admin") void loadEnquiries();
  }, [activeView]);

  const visibleProducts = useMemo(
    () =>
      category === "All"
        ? products
        : products.filter((p) => p.category === category),
    [category]
  );

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setApiError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to submit your enquiry.");
      setForm({
        name: "",
        email: "",
        phone: "",
        type: "General enquiry",
        message: "",
      });
      setNotice(
        "Thanks! Your enquiry has been received. Our team will be in touch soon."
      );
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  async function deleteEnquiry(id: string) {
    setApiError("");
    try {
      const response = await fetch(
        `/api/enquiries?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to delete enquiry.");
      setEnquiries(data.enquiries);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  const whatsappText = encodeURIComponent(
    "Hi BakeHouse! I'd like to ask about your products and availability."
  );
  const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${whatsappText}`;

  return (
    <main>
      <div className="announcement">
        Freshly baked every morning · Local ingredients · Made with love
      </div>
      <header className="header">
        <a className="brand" href="#home" onClick={() => setActiveView("site")}>
          <span className="brand-mark">B</span>
          <span>
            BAKE<span className="brand-light">HOUSE</span>
            <small>NEIGHBOURHOOD BAKERY</small>
          </span>
        </a>
        <nav className="nav">
          <a href="#story" onClick={() => setActiveView("site")}>
            Our story
          </a>
          <a href="#menu" onClick={() => setActiveView("site")}>
            Our bakes
          </a>
          <a href="#contact" onClick={() => setActiveView("site")}>
            Contact
          </a>
        </nav>
        <button
          className="admin-link"
          onClick={() =>
            setActiveView(activeView === "admin" ? "site" : "admin")
          }
        >
          {activeView === "admin" ? "← View website" : "Admin preview ↗"}
        </button>
      </header>

      {activeView === "site" ? (
        <>
          <section className="hero" id="home">
            <div className="hero-copy">
              <p className="eyebrow">A LITTLE JOY IN EVERY BITE</p>
              <h1>
                Good days
                <br />
                start with <em>great bakes.</em>
              </h1>
              <p className="hero-text">
                Your neighbourhood bakery for slow mornings, sweet celebrations
                and everything in between.
              </p>
              <div className="hero-actions">
                <a className="button button-dark" href="#menu">
                  Explore our bakes <span>↗</span>
                </a>
                <a className="text-link" href="#contact">
                  Make an enquiry
                </a>
              </div>
              <div className="hero-note">
                <span>✳</span> Baked fresh daily in small batches
              </div>
            </div>
            <div
              className="hero-art"
              aria-label="Illustration of freshly baked pastries"
            >
              <div className="sun-disc"></div>
              <div className="hero-emoji">🥐</div>
              <div className="hero-sticker">
                FRESH
                <br />
                FROM
                <br />
                THE OVEN
              </div>
              <div className="hero-caption">
                Handmade with
                <br />
                heart since 2018
              </div>
            </div>
          </section>

          <section className="trust-strip">
            <div>
              <strong>01</strong>
              <span>Fresh every morning</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Quality ingredients</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Made for your moments</span>
            </div>
          </section>

          <section className="story section" id="story">
            <div className="story-art">
              <div className="story-emoji">🍞</div>
              <span className="round-stamp">LOCAL · FRESH · LOVELY</span>
            </div>
            <div className="story-copy">
              <p className="eyebrow">A WARM WELCOME</p>
              <h2>
                A neighbourhood
                <br />
                kind of <em>bakery.</em>
              </h2>
              <p>
                At BakeHouse, we believe the little things make a day special.
                We bake in small batches, use thoughtfully chosen ingredients
                and put care into every loaf, pastry and celebration cake.
              </p>
              <p>
                Whether you're picking up your morning croissant or planning a
                cake for someone you love, there's always something fresh
                waiting for you.
              </p>
              <a className="under-link" href="#contact">
                Come say hello <span>→</span>
              </a>
            </div>
          </section>

          <section className="menu-section section" id="menu">
            <div className="section-heading">
              <div>
                <p className="eyebrow">FROM OUR OVEN TO YOU</p>
                <h2>
                  Something for <em>every craving.</em>
                </h2>
              </div>
              <p>
                Small-batch favourites, baked with care
                <br />
                and ready to make your day.
              </p>
            </div>
            <div className="filters" role="group" aria-label="Filter products">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "filter active" : "filter"}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className={`product-art product-art-${product.id}`}>
                    {product.tag && (
                      <span className="product-tag">{product.tag}</span>
                    )}
                    <span className="product-emoji">{product.emoji}</span>
                  </div>
                  <div className="product-info">
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                    <strong>£{product.price.toFixed(2)}</strong>
                  </div>
                  <a
                    className="order-link"
                    href="#contact"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        type: `Order enquiry – ${product.name}`,
                        message: `I'm interested in ${product.name}. Please share availability.`,
                      }))
                    }
                  >
                    Enquire about this <span>↗</span>
                  </a>
                </article>
              ))}
            </div>
            <p className="menu-footnote">
              Our menu changes with the seasons. Prices shown are sample prices
              for this prototype.
            </p>
          </section>

          <section className="banner">
            <div>
              <p className="eyebrow">A LITTLE SOMETHING TO CELEBRATE?</p>
              <h2>
                Make the moment
                <br />
                <em>extra sweet.</em>
              </h2>
            </div>
            <div className="banner-right">
              <p>
                Custom cakes and treat boxes for birthdays, gatherings and all
                the lovely in-betweens.
              </p>
              <a className="button button-cream" href="#contact">
                Ask about a celebration <span>↗</span>
              </a>
            </div>
            <div className="banner-cake">🎂</div>
          </section>

          <section className="contact section" id="contact">
            <div className="contact-copy">
              <p className="eyebrow">LET'S MAKE SOMETHING DELICIOUS</p>
              <h2>
                We'd love to
                <br />
                <em>hear from you.</em>
              </h2>
              <p>
                Questions, custom cake requests or a little hello? Send us a
                message and we'll get back to you.
              </p>
              <div className="contact-detail">
                <span>✉</span>
                <div>
                  <small>EMAIL US</small>
                  <strong>hello@bakehouse.com</strong>
                </div>
              </div>
              <div className="contact-detail">
                <span>⌖</span>
                <div>
                  <small>FIND US</small>
                  <strong>XYZ Market Street, London</strong>
                </div>
              </div>
              <div className="contact-detail">
                <span>◷</span>
                <div>
                  <small>OPENING HOURS</small>
                  <strong>Mon–Sat · 8:00am–5:00pm</strong>
                </div>
              </div>
              <a
                className="whatsapp-link"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Chat with us on WhatsApp ↗
              </a>
            </div>
            <form className="enquiry-form" onSubmit={submitEnquiry}>
              <h3>Send an enquiry</h3>
              <p>Fill in the details below and we'll be in touch.</p>
              <div className="form-row">
                <label>
                  Your name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g. Alex Morgan"
                  />
                </label>
                <label>
                  Email address
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="alex@email.com"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Phone (optional)
                  <input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+44 7..."
                  />
                </label>
                <label>
                  I'm enquiring about
                  <select
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value)}
                  >
                    <option>General enquiry</option>
                    <option>Custom celebration cake</option>
                    <option>Bulk / event order</option>
                    <option>Product availability</option>
                  </select>
                </label>
              </div>
              <label>
                Your message
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Tell us what you have in mind..."
                />
              </label>
              <button
                className="button button-dark submit-button"
                type="submit"
              >
                Send enquiry <span>↗</span>
              </button>
              {notice && (
                <div className="success-message" role="status">
                  {notice}
                </div>
              )}
              {apiError && activeView === "site" && (
                <div className="success-message error-message" role="alert">
                  {apiError}
                </div>
              )}
              <small className="privacy-note">
                Prototype: enquiries are submitted to the Next.js backend and
                stored in a local JSON file on the server.
              </small>
            </form>
          </section>
        </>
      ) : (
        <section className="admin section">
          <div className="admin-top">
            <div>
              <p className="eyebrow">BAKEHOUSE BACK OFFICE</p>
              <h1>
                Enquiry <em>dashboard.</em>
              </h1>
              <p className="admin-sub">
                A simple view of customer interest captured through the website.
              </p>
            </div>
            <div className="stat-card">
              <span>TOTAL ENQUIRIES</span>
              <strong>{enquiries.length}</strong>
              <small>Saved in this browser</small>
            </div>
          </div>
          <div className="admin-toolbar">
            <h2>Recent enquiries</h2>
            <button className="filter" onClick={() => void loadEnquiries()}>
              Refresh enquiries ↻
            </button>
          </div>
          {apiError && (
            <div className="success-message error-message" role="alert">
              {apiError}
            </div>
          )}
          {loadingEnquiries ? (
            <div className="empty-state">
              <p>Loading enquiries from the server…</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="empty-state">
              <span>✉</span>
              <h3>No enquiries yet</h3>
              <p>
                Submit the website contact form to see a customer enquiry appear
                here.
              </p>
              <button
                className="button button-dark"
                onClick={() => setActiveView("site")}
              >
                Go to website
              </button>
            </div>
          ) : (
            <div className="enquiry-list">
              {enquiries.map((item) => (
                <article className="enquiry-card" key={item.id}>
                  <div className="enquiry-card-top">
                    <div>
                      <h3>{item.name}</h3>
                      <span>{item.type}</span>
                    </div>
                    <small>{item.createdAt}</small>
                  </div>
                  <p>{item.message}</p>
                  <div className="enquiry-meta">
                    <span>✉ {item.email}</span>
                    {item.phone && <span>☎ {item.phone}</span>}
                    <button onClick={() => deleteEnquiry(item.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
          <p className="privacy-note admin-note">
            Prototype limitation: this demo admin view has no authentication.
            JSON-file storage is suitable for local demonstration, not
            multi-instance serverless hosting or sensitive customer data. Add
            authentication and persistent secured hosting before production use.
          </p>
        </section>
      )}

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark">B</span>
          <span>
            BAKE<span className="brand-light">HOUSE</span>
            <small>NEIGHBOURHOOD BAKERY</small>
          </span>
        </a>
        <p>Freshly baked. Locally loved.</p>
        <span>© 2026 BakeHouse · prototype</span>
      </footer>
    </main>
  );
}

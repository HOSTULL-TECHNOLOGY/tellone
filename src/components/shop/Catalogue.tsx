"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { categories, productSeries, products, type Product } from "@/data/shop";
import type { Locale } from "@/lib/i18n";
import { EmptyState } from "@/components/ui/Page";
import { ProductCard } from "./ProductBits";

const PRICE_BANDS = [
  { v: "", label: "Any price" },
  { v: "0-2000", label: "Under ₦2,000" },
  { v: "2000-10000", label: "₦2,000 – ₦10,000" },
  { v: "10000-50000", label: "₦10,000 – ₦50,000" },
  { v: "50000-", label: "Over ₦50,000" },
];
const SIZES = ["S", "M", "L", "XL", "XXL", "One size"];
const COLOURS = Array.from(new Set(products.flatMap((p) => p.colours ?? [])));

/**
 * EC-3 catalogue: search, filters (category, collection, price, size, colour) and sort.
 * The full list is server-rendered, so it is readable without JavaScript.
 */
export function Catalogue({ locale }: { locale: Locale }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [series, setSeries] = useState("");
  const [band, setBand] = useState("");
  const [size, setSize] = useState("");
  const [colour, setColour] = useState("");
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get("category");
    if (c && (categories as string[]).includes(c)) setCat(c);
    const se = sp.get("series");
    const match = productSeries.find((x) => x.toLowerCase().replace(/\s+/g, "-") === se);
    if (match) setSeries(match);
    const qq = sp.get("q");
    if (qq) setQ(qq);
  }, []);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const [min, max] = band ? band.split("-").map((x) => (x ? Number(x) : undefined)) : [undefined, undefined];
    let out: Product[] = products.filter(
      (p) =>
        (!needle || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(needle)) &&
        (!cat || p.category === cat) &&
        (!series || p.series === series) &&
        (min === undefined || p.price >= min) &&
        (max === undefined || p.price <= max) &&
        (!size || p.sizes?.includes(size)) &&
        (!colour || p.colours?.includes(colour)),
    );
    const idx = (p: Product) => products.indexOf(p);
    if (sort === "popular") out = [...out].sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller) || idx(a) - idx(b));
    if (sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "newest") out = [...out].sort((a, b) => idx(b) - idx(a));
    return out;
  }, [q, cat, series, band, size, colour, sort]);

  const active = [q, cat, series, band, size, colour].some(Boolean);
  const reset = () => {
    setQ("");
    setCat("");
    setSeries("");
    setBand("");
    setSize("");
    setColour("");
  };

  return (
    <div className="catalogue">
      <form className="filters shop-filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="field shop-filter-search">
          <label htmlFor="cat-q">Search merch</label>
          <div className="input-icon">
            <Search size={16} aria-hidden />
            <input id="cat-q" className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="T-shirt, cap, Hausa…" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="cat-c">Category</label>
          <select id="cat-c" className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cat-se">Collection</label>
          <select id="cat-se" className="input" value={series} onChange={(e) => setSeries(e.target.value)}>
            <option value="">All collections</option>
            {productSeries.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cat-p">Price</label>
          <select id="cat-p" className="input" value={band} onChange={(e) => setBand(e.target.value)}>
            {PRICE_BANDS.map((b) => (
              <option key={b.v} value={b.v}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cat-s">Size</label>
          <select id="cat-s" className="input" value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Any size</option>
            {SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cat-col">Colour</label>
          <select id="cat-col" className="input" value={colour} onChange={(e) => setColour(e.target.value)}>
            <option value="">Any colour</option>
            {COLOURS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cat-sort">Sort by</label>
          <select id="cat-sort" className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Most popular</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </form>
      <div className="catalogue-bar">
        <p aria-live="polite" className="small muted">
          {list.length} {list.length === 1 ? "product" : "products"}
          {active ? " match your filters" : ""}
        </p>
        {active && (
          <button type="button" className="btn btn-sm btn-ghost" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>
      {list.length ? (
        <div className="shop-grid-full">
          {list.map((p) => (
            <ProductCard key={p.slug} p={p} locale={locale} headingLevel={2} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<SearchX size={32} aria-hidden />}
          title="No products match"
          text="Try a different size or colour, or clear the filters."
          action={
            <button type="button" className="btn btn-outline" onClick={reset}>
              Clear filters
            </button>
          }
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import tbhLogo from "@/imports/1000883408-removebg-preview.png";
import peterObiPhoto from "@/imports/download__19_.jpg";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Star,
  CheckCircle,
  Globe,
  Heart,
  Zap,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Impact", href: "#impact" },
  { label: "Events", href: "#events" },
  { label: "News", href: "#news" },
  { label: "Join", href: "#join" },
];

const STATS = [
  { value: "36", suffix: "+", label: "States Covered", icon: Globe },
  { value: "2.4M", suffix: "", label: "Supporters Registered", icon: Users },
  { value: "1,800", suffix: "+", label: "Community Events", icon: Calendar },
  { value: "94", suffix: "%", label: "Youth Engagement", icon: TrendingUp },
];

const EVENTS = [
  {
    date: "JUL 12",
    year: "2025",
    title: "Lagos Mega Rally",
    location: "Tafawa Balewa Square, Lagos",
    type: "Rally",
    seats: "Unlimited",
  },
  {
    date: "JUL 19",
    year: "2025",
    title: "Abuja Town Hall",
    location: "International Conference Centre, Abuja",
    type: "Town Hall",
    seats: "2,000 seats",
  },
  {
    date: "AUG 2",
    year: "2025",
    title: "Southeast Solidarity March",
    location: "Enugu State Government House Square",
    type: "March",
    seats: "Open",
  },
  {
    date: "AUG 16",
    year: "2025",
    title: "Youth Innovation Summit",
    location: "Eko Atlantic City, Lagos",
    type: "Summit",
    seats: "5,000 seats",
  },
];

const NEWS = [
  {
    category: "Campaign",
    date: "June 18, 2025",
    title: "TBH One Mobilises 500,000 New Voters Across the North",
    excerpt:
      "In a landmark grassroots effort, TBH One volunteers registered half a million new voters across 12 northern states, marking the single largest voter drive in Nigerian history.",
    img: "https://images.unsplash.com/photo-1633116937591-f312921e99b9?w=600&h=380&fit=crop&auto=format",
  },
  {
    category: "Policy",
    date: "June 10, 2025",
    title: "Obi 2027 Unveils Comprehensive Education Reform Blueprint",
    excerpt:
      "The presidential aspirant released a detailed 100-page policy document committing to free primary education, skills-based secondary curricula, and tripling university funding.",
    img: "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?w=600&h=380&fit=crop&auto=format",
  },
  {
    category: "Movement",
    date: "May 29, 2025",
    title: "Democracy Day: Millions Stand Under the TBH One Banner",
    excerpt:
      "Across Nigeria and the diaspora, Democracy Day 2025 saw unprecedented crowds gathering under the TBH One banner — a movement defined by hope, discipline, and collective will.",
    img: "https://images.unsplash.com/photo-1604212561903-5ca7f041c58b?w=600&h=380&fit=crop&auto=format",
  },
];

const PILLARS = [
  {
    icon: Zap,
    title: "Economic Revival",
    desc: "A new economy that works for every Nigerian — from the farmer in Kebbi to the tech founder in Yaba. Job creation, SME funding, and infrastructural investment at scale.",
  },
  {
    icon: Heart,
    title: "Healthcare for All",
    desc: "Universal basic healthcare within reach of every community. No Nigerian should die of a curable disease. We will rebuild the health system from the ground up.",
  },
  {
    icon: Star,
    title: "Education First",
    desc: "Free, quality public education through secondary school. Skilled graduates who can compete globally and innovate locally — the foundation of Nigeria's renaissance.",
  },
  {
    icon: CheckCircle,
    title: "Security & Peace",
    desc: "A professional, well-equipped, community-trusted security service that protects lives and livelihoods — not one that terrorises the citizens it is sworn to serve.",
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    role: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-white overflow-x-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg border-b border-green-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button onClick={() => scrollTo("#hero")} className="flex items-center gap-3">
            <ImageWithFallback
              src={tbhLogo}
              alt="TBH One — Tell One Bring One Help One"
              className="h-12 md:h-14 w-auto object-contain"
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href)}
                className={`px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-colors rounded-sm ${
                  scrolled
                    ? "text-green-900 hover:text-green-600"
                    : "text-white hover:text-green-200"
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo("#join")}
              className="hidden sm:block bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-widest px-5 py-2.5 transition-all"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}
            >
              Join Now
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 transition-colors ${scrolled ? "text-green-900" : "text-white"}`}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden bg-green-900 border-t border-green-700">
            <nav className="flex flex-col py-4">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.label}
                  onClick={() => scrollTo(l.href)}
                  className="text-left px-6 py-3 text-white font-semibold uppercase tracking-widest text-sm hover:bg-green-800 transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {l.label}
                </button>
              ))}
              <div className="px-6 pt-3 pb-2">
                <button
                  onClick={() => scrollTo("#join")}
                  className="w-full bg-red-600 text-white font-bold uppercase tracking-widest py-3 text-sm"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Join the Movement
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1580466920837-63e59228f76e?w=1800&h=1100&fit=crop&auto=format"
            alt="Nigerian community gathering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/80 to-green-800/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-transparent" />
        </div>

        {/* Nigerian flag stripe accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-green-500" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-green-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="max-w-3xl">
            {/* Pre-tag */}
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 text-red-300 px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              TBH One Movement — Tell One · Bring One · Help One
            </div>

            {/* Main headline */}
            <h1
              className="text-white leading-none mb-6"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              One Nigeria.
              <br />
              <span className="text-red-400">One Voice.</span>
              <br />
              One Movement.
            </h1>

            <p
              className="text-green-100 text-xl md:text-2xl font-light leading-relaxed mb-3 max-w-xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              A Nigeria of honour. A Nigeria that works.
              <br />
              <span className="text-white font-semibold">The movement is you.</span>
            </p>

            <p className="text-green-300/80 text-base mb-10 max-w-lg leading-relaxed">
              Together, we are millions. Neighbours reaching neighbours, voices
              carrying the truth — one conversation at a time — until Nigeria
              chooses a new direction.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo("#join")}
                className="group flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest px-8 py-4 text-base transition-all"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.15em" }}
              >
                Join the Movement
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo("#about")}
                className="flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white font-bold uppercase tracking-widest px-8 py-4 text-base transition-all"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.15em" }}
              >
                Learn More <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ── TICKER STRIP ── */}
      <div className="bg-red-600 py-3 overflow-hidden">
        <div className="flex gap-0 whitespace-nowrap" style={{ animation: "ticker 30s linear infinite" }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 pr-8">
              {["Tell One", "Bring One", "Help One", "Vote Obi 2027", "New Nigeria Now", "TBH One Movement"].map((t) => (
                <span
                  key={t}
                  className="text-white font-bold uppercase tracking-widest text-sm px-4"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  ★ {t}
                </span>
              ))}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes ticker {
            from { transform: translateX(0); }
            to { transform: translateX(-33.33%); }
          }
        `}</style>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-16">
            <span className="w-10 h-0.5 bg-red-600" />
            <span
              className="text-red-600 text-xs font-bold uppercase tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              About the Movement
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image stack */}
            <div className="relative">
              <div className="aspect-[4/5] bg-green-100 overflow-hidden">
                <ImageWithFallback
                  src={peterObiPhoto}
                  alt="Peter Obi"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-4 md:-right-10 bg-green-700 text-white p-6 w-48 md:w-56 shadow-2xl">
                <div
                  className="text-5xl font-black leading-none text-green-300 mb-1"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  2027
                </div>
                <div className="text-xs uppercase tracking-widest font-semibold text-green-200">
                  Presidential Election
                </div>
                <div className="mt-3 text-sm text-green-100 leading-relaxed">
                  The moment Nigeria chooses its future.
                </div>
              </div>
              {/* Green accent bar */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-4 border-green-600 -z-10" />
            </div>

            {/* Text */}
            <div>
              <h2
                className="text-green-900 uppercase leading-none mb-8"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                Who Is
                <br />
                <span className="text-red-600">Peter Obi?</span>
              </h2>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Peter Gregory Obi served two terms as Governor of Anambra State —
                transforming it from near-insolvency to one of Nigeria's most
                financially prudent states. He left office with a savings balance,
                not a debt. He is the only governor in Nigerian history to do so.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                A disciplined economist, a man of proven integrity, and a visionary
                who believes Nigeria is not poor — it is poorly managed. TBH One
                exists to carry that message to every street, every market, and every
                household across our 36 states and the diaspora.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {PILLARS.map((p) => (
                  <div
                    key={p.title}
                    className="border border-green-100 p-5 hover:border-green-400 hover:shadow-md transition-all group"
                  >
                    <p.icon
                      size={22}
                      className="text-green-600 mb-3 group-hover:text-red-600 transition-colors"
                    />
                    <div
                      className="text-green-900 font-bold uppercase tracking-wide text-sm mb-1"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {p.title}
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollTo("#join")}
                className="group inline-flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white font-bold uppercase tracking-widest px-7 py-3.5 transition-all"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}
              >
                Stand With Us
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* TBH ONE explanation */}
          <div className="mt-24 grid md:grid-cols-3 gap-0 border border-green-100 overflow-hidden">
            {[
              { letter: "T", word: "Tell One", color: "bg-green-700", desc: "Share the vision. Talk to one person you trust about why Nigeria needs Peter Obi in 2027. Start conversations that matter." },
              { letter: "B", word: "Bring One", color: "bg-green-800", desc: "Invite one person to a rally, a town hall, or a community meeting. Physical presence transforms passive support into active movement." },
              { letter: "H", word: "Help One", color: "bg-green-900", desc: "Volunteer your time, skill, or resources. Register one voter. Drive one neighbour to the polls. Every act of service counts." },
            ].map((item) => (
              <div key={item.letter} className={`${item.color} text-white p-8 md:p-10`}>
                <div
                  className="text-green-400/40 font-black leading-none mb-4"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "6rem", lineHeight: 1 }}
                >
                  {item.letter}
                </div>
                <div
                  className="text-2xl font-bold uppercase tracking-widest text-red-300 mb-3"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {item.word}
                </div>
                <p className="text-green-200 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section id="impact" className="py-24 bg-green-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-green-500" />
          <div className="flex-1 bg-white/20" />
          <div className="flex-1 bg-green-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-0.5 bg-red-400" />
              <span
                className="text-red-400 text-xs font-bold uppercase tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Our Impact
              </span>
              <span className="w-10 h-0.5 bg-red-400" />
            </div>
            <h2
              className="text-white uppercase"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              The Movement
              <br />
              <span className="text-red-400">By the Numbers</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`text-center p-8 md:p-12 border-green-700 ${
                  i !== 0 ? "border-l" : ""
                } ${i >= 2 ? "border-t lg:border-t-0" : ""}`}
              >
                <s.icon size={28} className="text-green-400 mx-auto mb-4" />
                <div
                  className="text-white font-black leading-none mb-2"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                    fontWeight: 900,
                  }}
                >
                  {s.value}
                  <span className="text-red-400">{s.suffix}</span>
                </div>
                <div className="text-green-300 text-sm uppercase tracking-widest font-semibold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Progress bars */}
          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Northern Nigeria Outreach", value: 78 },
              { label: "Southern Nigeria Outreach", value: 91 },
              { label: "Diaspora Community Network", value: 65 },
              { label: "Youth (18–35) Mobilisation", value: 94 },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-200 font-medium">{bar.label}</span>
                  <span className="text-red-400 font-bold">{bar.value}%</span>
                </div>
                <div className="h-1.5 bg-green-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-red-500 rounded-full"
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOIN MOVEMENT ── */}
      <section id="join" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: copy */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-0.5 bg-red-600" />
                <span
                  className="text-red-600 text-xs font-bold uppercase tracking-widest"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Join the Movement
                </span>
              </div>
              <h2
                className="text-green-900 uppercase leading-none mb-8"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                }}
              >
                Nigeria Needs
                <br />
                <span className="text-red-600">Your Voice</span>
              </h2>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                No government changes without the governed. Register with TBH One
                today and become part of the structured grassroots movement taking
                Nigeria back — ward by ward, household by household.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "Access exclusive mobilisation resources and training",
                  "Connect with coordinators in your state and LGA",
                  "Attend private briefings and strategy sessions",
                  "Earn your TBH One volunteer certification",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="border-l-4 border-red-600 pl-6 py-2">
                <p className="text-gray-700 italic leading-relaxed">
                  "This is not Peter Obi alone. This is all of us. TBH One is the
                  vehicle through which millions of ordinary Nigerians make
                  extraordinary history."
                </p>
                <p className="text-green-700 font-bold text-sm mt-3">— TBH One National Coordinator</p>
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-green-900 p-8 md:p-10">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle size={56} className="text-green-300 mx-auto mb-4" />
                  <h3
                    className="text-white text-3xl font-black uppercase mb-3"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Welcome to TBH One!
                  </h3>
                  <p className="text-green-200 leading-relaxed">
                    You are now part of Nigeria's most important movement.
                    A coordinator will reach you within 48 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h3
                    className="text-white text-2xl font-black uppercase mb-6"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}
                  >
                    Register as a Volunteer
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-green-300 text-xs font-bold uppercase tracking-widest mb-1.5">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Adaeze Okonkwo"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-green-800 border border-green-700 focus:border-red-400 text-white placeholder-green-500 px-4 py-3 outline-none transition-colors text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-green-300 text-xs font-bold uppercase tracking-widest mb-1.5">
                          Email *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-green-800 border border-green-700 focus:border-red-400 text-white placeholder-green-500 px-4 py-3 outline-none transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-green-300 text-xs font-bold uppercase tracking-widest mb-1.5">
                          Phone *
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="+234 800 000 0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-green-800 border border-green-700 focus:border-red-400 text-white placeholder-green-500 px-4 py-3 outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-green-300 text-xs font-bold uppercase tracking-widest mb-1.5">
                        State of Residence *
                      </label>
                      <select
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-green-800 border border-green-700 focus:border-red-400 text-white px-4 py-3 outline-none transition-colors text-sm"
                      >
                        <option value="" className="bg-green-900">Select your state…</option>
                        {[
                          "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue",
                          "Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT",
                          "Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi",
                          "Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo",
                          "Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","Diaspora"
                        ].map((s) => (
                          <option key={s} value={s} className="bg-green-900">{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-green-300 text-xs font-bold uppercase tracking-widest mb-1.5">
                        How will you contribute?
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-green-800 border border-green-700 focus:border-red-400 text-white px-4 py-3 outline-none transition-colors text-sm"
                      >
                        <option value="" className="bg-green-900">Select a role…</option>
                        <option className="bg-green-900">Ward Coordinator</option>
                        <option className="bg-green-900">Social Media Advocate</option>
                        <option className="bg-green-900">Voter Registration Drive</option>
                        <option className="bg-green-900">Event Organiser</option>
                        <option className="bg-green-900">Financial Supporter</option>
                        <option className="bg-green-900">Other</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 text-base transition-all mt-2"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.15em" }}
                    >
                      I Am TBH One →
                    </button>
                    <p className="text-green-400 text-xs text-center">
                      Your data is protected and will never be shared with third parties.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section id="events" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-0.5 bg-red-600" />
                <span
                  className="text-red-600 text-xs font-bold uppercase tracking-widest"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  On the Ground
                </span>
              </div>
              <h2
                className="text-green-900 uppercase leading-none"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                Upcoming <span className="text-red-600">Events</span>
              </h2>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-green-700 font-bold text-sm uppercase tracking-widest hover:text-red-600 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {EVENTS.map((ev, i) => (
              <div
                key={ev.title}
                className="group flex gap-0 bg-white border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Date block */}
                <div
                  className={`flex-shrink-0 w-24 flex flex-col items-center justify-center py-6 ${
                    i % 2 === 0 ? "bg-green-700" : "bg-green-900"
                  }`}
                >
                  <div
                    className="text-green-300 text-xs font-bold uppercase tracking-widest"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {ev.date.split(" ")[0]}
                  </div>
                  <div
                    className="text-white text-3xl font-black leading-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {ev.date.split(" ")[1]}
                  </div>
                  <div className="text-green-400 text-xs">{ev.year}</div>
                </div>
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-widest text-red-600 mb-2"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {ev.type}
                    </span>
                    <h3
                      className="text-green-900 font-black text-xl mb-2 group-hover:text-green-700 transition-colors"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.02em" }}
                    >
                      {ev.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin size={13} className="flex-shrink-0 text-green-500" />
                      {ev.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      <Users size={12} className="inline mr-1" />
                      {ev.seats}
                    </span>
                    <button className="text-xs font-bold uppercase tracking-widest text-green-700 hover:text-red-600 transition-colors flex items-center gap-1">
                      Register <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section id="news" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-0.5 bg-red-600" />
                <span
                  className="text-red-600 text-xs font-bold uppercase tracking-widest"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Latest Updates
                </span>
              </div>
              <h2
                className="text-green-900 uppercase leading-none"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                News &amp; <span className="text-red-600">Stories</span>
              </h2>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-green-700 font-bold text-sm uppercase tracking-widest hover:text-red-600 transition-colors">
              All News <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {NEWS.map((article, i) => (
              <article
                key={article.title}
                className="group border border-gray-100 hover:shadow-xl transition-all overflow-hidden cursor-pointer"
              >
                <div className="aspect-[16/9] overflow-hidden bg-green-100">
                  <img
                    src={article.img}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 ${
                        i === 0
                          ? "bg-red-100 text-red-700"
                          : i === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {article.category}
                    </span>
                    <span className="text-gray-400 text-xs">{article.date}</span>
                  </div>
                  <h3
                    className="text-green-900 font-black text-xl leading-tight mb-3 group-hover:text-green-700 transition-colors"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-green-700 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-red-600 transition-colors">
                      Read More <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[480px]">
          {/* Green half */}
          <div className="bg-green-800 flex items-center justify-center p-10 md:p-16">
            <div className="max-w-sm text-center lg:text-left">
              <ImageWithFallback
                src={tbhLogo}
                alt="TBH One"
                className="h-16 w-auto object-contain mb-6 mx-auto lg:mx-0 drop-shadow-lg"
              />
              <h2
                className="text-white uppercase leading-none mb-4"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                Tell One.
                <br />
                Bring One.
                <br />
                Help One.
              </h2>
              <p className="text-green-200 text-sm leading-relaxed">
                Nigeria changes when we each take responsibility for the person next to us.
                The work begins with you, today.
              </p>
            </div>
          </div>

          {/* Red half */}
          <div className="bg-red-600 flex items-center justify-center p-10 md:p-16">
            <div className="max-w-sm text-center">
              <div
                className="text-white/20 font-black leading-none mb-4 select-none"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "8rem",
                  lineHeight: 1,
                }}
              >
                2027
              </div>
              <h2
                className="text-white uppercase leading-none mb-6 -mt-4"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 800,
                }}
              >
                The Time Is Now.
                <br />
                Nigeria Deserves Better.
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => scrollTo("#join")}
                  className="bg-white text-red-700 font-black uppercase tracking-widest px-6 py-3.5 hover:bg-red-50 transition-colors text-sm"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Join Now
                </button>
                <button className="border-2 border-white text-white font-black uppercase tracking-widest px-6 py-3.5 hover:bg-white/10 transition-colors text-sm"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Donate
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-green-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <ImageWithFallback
                src={tbhLogo}
                alt="TBH One"
                className="h-12 w-auto object-contain mb-4 drop-shadow-lg"
              />
              <p className="text-green-300 text-sm leading-relaxed max-w-sm">
                TBH One is a grassroots civic movement dedicated to electing Peter Obi
                as President of Nigeria in 2027. We are non-partisan citizens united
                by a single belief: Nigeria can be better.
              </p>
              <div className="flex gap-4 mt-5">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-9 h-9 border border-green-700 hover:border-red-500 hover:bg-red-600 flex items-center justify-center transition-all text-green-300 hover:text-white"
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div
                className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Quick Links
              </div>
              <ul className="space-y-2">
                {["Home", "About Peter Obi", "Our Mission", "Events", "News", "Join Us", "Donate"].map((l) => (
                  <li key={l}>
                    <button className="text-green-300 hover:text-white text-sm transition-colors">
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div
                className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Contact
              </div>
              <div className="space-y-3 text-sm text-green-300">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-green-500 flex-shrink-0" />
                  <span>info@tbhone.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-green-500 flex-shrink-0" />
                  <span>+234 800 TBH ONE</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Suite 14, Alausa Business Centre,<br />Ikeja, Lagos State, Nigeria.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-green-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-green-500">
            <p>© 2026 TBH One Movement. All rights reserved. Not an official campaign.</p>
            <div className="flex gap-6">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Use</button>
              <button className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

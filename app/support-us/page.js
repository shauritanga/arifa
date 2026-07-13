"use client";
import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { startPayment } from "../../lib/client/start-payment";
function RevealOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("opacity-100", "translate-y-0");
          entries[0].target.classList.remove("opacity-0", "translate-y-8");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 transition-all duration-1000 ease-out ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {" "}
      {children}{" "}
    </div>
  );
}
export default function SupportUsPage({ searchParams }) {
  const params = use(searchParams);
  const selectedPackage = params?.package || "";
  const selectedPackageLabel = selectedPackage
    ? `${selectedPackage.charAt(0).toUpperCase()}${selectedPackage.slice(1)} Package`
    : "";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    supportType: selectedPackage ? "sponsorship" : "financial",
    amount: "",
    packageName: selectedPackageLabel,
    message: selectedPackageLabel
      ? `I would like to sponsor ARIFA through the ${selectedPackageLabel}.`
      : "",
  });
  const isPayment = ["financial", "sponsorship"].includes(formData.supportType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!isPayment) {
      setTimeout(() => {
        alert("Thank you. ARIFA will contact you about this partnership inquiry.");
        setIsSubmitting(false);
      }, 1500);
      return;
    }

    try {
      // Navigates away to AirPay on success, so isSubmitting stays true.
      await startPayment({
        ...formData,
        paymentType:
          formData.supportType === "sponsorship" ? "sponsorship" : "donation",
      });
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* ====== Immersive Hero Section ====== */}{" "}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {" "}
        {/* Background Image & Cinematic Gradients */}{" "}
        <div className="absolute inset-0 z-0 bg-primary">
          {" "}
          <Image
            src="/support-hero.png"
            alt="AI Healthcare Research"
            fill
            className="object-cover object-center opacity-40 scale-105 transform hover:scale-100 transition-transform duration-[10s]"
            priority
          />{" "}
          <div className="absolute inset-0 bg-primary/80" />{" "}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-primary/80" />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10">
          {" "}
          <div className="max-w-[800px]">
            {" "}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-white text-sm font-semibold mb-8 animate-fadeInUp">
              {" "}
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />{" "}
              Partner With Us{" "}
            </div>{" "}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
              {" "}
              Empower the Future of{" "}
              <span className="text-secondary">African Prosperity</span>.{" "}
            </h1>{" "}
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 animate-fadeInUp animate-delay-200">
              {" "}
              Your support directly funds cutting-edge Artificial Intelligence
              research in healthcare, agriculture, and economic development.
              Together, we can build ethical, inclusive technologies that
              transform millions of lives.{" "}
            </p>{" "}
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fadeInUp animate-delay-300">
              {" "}
              <button
                onClick={() =>
                  document
                    .getElementById("pledge-form")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:bg-primary hover:-translate-y-1 transition-all"
              >
                {" "}
                Make a Donation <i className="fas fa-heart text-sm" />{" "}
              </button>{" "}
              <button
                onClick={() =>
                  document
                    .getElementById("partnership-tiers")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 hover:-translate-y-1 transition-all"
              >
                {" "}
                Explore Partnerships{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== The Impact Section (Why Support Us) ====== */}{" "}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          {" "}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {" "}
            <RevealOnScroll>
              {" "}
              <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">
                The Impact of Your Support
              </h2>{" "}
              <h3 className="text-3xl md:text-5xl font-extrabold text-black leading-tight mb-8 font-[var(--font-heading)]">
                {" "}
                AI Built for Africa, By Africa.{" "}
              </h3>{" "}
              <p className="text-lg text-black/70 leading-relaxed mb-8">
                {" "}
                ARIFA is uniquely positioned to address the continent&apos;s
                most pressing challenges. By supporting our institute, you are
                investing in localized solutions that global tech companies
                often overlook.{" "}
              </p>{" "}
              <ul className="space-y-6">
                {" "}
                <li className="flex gap-4">
                  {" "}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
                    {" "}
                    <i className="fas fa-seedling" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="text-xl font-bold text-black mb-2">
                      Sustainable Agriculture
                    </h4>{" "}
                    <p className="text-black/70 leading-relaxed">
                      Developing AI models that predict crop yields and detect
                      diseases early, directly enhancing food security.
                    </p>{" "}
                  </div>{" "}
                </li>{" "}
                <li className="flex gap-4">
                  {" "}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xl">
                    {" "}
                    <i className="fas fa-heartbeat" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="text-xl font-bold text-black mb-2">
                      Transformative Healthcare
                    </h4>{" "}
                    <p className="text-black/70 leading-relaxed">
                      Creating diagnostic tools suited for low-resource
                      environments to democratize access to quality care.
                    </p>{" "}
                  </div>{" "}
                </li>{" "}
                <li className="flex gap-4">
                  {" "}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xl">
                    {" "}
                    <i className="fas fa-user-graduate" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="text-xl font-bold text-black mb-2">
                      Empowering the Next Generation
                    </h4>{" "}
                    <p className="text-black/70 leading-relaxed">
                      Providing world-class AI certifications and training to
                      African youth, ensuring they lead the digital revolution.
                    </p>{" "}
                  </div>{" "}
                </li>{" "}
              </ul>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll
              delay={200}
              className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
            >
              {" "}
              <Image
                src="/support-impact.png"
                alt="AI in Agriculture"
                fill
                className="object-cover"
              />{" "}
              <div className="absolute inset-0 bg-primary/80" />{" "}
              <div className="absolute bottom-8 left-8 right-8">
                {" "}
                <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-white">
                  {" "}
                  <div className="text-3xl font-extrabold mb-2 font-[var(--font-heading)]">
                    100%
                  </div>{" "}
                  <div className="text-sm font-medium text-white/80 uppercase tracking-wide">
                    Of funding goes directly to research & capacity building
                    programs.
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </RevealOnScroll>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Ways to Partner Grid ====== */}{" "}
      <section
        id="partnership-tiers"
        className="py-24 md:py-32 bg-primary relative overflow-hidden"
      >
        {" "}
        {/* Background Accents */}{" "}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />{" "}
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          {" "}
          <div className="text-center max-w-[800px] mx-auto mb-20">
            {" "}
            <RevealOnScroll>
              {" "}
              <h2 className="text-sm font-bold text-secondary tracking-[0.2em] uppercase mb-4">
                Collaboration Models
              </h2>{" "}
              <h3 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6 font-[var(--font-heading)]">
                {" "}
                Ways to Engage & Support{" "}
              </h3>{" "}
              <p className="text-lg text-white/70 leading-relaxed">
                {" "}
                Whether you are an individual philanthropist, a global tech
                corporation, or an academic institution, there is a pathway for
                you to join our mission.{" "}
              </p>{" "}
            </RevealOnScroll>{" "}
          </div>{" "}
          <div className="grid md:grid-cols-3 gap-8">
            {" "}
            <RevealOnScroll delay={100}>
              {" "}
              <div className="h-full bg-white/5 border border-white/10 p-10 rounded-3xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group">
                {" "}
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl mb-8 shadow-lg">
                  {" "}
                  <i className="fas fa-hand-holding-heart" />{" "}
                </div>{" "}
                <h4 className="text-2xl font-bold text-white mb-4">
                  Philanthropic Giving
                </h4>{" "}
                <p className="text-white/70 leading-relaxed mb-8">
                  {" "}
                  Direct financial contributions to fund specific research
                  verticals, scholarships for underprivileged trainees, or
                  general institutional endowments.{" "}
                </p>{" "}
                <ul className="space-y-3 text-white/90 font-medium mb-8">
                  {" "}
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check text-secondary" /> One-time
                    Donations
                  </li>{" "}
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check text-secondary" /> Monthly
                    Pledges
                  </li>{" "}
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check text-secondary" /> Endowment
                    Funds
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll delay={200}>
              {" "}
              <div className="h-full bg-primary/20 border border-primary/30 p-10 rounded-3xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                {" "}
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                  Most Impactful
                </div>{" "}
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-white text-2xl mb-8 shadow-lg">
                  {" "}
                  <i className="fas fa-building" />{" "}
                </div>{" "}
                <h4 className="text-2xl font-bold text-white mb-4">
                  Corporate Partnership
                </h4>{" "}
                <p className="text-white/70 leading-relaxed mb-8">
                  {" "}
                  Strategic alliances with industry leaders to co-develop AI
                  solutions, sponsor large-scale projects, and tap into our
                  elite talent pool.{" "}
                </p>{" "}
                <ul className="space-y-3 text-white/90 font-medium mb-8">
                  {" "}
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check text-secondary" /> Joint Research
                    Initiatives
                  </li>{" "}
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check text-secondary" /> Lab
                    Sponsorships
                  </li>{" "}
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check text-secondary" /> Custom AI
                    Consultancy
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll delay={300}>
              {" "}
              <div className="h-full bg-white/5 border border-white/10 p-10 rounded-3xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group">
                {" "}
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl mb-8 shadow-lg">
                  {" "}
                  <i className="fas fa-university" />{" "}
                </div>{" "}
                <h4 className="text-2xl font-bold text-white mb-4">
                  Academic Collaboration
                </h4>{" "}
                <p className="text-white/70 leading-relaxed mb-8">
                  {" "}
                  Partnering with global universities and research institutes to
                  share data, co-author publications, and facilitate researcher
                  exchange programs.{" "}
                </p>{" "}
                <ul className="space-y-3 text-white/90 font-medium mb-8">
                  {" "}
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check text-secondary" /> Data &
                    Resource Sharing
                  </li>{" "}
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check text-secondary" /> Co-Authored
                    Journals
                  </li>{" "}
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check text-secondary" /> Faculty
                    Exchanges
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
            </RevealOnScroll>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Donation / Contact Form ====== */}{" "}
      <section id="pledge-form" className="py-24 md:py-32 bg-white relative">
        {" "}
        <div className="max-w-[800px] mx-auto px-6">
          {" "}
          <RevealOnScroll>
            {" "}
            <div className="text-center mb-16">
              {" "}
              <h2 className="text-3xl md:text-5xl font-extrabold text-black leading-tight mb-6 font-[var(--font-heading)]">
                {" "}
                Make Your Pledge Today{" "}
              </h2>{" "}
              <p className="text-lg text-black/70 leading-relaxed">
                {" "}
                Fill out the form below to process your financial contribution
                or sponsorship via AirPay, or to initiate a corporate
                partnership discussion.{" "}
              </p>{" "}
            </div>{" "}
            <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-black/10 p-8 md:p-12">
              {" "}
              <form onSubmit={handleSubmit} className="space-y-8">
                {" "}
                <div className="grid md:grid-cols-2 gap-8">
                  {" "}
                  <div>
                    {" "}
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Full Name
                    </label>{" "}
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-xl bg-white border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                      placeholder="Jane Doe"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Email Address
                    </label>{" "}
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-xl bg-white border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                      placeholder="jane@example.com"
                    />{" "}
                  </div>{" "}
                </div>{" "}
                <div className="grid md:grid-cols-2 gap-8">
                  {" "}
                  <div>
                    {" "}
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Phone Number
                    </label>{" "}
                    <input
                      type="tel"
                      name="phone"
                      required={isPayment}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-xl bg-white border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                      placeholder="+255 700 000 000"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Organization (Optional)
                    </label>{" "}
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      className="w-full px-5 py-4 rounded-xl bg-white border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                      placeholder="Company or Foundation"
                    />{" "}
                  </div>{" "}
                </div>{" "}
                <div>
                    {" "}
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Type of Support
                    </label>{" "}
                    <select
                      name="supportType"
                      value={formData.supportType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          supportType: e.target.value,
                        })
                      }
                      className="w-full px-5 py-4 rounded-xl bg-white border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium appearance-none"
                    >
                      {" "}
                      <option value="financial">Financial Donation</option>{" "}
                      <option value="sponsorship">Sponsorship Payment</option>{" "}
                      <option value="corporate">Corporate Partnership</option>{" "}
                      <option value="academic">
                        Academic Collaboration
                      </option>{" "}
                    </select>{" "}
                </div>{" "}
                {isPayment && (
                  <div className="animate-fadeInUp">
                    {" "}
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Payment Amount (TZS)
                    </label>{" "}
                    <div className="relative">
                      {" "}
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-black/70">
                        TSh
                      </span>{" "}
                      <input
                        type="number"
                        name="amount"
                        required
                        min="1000"
                        step="1"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        className="w-full pl-16 pr-5 py-4 rounded-xl bg-white border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-lg text-primary"
                        placeholder="1,000,000"
                      />{" "}
                    </div>{" "}
                    {formData.supportType === "sponsorship" && (
                      <p className="mt-3 text-sm text-black/60">
                        Enter the agreed sponsorship amount in Tanzanian
                        shillings. USD package prices are shown for planning and
                        should be confirmed with ARIFA before payment.
                      </p>
                    )}
                  </div>
                )}{" "}
                <div>
                  {" "}
                  <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                    Message or Specific Intent
                  </label>{" "}
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-xl bg-white border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium resize-none"
                    placeholder="Let us know if you want to fund a specific research area..."
                  ></textarea>{" "}
                </div>{" "}
                <div className="pt-6">
                  {" "}
                  {error && (
                    <div
                      role="alert"
                      className="mb-4 rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700"
                    >
                      {error}
                    </div>
                  )}{" "}
                  {isPayment ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {" "}
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          {" "}
                          <i className="fas fa-lock opacity-70" /> Proceed to
                          AirPay Secure Payment{" "}
                          <i className="fas fa-arrow-right opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all absolute right-8" />{" "}
                        </>
                      )}{" "}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {" "}
                      {isSubmitting ? "Submitting..." : "Submit Inquiry"}{" "}
                    </button>
                  )}{" "}
                  {isPayment && (
                    <div className="text-center mt-4 flex items-center justify-center gap-4 text-sm text-black/70 font-medium">
                      {" "}
                      <span>
                        <i className="fas fa-shield-check text-secondary mr-1" />{" "}
                        Encrypted
                      </span>{" "}
                      <span>
                        <i className="fas fa-bolt text-secondary mr-1" /> AirPay
                        Powered
                      </span>{" "}
                    </div>
                  )}{" "}
                </div>{" "}
              </form>{" "}
            </div>{" "}
          </RevealOnScroll>{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
function RevealOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("opacity-100", "translate-y-0");
          entries[0].target.classList.remove("opacity-0", "translate-y-6");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {" "}
      {children}{" "}
    </div>
  );
}
const engagements = [
  // Upcoming / Available on Website { day: "15", month: "Jul", year: "2026", title: "ARIFA Annual AI Conference 2026", location: "YMCA Building, Dar es Salaam, Tanzania", desc: "Join leading AI researchers and practitioners for our flagship annual conference featuring keynotes, workshops, and networking sessions.", type: "Upcoming" }, { day: "02", month: "Aug", year: "2026", title: "Robotics & Innovation Challenge", location: "Dar es Salaam, Tanzania", desc: "A hands-on robotics competition bringing together young innovators to design AI-powered solutions for real-world challenges.", type: "Upcoming" }, { day: "18", month: "Sep", year: "2026", title: "Women in AI — East Africa Meetup", location: "Virtual Event", desc: "A networking and mentorship event dedicated to highlighting and supporting female researchers and engineers in the African AI ecosystem.", type: "Upcoming" }, { day: "10", month: "Oct", year: "2026", title: "Data Science for Public Policy Workshop", location: "Dodoma, Tanzania", desc: "An exclusive workshop for government officials and policymakers on leveraging data analytics for evidence-based decision making.", type: "Upcoming" }, // Past Events from Document { day: "05", month: "Jul", year: "2025", title: "Webinar: Data Protection and Responsible AI Use", location: "Online", desc: "ARIFA hosted a thought-provoking webinar on Data Protection and Responsible AI Use, aimed at raising awareness on how organizations can safeguard personal data while maximizing the value of AI. The session featured expert insights on ethical data practices, regulatory compliance, and responsible AI deployment across sectors.", type: "Past" }, { day: "17", month: "May", year: "2025", title: "Webinar: Keeping Up with AI Research Papers", location: "Online", desc: "ARIFA organized a practical and insightful webinar titled \"Keeping Up with AI Research Papers,\" delivered by our Research Assistant, Mr. Edson Stanley. The session provided participants with effective strategies for discovering, reading, and staying up to date with the rapidly evolving world of AI research.", type: "Past" }, { day: "24", month: "Apr", year: "2025", title: "Training: AI for Business Growth", location: "AURA Suites Hotel, Dar es Salaam", desc: "ARIFA successfully organized a high-impact training session equipping entrepreneurs, business leaders, and professionals with practical knowledge on leveraging AI to drive innovation, optimize operations, and enhance customer engagement.", type: "Past" }, { day: "21", month: "Mar", year: "2025", title: "Business Synergies: ARIFA and Aura Suites Hotel", location: "Aura Suites Hotel, Dar es Salaam, Tanzania", desc: "ARIFA held a strategic meeting with the management of AURA Suites Hotel to explore potential business synergies. The discussion focused on opportunities for collaboration in hosting future innovation events, trainings, and AI-driven hospitality solutions.", type: "Past" }, { day: "07", month: "Jul", year: "2023", title: "AI For Good Summit", location: "Geneva, Switzerland", desc: "The ARIFA team proudly participated in the AI for Good Summit. This global event convened thought leaders, innovators, and policymakers to explore how AI can be harnessed to address the world's most pressing challenges. ARIFA engaged in key discussions on ethical AI, digital inclusion, and sustainable development.", type: "Past" }, { day: "05", month: "Jun", year: "2023", title: "Partnership Agreement between ARIFA & ICT Commission", location: "Dar es Salaam, Tanzania", desc: "ARIFA signed a landmark Partnership Agreement with the ICT Commission of Tanzania. This strategic collaboration aims to accelerate AI adoption, research, and innovation across the country, setting the foundation for joint initiatives in policy development and capacity building.", type: "Past" }, { day: "16", month: "Mar", year: "2023", title: "Conference on the State of AI in Africa (COSAA) 2023 & AI for Leaders Summit", location: "Strathmore University, Nairobi, Kenya", desc: "ARIFA participated in COSAA 2023 and the AI for Leaders Summit, presenting a research paper on \"The Role of Data in AI Innovation and Research.\" The conference provided a valuable platform to share insights and strengthen regional collaboration in advancing AI across Africa.", type: "Past" }, { day: "05", month: "Mar", year: "2023", title: "Webinar: AI in Healthcare, How Far Behind is East Africa", location: "Online", desc: "ARIFA organized a thought-provoking webinar led by our Director of Research & Innovation, Prof. Benedictor Nguchu, providing critical insights into the current state, challenges, and opportunities for AI adoption in the region's healthcare systems.", type: "Past" }, { day: "05", month: "Nov", year: "2022", title: "Road to Success Speakers Conference 2022", location: "Dar es Salaam, Tanzania", desc: "ARIFA was proud to sponsor this transformative event dedicated to grooming extraordinary speakers and empowering voices for impact. By supporting this initiative, ARIFA reaffirmed its commitment to nurturing talent and building leadership capacity.", type: "Past" }, { day: "22", month: "Sep", year: "2022", title: "Memorandum of Understanding between ARIFA & RCT", location: "Mikocheni, Dar es Salaam, Tanzania", desc: "ARIFA signed an MoU with the Rice Council of Tanzania (RCT), marking a strategic partnership to promote AI-driven solutions in agriculture to enhance productivity and sustainability in Tanzania's rice sector.", type: "Past" }, { day: "26", month: "Aug", year: "2022", title: "Dissemination Workshop: Unified AI-Enabled Health Referral System", location: "Seashells Millenium Towers Hotel, Dar es Salaam, Tanzania", desc: "ARIFA successfully organized a dissemination workshop focused on developing a framework to unify healthcare stakeholders through structured, high-quality data sets to streamline referrals and support universal health coverage.", type: "Past" }, { day: "18", month: "May", year: "2022", title: "Basic ICT Training for People Living With Disabilities (PWDs)", location: "Tanzanite Tower, Dar es Salaam, Tanzania", desc: "ARIFA organized a Basic ICT Training for PWDs, equipping participants with essential computer and digital literacy skills to access opportunities in education, employment, and entrepreneurship.", type: "Past" }
];
export default function Engagements() {
  const upcomingEvents = engagements.filter((e) => e.type === "Upcoming");
  const pastEvents = engagements.filter((e) => e.type === "Past");
  return (
    <>
      {" "}
      {/* ====== Page Header ====== */}{" "}
      <section className="relative pt-40 pb-24 bg-primary overflow-hidden">
        {" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <Image
            src="/about-img.png"
            alt="Events Background"
            fill
            className="object-cover object-center opacity-35"
            priority
          />{" "}
          <div className="absolute inset-0 bg-primary/70" />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          {" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp font-[var(--font-heading)]">
            {" "}
            Our <span className="text-secondary">Engagements</span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-100">
            {" "}
            A comprehensive overview of ARIFA&apos;s past and upcoming
            conferences, workshops, and strategic partnerships.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Upcoming Events ====== */}{" "}
      <section className="py-24 bg-white">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
              Join Us
            </span>{" "}
            <h2 className="text-3xl md:text-4xl font-extrabold text-black font-[var(--font-heading)]">
              {" "}
              Upcoming Events{" "}
            </h2>{" "}
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {upcomingEvents.map((event, idx) => (
              <RevealOnScroll
                key={idx}
                delay={(idx % 3) * 100}
                className="bg-white rounded-2xl flex flex-col overflow-hidden border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group"
              >
                {" "}
                {/* Date Header */}{" "}
                <div className="bg-primary text-white p-6 relative overflow-hidden">
                  {" "}
                  <div className="flex items-center gap-4 relative z-10">
                    {" "}
                    <span className="text-5xl font-extrabold font-[var(--font-heading)] leading-none">
                      {event.day}
                    </span>{" "}
                    <div className="flex flex-col">
                      {" "}
                      <span className="text-lg font-bold uppercase tracking-widest text-secondary leading-tight">
                        {event.month}
                      </span>{" "}
                      <span className="text-sm font-medium opacity-90">
                        {event.year}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Content */}{" "}
                <div className="p-8 flex-grow flex flex-col">
                  {" "}
                  <h3 className="text-xl font-bold text-black font-[var(--font-heading)] mb-4 group-hover:text-primary transition-colors leading-snug">
                    {" "}
                    {event.title}{" "}
                  </h3>{" "}
                  <p className="text-sm font-semibold text-black/70 mb-4 flex items-center gap-2">
                    {" "}
                    <i className="fas fa-map-marker-alt text-secondary" />{" "}
                    {event.location}{" "}
                  </p>{" "}
                  <p className="text-black/70 leading-relaxed text-sm flex-grow">
                    {" "}
                    {event.desc}{" "}
                  </p>{" "}
                  <div className="mt-8 pt-6 border-t border-black/10">
                    {" "}
                    <Link
                      href="/contact-us"
                      className="inline-flex items-center text-sm font-bold text-primary hover:text-secondary transition-colors group/link"
                    >
                      {" "}
                      Register Now{" "}
                      <i className="fas fa-arrow-right ml-2 text-[0.8em] group-hover/link:translate-x-1 transition-transform" />{" "}
                    </Link>{" "}
                  </div>{" "}
                </div>{" "}
              </RevealOnScroll>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Past Events ====== */}{" "}
      <section className="py-24 bg-white border-t border-black/10">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">
              Our Track Record
            </span>{" "}
            <h2 className="text-3xl md:text-4xl font-extrabold text-black font-[var(--font-heading)]">
              {" "}
              Past Engagements{" "}
            </h2>{" "}
            <div className="w-20 h-1 bg-secondary mx-auto mt-6 rounded-full" />{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {pastEvents.map((event, idx) => (
              <RevealOnScroll
                key={idx}
                delay={(idx % 3) * 50}
                className="bg-white rounded-2xl flex flex-col overflow-hidden border border-black/10 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group"
              >
                {" "}
                {/* Date Header */}{" "}
                <div className="bg-primary text-white p-5 flex items-center gap-3 border-b-4 border-transparent group-hover:border-primary transition-colors">
                  {" "}
                  <span className="text-3xl font-extrabold font-[var(--font-heading)] leading-none text-white/90">
                    {event.day}
                  </span>{" "}
                  <div className="flex flex-col">
                    {" "}
                    <span className="text-sm font-bold uppercase tracking-widest text-secondary leading-tight">
                      {event.month}
                    </span>{" "}
                    <span className="text-xs font-medium opacity-60">
                      {event.year}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Content */}{" "}
                <div className="p-6 flex-grow flex flex-col">
                  {" "}
                  <h3 className="text-lg font-bold text-black font-[var(--font-heading)] mb-3 group-hover:text-primary transition-colors leading-snug">
                    {" "}
                    {event.title}{" "}
                  </h3>{" "}
                  <p className="text-xs font-semibold text-black/70 mb-4 flex items-center gap-2">
                    {" "}
                    <i className="fas fa-map-marker-alt text-secondary" />{" "}
                    {event.location}{" "}
                  </p>{" "}
                  <p className="text-sm text-black/70 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                    {" "}
                    {event.desc}{" "}
                  </p>{" "}
                </div>{" "}
              </RevealOnScroll>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}

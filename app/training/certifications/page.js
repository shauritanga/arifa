"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ApplyButton from "@/app/components/ApplyButton";

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
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
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
      {children}
    </div>
  );
}

const certifications = [
  {
    "title": "Certified Digital Marketing Professional (CDMP)",
    "image": "https://arifa.org/storage/certifications/CDMP.jpg",
    "desc": "The Certified Digital Marketing Professional (CDMP) program prepares participants to plan, execute, analyze, and optimize digital marketing campaigns using a data-driven, omnichannel approach. It covers SEO, SEM, content marketing, social media, email, analytics, and digital strategy, empowering professionals to deliver impactful campaigns for brands, NGOs, startups, or public sector organizations.",
    "view_url": "https://arifa.org/certification/view/20",
    "apply_url": "https://arifa.org/certification/apply/20",
    "category": "Emerging Tech"
  },
  {
    "title": "Certified Business Intelligence Professional (CBIP)",
    "image": "https://arifa.org/storage/certifications/CBIP.jpg",
    "desc": "The Certified Business Intelligence Professional (CBIP) certification equips professionals with the competencies to analyze data, build dashboards, design reports, and support strategic decisions through data storytelling and visualization. It blends business acumen, analytics, and technical skills with tools such as Power BI, Tableau, Excel, SQL, and Google Looker Studio.",
    "view_url": "https://arifa.org/certification/view/19",
    "apply_url": "https://arifa.org/certification/apply/19",
    "category": "Emerging Tech"
  },
  {
    "title": "Certified Cyber Security Professional (CCSP)",
    "image": "https://arifa.org/storage/certifications/CCSP.jpg",
    "desc": "The Certified Cyber Security Professional (CCSP) is a practical, multi-domain certification program that equips professionals with the technical skills and strategic awareness needed to identify, prevent, detect, and respond to cybersecurity threats and incidents. The program covers key domains including network security, cloud security, ethical hacking, digital forensics, and governance.",
    "view_url": "https://arifa.org/certification/view/18",
    "apply_url": "https://arifa.org/certification/apply/18",
    "category": "Emerging Tech"
  },
  {
    "title": "Certified Blockchain Professional (CBP)",
    "image": "https://arifa.org/storage/certifications/CBP.jpg",
    "desc": "The Certified Blockchain Professional (CBP) program is an industry-aligned certification that provides participants with in-depth knowledge of blockchain technology, decentralized systems, smart contracts, and real-world blockchain applications. It empowers professionals to understand, build, and manage blockchain solutions for finance, supply chain, governance, identity, and more.",
    "view_url": "https://arifa.org/certification/view/17",
    "apply_url": "https://arifa.org/certification/apply/17",
    "category": "Emerging Tech"
  },
  {
    "title": "Certified Internet of Things Professional (CIoTP)",
    "image": "https://arifa.org/storage/certifications/CIoTP.jpg",
    "desc": "The Certified Internet of Things Professional (CIoTP) certification is a comprehensive program that prepares participants to work at the intersection of hardware, software, networking, and data in IoT environments. It covers the end-to-end development of IoT systems from sensors and microcontrollers to cloud integration, data visualization, and edge intelligence.",
    "view_url": "https://arifa.org/certification/view/16",
    "apply_url": "https://arifa.org/certification/apply/16",
    "category": "Emerging Tech"
  },
  {
    "title": "Certified Cloud Computing Professional (CCCP)",
    "image": "https://arifa.org/storage/certifications/CCCP.jpg",
    "desc": "The Certified Cloud Computing Professional (CCCP) certification prepares participants to become cloud architects, engineers, or system administrators with the expertise to manage modern, scalable, and secure cloud infrastructure. Covering major platforms like AWS, Microsoft Azure, and Google Cloud Platform (GCP), the program offers real-world cloud labs, architectural design exercises, and deployment simulations.",
    "view_url": "https://arifa.org/certification/view/15",
    "apply_url": "https://arifa.org/certification/apply/15",
    "category": "Emerging Tech"
  },
  {
    "title": "Certified Computer Vision Professional (CCVP)",
    "image": "https://arifa.org/storage/certifications/CCVP.jpg",
    "desc": "The Certified Computer Vision Professional (CCVP) certification is an advanced, applied program for professionals building intelligent systems that can see, understand, and interpret visual data. This certification equips participants with the skills to design, train, and deploy computer vision models using deep learning frameworks, real-world datasets, and best practices in responsible and scalable AI deployment.",
    "view_url": "https://arifa.org/certification/view/14",
    "apply_url": "https://arifa.org/certification/apply/14",
    "category": "Specialized AI"
  },
  {
    "title": "Certified Natural Language Processing Professional (CNLPP)",
    "image": "https://arifa.org/storage/certifications/CNLPP.jpg",
    "desc": "The Certified Natural Language Processing Professional (CNLPP) certification is an advanced program for practitioners aiming to specialize in language technologies and AI-driven text and speech systems. This program provides deep expertise in building, fine-tuning, and deploying NLP models using state-of-the-art techniques and tools, including transformers, generative models, and multilingual AI.",
    "view_url": "https://arifa.org/certification/view/13",
    "apply_url": "https://arifa.org/certification/apply/13",
    "category": "Specialized AI"
  },
  {
    "title": "Certified Deep Learning Professional (CDLP)",
    "image": "https://arifa.org/storage/certifications/CDLP.jpg",
    "desc": "The Certified Deep Learning Professional (CDLP) program is an advanced technical certification for individuals seeking to design, optimize, and deploy cutting-edge deep neural networks. This course immerses participants in modern deep learning theory and practice, empowering them to build scalable, high-performance models across domains like vision, language, time series, and generative AI.",
    "view_url": "https://arifa.org/certification/view/12",
    "apply_url": "https://arifa.org/certification/apply/12",
    "category": "Specialized AI"
  },
  {
    "title": "Certified Machine Learning Engineer (CMLE)",
    "image": "https://arifa.org/storage/certifications/CMLE.jpg",
    "desc": "The Certified Machine Learning Engineer (CMLE) certification is an advanced, industry-driven program designed to prepare learners for building, deploying, and maintaining scalable ML systems in production environments. It blends machine learning expertise with software engineering, DevOps, and cloud computing to prepare participants for real-world challenges in AI delivery.",
    "view_url": "https://arifa.org/certification/view/11",
    "apply_url": "https://arifa.org/certification/apply/11",
    "category": "Machine Learning"
  },
  {
    "title": "Certified Machine Learning Scientist (CMLS)",
    "image": "https://arifa.org/storage/certifications/CMLS.jpg",
    "desc": "The Certified Machine Learning Scientist (CMLS) is an advanced certification for practitioners and researchers seeking deep expertise in the theoretical foundations, experimental design, and innovative development of machine learning systems. The program builds proficiency in ML theory, algorithmic design, probabilistic modeling, and scientific research methodologies, empowering professionals to push the boundaries of AI innovation.",
    "view_url": "https://arifa.org/certification/view/10",
    "apply_url": "https://arifa.org/certification/apply/10",
    "category": "Machine Learning"
  },
  {
    "title": "Certified Machine Learning Associate (CMLA)",
    "image": "https://arifa.org/storage/certifications/CMLA.jpg",
    "desc": "The Certified Machine Learning Associate (CMLA) is a hands-on, project-based certification designed to prepare participants for technical roles in machine learning and applied AI. It focuses on core ML concepts, model building, feature engineering, and performance evaluation using Python and leading ML libraries.",
    "view_url": "https://arifa.org/certification/view/9",
    "apply_url": "https://arifa.org/certification/apply/9",
    "category": "Machine Learning"
  },
  {
    "title": "Certified Data Analyst (CDA)",
    "image": "https://arifa.org/storage/certifications/CDA.jpg",
    "desc": "The Certified Data Analyst (CDA) certification is an applied, entry-to-mid-level program that prepares participants to collect, clean, analyze, visualize, and communicate data to inform decision-making. Whether you're starting your career in analytics or upskilling into a more data-driven role, this program offers the foundational tools and workflows required in today\u2019s business environments.",
    "view_url": "https://arifa.org/certification/view/8",
    "apply_url": "https://arifa.org/certification/apply/8",
    "category": "Data Science"
  },
  {
    "title": "Certified Data Science Consultant (CDSC)",
    "image": "https://arifa.org/storage/certifications/CDSC.jpg",
    "desc": "The Certified Data Science Consultant (CDSC) certification is a leadership-level program designed for professionals who advise, design, and manage data-driven transformation initiatives. This program emphasizes business impact, data strategy formulation, stakeholder engagement, and governance compliance, preparing participants to serve as data science consultants in private, public, or international development environments.",
    "view_url": "https://arifa.org/certification/view/7",
    "apply_url": "https://arifa.org/certification/apply/7",
    "category": "Data Science"
  },
  {
    "title": "Certified Data Science Professional (CDSP)",
    "image": "https://arifa.org/storage/certifications/CDSP.jpg",
    "desc": "The Certified Data Science Professional (CDSP) is an advanced program tailored for experienced data practitioners who aim to deepen their expertise in statistical modeling, machine learning, data engineering, and business analytics. The certification integrates technical mastery, real-world projects, and strategic problem-solving, empowering professionals to lead high-impact data initiatives in industry or government.",
    "view_url": "https://arifa.org/certification/view/6",
    "apply_url": "https://arifa.org/certification/apply/6",
    "category": "Data Science"
  },
  {
    "title": "Certified Data Science Associate (CDSA)",
    "image": "https://arifa.org/storage/certifications/cdsa.jpg",
    "desc": "The Certified Data Science Associate (CDSA) is a practical, career-focused program that introduces participants to the core competencies required for modern data science roles. It builds proficiency in statistical thinking, data exploration, predictive modeling, and communicating insights using real-world datasets and tools.",
    "view_url": "https://arifa.org/certification/view/5",
    "apply_url": "https://arifa.org/certification/apply/5",
    "category": "Data Science"
  },
  {
    "title": "Certified Artificial Intelligence Consultant (CAIC)",
    "image": "https://arifa.org/storage/certifications/caic.jpg",
    "desc": "The Certified Artificial Intelligence Consultant (CAIC) is an executive-level program designed to equip professionals with the skills and knowledge to lead AI transformation in businesses, governments, and development sectors. Participants will learn how to evaluate AI maturity, formulate strategies, manage risks, and align AI adoption with organizational goals and ethical standards.",
    "view_url": "https://arifa.org/certification/view/4",
    "apply_url": "https://arifa.org/certification/apply/4",
    "category": "Artificial Intelligence"
  },
  {
    "title": "Certified Artificial Intelligence Professional (CAIP)",
    "image": "https://arifa.org/storage/certifications/caip.jpg",
    "desc": "The Certified Artificial Intelligence Professional (CAIP) is a specialized certification for individuals seeking mastery in AI development, deployment, and strategy. This program emphasizes leadership in AI, cutting-edge innovation, and the design of scalable, ethical AI systems that address high-impact challenges in business and society.",
    "view_url": "https://arifa.org/certification/view/3",
    "apply_url": "https://arifa.org/certification/apply/3",
    "category": "Artificial Intelligence"
  },
  {
    "title": "Certified Artificial Intelligence Engineer (CAIE)",
    "image": "https://arifa.org/storage/certifications/caie.jpg",
    "desc": "The Certified Artificial Intelligence Engineer (CAIE) program equips participants with the practical expertise required to build, optimize, and deploy AI systems in production environments. This intensive program focuses on software engineering practices, deep learning architectures, AI system pipelines, and deployment at scale, blending academic rigor with industry-driven engineering standards.",
    "view_url": "https://arifa.org/certification/view/2",
    "apply_url": "https://arifa.org/certification/apply/2",
    "category": "Artificial Intelligence"
  },
  {
    "title": "Certified Artificial Intelligence Associate (CAIA)",
    "image": "https://arifa.org/storage/certifications/caia.jpg",
    "desc": "The Certified Artificial Intelligence Associate (CAIA) is an intermediate-level certification that builds upon foundational AI knowledge. It prepares participants to design, implement, and manage AI-driven solutions in real-world settings. This program blends theory with practical applications, emphasizing problem-solving, project-based learning, and ethical AI deployment.",
    "view_url": "https://arifa.org/certification/view/1",
    "apply_url": "https://arifa.org/certification/apply/1",
    "category": "Artificial Intelligence"
  }
];

export default function Certifications() {
  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="relative pt-40 pb-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/program-certification.png"
            alt="Certifications Background"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/80 to-dark" />
        </div>
        
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-6 animate-fadeInUp">
            Training
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#FDE68A]">Certifications</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            Industry-recognized certification programs designed to build world-class AI, Data Science, and Tech talent across Africa.
          </p>
        </div>
      </section>

      {/* ====== Certification Grid ====== */}
      <section className="py-24 bg-[var(--color-surface)] min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto px-6">
          
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <h2 className="text-3xl font-bold text-dark font-[var(--font-heading)] mb-6">Our Comprehensive Certification Portfolio</h2>
            <p className="text-[var(--color-text-muted)] text-lg">
              Explore our wide range of professional certifications tailored for different career stages, from foundational concepts to advanced engineering and strategic consulting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, idx) => (
              <RevealOnScroll key={idx} delay={(idx % 3) * 50} className="bg-white rounded-2xl overflow-hidden border border-border-light shadow-[0_4px_20px_rgba(26,26,46,0.04)] hover:shadow-[0_20px_40px_rgba(26,26,46,0.12)] transition-all group flex flex-col h-full">
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  {cert.image && (
                    <Image 
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-white/90 backdrop-blur text-dark shadow-sm">
                      {cert.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-dark font-[var(--font-heading)] leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-sm mb-6 line-clamp-3 leading-relaxed">
                    {cert.desc}
                  </p>
                  
                  <div className="mt-auto pt-5 border-t border-border-light flex justify-between items-center gap-4">
                    <Link href={`/training/certifications/view/${cert.view_url.split('/').pop()}`} className="text-sm font-bold text-dark hover:text-primary transition-colors flex-1 text-center py-2.5 border border-border-light hover:border-primary rounded-lg">
                      View Syllabus
                    </Link>
                    <ApplyButton 
                      courseTitle={cert.title}
                      courseImage={cert.image}
                      className="text-sm font-bold text-white bg-primary hover:bg-primary-light transition-colors flex-1 text-center py-2.5 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    />
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

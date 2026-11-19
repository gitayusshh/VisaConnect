
import { Link } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  Briefcase,
  Plane,
  FileCheck,
  Search,
  CalendarCheck,
  ShieldCheck,
  Clock3,
  Globe2,
  Headphones,
  Star,
  Quote,
  CheckCircle2
} from "lucide-react";

import countries from "../data/countries";
import CountryCard from "../components/CountryCard";

function Home() {
  const services = [
    {
      title: "Tourist Visa",
      description: "Explore your dream destinations with guidance.",
      icon: Plane
    },
    {
      title: "Student Visa",
      description: "Start your international education journey.",
      icon: GraduationCap
    },
    {
      title: "Work Visa",
      description: "Explore global career opportunities.",
      icon: Briefcase
    },
    {
      title: "Business Visa",
      description: "Travel internationally for business purposes.",
      icon: FileCheck
    }
  ];

  const benefits = [
    {
      title: "Easy Online Applications",
      description:
        "Complete a simple step-by-step application without complicated paperwork.",
      icon: FileCheck
    },
    {
      title: "Application Tracking",
      description:
        "Stay informed about your application progress through a clear tracking dashboard.",
      icon: Clock3
    },
    {
      title: "Multiple Destinations",
      description:
        "Explore visa information for popular destinations around the world.",
      icon: Globe2
    },
    {
      title: "Consultation Booking",
      description:
        "Choose a convenient time and schedule a simulated consultation online.",
      icon: Headphones
    }
  ];

  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Student Visa Applicant",
      country: "Canada",
      message:
        "The application steps were easy to understand, and the tracking feature made the process simple."
    },
    {
      name: "Priya Mehta",
      role: "Tourist Visa Applicant",
      country: "United Kingdom",
      message:
        "I liked how clearly the destination requirements were presented and how quickly I could book a consultation."
    },
    {
      name: "Rohan Kapoor",
      role: "Work Visa Applicant",
      country: "Germany",
      message:
        "The dashboard and application tracking features made everything feel organized and convenient."
    }
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-content">
          <div>
            <span className="hero-tag">
              Your Journey Starts Here
            </span>

            <h1>
              Your Gateway to
              <span> Global Opportunities</span>
            </h1>

            <p>
              Explore visa destinations, apply online,
              book consultations, and track your visa
              application — all in one place.
            </p>

            <div className="hero-buttons">
              <Link to="/apply" className="primary-btn">
                Apply for Visa <ArrowRight size={18} />
              </Link>

              <Link to="/countries" className="outline-btn">
                Explore Countries
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <Plane size={100} strokeWidth={1.2} />
            <h2>Explore the World</h2>
            <p>Your next destination is waiting.</p>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="section container">
        <div className="section-heading">
          <span>POPULAR DESTINATIONS</span>
          <h2>Explore Visa Destinations</h2>
          <p>
            Discover visa information for popular countries.
          </p>
        </div>

        <div className="country-grid">
          {countries.slice(0, 6).map((country) => (
            <CountryCard
              key={country.id}
              country={country}
            />
          ))}
        </div>

        <div className="center">
          <Link to="/countries" className="outline-btn">
            View All Countries <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* VISA SERVICES */}
      <section className="services-section">
        <div className="container section">
          <div className="section-heading">
            <span>OUR SERVICES</span>
            <h2>Visa Services for Every Journey</h2>
            <p>
              Choose the visa service that suits your needs.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  className="service-card"
                  key={service.title}
                >
                  <div className="service-icon">
                    <Icon size={27} />
                  </div>

                  <h3>{service.title}</h3>
                  <p>{service.description}</p>

                  <Link to="/countries">
                    Explore Service
                    <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section container">
        <div className="section-heading">
          <span>SIMPLE PROCESS</span>
          <h2>How It Works</h2>
          <p>
            Follow four simple steps to begin your visa journey.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <Search size={34} />
            <h3>1. Explore</h3>
            <p>
              Choose your destination and visa category.
            </p>
          </div>

          <div className="step-card">
            <FileCheck size={34} />
            <h3>2. Apply</h3>
            <p>
              Complete the visa application form.
            </p>
          </div>

          <div className="step-card">
            <CalendarCheck size={34} />
            <h3>3. Consult</h3>
            <p>
              Schedule a consultation with our team.
            </p>
          </div>

          <div className="step-card">
            <ShieldCheck size={34} />
            <h3>4. Track</h3>
            <p>
              Monitor your application progress online.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-choose-section">
        <div className="container section">
          <div className="section-heading">
            <span>WHY CHOOSE US</span>
            <h2>A Simpler Way to Plan Your Visa Journey</h2>
            <p>
              Everything you need to explore destinations,
              organize applications, and track progress
              in one convenient platform.
            </p>
          </div>

          <div className="benefits-grid">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  className="benefit-card"
                  key={benefit.title}
                >
                  <div className="benefit-icon">
                    <Icon size={28} />
                  </div>

                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>

                  <div className="benefit-check">
                    <CheckCircle2 size={17} />
                    <span>Available in Demo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section container">
        <div className="section-heading">
          <span>TESTIMONIALS</span>
          <h2>What Our Sample Users Say</h2>
          <p>
            Example testimonials illustrating the
            VisaConnect experience.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div
              className="testimonial-card"
              key={testimonial.name}
            >
              <div className="testimonial-top">
                <Quote size={28} />

                <div className="testimonial-stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={17}
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>

              <p className="testimonial-message">
                "{testimonial.message}"
              </p>

              <div className="testimonial-user">
                <div className="testimonial-avatar">
                  {testimonial.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>

                <div>
                  <h4>{testimonial.name}</h4>
                  <span>
                    {testimonial.role} · {testimonial.country}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="testimonial-disclaimer">
          Testimonials are fictional examples created for
          demonstration purposes.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Visa Journey?</h2>

          <p>
            Explore destinations and begin your application.
          </p>

          <Link to="/apply" className="cta-btn">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;

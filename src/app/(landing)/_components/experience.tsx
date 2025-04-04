"use client";

import { useEffect, useRef } from "react";
import { Briefcase, Calendar } from "lucide-react";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      itemRefs.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  const experiences = [
    {
      title: "Full Stack Developer",
      company: "Swivt Technology",
      period: "2023 - Present",
      description:
        "Currently involved in full stack projects to design and develop as per the client’s requirement. I also had a chance to lead a team of developers to motivate and assign the task respectively. ",
    },
    {
      title: "Software Engineer",
      company: "Gurzu Inc",
      period: "2021 - 2023",
      description:
        "Worked as a backend engineer. The major job description was to create a backend system using AWS services. Also worked as a custom app developer with Shopify. ",
    },
    {
      title: "Freelance Web/Mobile Developer",
      company: "",
      period: "2019 - 2021",
      description:
        "Worked with multiple clients and different projects as web and mobile developer. Ecommerce websites, Mobile apps and Backend systems were the kind of projects I was mostly involved in. ",
    },
    {
      title: "Software Programmer",
      company: "Real time solutions",
      period: "2016 - 2019",
      description:
        "Worked as a backend Nodejs developer. The job description was to create a scalable system to handle requests from IOT devices and process it accordingly using microservices. Also worked with a raspberry pi to design nodes of the IOT system.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className=" relative opacity-0 transition-opacity duration-1000 ease-in-out"
    >
      <div className="absolute inset-0 bg-dots-pattern opacity-5 z-0"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Work Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey and the companies I&apos;ve had the pleasure to
            work with over the years
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-border"></div>

          {/* Experience items */}
          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={(el) => (itemRefs.current[index] = el) as any}
              className={`relative mb-12 opacity-0 transition-all duration-700 delay-${
                index * 200
              } ${
                index % 2 === 0
                  ? "md:pr-12 md:text-right md:ml-0 md:mr-auto"
                  : "md:pl-12 md:ml-auto md:mr-0"
              } md:w-1/2`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-6 h-6 rounded-full bg-primary border-4 border-background"></div>

              {/* Content */}
              <div
                className={`bg-card p-6 rounded-lg shadow-lg border ${
                  index % 2 === 0 ? "md:rounded-r-none" : "md:rounded-l-none"
                }`}
              >
                <div className="flex items-end gap-2 mb-2 text-primary">
                  <Briefcase className="h-5 w-5" />
                  <h3 className="font-bold text-lg">{exp.title}</h3>
                </div>
                <div className="flex items-start">
                  <h4 className="font-semibold mb-2">{exp.company}</h4>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{exp.period}</span>
                </div>
                <p className="text-muted-foreground">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

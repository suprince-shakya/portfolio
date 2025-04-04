"use client"

import { useEffect, useRef } from "react"
import { Database, Globe, Server, PenToolIcon as Tool } from "lucide-react"
import Image from "next/image"

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null)
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    categoryRefs.current.forEach((item) => {
      if (item) observer.observe(item)
    })

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
      categoryRefs.current.forEach((item) => {
        if (item) observer.unobserve(item)
      })
    }
  }, [])

  const techCategories = [
    {
      name: "Frontend",
      icon: <Globe className="h-6 w-6" />,
      technologies: [
        {
          name: "React",
          icon: "/icons/react.png?height=40&width=40",
        },
        {
          name: "Next.js",
          icon: "/icons/next.png?height=40&width=40",
        },
        {
          name: "React Native",
          icon: "/icons/react-native.png?height=40&width=40",
        },
        {
          name: "Tailwind CSS",
          icon: "/icons/tailwind.png?height=40&width=40",
        },
        {
          name: "JavaScript",
          icon: "/icons/js.png?height=40&width=40",
        },
        {
          name: "TypeScript",
          icon: "/icons/typescript.png?height=40&width=40",
        },
      ],
    },
    {
      name: "Backend",
      icon: <Server className="h-6 w-6" />,
      technologies: [
        {
          name: "Node.js",
          icon: "/icons/node.png?height=40&width=40",
        },
        {
          name: "Express",
          icon: "/icons/express.png?height=40&width=40",
        },
        {
          name: "Nest",
          icon: "/icons/nest.png?height=40&width=40",
        },
        {
          name: "GraphQL",
          icon: "/icons/graphql.png?height=40&width=40",
        },
        {
          name: "REST API",
          icon: "/icons/rest.png?height=40&width=40",
        },
        {
          name: "RabbitMQ",
          icon: "/icons/rabbitmq.png?height=40&width=40",
        },
      ],
    },
    {
      name: "Database",
      icon: <Database className="h-6 w-6" />,
      technologies: [
        {
          name: "MongoDB",
          icon: "/icons/mongo.png?height=40&width=40",
        },
        {
          name: "PostgreSQL",
          icon: "/icons/postgres.png?height=40&width=40",
        },
        {
          name: "MySQL",
          icon: "/icons/mysql.png?height=40&width=40",
        },
        {
          name: "Firebase",
          icon: "/icons/firebase.png?height=40&width=40",
        },
      ],
    },
    {
      name: "Tools",
      icon: <Tool className="h-6 w-6" />,
      technologies: [
        {
          name: "Git",
          icon: "/icons/git.png?height=40&width=40",
        },
        {
          name: "Docker",
          icon: "/icons/docker.png?height=40&width=40",
        },
        {
          name: "Nginx",
          icon: "/icons/nginx.png?height=40&width=40",
        },
        {
          name: "Figma",
          icon: "/icons/figma.png?height=40&width=40",
        },
        {
          name: "DB Schema",
          icon: "/icons/dbschema.png?height=40&width=40",
        },
        {
          name: "Trello",
          icon: "/icons/trello.png?height=40&width=40",
        },
        
      ],
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 relative opacity-0 transition-opacity duration-1000 ease-in-out">
      <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark opacity-5 z-0"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These are the technologies I&apos;ve worked with and am proficient in
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {techCategories.map((category, index) => (
            <div
              key={index}
              ref={(el) => (categoryRefs.current[index] = el) as any}
              className="bg-card rounded-lg p-6 shadow-md border opacity-0 transition-all duration-700 delay-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">{category.icon}</div>
                <h3 className="text-xl font-bold">{category.name}</h3>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {category.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="flex flex-col items-center justify-center gap-2 p-3 hover:bg-muted rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 relative">
                      <Image src={tech.icon} alt={tech.name} className="object-contain h-[40px] w-[40px]" height={0} width={0}/>
                    </div>
                    <span className="text-sm font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


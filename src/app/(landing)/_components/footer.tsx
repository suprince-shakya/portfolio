import { Facebook, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted py-6">
      <div className="container mx-auto">
        <div className="flex gap-4 justify-center items-center">
          <Link
            aria-label="GitHub"
            href={`https://github.com/suprince-shakya`}
            target="_blank"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            aria-label="LinkedIn"
            href={`https://www.linkedin.com/in/suprince-shakya/`}
            target="_blank"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Facebook"
            href={`https://www.facebook.com/profile.php?id=100079720681304`}
            target="_blank"
          >
            <Facebook className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Email"
            href={`mailto:suprincezzz@gmail.com`}
            target="_blank"
          >
            <Mail className="h-5 w-5" />
          </Link>
        </div>

        <div className="border-t border-border text-center my-2 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Suprince Shakya. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

import About from './about';
import Contact from './contact';
import Experience from './experience';
import Footer from './footer';
import Hero from './hero';
import Navbar from './navbar';
import Projects from './projects';
import TechStack from './tech-stack';
import type { ExperienceDTO, ProjectDTO, SiteContentDTO, StackGroupDTO } from '@/lib/serializers';

interface HomePageProps {
	projects: ProjectDTO[];
	content: SiteContentDTO;
	experiences: ExperienceDTO[];
	stacks: StackGroupDTO[];
}

export const HomePage = ({ projects, content, experiences, stacks }: HomePageProps) => {
	return (
		<>
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium"
			>
				Skip to content
			</a>
			<Navbar profile={content.profile} />
			<main id="main">
				<Hero profile={content.profile} />
				<div id="about">
					<About about={content.about} />
				</div>
				<div id="experience">
					<Experience experiences={experiences} />
				</div>
				<div id="projects">
					<Projects projects={projects} github={content.profile.github} />
				</div>
				<div id="stack">
					<TechStack stacks={stacks} />
				</div>
				<div id="contact">
					<Contact profile={content.profile} />
				</div>
			</main>
			<Footer profile={content.profile} />
		</>
	);
};

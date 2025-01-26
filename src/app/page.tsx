import { HeroSection } from "@/components/hero-section";
import { FeatureCard } from "@/components/feature-card";
import { TechBadge } from "@/components/tech-badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <HeroSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="AI-Powered Generation"
            description="Generate intelligent questions using Google's Gemini AI technology"
            icon="🤖"
          />
          <FeatureCard
            title="Smart Suggestions"
            description="Get intelligent topic-based question suggestions to enhance your quizzes"
            icon="🎯"
          />
          <FeatureCard
            title="Modern UI"
            description="Beautiful and responsive design with Tailwind CSS and HeroUI"
            icon="🎨"
          />
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Built With Modern Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <TechBadge>Next.js 15.1</TechBadge>
          <TechBadge>Google Gemini AI</TechBadge>
          <TechBadge>PostgreSQL</TechBadge>
          <TechBadge>Drizzle ORM</TechBadge>
          <TechBadge>TypeScript</TechBadge>
          <TechBadge>Tailwind CSS</TechBadge>
          <TechBadge>React 19</TechBadge>
          <TechBadge>Framer Motion</TechBadge>
        </div>
      </section>
    </main>
  );
}

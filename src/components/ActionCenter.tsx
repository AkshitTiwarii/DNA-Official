import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Code, GraduationCap, Lightbulb, Rss, Star } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Explore Opportunities",
    subtitle: "Internships, Jobs & More",
    icon: <Briefcase className="h-8 w-8 text-white" />,
    href: "/opportunities",
    featured: true,
    color: "from-green-500 to-green-600",
  },
  {
    title: "View Projects",
    subtitle: "See what we're building",
    icon: <Code className="h-8 w-8 text-white" />,
    href: "/projects",
    featured: true,
    color: "from-green-600 to-green-700",
  },
  {
    title: "Latest Content",
    subtitle: "Videos, Roadmaps & PDFs",
    icon: <Rss className="h-8 w-8 text-white" />,
    href: "/content",
    color: "from-green-400 to-green-500",
  },
  {
    title: "Mentorship",
    subtitle: "Get guidance from experts",
    icon: <GraduationCap className="h-8 w-8 text-white" />,
    href: "/mentorship",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Hackathons",
    subtitle: "Compete and innovate",
    icon: <Lightbulb className="h-8 w-8 text-white" />,
    href: "/hackathons",
    color: "from-green-600 to-green-700",
  },
  {
    title: "Rewards",
    subtitle: "Earn for your contributions",
    icon: <Star className="h-8 w-8 text-white" />,
    href: "/rewards",
    color: "from-green-400 to-green-500",
  },
];

export const ActionCenter = () => {
  return (
    <div className="py-16 sm:py-24 bg-gray-900/50 rounded-3xl border border-white/10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Engage with the <span className="text-green-400">DNA Community</span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            Your journey into tech starts here. Explore, learn, and contribute.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <Link
              to={action.href}
              key={action.title}
              className={`group relative flex flex-col justify-between rounded-2xl bg-gray-900/80 p-8 ring-1 ring-green-400/20 transition-all duration-300 hover:ring-green-400/40 hover:-translate-y-1 ${
                action.featured ? "lg:col-span-1 sm:col-span-2" : ""
              }`}
            >
              <div>
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${action.color}`}>
                  {action.icon}
                </div>
                <h3 className="text-xl font-semibold leading-7 text-white">
                  {action.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-400">
                  {action.subtitle}
                </p>
              </div>
              <div className="mt-6">
                <Button variant="link" className="p-0 text-green-400 font-semibold hover:text-green-300">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              {action.featured && (
                <div className="absolute top-4 right-4">
                  <Star className="h-6 w-6 text-green-400" fill="currentColor" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

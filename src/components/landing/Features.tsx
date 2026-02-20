"use client";

import {
  Zap,
  Shield,
  Globe,
  Share2,
  FolderOpen,
  KeyRound,
  History,
  Layers,
} from "lucide-react";

const features = [
  {
    title: "Request Collections",
    description:
      "Organize API requests into folders and collections. Create, rename, and nest requests exactly how your project needs.",
    icon: FolderOpen,
    color: "text-amber-400",
    bgIcon: "bg-amber-400/10 border-amber-400/20",
  },
  {
    title: "Cloud Sync & Share",
    description:
      "Your collections and environments sync securely to PostgreSQL. Share collections or environments with teammates by email.",
    icon: Share2,
    color: "text-indigo-400",
    bgIcon: "bg-indigo-400/10 border-indigo-400/20",
  },
  {
    title: "Multi-Environment",
    description:
      "Switch between Development, Staging, and Production environments instantly. Variable substitution works across URLs, headers, and body.",
    icon: Globe,
    color: "text-emerald-400",
    bgIcon: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    title: "Secure Secrets",
    description:
      "Store sensitive values like API keys and tokens securely. Secrets are substituted into requests at send time and never exposed in logs.",
    icon: KeyRound,
    color: "text-rose-400",
    bgIcon: "bg-rose-400/10 border-rose-400/20",
  },
  {
    title: "Request History",
    description:
      "Every request you send is saved automatically. Revisit any past request instantly, delete individual entries, or clear all history.",
    icon: History,
    color: "text-sky-400",
    bgIcon: "bg-sky-400/10 border-sky-400/20",
  },
  {
    title: "Global Headers",
    description:
      "Define headers once and have them injected into every request automatically. Perfect for Authorization or Content-Type defaults.",
    icon: Layers,
    color: "text-purple-400",
    bgIcon: "bg-purple-400/10 border-purple-400/20",
  },
  {
    title: "Lightweight & Fast",
    description:
      "Built on Next.js 15 with server-side authentication. Near-instant response times with an optimistic UI that never blocks your workflow.",
    icon: Zap,
    color: "text-yellow-400",
    bgIcon: "bg-yellow-400/10 border-yellow-400/20",
  },
  {
    title: "Open Source",
    description:
      "Fully open source under MIT license. Inspect the code, contribute features, self-host, or fork it for your own team.",
    icon: Shield,
    color: "text-teal-400",
    bgIcon: "bg-teal-400/10 border-teal-400/20",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Everything You Need
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          A complete API testing workspace that grows with your team. No
          subscriptions, no limits on what you can do.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-300 group shadow-lg"
          >
            <div
              className={`p-3 rounded-xl border w-fit mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${feature.bgIcon}`}
            >
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-zinc-100">
              {feature.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

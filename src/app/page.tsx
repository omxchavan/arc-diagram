"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI-Powered Generation",
    description: "Describe any system in plain English and watch it transform into a beautiful architecture diagram in seconds.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: "Edit with AI",
    description: "Refine your diagrams iteratively. Ask AI to add nodes, restructure, or modify — it understands your current diagram.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
    title: "Drag, Edit & Connect",
    description: "Full interactive canvas — drag nodes, double-click to rename, draw connections, or delete. Total control.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM7 14a1 1 0 011-1h8a1 1 0 011 1v4a1 1 0 01-1 1H8a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    title: "Auto Layout",
    description: "One-click Dagre-powered layout instantly organizes your nodes into a clean, hierarchical structure.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "Export Anywhere",
    description: "Download your diagram as a high-resolution PNG image or structured JSON data for use in docs and presentations.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
    title: "Autosave & Restore",
    description: "Your work is automatically saved to your browser. Come back anytime and pick up right where you left off.",
  },
];

const EXAMPLES = [
  "Chat app architecture",
  "E-commerce system",
  "Microservices architecture",
  "AI/ML pipeline",
  "CI/CD pipeline",
  "Social media platform",
];

function FloatingNode({ className, label, delay }: { className: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#1e1e2a] to-[#16161d] 
          border border-[#27272f] shadow-[0_4px_20px_rgba(0,0,0,0.4)] text-xs font-medium text-white/80"
      >
        <div className="absolute top-0 left-3 right-3 h-[1.5px] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </div>
          {label}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0d0d12] text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between backdrop-blur-xl bg-[#0d0d12]/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight">Arc Diagram</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block">
              How It Works
            </a>
            <Link
              href="/editor"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold
                hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-32 pb-20 px-6 overflow-hidden"
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-medium text-indigo-300">Powered by Google Gemini AI</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6"
          >
            <span className="block">Describe it.</span>
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Diagram it.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Arc Diagram transforms your ideas into stunning architecture diagrams instantly.
            No sign-up. No learning curve. Just describe your system and watch it come to life.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/editor"
              className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-semibold
                hover:from-indigo-500 hover:to-purple-500 
                shadow-[0_8px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.4)]
                transition-all duration-300 flex items-center gap-2"
            >
              Start Creating
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-base font-medium
                hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Floating demo nodes */}
          <div className="relative h-48 max-w-3xl mx-auto hidden md:block">
            <FloatingNode className="top-0 left-[5%]" label="Frontend" delay={0.6} />
            <FloatingNode className="top-4 left-[35%]" label="API Gateway" delay={0.8} />
            <FloatingNode className="top-0 right-[5%]" label="Database" delay={1.0} />
            <FloatingNode className="bottom-4 left-[15%]" label="Auth Service" delay={1.2} />
            <FloatingNode className="bottom-0 left-[50%]" label="Cache Layer" delay={1.4} />
            <FloatingNode className="bottom-8 right-[10%]" label="Message Queue" delay={1.6} />

            {/* Animated connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 200">
              <motion.line
                x1="120" y1="30" x2="280" y2="30"
                stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ delay: 1.8, duration: 1 }}
              />
              <motion.line
                x1="380" y1="30" x2="560" y2="30"
                stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ delay: 2.0, duration: 1 }}
              />
              <motion.line
                x1="200" y1="50" x2="200" y2="150"
                stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ delay: 2.2, duration: 1 }}
              />
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Three Steps. That&apos;s It.</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              No complex tools to learn. No accounts to create. Just pure productivity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Describe",
                description: "Type a natural language description of any system, architecture, or workflow.",
                gradient: "from-indigo-500/20 to-indigo-600/5",
              },
              {
                step: "02",
                title: "Generate",
                description: "AI instantly creates a structured diagram with nodes, connections, and clean layout.",
                gradient: "from-purple-500/20 to-purple-600/5",
              },
              {
                step: "03",
                title: "Refine",
                description: "Drag, edit, connect, or ask AI again to update. Export as PNG or JSON when ready.",
                gradient: "from-pink-500/20 to-pink-600/5",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative p-8 rounded-2xl bg-gradient-to-b ${item.gradient} border border-white/5
                  hover:border-white/10 transition-all group`}
              >
                <span className="text-5xl font-black text-white/5 absolute top-4 right-6 group-hover:text-white/10 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-[#0a0a10]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              A complete diagram toolkit — powerful enough for professionals, simple enough for everyone.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[#111118] border border-[#1e1e28] hover:border-[#2a2a3a] 
                  transition-all group hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 
                  border border-indigo-500/15 flex items-center justify-center text-indigo-400 mb-4
                  group-hover:from-indigo-500/25 group-hover:to-purple-500/25 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Try It Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Try These Examples</h2>
            <p className="text-zinc-500 mb-10">Click any example to jump into the editor and generate instantly.</p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {EXAMPLES.map((example, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={`/editor?prompt=${encodeURIComponent(example)}`}
                    className="inline-block px-5 py-2.5 rounded-full bg-[#16161d] border border-[#27272f] 
                      text-sm text-zinc-300 hover:text-white hover:border-indigo-500/40 
                      hover:bg-indigo-500/10 transition-all"
                  >
                    {example}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Big CTA */}
            <Link
              href="/editor"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl 
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-500 hover:to-purple-500
                shadow-[0_8px_40px_rgba(99,102,241,0.35)] hover:shadow-[0_12px_50px_rgba(99,102,241,0.45)]
                transition-all duration-300 text-lg font-semibold"
            >
              Open Arc Diagram Editor
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a24] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-400">Arc Diagram</span>
          </div>
          <p className="text-xs text-zinc-600">
            Built with Next.js, React Flow & Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}

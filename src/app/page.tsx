// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 bg-white">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-4">
          BarterHub
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          Exchange skills, not money. Discover people near you willing to trade
          what they know — and learn something new in return.
        </p>
        <Link
          href="/auth/signup"
          className="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white text-lg font-medium rounded hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          Why Use BarterHub?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "No Money Needed",
              desc: "Trade skills instead of paying cash. Learn guitar, teach painting — it’s value for value.",
              icon: "💡",
            },
            {
              title: "Local Community",
              desc: "Find skilled people near you. Make connections, build networks, and grow together.",
              icon: "🌍",
            },
            {
              title: "Skill for Skill",
              desc: "Offer what you know and request what you need. Mutual learning at its best.",
              icon: "🤝",
            },
          ].map(({ title, desc, icon }) => (
            <div
              key={title}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-700">
                {title}
              </h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-indigo-50 py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            {
              step: "1",
              label: "Create a Profile",
              desc: "Set up your profile with skills you offer and request.",
            },
            {
              step: "2",
              label: "Browse Skills",
              desc: "Find others offering what you need or needing what you offer.",
            },
            {
              step: "3",
              label: "Start a Barter",
              desc: "Message, chat, and exchange skills — fairly and securely.",
            },
          ].map(({ step, label, desc }) => (
            <div
              key={step}
              className="bg-white p-6 rounded-lg shadow border border-indigo-100"
            >
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                Step {step}
              </div>
              <h4 className="text-lg font-semibold text-indigo-800">{label}</h4>
              <p className="text-sm text-gray-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 text-center bg-white px-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">
          Ready to Barter?
        </h2>
        <p className="text-gray-600 mb-6">
          Join the community. Trade knowledge. Learn and grow together.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-indigo-600 text-white text-lg font-medium rounded hover:bg-indigo-700 transition"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t mt-8">
        © {new Date().getFullYear()} BarterHub. All rights reserved.
      </footer>
    </main>
  );
}

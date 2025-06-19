"use client";
import { m } from "framer-motion";
import { Search, ShoppingCart, MessageCircle, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Search 🔍",
    description:
      "Scroll through tons of cool stuff posted by your fellow students!",
    step: "01",
  },
  {
    icon: MessageCircle,
    title: "Connect & Chat 💬",
    description:
      "Hit up the seller, ask questions, and maybe score a sweet deal!",
    step: "02",
  },
  {
    icon: ShoppingCart,
    title: "Meet & Purchase 🤝",
    description: "Meet up on campus, check out the item, and make it yours!",
    step: "03",
  },
  {
    icon: CheckCircle,
    title: "Rate & Review ⭐",
    description: "Give them a shoutout and help build our awesome community!",
    step: "04",
  },
];

const StepCard = ({ step, index }) => {
  const Icon = step.icon;

  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      {/* Step number */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
        {step.step}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
        {/* Icon */}
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {step.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">{step.description}</p>
      </div>

      {/* Connector line (hidden on last item) */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-8 w-16 h-0.5 bg-gray-200">
          <div className="w-2 h-2 bg-primary rounded-full absolute -right-1 -top-0.5" />
        </div>
      )}
    </m.div>
  );
};

const HowItWorks = () => {
  return (
    <div className="container">
      <div className="text-center mb-16">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
        >
          🚀 How Selling Works (It's Super Easy!)
        </m.h2>
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Just 4 simple steps to start buying & selling like a pro! 😄
        </m.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {steps.map((step, index) => (
          <StepCard key={index} step={step} index={index} />
        ))}
      </div>

      {/* CTA Section */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="text-center mt-16"
      >
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 lg:p-12 text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Ready to Join the Fun? 🎉
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Thousands of students are already having a blast buying and selling here!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/display"
              className="btn bg-white text-primary hover:bg-gray-50 px-8 py-3"
            >
              Start Shopping! 🛒
            </a>
            <a
              href="/upload"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary px-8 py-3"
            >
              Sell My Stuff! 💰
            </a>
          </div>
        </div>
      </m.div>
    </div>
  );
};

export default HowItWorks;

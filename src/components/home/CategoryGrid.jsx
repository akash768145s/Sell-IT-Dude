"use client";
import { m } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Gamepad2,
  Laptop,
  Package,
  Calculator,
  Dumbbell,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";

const categories = [
  {
    name: "Stationary",
    icon: BookOpen,
    description: "Books, pens, notebooks & more",
    color: "bg-blue-500",
    href: "/display?category=Stationary",
  },
  {
    name: "Electronics",
    icon: Laptop,
    description: "Laptops, phones, gadgets",
    color: "bg-purple-500",
    href: "/display?category=Electronics",
  },
  {
    name: "Sport Equipment",
    icon: Dumbbell,
    description: "Sports gear & equipment",
    color: "bg-green-500",
    href: "/display?category=Sport Equipment",
  },
  {
    name: "Other Accessories",
    icon: Package,
    description: "Everything else you need",
    color: "bg-orange-500",
    href: "/display?category=Other Accessories",
  },
];

const CategoryCard = ({ category, index }) => {
  const Icon = category.icon;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={category.href}>
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 h-full">
          {/* Icon */}
          <div
            className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600">{category.description}</p>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        </div>
      </Link>
    </m.div>
  );
};

const CategoryGrid = () => {
  return (
    <div className="container">
      <div className="text-center mb-12">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
        >
          Shop by Category
        </m.h2>
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Find exactly what you need from our organized categories of student
          essentials
        </m.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={category.name} category={category} index={index} />
        ))}
      </div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8"
      >
        <Link href="/display" className="btn btn-outline px-6 py-3 text-base">
          View All Products
        </Link>
      </m.div>
    </div>
  );
};

export default CategoryGrid;

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Pizza,
  Beef,
  Soup,
  Drumstick,
  Salad,
  CakeSlice,
} from "lucide-react";

const CATEGORIES = [
  { name: "Pizza", icon: Pizza, count: "120+ Restaurants" },
  { name: "Burger", icon: Beef, count: "120+ Restaurants" },
  { name: "Noodles", icon: Soup, count: "120+ Restaurants" },
  { name: "Chicken", icon: Drumstick, count: "120+ Restaurants" },
  { name: "Salad", icon: Salad, count: "120+ Restaurants" },
  { name: "Desserts", icon: CakeSlice, count: "120+ Restaurants" },
];

// Same stagger/fadeUp rhythm used across the Home page, so this grid
// animates in with the same feel as the rest of the site.
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function CategoryGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    // Navigate to /category?name=Pizza (etc.) — query param carries the category
    navigate(`/category?name=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="bg-linear-to-br from-orange-100 via-amber-100 to-yellow-200 px-6 py-12">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        {CATEGORIES.map(({ name, icon: Icon, count }) => (
          <motion.button
            key={name}
            variants={fadeUp}
            onClick={() => handleCategoryClick(name)}
            whileHover={{ y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 flex flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4"
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="w-9 h-9 text-orange-500" strokeWidth={1.75} />
            </motion.div>
            <h3 className="text-lg font-bold text-slate-900">{name}</h3>
            <p className="text-sm text-slate-500 mt-1">{count}</p>
            <span className="w-6 h-0.5 bg-orange-500 rounded-full mt-3" />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
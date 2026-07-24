const restaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    coverImage:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600",
    rating: 4.8,
    time: "25 mins",
    cuisine: "Italian",
    location: "Hazratganj, Lucknow",
    deliveryFee: "Free Delivery",

    menu: [
      {
        id: 101,
        name: "Margherita Pizza",
        price: 249,
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
        description: "Classic cheese pizza with fresh basil.",
        veg: true,
        bestSeller: true,
      },
      {
        id: 102,
        name: "Farmhouse Pizza",
        price: 349,
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
        description: "Loaded with vegetables and mozzarella.",
        veg: true,
        bestSeller: false,
      },
      {
        id: 103,
        name: "Garlic Bread",
        price: 149,
        image:
          "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg",
        description: "Freshly baked garlic bread.",
        veg: true,
        bestSeller: false,
      },
    ],
  },
  {
    id: 2,
    name: "Burger Hub",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    coverImage:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600",
    rating: 4.6,
    time: "20 mins",
    cuisine: "Fast Food",
    location: "Aliganj, Lucknow",
    deliveryFee: "₹40 Delivery",

    menu: [
      {
        id: 201,
        name: "Veg Burger",
        price: 199,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
        description: "Fresh vegetables with a crispy patty.",
        veg: true,
        bestSeller: true,
      },
      {
        id: 202,
        name: "Cheese Burger",
        price: 249,
        image:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
        description: "Loaded with cheese and grilled patty.",
        veg: false,
        bestSeller: true,
      },
      {
        id: 203,
        name: "Double Cheese Burger",
        price: 299,
        image:
          "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800",
        description:
          "Double grilled patties with extra cheese and fresh lettuce.",
        veg: false,
        bestSeller: false,
      },
    ],
  },
  {
    id: 3,
    name: "Sushi World",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600",
    coverImage:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600",
    rating: 4.7,
    time: "30 mins",
    cuisine: "Japanese",
    location: "Gomti Nagar, Lucknow",
    deliveryFee: "₹60 Delivery",

    menu: [
      {
        id: 301,
        name: "California Roll",
        price: 399,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
        description: "Crab, avocado & cucumber rolled in sushi rice.",
        veg: false,
        bestSeller: true,
      },
      {
        id: 302,
        name: "Salmon Nigiri",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800",
        description: "Fresh salmon over seasoned rice.",
        veg: false,
        bestSeller: true,
      },
      {
        id: 303,
        name: "Veg Sushi Roll",
        price: 349,
        image:
          "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800",
        description: "Fresh vegetables wrapped in sushi rice.",
        veg: true,
        bestSeller: false,
      },
    ],
  },
  {
    id: 4,
    name: "Biryani House",
    image: "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=600",
    coverImage:
      "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=1600",
    rating: 4.9,
    time: "35 mins",
    cuisine: "Indian",
    location: "Indira Nagar, Lucknow",
    deliveryFee: "Free Delivery",

    menu: [
      {
        id: 401,
        name: "Chicken Biryani",
        price: 299,
        image:
          "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800",
        description: "Authentic Hyderabadi chicken biryani.",
        veg: false,
        bestSeller: true,
      },
      {
        id: 402,
        name: "Veg Biryani",
        price: 249,
        image:
          "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800",
        description: "Fragrant basmati rice with fresh vegetables.",
        veg: true,
        bestSeller: true,
      },
      {
        id: 403,
        name: "Mutton Biryani",
        price: 399,
        image:
          "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800",
        description: "Slow-cooked mutton with aromatic spices.",
        veg: false,
        bestSeller: false,
      },
    ],
  },
];

export default restaurants;

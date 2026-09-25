/* =========================================================
   ORBIT — Product data
   Static product catalogue used across the whole site.
   ========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "AeroFit Pulse Smartwatch",
    category: "Wearables",
    price: 2499,
    tag: "Bestseller",
    image: "images/watch-square.jpg",
    description:
      "A square-dial smartwatch with a crisp AMOLED display, tuned for all-day fitness tracking and quick notifications on the go. Built for everyday reliability, from morning runs to late meetings.",
    specs: [
      ["Display", "1.9\" AMOLED"],
      ["Battery life", "Up to 7 days"],
      ["Water resistance", "IP68"],
      ["Connectivity", "Bluetooth 5.2"]
    ]
  },
  {
    id: 2,
    name: "Nova X6 Pro Mirrorless Camera",
    category: "Cameras",
    price: 89999,
    tag: "Pro pick",
    image: "images/camera-mirrorless.jpg",
    description:
      "A full-frame mirrorless body with a fast native mount, built for creators who move between stills and video without missing a beat. Pairs with a wide lens ecosystem for portraits, travel and street work.",
    specs: [
      ["Sensor", "Full-frame, 24MP"],
      ["Video", "4K 60fps"],
      ["Mount", "Native full-frame mount"],
      ["Viewfinder", "5.76M-dot EVF"]
    ]
  },
  {
    id: 3,
    name: "Halo Round Smart Watch",
    category: "Wearables",
    price: 3299,
    tag: "New",
    image: "images/watch-round.jpg",
    description:
      "A circular AMOLED smartwatch with a vivid always-on display, layered sleep and heart-rate tracking, and a silicone strap that stays comfortable through workouts and long days at the desk.",
    specs: [
      ["Display", "1.43\" round AMOLED"],
      ["Battery life", "Up to 10 days"],
      ["Sensors", "HR, SpO2, sleep"],
      ["Water resistance", "5ATM"]
    ]
  },
  {
    id: 4,
    name: "TrailCam HD 1080p Action Camera",
    category: "Cameras",
    price: 3499,
    tag: null,
    image: "images/action-camera.jpg",
    description:
      "A waterproof action camera with a 1080p sensor and a full accessory mount kit, ready for hikes, rides and underwater adventures straight out of the box.",
    specs: [
      ["Resolution", "1080p Full HD"],
      ["Waterproof case", "Up to 30m"],
      ["Mounts included", "8-piece kit"],
      ["Storage", "microSD, up to 32GB"]
    ]
  },
  {
    id: 5,
    name: "PulseRing Fitness Tracker",
    category: "Wearables",
    price: 5999,
    tag: null,
    image: "images/smart-ring.jpg",
    description:
      "A titanium smart ring that tracks steps, heart rate and sleep quietly on your finger, with a bright LED readout and week-long battery life.",
    specs: [
      ["Material", "Titanium alloy"],
      ["Battery life", "Up to 7 days"],
      ["Tracking", "Steps, HR, sleep"],
      ["Display", "LED readout"]
    ]
  },
  {
    id: 6,
    name: "PulseBuds Wireless Earbuds",
    category: "Audio",
    price: 7999,
    tag: "Bestseller",
    image: "images/ps-earbuds.jpg",
    description:
      "Low-latency wireless earbuds designed for gaming and everyday listening, with a compact charging case and punchy, balanced sound.",
    specs: [
      ["Driver", "10mm dynamic"],
      ["Latency", "Low-latency mode"],
      ["Battery life", "6h + 18h case"],
      ["Charging", "USB-C"]
    ]
  },
  {
    id: 7,
    name: "Resonate Mini Smart Speaker",
    category: "Audio",
    price: 12999,
    tag: null,
    image: "images/jbl-speaker.jpg",
    description:
      "A compact smart speaker with dual tweeters and a deep-throw woofer, wrapped in a rugged mesh shell built for room-filling sound indoors or out.",
    specs: [
      ["Drivers", "Dual tweeter + woofer"],
      ["Connectivity", "Wi-Fi + Bluetooth"],
      ["Water resistance", "IPX4"],
      ["Power", "30W RMS"]
    ]
  },
  {
    id: 8,
    name: "RidgeWave On-Ear Headphones",
    category: "Audio",
    price: 2999,
    tag: null,
    image: "images/raegr-headphones.jpg",
    description:
      "Foldable on-ear wireless headphones with swappable ear cushions, cushioned padding, and a lightweight build made for daily commutes.",
    specs: [
      ["Driver", "40mm dynamic"],
      ["Battery life", "Up to 20 hours"],
      ["Ear cushions", "2 swappable sets"],
      ["Fold design", "Yes, travel-ready"]
    ]
  }
];

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function getCategories() {
  return [...new Set(PRODUCTS.map((p) => p.category))];
}

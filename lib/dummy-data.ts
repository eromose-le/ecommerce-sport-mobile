export const products = [
  {
    id: "1",
    name: "10kg Dumbbell",
    brand: "StrengthPro",
    price: 120,
    displayImage: require("@/assets/images/dumbbell.png"),
    images: [
      "https://picsum.photos/500/500?random=1",
      "https://picsum.photos/500/500?random=11",
      "https://picsum.photos/500/500?random=12",
      "https://picsum.photos/500/500?random=1",
      "https://picsum.photos/500/500?random=11",
      "https://picsum.photos/500/500?random=12",
      "https://picsum.photos/500/500?random=1",
      "https://picsum.photos/500/500?random=11",
      "https://picsum.photos/500/500?random=12",
    ],
    description:
      "Elevate your workout routine with our premium 10kg dumbbell, designed to enhance your strength training and boost fitness performance.",
    variations: ["#000000", "#4A4A4A"],
    attributes: [
      {
        title: "Premium Quality Material",
        text: "Crafted from high-grade cast iron, ensuring durability and longevity.",
      },
      {
        title: "Ergonomic Design",
        text: "Smooth handle grip ensures a secure hold during even the most intense workouts.",
      },
      {
        title: "Compact and Versatile",
        text: "Ideal for a range of exercises including curls, shoulder presses, deadlifts, and more.",
      },
      {
        title: "Space-Saving",
        text: "Compact size makes it easy to store and perfect for home use.",
      },
      {
        title: "Rust-Resistant Finish",
        text: "Coated with protective layer to prevent rust and maintain a sleek look.",
      },
    ],
    reviews: [
      {
        id: 101,
        username: "C***",
        avatar: "https://i.pravatar.cc/150?u=a1",
        date: "Oct 8, 2024",
        rating: 5,
        comment:
          "Excellent quality! This dumbbell is exactly what I needed for my home workouts.",
      },
      {
        id: 102,
        username: "F***",
        avatar: "https://i.pravatar.cc/150?u=a2",
        date: "Oct 8, 2024",
        rating: 5,
        comment:
          "Very comfortable grip and balanced weight. Highly recommend for strength training.",
      },
    ],
  },

  // ----------------------------------------------------------------------

  {
    id: "2",
    name: "Adjustable Kettlebell",
    brand: "FlexForge",
    price: 220,
    displayImage: require("@/assets/images/dumbbell.png"),
    images: [
      "https://picsum.photos/500/500?random=2",
      "https://picsum.photos/500/500?random=21",
      "https://picsum.photos/500/500?random=22",
    ],
    description:
      "A compact adjustable kettlebell that replaces 4 kettlebells in one. Perfect for beginners and advanced athletes alike.",
    variations: ["#222222"],
    attributes: [
      {
        title: "Adjustable Weight",
        text: "Switch easily between 5kg, 10kg, 15kg, and 20kg options.",
      },
      {
        title: "Secure Lock System",
        text: "Ensures stability while switching weights for safety.",
      },
      {
        title: "Ergonomic Handle",
        text: "Wide handle provides optimal grip for swings and lifts.",
      },
      {
        title: "Durable Steel Core",
        text: "Built with premium steel for long-lasting performance.",
      },
      {
        title: "Space Efficient",
        text: "Saves space and replaces multiple equipment pieces.",
      },
    ],
    reviews: [
      {
        id: 201,
        username: "M***",
        avatar: "https://i.pravatar.cc/150?u=b1",
        date: "Oct 18, 2024",
        rating: 5,
        comment: "Love how easy it is to switch weights. Perfect for home gym.",
      },
    ],
  },

  // ----------------------------------------------------------------------

  {
    id: "3",
    name: "Resistance Band Set",
    brand: "FitFlex",
    price: 45,
    displayImage: require("@/assets/images/dumbbell.png"),
    images: [
      "https://picsum.photos/500/500?random=3",
      "https://picsum.photos/500/500?random=31",
      "https://picsum.photos/500/500?random=32",
    ],
    description:
      "A full set of resistance bands ranging from light to extra heavy, suitable for mobility, strength, and recovery workouts.",
    variations: ["#E63946", "#F1FAEE", "#1D3557"],
    attributes: [
      {
        title: "Multi-Strength Levels",
        text: "Includes 5 resistance levels for progressive training.",
      },
      {
        title: "Premium Latex Material",
        text: "High elasticity and snap-resistant design.",
      },
      {
        title: "Portable",
        text: "Carry pouch included for easy travel use.",
      },
      {
        title: "Full Body Workouts",
        text: "Suitable for toning arms, legs, glutes, chest, and core.",
      },
      {
        title: "Beginner Friendly",
        text: "Easy to use and suitable for all fitness levels.",
      },
    ],
    reviews: [
      {
        id: 301,
        username: "A***",
        avatar: "https://i.pravatar.cc/150?u=c1",
        date: "Sept 12, 2024",
        rating: 4,
        comment: "Good set for stretching and strength work.",
      },
    ],
  },

  // ----------------------------------------------------------------------

  {
    id: "4",
    name: "Premium Yoga Mat",
    brand: "ZenFlow",
    price: 80,
    displayImage: require("@/assets/images/dumbbell.png"),
    images: [
      "https://picsum.photos/500/500?random=4",
      "https://picsum.photos/500/500?random=41",
      "https://picsum.photos/500/500?random=42",
    ],
    description:
      "Eco-friendly yoga mat with a soft-touch surface and anti-slip base for stability during all your flows.",
    variations: ["#6A5ACD", "#8A2BE2"],
    attributes: [
      {
        title: "Eco Friendly",
        text: "Made with biodegradable natural rubber.",
      },
      {
        title: "Non-Slip Grip",
        text: "Won't slide or move during intense poses.",
      },
      {
        title: "Thick Cushioning",
        text: "Provides great support for joints.",
      },
      {
        title: "Easy to Clean",
        text: "Sweat-resistant and quick drying material.",
      },
      {
        title: "Durable Build",
        text: "Designed for everyday use with premium quality.",
      },
    ],
    reviews: [
      {
        id: 401,
        username: "J***",
        avatar: "https://i.pravatar.cc/150?u=d1",
        date: "Oct 1, 2024",
        rating: 5,
        comment: "Very comfortable. My new favorite yoga mat.",
      },
    ],
  },

  // ----------------------------------------------------------------------

  {
    id: "5",
    name: "Smart Jump Rope",
    brand: "CardioTech",
    price: 65,
    displayImage: require("@/assets/images/dumbbell.png"),
    images: [
      "https://picsum.photos/500/500?random=5",
      "https://picsum.photos/500/500?random=51",
      "https://picsum.photos/500/500?random=52",
    ],
    description:
      "Bluetooth-enabled jump rope that tracks jump count, calories, speed, and duration in real time.",
    variations: ["#000000"],
    attributes: [
      {
        title: "Smart Tracking",
        text: "Syncs jump data to your mobile app.",
      },
      {
        title: "Speed Rope",
        text: "Designed for fast rotations with steel bearings.",
      },
      {
        title: "Adjustable Length",
        text: "Adjusts easily to fit any user height.",
      },
      {
        title: "Comfort Grip",
        text: "Foam handles ensure secure and sweat-free grip.",
      },
      {
        title: "Rechargeable",
        text: "USB-C rechargeable and lasts up to 30 days.",
      },
    ],
    reviews: [
      {
        id: 501,
        username: "N***",
        avatar: "https://i.pravatar.cc/150?u=e1",
        date: "Oct 28, 2024",
        rating: 5,
        comment: "Amazing rope! Love the tracking and build quality.",
      },
    ],
  },
];

/*! Copyright (c) 2026 Free Life. All rights reserved. */
/* Elite Life: marina, hangar y vehículos especiales.
 * Se carga como script normal después de game.html para poder engancharse a
 * Shopping y Assets sin tocar el archivo gigante.
 */
(() => {
  "use strict";
  if (window.FL_ELITE_LIFE) return;
  window.FL_ELITE_LIFE = true;

  const CATS = {
    boats: {
      title: "BOATS & YACHTS",
      short: "Boat",
      dealer: "Northstar Marine",
      icon: "boats/ship-06-superyacht-white.png",
      desc: "Speedboats, yachts and superyachts",
    },
    sportbikes: {
      title: "MOTORCYCLES",
      short: "Bike",
      dealer: "Redline Motorcycles",
      icon: "bikes/sportbike-01-ducati-red.png",
      desc: "Sportbikes, cruisers, dirt bikes and scooters",
    },
    planes: {
      title: "PRIVATE AIRCRAFT",
      short: "Aircraft",
      dealer: "Skyline Aircraft Sales",
      icon: "aircraft/private-jet.png",
      desc: "Seaplanes, turboprops and private jets",
    },
    islands: {
      title: "ISLANDS",
      short: "Island",
      dealer: "Archipelago Estates",
      icon: "islands/island-01-modern-villa.png",
      desc: "Private and wild islands, with docks and beaches",
    },
    helicopters: {
      title: "HELICOPTERS",
      short: "Helicopter",
      dealer: "Rotor Executive",
      icon: "aircraft/heli-07-corporate-black.png",
      desc: "Executive and luxury helicopters",
    },
  };

  const CATALOG = {
    islands: [
      {
        id: "island-modern-villa",
        name: "Modern Villa Island",
        price: 9500000,
        upkeep: 95000,
        speed: "14 acres",
        cap: 10,
        img: "islands/island-01-modern-villa.png",
        type: "private island",
        desc: "A glass-and-pool villa with its own dock and a beach that belongs only to you.",
      },
      {
        id: "island-spanish-villa",
        name: "Spanish Villa Island",
        price: 7800000,
        upkeep: 80000,
        speed: "12 acres",
        cap: 10,
        img: "islands/island-02-spanish-villa.png",
        type: "private island",
        desc: "Terracotta roofs on a rocky hill, with a pergola made for long dinners.",
      },
      {
        id: "island-tiki-huts",
        name: "Tiki Huts Island",
        price: 3200000,
        upkeep: 42000,
        speed: "9 acres",
        cap: 8,
        img: "islands/island-03-tiki-huts.png",
        type: "private island",
        desc: "Stilt huts, loungers and a beach umbrella. Nobody has ever been in a hurry here.",
      },
      {
        id: "island-manor-house",
        name: "Manor Island",
        price: 14000000,
        upkeep: 140000,
        speed: "20 acres",
        cap: 14,
        img: "islands/island-04-manor-house.png",
        type: "private island",
        desc: "A grand manor with terraced gardens, a gazebo and a staff wing.",
      },
      {
        id: "island-farm-water-tower",
        name: "Farm Island",
        price: 4500000,
        upkeep: 52000,
        speed: "16 acres",
        cap: 8,
        img: "islands/island-05-farm-water-tower.png",
        type: "private island",
        desc: "Cottages, crops and a water tower. Self-sufficient, if you are willing to farm.",
      },
      {
        id: "island-jungle-cabin",
        name: "Jungle Cabin Island",
        price: 1600000,
        upkeep: 24000,
        speed: "11 acres",
        cap: 4,
        img: "islands/island-06-jungle-cabin.png",
        type: "private island",
        desc: "One cabin hidden under the palms, with a rock face behind it.",
      },
      {
        id: "island-lighthouse",
        name: "Lighthouse Island",
        price: 5200000,
        upkeep: 60000,
        speed: "8 acres",
        cap: 6,
        img: "islands/island-07-lighthouse.png",
        type: "private island",
        desc: "A working lighthouse and the keeper's home on a rocky shore.",
      },
      {
        id: "island-pool-house",
        name: "Pool House Island",
        price: 8400000,
        upkeep: 90000,
        speed: "13 acres",
        cap: 10,
        img: "islands/island-08-pool-house.png",
        type: "private island",
        desc: "A flat-roof house with a big pool, loungers and a private dock.",
      },
      {
        id: "island-windmill-farm",
        name: "Windmill Island",
        price: 4100000,
        upkeep: 48000,
        speed: "15 acres",
        cap: 8,
        img: "islands/island-09-windmill-farm.png",
        type: "private island",
        desc: "A windmill, a farmhouse and neat vegetable fields by the sea.",
      },
      {
        id: "island-cliff-house",
        name: "Cliff House Island",
        price: 11000000,
        upkeep: 115000,
        speed: "12 acres",
        cap: 10,
        img: "islands/island-10-cliff-house.png",
        type: "private island",
        desc: "A modern house carved into the rock, with a staircase down to the water.",
      },
      {
        id: "island-village-shop",
        name: "Village Island",
        price: 6500000,
        upkeep: 70000,
        speed: "18 acres",
        cap: 12,
        img: "islands/island-11-village-shop.png",
        type: "private island",
        desc: "A tiny town with a shop, a water tower and a street all of its own.",
      },
      {
        id: "island-golf-course",
        name: "Golf Island",
        price: 18000000,
        upkeep: 180000,
        speed: "30 acres",
        cap: 12,
        img: "islands/island-12-golf-course.png",
        type: "private island",
        desc: "Your own private golf course with a bunker, a green and a clubhouse.",
      },
      {
        id: "island-wild-lagoon-hill",
        name: "Lagoon Hill",
        price: 2100000,
        upkeep: 18000,
        speed: "10 acres",
        cap: 4,
        img: "islands/wild-01-lagoon-hill.png",
        type: "wild island",
        desc: "An untouched island with a hidden lagoon. You choose what to build.",
      },
      {
        id: "island-wild-rocky-peak",
        name: "Rocky Peak",
        price: 1400000,
        upkeep: 14000,
        speed: "8 acres",
        cap: 2,
        img: "islands/wild-02-rocky-peak.png",
        type: "wild island",
        desc: "A steep rocky peak above a small beach. Great views, little shade.",
      },
      {
        id: "island-wild-meadow",
        name: "Meadow Isle",
        price: 1200000,
        upkeep: 12000,
        speed: "14 acres",
        cap: 4,
        img: "islands/wild-03-meadow.png",
        type: "wild island",
        desc: "Green meadows and a quiet shore, ready for whatever you plan.",
      },
      {
        id: "island-wild-yacht-villa",
        name: "Yacht Villa",
        price: 12000000,
        upkeep: 125000,
        speed: "11 acres",
        cap: 10,
        img: "islands/wild-04-yacht-villa.png",
        type: "wild island",
        desc: "A white villa on the rocks with a yacht moored at the dock.",
      },
      {
        id: "island-wild-cave-island",
        name: "Cave Island",
        price: 1900000,
        upkeep: 16000,
        speed: "9 acres",
        cap: 4,
        img: "islands/wild-05-cave-island.png",
        type: "wild island",
        desc: "Sea caves under a tall cliff. Pirates would have loved it.",
      },
      {
        id: "island-wild-flat-meadow",
        name: "Flat Meadow",
        price: 900000,
        upkeep: 9000,
        speed: "16 acres",
        cap: 4,
        img: "islands/wild-06-flat-meadow.png",
        type: "wild island",
        desc: "A low, wide island with open grass, ready to build on.",
      },
      {
        id: "island-wild-lighthouse",
        name: "Lighthouse Isle",
        price: 3800000,
        upkeep: 40000,
        speed: "8 acres",
        cap: 6,
        img: "islands/wild-07-lighthouse.png",
        type: "wild island",
        desc: "A lighthouse on a wild rocky shore, with a small dock.",
      },
      {
        id: "island-wild-lagoon-cave",
        name: "Lagoon Cave",
        price: 2600000,
        upkeep: 22000,
        speed: "9 acres",
        cap: 4,
        img: "islands/wild-08-lagoon-cave.png",
        type: "wild island",
        desc: "A turquoise pool inside a rock arch. It looks fake. It is real.",
      },
      {
        id: "island-wild-stilt-hut",
        name: "Stilt Hut",
        price: 1100000,
        upkeep: 12000,
        speed: "7 acres",
        cap: 3,
        img: "islands/wild-09-stilt-hut.png",
        type: "wild island",
        desc: "A lone hut on stilts by the water, a dock and nothing else.",
      },
      {
        id: "island-wild-white-villa",
        name: "White Villa",
        price: 9000000,
        upkeep: 95000,
        speed: "12 acres",
        cap: 10,
        img: "islands/wild-10-white-villa.png",
        type: "wild island",
        desc: "A white villa with a pool, a dock and a palm-lined shore.",
      },
      {
        id: "island-wild-palm-meadow",
        name: "Palm Meadow",
        price: 1000000,
        upkeep: 10000,
        speed: "13 acres",
        cap: 4,
        img: "islands/wild-11-palm-meadow.png",
        type: "wild island",
        desc: "Palm trees and open grass on a quiet beach.",
      },
      {
        id: "island-wild-arch-cave",
        name: "Arch Cave",
        price: 2300000,
        upkeep: 20000,
        speed: "9 acres",
        cap: 4,
        img: "islands/wild-12-arch-cave.png",
        type: "wild island",
        desc: "A natural stone arch over the sand. Sunrise looks like a postcard.",
      },
    ],
    boats: [
      {
        id: "speedboat",
        name: "Marlin 22 Speedboat",
        price: 85000,
        upkeep: 420,
        speed: "54 kn",
        cap: 6,
        img: "boats/ship-09-speedboat.png",
        desc: "A fast weekend boat with an open cockpit and a deep-V hull.",
      },
      {
        id: "sport-yacht",
        name: "Corsair Sport Yacht",
        price: 650000,
        upkeep: 2400,
        speed: "38 kn",
        cap: 10,
        img: "boats/ship-10-sport-yacht.png",
        desc: "A sleek sport yacht with a sun deck, twin cabins and a wet bar.",
      },
      {
        id: "sailing-yacht",
        name: "Aurora Sailing Yacht",
        price: 1400000,
        upkeep: 3900,
        speed: "14 kn",
        cap: 12,
        img: "boats/sailing-yacht.png",
        desc: "A blue-water sailing yacht built for long, quiet summers at sea.",
      },
      {
        id: "fishing-yacht",
        name: "Marlin 55 Sportfisher",
        price: 1900000,
        upkeep: 7200,
        speed: "32 kn",
        cap: 10,
        img: "boats/ship-11-fishing-yacht.png",
        desc: "A tournament-grade sportfisher with a flybridge and an ice-cold fish hold.",
      },
      {
        id: "catamaran",
        name: "Twin Star 44 Catamaran",
        price: 2100000,
        upkeep: 6800,
        speed: "20 kn",
        cap: 14,
        img: "boats/ship-12-catamaran.png",
        desc: "Two hulls, four cabins and a trampoline deck for doing absolutely nothing.",
      },
      {
        id: "navy-patrol",
        name: "Sentinel 48 Patrol Boat",
        price: 2800000,
        upkeep: 18000,
        speed: "34 kn",
        cap: 10,
        img: "boats/ship-04-navy.png",
        desc: "A grey go-fast patrol hull. Perfectly legal, deeply intimidating.",
      },
      {
        id: "cruise-ship",
        name: "Voyager 320 Cruise",
        price: 3200000,
        upkeep: 12000,
        speed: "22 kn",
        cap: 40,
        img: "boats/ship-01-cruise.png",
        desc: "A small cruise hull with a pool deck — invite the whole family, regret it later.",
      },
      {
        id: "offshore",
        name: "Horizon Offshore 75",
        price: 4200000,
        upkeep: 26000,
        speed: "24 kn",
        cap: 16,
        img: "boats/ship-03-offshore.png",
        desc: "A blue-water offshore cruiser built to shrug off the worst weather.",
      },
      {
        id: "azure-yacht",
        name: "Azure 36 Superyacht",
        price: 6900000,
        upkeep: 18000,
        speed: "26 kn",
        cap: 18,
        img: "boats/ship-08-superyacht-blue.png",
        desc: "A blue-hulled superyacht with a beach club, a jacuzzi and very good taste.",
      },
      {
        id: "onyx-yacht",
        name: "Onyx 38 Superyacht",
        price: 7200000,
        upkeep: 19000,
        speed: "25 kn",
        cap: 20,
        img: "boats/ship-05-superyacht-black.png",
        desc: "All black, all glass, all attitude. It looks like a villain's launch for a reason.",
      },
      {
        id: "superyacht",
        name: "Sovereign 44 Superyacht",
        price: 8500000,
        upkeep: 22000,
        speed: "26 kn",
        cap: 24,
        img: "boats/ship-06-superyacht-white.png",
        desc: "Crew quarters, a helipad and enough decks to lose your guests on.",
      },
      {
        id: "aurum-yacht",
        name: "Aurum 42 Superyacht",
        price: 9100000,
        upkeep: 24000,
        speed: "24 kn",
        cap: 22,
        img: "boats/ship-07-superyacht-gold.png",
        desc: "Teak decks and gold trim — the flagship of the Northstar line.",
      },
      {
        id: "cargo-ship",
        name: "Meridian Cargo 900",
        price: 12500000,
        upkeep: 60000,
        speed: "18 kn",
        cap: 12,
        img: "boats/ship-02-container.png",
        desc: "A privately owned container ship. Peak main character energy.",
      },
    ],
    sportbikes: [
      {
        id: "sportbike-ducati",
        name: "Ducati Panigale V4",
        price: 32000,
        upkeep: 900,
        speed: "186 mph",
        cap: 2,
        img: "bikes/sportbike-01-ducati-red.png",
        desc: "The red one. Loses every argument about practicality before it starts.",
      },
      {
        id: "sportbike-yamaha",
        name: "Yamaha YZF-R1",
        price: 24500,
        upkeep: 700,
        speed: "186 mph",
        cap: 2,
        img: "bikes/sportbike-02-yamaha-blue.png",
        desc: "A blue litre bike that has been scaring riders since 1998.",
      },
      {
        id: "sportbike-bmw",
        name: "BMW S1000RR",
        price: 26000,
        upkeep: 760,
        speed: "188 mph",
        cap: 2,
        img: "bikes/sportbike-03-bmw-black.png",
        desc: "Sharp, fast and German to the bone, including the optional heated grips.",
      },
      {
        id: "sportbike-kawasaki",
        name: "Kawasaki Ninja ZX-10R",
        price: 23000,
        upkeep: 680,
        speed: "186 mph",
        cap: 2,
        img: "bikes/sportbike-04-kawasaki-green.png",
        desc: "Lime green, track bred, and never once accused of being subtle.",
      },
      {
        id: "sportbike-suzuki",
        name: "Suzuki GSX-R1000R",
        price: 21500,
        upkeep: 640,
        speed: "186 mph",
        cap: 2,
        img: "bikes/sportbike-05-suzuki-white.png",
        desc: "The sensible superbike. Still does over 300 km/h, still not sensible.",
      },
      {
        id: "sportbike-ktm-orange",
        name: "KTM 1290 Super Duke R",
        price: 21000,
        upkeep: 610,
        speed: "180 mph",
        cap: 2,
        img: "bikes/sportbike-06-ktm-orange.png",
        desc: "A naked bike that behaves like a bad idea on purpose.",
      },
      {
        id: "sportbike-honda",
        name: "Honda CBR1000RR-R Fireblade",
        price: 28500,
        upkeep: 780,
        speed: "186 mph",
        cap: 2,
        img: "bikes/sportbike-07-honda-red.png",
        desc: "Honda reliability with a race engine you can commute on, badly.",
      },
      {
        id: "sportbike-aprilia",
        name: "Aprilia RSV4 Factory",
        price: 27000,
        upkeep: 800,
        speed: "190 mph",
        cap: 2,
        img: "bikes/sportbike-08-aprilia-black.png",
        desc: "An Italian V4 that sounds like it is angry with the world, and wins.",
      },
      {
        id: "sportbike-triumph",
        name: "Triumph Speed Triple 1200 RS",
        price: 19500,
        upkeep: 520,
        speed: "170 mph",
        cap: 2,
        img: "bikes/sportbike-09-triumph-black.png",
        desc: "A triple-cylinder hooligan with the best burble in the garage.",
      },
      {
        id: "sportbike-bmw-m",
        name: "BMW M 1000 RR",
        price: 45000,
        upkeep: 1400,
        speed: "190 mph",
        cap: 2,
        img: "bikes/sportbike-10-bmw-white.png",
        desc: "Carbon wheels, winglets and a price that would buy a very good car.",
      },
      {
        id: "sportbike-mvagusta",
        name: "MV Agusta F4 Claudio",
        price: 78000,
        upkeep: 2200,
        speed: "186 mph",
        cap: 2,
        img: "bikes/sportbike-11-mvagusta-red.png",
        desc: "A limited-run collector's bike. You will look at it more than ride it.",
      },
      {
        id: "sportbike-ktm-rc8c",
        name: "KTM RC 8C",
        price: 42000,
        upkeep: 1300,
        speed: "175 mph",
        cap: 1,
        img: "bikes/sportbike-12-ktm-black.png",
        desc: "A track-only weapon with one seat and no excuses whatsoever.",
      },
      {
        id: "moto-yamaha-r6",
        name: "Yamaha YZF-R6",
        price: 12500,
        upkeep: 450,
        speed: "160 mph",
        cap: 2,
        img: "bikes/moto-01-yamaha-r6-blue.png",
        type: "moto",
        desc: "A screaming supersport that wants to be revved to the moon.",
      },
      {
        id: "moto-honda-crf",
        name: "Honda CRF450RX",
        price: 10200,
        upkeep: 380,
        speed: "85 mph",
        cap: 1,
        img: "bikes/moto-02-honda-crf-red.png",
        type: "moto",
        desc: "A red enduro built for fire roads and bad decisions.",
      },
      {
        id: "moto-kawasaki-ninja",
        name: "Kawasaki Ninja ZX-6R",
        price: 11800,
        upkeep: 440,
        speed: "160 mph",
        cap: 2,
        img: "bikes/moto-03-kawasaki-ninja-black.png",
        type: "moto",
        desc: "Black, green-wheeled and very much a Ninja.",
      },
      {
        id: "moto-harley-street-bob",
        name: "Harley-Davidson Street Bob",
        price: 17500,
        upkeep: 560,
        speed: "110 mph",
        cap: 2,
        img: "bikes/moto-04-harley-black.png",
        type: "moto",
        desc: "Black paint, loud pipes and zero apologies.",
      },
      {
        id: "moto-honda-scooter",
        name: "Honda Click 160 Scooter",
        price: 3800,
        upkeep: 220,
        speed: "62 mph",
        cap: 2,
        img: "bikes/moto-05-honda-scooter-white.png",
        type: "moto",
        desc: "The sensible white scooter that gets you everywhere and judges nobody.",
      },
      {
        id: "moto-bmw-gs",
        name: "BMW R 1250 GS Adventure",
        price: 20500,
        upkeep: 650,
        speed: "125 mph",
        cap: 2,
        img: "bikes/moto-06-bmw-gs-black.png",
        type: "moto",
        desc: "Gold wheels, big tank, and the confidence to cross a continent.",
      },
      {
        id: "moto-ducati-panigale",
        name: "Ducati Panigale V2",
        price: 19500,
        upkeep: 620,
        speed: "170 mph",
        cap: 2,
        img: "bikes/moto-07-ducati-panigale-red.png",
        type: "moto",
        desc: "Italian red, tiny seat, enormous attitude.",
      },
      {
        id: "moto-suzuki-gsxr",
        name: "Suzuki GSX-R1000R",
        price: 18500,
        upkeep: 600,
        speed: "186 mph",
        cap: 2,
        img: "bikes/moto-08-suzuki-gsxr-blue.png",
        type: "moto",
        desc: "A blue superbike with racing in its blood.",
      },
      {
        id: "moto-chopper",
        name: "Custom Black Chopper",
        price: 24500,
        upkeep: 700,
        speed: "105 mph",
        cap: 2,
        img: "bikes/moto-09-chopper-black.png",
        type: "moto",
        desc: "Long forks, flame paint and a seat made for the open road.",
      },
      {
        id: "moto-ktm-enduro",
        name: "KTM 350 EXC-F Enduro",
        price: 11200,
        upkeep: 400,
        speed: "80 mph",
        cap: 1,
        img: "bikes/moto-10-ktm-enduro-white.png",
        type: "moto",
        desc: "A light enduro that eats trails for breakfast.",
      },
      {
        id: "moto-kawasaki-z",
        name: "Kawasaki Z900",
        price: 9800,
        upkeep: 380,
        speed: "150 mph",
        cap: 2,
        img: "bikes/moto-11-kawasaki-z-green.png",
        type: "moto",
        desc: "A green naked bike with a very loud personality.",
      },
      {
        id: "moto-honda-goldwing",
        name: "Honda Gold Wing Tour",
        price: 27500,
        upkeep: 780,
        speed: "125 mph",
        cap: 2,
        img: "bikes/moto-12-honda-goldwing-red.png",
        type: "moto",
        desc: "A red touring cruiser with luggage, heated seats and a stereo.",
      },
      {
        id: "dirt-honda-crf450r",
        name: "Honda CRF450R",
        price: 9800,
        upkeep: 380,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-01-honda-crf-red.png",
        type: "dirt bike",
        desc: "Red and ready for the track.",
      },
      {
        id: "dirt-yamaha-yz450f",
        name: "Yamaha YZ450F",
        price: 9600,
        upkeep: 370,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-02-yamaha-yz-blue.png",
        type: "dirt bike",
        desc: "Blue, fast and built to win motocross.",
      },
      {
        id: "dirt-kawasaki-kx450",
        name: "Kawasaki KX450",
        price: 9500,
        upkeep: 370,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-03-kawasaki-kx-green.png",
        type: "dirt bike",
        desc: "Lime green and mean over every jump.",
      },
      {
        id: "dirt-ktm-450-sxf",
        name: "KTM 450 SX-F",
        price: 10900,
        upkeep: 400,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-04-ktm-sx-orange.png",
        type: "dirt bike",
        desc: "Orange fury, straight from the factory.",
      },
      {
        id: "dirt-husqvarna-fc450",
        name: "Husqvarna FC 450",
        price: 11000,
        upkeep: 410,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-05-husqvarna-white.png",
        type: "dirt bike",
        desc: "White and navy, with plenty of Swedish precision.",
      },
      {
        id: "dirt-suzuki-rmz450",
        name: "Suzuki RM-Z450",
        price: 9300,
        upkeep: 360,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-06-suzuki-rm-yellow.png",
        type: "dirt bike",
        desc: "A yellow motocross classic that never goes out of style.",
      },
      {
        id: "dirt-gasgas-mc450f",
        name: "GasGas MC 450F",
        price: 10300,
        upkeep: 390,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-07-gasgas-red.png",
        type: "dirt bike",
        desc: "Red race machine with serious acceleration.",
      },
      {
        id: "dirt-beta-450-rx",
        name: "Beta 450 RX",
        price: 10800,
        upkeep: 400,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-08-beta-white.png",
        type: "dirt bike",
        desc: "White Italian enduro-cross for tight trails.",
      },
      {
        id: "dirt-sherco-450-sef",
        name: "Sherco 450 SEF-R",
        price: 11200,
        upkeep: 410,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-09-sherco-blue.png",
        type: "dirt bike",
        desc: "Blue with green rims, built for hard enduro.",
      },
      {
        id: "dirt-tm-mx-450",
        name: "TM Racing MX 450 Fi",
        price: 9900,
        upkeep: 380,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-10-tm-racing-blue.png",
        type: "dirt bike",
        desc: "A light blue race bike from a small, serious factory.",
      },
      {
        id: "dirt-kawasaki-kx450-factory",
        name: "Kawasaki KX450 Factory Edition",
        price: 13800,
        upkeep: 500,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-11-monster-black-green.png",
        type: "dirt bike",
        desc: "Black and green factory graphics and all the horsepower.",
      },
      {
        id: "dirt-honda-crf450r-works",
        name: "Honda CRF450R Works Edition",
        price: 12400,
        upkeep: 460,
        speed: "85 mph",
        cap: 1,
        img: "bikes/dirt-12-honda-crf-red-2.png",
        type: "dirt bike",
        desc: "The red works bike with every upgrade bolted on.",
      },
      {
        id: "scooter-honda-dio-black",
        name: "Honda Dio 110 Black",
        price: 3200,
        upkeep: 190,
        speed: "55 mph",
        cap: 2,
        img: "bikes/scooter-01-honda-dio-black.png",
        type: "scooter",
        desc: "A sleek black city scooter.",
      },
      {
        id: "scooter-yamaha-zuma",
        name: "Yamaha Zuma 125 Blue",
        price: 3900,
        upkeep: 230,
        speed: "60 mph",
        cap: 2,
        img: "bikes/scooter-02-yamaha-zuma-blue.png",
        type: "scooter",
        desc: "Rugged little blue scooter with a big attitude.",
      },
      {
        id: "scooter-honda-dio-pink",
        name: "Honda Dio Pink Edition",
        price: 3300,
        upkeep: 190,
        speed: "55 mph",
        cap: 2,
        img: "bikes/scooter-03-honda-dio-pink.png",
        type: "scooter",
        desc: "Hot pink, small engine, huge personality.",
      },
      {
        id: "scooter-yamaha-purple",
        name: "Yamaha Jog RR Purple",
        price: 3100,
        upkeep: 190,
        speed: "55 mph",
        cap: 2,
        img: "bikes/scooter-04-yamaha-purple.png",
        type: "scooter",
        desc: "A purple city runabout with sporty bodywork.",
      },
      {
        id: "scooter-honda-dio-white",
        name: "Honda Dio 110 White",
        price: 3200,
        upkeep: 190,
        speed: "55 mph",
        cap: 2,
        img: "bikes/scooter-05-honda-dio-white.png",
        type: "scooter",
        desc: "Clean white paint and neat little graphics.",
      },
      {
        id: "scooter-yamaha-zuma-red",
        name: "Yamaha Zuma 125 Red",
        price: 3900,
        upkeep: 230,
        speed: "60 mph",
        cap: 2,
        img: "bikes/scooter-06-yamaha-zuma-red.png",
        type: "scooter",
        desc: "The red Zuma: tough, loud and quick off the line.",
      },
      {
        id: "scooter-yamaha-jog-white",
        name: "Yamaha Jog White",
        price: 3000,
        upkeep: 180,
        speed: "55 mph",
        cap: 2,
        img: "bikes/scooter-07-yamaha-jog-white.png",
        type: "scooter",
        desc: "A white, cheap and cheerful commuter.",
      },
      {
        id: "scooter-honda-zx",
        name: "Honda Dio ZX Black",
        price: 3400,
        upkeep: 200,
        speed: "55 mph",
        cap: 2,
        img: "bikes/scooter-08-honda-zx-black.png",
        type: "scooter",
        desc: "Sharp black styling and a stubborn little engine.",
      },
      {
        id: "scooter-suzuki-address",
        name: "Suzuki Address 110 Blue",
        price: 2900,
        upkeep: 170,
        speed: "55 mph",
        cap: 2,
        img: "bikes/scooter-09-suzuki-blue.png",
        type: "scooter",
        desc: "Blue and white and absurdly easy to park.",
      },
      {
        id: "scooter-honda-dio-red",
        name: "Honda Dio 110 Red",
        price: 3200,
        upkeep: 190,
        speed: "55 mph",
        cap: 2,
        img: "bikes/scooter-10-honda-dio-red.png",
        type: "scooter",
        desc: "A red scooter that makes every errand feel faster.",
      },
      {
        id: "scooter-yamaha-aerox",
        name: "Yamaha Aerox 155",
        price: 4500,
        upkeep: 260,
        speed: "60 mph",
        cap: 2,
        img: "bikes/scooter-11-yamaha-yellow.png",
        type: "scooter",
        desc: "The yellow one. Quick, loud and a little bit show-off.",
      },
      {
        id: "scooter-honda-dio-green",
        name: "Honda Dio Army Green",
        price: 3200,
        upkeep: 190,
        speed: "55 mph",
        cap: 2,
        img: "bikes/scooter-12-honda-dio-green.png",
        type: "scooter",
        desc: "Matte army green for a stealthier commute.",
      },
    ],
    planes: [
      {
        id: "seaplane",
        name: "Kingfisher Seaplane",
        price: 450000,
        upkeep: 1800,
        speed: "145 kt",
        cap: 6,
        img: "aircraft/seaplane.png",
        desc: "A rugged amphibian that can land on lakes, rivers and private strips.",
      },
      {
        id: "turboprop",
        name: "Meridian T6 Turboprop",
        price: 1800000,
        upkeep: 5200,
        speed: "310 kt",
        cap: 9,
        img: "aircraft/turboprop.png",
        desc: "A dependable executive turboprop with short-field performance.",
      },
      {
        id: "private-jet",
        name: "Aeris Zephyr Jet",
        price: 12000000,
        upkeep: 38000,
        speed: "480 kt",
        cap: 12,
        img: "aircraft/private-jet.png",
        desc: "A long-range private jet with a full galley and lie-flat seats.",
      },
      {
        id: "airliner",
        name: "Skyline 737 BBJ",
        price: 45000000,
        upkeep: 125000,
        speed: "510 kt",
        cap: 42,
        img: "aircraft/airliner.png",
        desc: "A converted airliner for entourages, staff and very loud entrances.",
      },
      {
        id: "plane-01-airliner-blue",
        name: "Meridian A320 Shuttle",
        price: 38000000,
        upkeep: 95000,
        speed: "470 kt",
        cap: 40,
        img: "aircraft/plane-01-airliner-blue.png",
        desc: "A narrow-body airliner refit for executive charters.",
      },
      {
        id: "plane-02-airliner-red-stripe",
        name: "Sunrise A320 Charter",
        price: 36000000,
        upkeep: 92000,
        speed: "470 kt",
        cap: 40,
        img: "aircraft/plane-02-airliner-red-stripe.png",
        desc: "A short-haul airliner with a red-and-blue stripe livery.",
      },
      {
        id: "plane-03-bizjet-gold",
        name: "Sovereign G650 Jet",
        price: 68000000,
        upkeep: 160000,
        speed: "516 kt",
        cap: 16,
        img: "aircraft/plane-03-bizjet-gold.png",
        desc: "An ultra long-range business jet with gold accents.",
      },
      {
        id: "plane-04-turboprop-navy",
        name: "Atlas ATR Turboprop",
        price: 22000000,
        upkeep: 64000,
        speed: "270 kt",
        cap: 50,
        img: "aircraft/plane-04-turboprop-navy.png",
        desc: "A regional twin turboprop for island hopping.",
      },
      {
        id: "plane-05-superjumbo-white",
        name: "Imperial Superjumbo",
        price: 350000000,
        upkeep: 780000,
        speed: "560 kt",
        cap: 120,
        img: "aircraft/plane-05-superjumbo-white.png",
        desc: "A double-decker superjumbo with a private suite deck.",
      },
      {
        id: "plane-06-bizjet-black-red",
        name: "Raven Phantom Jet",
        price: 52000000,
        upkeep: 130000,
        speed: "500 kt",
        cap: 14,
        img: "aircraft/plane-06-bizjet-black-red.png",
        desc: "A black-and-red executive jet that says money without words.",
      },
      {
        id: "plane-07-regional-blue",
        name: "Azure Regional Jet",
        price: 30000000,
        upkeep: 80000,
        speed: "450 kt",
        cap: 36,
        img: "aircraft/plane-07-regional-blue.png",
        desc: "A regional jet with a custom blue livery.",
      },
      {
        id: "plane-08-cargo-purple",
        name: "Parcel Express Freighter",
        price: 42000000,
        upkeep: 105000,
        speed: "460 kt",
        cap: 6,
        img: "aircraft/plane-08-cargo-purple.png",
        desc: "A cargo freighter for moving a lot of boxes very fast.",
      },
      {
        id: "plane-09-supersonic-white",
        name: "Concorde-Class Supersonic",
        price: 250000000,
        upkeep: 600000,
        speed: "1,150 kt",
        cap: 40,
        img: "aircraft/plane-09-supersonic-white.png",
        desc: "A supersonic jet that crosses the Atlantic before lunch.",
      },
      {
        id: "plane-10-bizjet-navy",
        name: "Meridian Navy Jet",
        price: 48000000,
        upkeep: 120000,
        speed: "490 kt",
        cap: 14,
        img: "aircraft/plane-10-bizjet-navy.png",
        desc: "A midsize executive jet with navy and gold trim.",
      },
      {
        id: "plane-11-jumbo-blue",
        name: "Skyline Jumbo",
        price: 420000000,
        upkeep: 860000,
        speed: "540 kt",
        cap: 140,
        img: "aircraft/plane-11-jumbo-blue.png",
        desc: "A full-size jumbo jet with lounges and a private bedroom.",
      },
      {
        id: "plane-12-bizjet-black",
        name: "Onyx Light Jet",
        price: 18000000,
        upkeep: 52000,
        speed: "440 kt",
        cap: 8,
        img: "aircraft/plane-12-bizjet-black.png",
        desc: "A sleek black light jet for quick trips.",
      },
    ],
    helicopters: [
      {
        id: "helicopter",
        name: "Rotor R44",
        price: 950000,
        upkeep: 4300,
        speed: "110 kt",
        cap: 4,
        img: "aircraft/heli-07-corporate-black.png",
        desc: "A light utility helicopter that gets you over traffic in minutes.",
      },
      {
        id: "news-heli",
        name: "Skyline News Chopper",
        price: 1600000,
        upkeep: 7000,
        speed: "130 kt",
        cap: 5,
        img: "aircraft/heli-05-news-blue.png",
        desc: "A blue-and-white broadcast helicopter with a camera ball on the nose.",
      },
      {
        id: "police-heli",
        name: "Sentinel Patrol Heli",
        price: 1900000,
        upkeep: 8500,
        speed: "140 kt",
        cap: 6,
        img: "aircraft/heli-02-police-white.png",
        desc: "White with a light bar. People will assume you are official.",
      },
      {
        id: "lifeflight",
        name: "LifeFlight 120",
        price: 2400000,
        upkeep: 11000,
        speed: "145 kt",
        cap: 6,
        img: "aircraft/heli-03-lifeflight-red.png",
        desc: "A red air-medical helicopter with a full stretcher cabin.",
      },
      {
        id: "air-ambulance",
        name: "MedEvac 145",
        price: 2600000,
        upkeep: 11500,
        speed: "150 kt",
        cap: 6,
        img: "aircraft/heli-08-air-ambulance-red.png",
        desc: "The faster air-ambulance spec, kitted out for serious retrievals.",
      },
      {
        id: "blackhawk",
        name: "Valkyrie UH-S Utility",
        price: 2800000,
        upkeep: 12000,
        speed: "150 kt",
        cap: 12,
        img: "aircraft/heli-01-blackhawk-black.png",
        desc: "A matte-black utility helicopter that carries a whole squad.",
      },
      {
        id: "surveillance-heli",
        name: "Blackwatch Surveillance",
        price: 3100000,
        upkeep: 13500,
        speed: "155 kt",
        cap: 8,
        img: "aircraft/heli-04-fbi-black.png",
        desc: "Black, quiet and fitted with a sensor turret you probably cannot legally use.",
      },
      {
        id: "luxury-helicopter",
        name: "Nocturne Executive",
        price: 4500000,
        upkeep: 19000,
        speed: "155 kt",
        cap: 8,
        img: "aircraft/heli-09-corporate-green.png",
        desc: "A black-and-gold executive helicopter with club seating and champagne.",
      },
      {
        id: "netjets-heli",
        name: "NetJets Shuttle 12",
        price: 4800000,
        upkeep: 19500,
        speed: "150 kt",
        cap: 12,
        img: "aircraft/heli-12-netjets-white.png",
        desc: "A white corporate shuttle that moves the whole board in one lift.",
      },
      {
        id: "klm-heli",
        name: "KLM Executive 10",
        price: 5200000,
        upkeep: 21000,
        speed: "160 kt",
        cap: 10,
        img: "aircraft/heli-10-klm-blue.png",
        desc: "Airline-blue livery, VIP interior, and a badge that opens doors.",
      },
      {
        id: "h160-noir",
        name: "Airbus H160 Noir",
        price: 5800000,
        upkeep: 23000,
        speed: "155 kt",
        cap: 10,
        img: "aircraft/heli-11-airbus-black.png",
        desc: "The newest executive airframe in the hangar, finished in satin black.",
      },
      {
        id: "apache",
        name: "Reaper AH-X Attack",
        price: 18500000,
        upkeep: 90000,
        speed: "160 kt",
        cap: 2,
        img: "aircraft/heli-06-apache-military.png",
        desc: "A demilitarised attack helicopter. Two seats, zero chill.",
      },
    ],
  };
  // [mod] vehicle prices x2.25 (same multiplier as cars in the car dealers)
  Object.values(CATALOG).forEach((list) => list.forEach((v) => { v.price = Math.round(v.price * (window.VEHICLE_PRICE_MULT || 2.25)); }));

  const money = (n) =>
    typeof usd === "function"
      ? usd(n)
      : `$${Math.round(Number(n) || 0).toLocaleString("en-US")}`;
  const dots = () => (typeof DOTS !== "undefined" ? DOTS : "");
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const back = () => (typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;");
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const fleet = () => {
    if (!Array.isArray(state.eliteVehicles)) state.eliteVehicles = [];
    return state.eliteVehicles;
  };
  const ownedBy = (kind) => fleet().filter((v) => v && v.kind === kind);
  const findDef = (kind, id) => (CATALOG[kind] || []).find((v) => v.id === id);

  /* Yearly showroom: every year each dealer shows a fresh random selection of its catalog. Most are new (the price
     moves a little with the market), some are used (lower condition, cheaper). Kept in state.eliteStock so the list does
     not change every time you open the shop; it is thrown away when you age up. */
  const yearNow = () => (state.birthYear || 0) + (state.age || 0);
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pickN = (arr, n) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  };
  const stockSize = (kind, total) => Math.min(total, kind === "sportbikes" ? 16 : Math.max(5, Math.round(total * 0.55)));
  const roundPrice = (n) => {
    const step = n > 20000 ? 100 : 10;
    return Math.max(50, Math.round(n / step) * step);
  };
  function showroom(kind) {
    const y = yearNow();
    if (!state.eliteStock || state.eliteStock.year !== y) state.eliteStock = { year: y, kinds: {} };
    const kinds = state.eliteStock.kinds;
    if (!kinds[kind]) {
      // any model can come up again, even one you already own: you can keep several of the same model
      const cat = CATALOG[kind] || [];
      kinds[kind] = pickN(cat, stockSize(kind, cat.length)).map((d) => {
        const used = Math.random() < 0.28,
          cond = used ? ri(45, 88) : 100,
          price = used
            ? roundPrice(d.price * (0.45 + (0.55 * cond) / 100) * (0.95 + Math.random() * 0.1))
            : roundPrice(d.price * (0.94 + Math.random() * 0.14));
        return { id: d.id, used, cond, price, qty: used || kind === "islands" ? 1 : ri(1, 3) };
      });
    }
    return kinds[kind];
  }
  const value = (v) => Math.max(0, Math.round((Number(v.price) || 0) * (0.55 + (Number(v.cond) || 100) / 300)));

  function openVehicleStore(kind) {
    const cat = CATS[kind];
    if (!cat) return openShopping();
    const have = (id) => ownedBy(kind).filter((v) => v.id === id).length;
    const stock = showroom(kind)
      .map((l) => ({ l, def: findDef(kind, l.id) }))
      .filter((x) => x.def && x.l.qty > 0);
    sTitle.textContent = cat.title;
    sSub.style.display = "none";
    sBack.innerHTML = back();
    sBack.onclick = () => openShopping();
    sList.innerHTML = stock.length
      ? `<div class="sec">In stock for ${yearNow()}</div>` +
        stock
          .map(
            ({ l, def: v }, i) =>
              `<div class="row" data-elite-buy="${i}"><img src="${v.img}" alt="" style="object-fit:contain"><div class="t"><b>${esc(v.name)} <em>(${l.used ? `${kind === "islands" ? "Run-down" : "Used"} · ${l.cond}%` : kind === "islands" ? "Ready" : "New"})</em></b><span>${money(l.price)} · ${esc(v.speed)} · ${v.cap} ${kind === "islands" ? "guests" : "seats"}${l.qty > 1 ? ` · ${l.qty} available` : ""}${have(v.id) ? ` · you own ${have(v.id)}` : ""}</span></div>${dots()}</div>`,
          )
          .join("") +
        `<div class="mm-foot" style="padding:10px 14px;text-align:left">The showroom gets a new random selection every year.</div>`
      : `<div class="row dis"><img src="${cat.icon}" alt=""><div class="t"><b>Sold out for ${yearNow()}</b><span>Come back next year: the ${cat.short.toLowerCase()} showroom gets a new random selection</span></div></div>`;
    sList.querySelectorAll("[data-elite-buy]").forEach((el) => {
      el.onclick = () => {
        const x = stock[Number(el.dataset.eliteBuy)];
        vehicleCard(x.def, kind, x.l);
      };
    });
    sList.scrollTop = 0;
    screen.classList.add("open");
  }

  function vehicleCard(def, kind, listing) {
    if (!def) return openVehicleStore(kind);
    const cat = CATS[kind];
    const l = listing || { used: false, cond: 100, price: def.price },
      cost = l.price;
    jCard({
      tag: cat.short,
      iconSrc: def.img,
      title: def.name,
      close: () => openVehicleStore(kind),
      lead: def.desc + (l.used ? ` This one is used (${l.cond}% condition).` : ""),
      rows: [
        ["Price", money(cost)],
        ...(l.used ? [["Condition", `${l.cond}%`]] : []),
        [kind === "islands" ? "Size" : "Top speed", def.speed],
        [kind === "islands" ? "Guests" : "Capacity", `${def.cap} people`],
        ["Yearly upkeep", money(def.upkeep)],
      ],
      choices: [
        [
          `Buy it — ${money(cost)}`,
          () => {
            if (state.age < 18)
              return notice("Too young", `You must be at least 18 to buy ${kind === "islands" ? "an island" : "a vehicle"}.`, null, true);
            const needLic = { boats: "boat", sportbikes: "motorcycle", planes: "pilot", helicopters: "heli" }[kind];
            if (needLic && window.FL_LICENSES && !FL_LICENSES.has(needLic)) return FL_LICENSES.need(needLic);
            if (state.money < cost)
              return notice(
                "Not enough",
                `You need ${money(cost)} to buy the ${esc(def.name)}.`,
                null,
                false,
              );
            state.money -= cost;
            l.qty = (Number(l.qty) || 1) - 1; // one unit sold; if units are left you can buy the same model again
            fleet().push({
              ...def,
              kind,
              value: def.price,
              cond: l.cond,
              bought: state.age,
              used: -1,
            });
            if (typeof chaChing === "function") chaChing();
            if (typeof renderStats === "function") renderStats();
            if (typeof say === "function") say(`I bought a ${l.used ? "used " : ""}${def.name} for ${money(cost)}.`);
            notice(
              "Delivered",
              kind === "islands"
                ? `${esc(def.name)} is yours. Find it in Assets, under Garage, Marina & Hangar.`
                : `The ${esc(def.name)} is yours. It is waiting in your garage, marina and hangar.`,
              () => openVehicleStore(kind),
              true,
            );
          },
        ],
        ["Not today", () => openVehicleStore(kind)],
      ],
    });
  }

  function openOwned() {
    const all = fleet();
    sTitle.textContent = "GARAGE, MARINA & HANGAR";
    sSub.style.display = "none";
    sBack.innerHTML = back();
    sBack.onclick = () => openAssets();
    sList.innerHTML = all.length
      ? all
          .map(
            (v, i) =>
              `<div class="row" data-elite-owned="${i}"><img src="${v.img}" alt=""><div class="t"><b>${esc(v.name)}</b><span>${esc(CATS[v.kind] ? CATS[v.kind].short : "Vehicle")} · ${Math.round(v.cond)}% condition · ${money(value(v))}</span></div>${dots()}</div>`,
          )
          .join("")
      : `<div class="row dis"><img src="boats/ship-06-superyacht-white.png" alt=""><div class="t"><b>No vehicles</b><span>Visit Shopping to stock your garage, marina and hangar</span></div></div>`;
    sList.querySelectorAll("[data-elite-owned]").forEach((el) => {
      el.onclick = () => ownedCard(all[Number(el.dataset.eliteOwned)]);
    });
    sList.scrollTop = 0;
    screen.classList.add("open");
  }

  function ownedCard(v) {
    if (!v) return openOwned();
    const label = CATS[v.kind] ? CATS[v.kind].short : "Vehicle";
    jCard({
      tag: label,
      iconSrc: v.img,
      title: v.name,
      close: () => openOwned(),
      lead: `Your ${label.toLowerCase()}, bought at age ${v.bought}.`,
      rows: [
        ["Estimated value", money(value(v))],
        [v.kind === "islands" ? "Size" : "Top speed", v.speed],
        [v.kind === "islands" ? "Guests" : "Capacity", `${v.cap} people`],
        ["Yearly upkeep", money(v.upkeep)],
      ],
      bars: [["Condition", Math.max(1, Math.min(100, Number(v.cond) || 0))]],
      choices: [
        [
          v.kind === "islands" ? "Spend a day there" : "Take it out",
          () => {
            if (state.age < 18)
              return notice("Too young", "You must be at least 18 to take it out.", null, true);
            if (v.used === state.age)
              return notice("Already out", `You already took the ${v.name} out this year.`, null, true);
            v.used = state.age;
            if (typeof fx === "function") fx({ Happiness: typeof rint === "function" ? rint(3, 9) : 5 }, "");
            if (typeof say === "function") say(`I took my ${v.name} out for the day.`);
            notice(
              "Worth it",
              v.kind === "islands"
                ? `You spent the day on ${esc(v.name)}: sand, silence and not one neighbour. The upkeep is expensive, but the view is not.`
                : `You spent the day on your ${esc(v.name)}. The upkeep is expensive, but the view is not.`,
              () => openOwned(),
              true,
            );
          },
        ],
        [
          "Sell it",
          () => {
            const offer = Math.round(value(v) * 0.9);
            const sell = () => {
              const i = fleet().indexOf(v);
              if (i < 0) return;
              fleet().splice(i, 1);
              state.money += offer;
              if (typeof chaChing === "function") chaChing();
              if (typeof renderStats === "function") renderStats();
              if (typeof say === "function") say(`I sold my ${v.name} for ${money(offer)}.`);
              notice("Sold", `You sold the ${esc(v.name)} for ${money(offer)}.`, () => openOwned(), true);
            };
            if (typeof iosConfirm === "function")
              iosConfirm("Sell it", `Sell your ${esc(v.name)} for ${money(offer)}?`, sell);
            else sell();
          },
        ],
      ],
    });
  }

  function addShoppingRows() {
    if (typeof isOldEra === "function" && isOldEra()) return;
    const rows =
      `<div class="sec">Garage, Marina & Hangar</div>` +
      Object.entries(CATS)
        .map(
          ([kind, cat]) =>
            `<div class="row" data-elite="${kind}"><img src="${cat.icon}" alt=""><div class="t"><b>${esc(cat.dealer)}</b><span>${esc(cat.desc)}</span></div>${chev()}</div>`,
        )
        .join("");
    // Quita los escaparates genéricos de la versión anterior.
    [...sList.querySelectorAll(".row")].forEach((row) => {
      const name = row.querySelector("b")?.textContent?.trim();
      if (name === "Skyline Aircraft Sales" || name === "Discount Aviation Dealer" || name === "Jones Boat Sales")
        row.remove();
    });
    const oldSec = [...sList.querySelectorAll(".sec")].find(
      (sec) => sec.textContent.trim() === "Specialty Vehicle Dealers",
    );
    if (oldSec) oldSec.remove();
    const brokers = [...sList.querySelectorAll(".sec")].find(
      (sec) => sec.textContent.trim() === "Real Estate Brokers",
    );
    if (brokers) brokers.insertAdjacentHTML("beforebegin", rows);
    else sList.insertAdjacentHTML("beforeend", rows);
    sList.querySelectorAll("[data-elite]").forEach((el) => {
      el.onclick = () => {
        if (typeof play === "function") play("choice");
        openVehicleStore(el.dataset.elite);
      };
    });
  }

  function addAssetsRow() {
    if (document.getElementById("eliteAssetsRow")) return;
    const html =
      `<div class="sec">Garage, Marina & Hangar</div>` +
      `<div class="row" id="eliteAssetsRow"><img src="boats/ship-06-superyacht-white.png" alt=""><div class="t"><b>Garage, Marina &amp; Hangar</b><span>${fleet().length} vehicle${fleet().length === 1 ? "" : "s"} in your collection</span></div>${chev()}</div>`;
    const misc = [...sList.querySelectorAll(".sec")].find((sec) => sec.textContent.trim() === "Misc.");
    if (misc) misc.insertAdjacentHTML("beforebegin", html);
    else sList.insertAdjacentHTML("beforeend", html);
    const row = document.getElementById("eliteAssetsRow");
    if (row) row.onclick = () => openOwned();
  }

  // Envolvemos Shopping y Assets una sola vez. Los otros módulos (joyas,
  // instrumentos) ya han envuelto estas funciones antes que nosotros.
  const shopping = window.openShopping;
  window.openShopping = function () {
    const result = shopping.apply(this, arguments);
    try {
      if (typeof sTitle !== "undefined" && sTitle.textContent === "SHOPPING") addShoppingRows();
    } catch (e) {
      console.warn("[elite-life] shopping", e);
    }
    return result;
  };

  const assets = window.openAssets;
  window.openAssets = function () {
    const result = assets.apply(this, arguments);
    try {
      if (typeof sTitle !== "undefined" && sTitle.textContent === "ASSETS") addAssetsRow();
    } catch (e) {
      console.warn("[elite-life] assets", e);
    }
    return result;
  };

  // Desgaste y mantenimiento anual.
  const ageButton = document.getElementById("ageBtn");
  if (ageButton)
    ageButton.addEventListener("click", () => {
      if (state && !state.dead) state.eliteStock = null; // new year, new showroom selection
      if (!state || state.dead || !fleet().length) return;
      let upkeep = 0;
      for (const v of fleet()) {
        v.cond = Math.max(0, (Number(v.cond) || 100) - (typeof rint === "function" ? rint(1, 4) : 2));
        upkeep += Number(v.upkeep) || 0;
      }
      if (upkeep) state.money = Math.max(0, state.money - upkeep);
    });

  // Nombres estables para las tiendas.
  state.shops ||= {};
  state.shops.boat ||= CATS.boats.dealer;
  state.shops.bike ||= CATS.sportbikes.dealer;
  state.shops.aircraft ||= CATS.planes.dealer;
  state.shops.heli ||= CATS.helicopters.dealer;
  state.shops.island ||= CATS.islands.dealer;

  window.FL_ELITE_LIFE = {
    CATALOG,
    openVehicleStore,
    openOwned,
    fleet,
  };
})();

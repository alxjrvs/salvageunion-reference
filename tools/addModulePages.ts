#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const projectRoot = process.cwd();
const modulesPath = join(projectRoot, "data", "modules.json");

// Page mapping from PDF pages 188-189
const modulePages: Record<string, number> = {
  // Tech 1 (from page 188)
  "Comms Module": 190,
  "Equipment Locker": 190,
  "Eggs Mayhem": 190,
  Firewall: 191,
  "Personal Recreation Device": 191,
  "Reactor Flare": 191,
  "Self-Destruct": 192,
  "Survey Scanner": 192,
  "Weapon Link": 193,
  "Weapons Link": 193,
  "Zoom Optics": 193,

  // Tech 2 (from page 188)
  "Barometric Sensor": 193,
  "Barometric Weather Sensor": 193,
  "Damage Assessor": 193,
  "Deep Survey Scanner": 194,
  "Energy Cell": 194,
  "Evasion Protocols": 194,
  "Hull Magnetiser": 194,
  "IR Night Vision Optics": 195,
  "M315 Motion Scanner": 195,
  "Metal Detector": 195,
  "Navigation Module": 196,
  "Pinpoint Targeter": 196,
  "Projection Array": 196,
  "Reactor Overload": 196,
  "Reactor Safety Protocols": 197,
  "Sleeping Beauty": 197,
  "Video Recording Array": 197,

  // Tech 3 (from page 188)
  "Advanced Weapon Link": 198,
  "Auto-Doctor": 198,
  "Comms Tapper": 199,
  "Concealed Locker": 199,
  "Coolant Flow Manifold": 199,
  "ECM Transmitter": 199,
  "Emergency Power Conduit": 199,
  "Encrypted Comms": 200,
  "Hacking Repeater Node": 200,
  "Multi-Targeter": 200,
  "Offensive Protocols": 200,
  "Panda Sneeze": 201,
  "Sonic Screecher": 201,
  "Voice Modulator": 202,

  // Tech 4 (from page 189)
  "Advanced Reactor Safety Protocols": 202,
  "Alpha Strike Module": 203,
  "Auto-Repair Droid": 203,
  "Dash Protocols": 203,
  "EM Self-Destruct": 203,
  "Electro-Magnetic Self-Destruct": 203,
  "Laser Guidance": 204,
  "Mech Scrambler": 204,
  "MRSI Co-Ordinator": 204,
  "Thermal Optics": 204,

  // Tech 5 (from page 189)
  "Advanced Targeting": 205,
  "Advanced Targeting Array": 205,
  "Coolant Flush": 205,
  "Holo Projector": 205,
  "Multi-Optics": 205,
  "Neuralink Communicator": 206,
  "Omega Push Module": 206,
  "Reaction Protocols": 206,
  "Weapon Guidance": 205,
  "DDR Module": 206,

  // Tech 6 (from page 189)
  "Matter Phaser": 207,
  "Reactor Transference": 207,

  // Additional modules found
  "Video Projection Array": 197, // Found in patterns, same page as Video Recording Array
  "Aardvarks Tongue": 202, // Listed on page 189 but marked "Deauthorised"
  "Adv. Targeting Array": 205, // Abbreviated form of Advanced Targeting Array
  "He 2 Coolant Flush": 205, // Abbreviated form of Coolant Flush
};

console.log("📄 Loading modules data...");
const modules = JSON.parse(readFileSync(modulesPath, "utf-8"));

console.log(`✅ Loaded ${modules.length} modules\n`);

let updated = 0;
let notFound = 0;

for (const module of modules) {
  const page = modulePages[module.name];
  if (page) {
    module.page = page;
    updated++;
  } else {
    console.log(`⚠️  No page mapping for: ${module.name}`);
    notFound++;
  }
}

console.log(`\n📊 Results:`);
console.log(`   ✅ Updated: ${updated}`);
console.log(`   ⚠️  Not found: ${notFound}`);

writeFileSync(modulesPath, JSON.stringify(modules, null, 2) + "\n");
console.log(`\n💾 Saved to ${modulesPath}`);

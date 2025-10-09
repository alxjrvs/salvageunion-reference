#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const projectRoot = process.cwd();
const equipmentPath = join(projectRoot, "data", "equipment.json");

// Page mapping from PDF pages 78-79
const equipmentPages: Record<string, number> = {
  // Tech 1 (from page 78)
  "First Aid Kit": 80,
  "Handheld Riveting Gun": 80,
  "Heavy Duty Torch": 80,
  "High Tensile Wire": 80,
  "Improvised Explosive Device": 80,
  "Improvised Firearm": 80,
  "Improvised Melee Weapon": 81,
  "Portable Comms Unit": 81,
  "Portable Communications Unit": 81,
  "Salvaging Tools": 81,

  // Tech 2 (from page 78)
  "Disposable Camera": 81,
  "Flare Gun": 81,
  "Holofoil Tent": 81,
  "Reinforced Polycarbonate Shield": 81,
  Pistol: 81,
  "Portable Arc Welder": 82,
  "Red Laser Pistol": 82,
  "Rigging Jack": 82,

  // Tech 3 (from page 78)
  "Green Laser Rifle": 82,
  Grenade: 82,
  "Hazard Protection Suit": 82,
  "Healing Bio-Foam": 83,
  "Handheld Epoxy Canister": 83,
  "Hover Sled": 83,
  "Melee Armament": 83,
  "Portable Flamethrower": 83,
  "Portable Flamethower": 83,
  "Reactive Armour": 83,
  Rifle: 83,
  Shotgun: 84,
  "Tranquiliser Rifle": 84,
  "Tranquilizer Rifle": 84,

  // Tech 4 (from page 79)
  "Electro Grappling Hook": 84,
  "Advanced Epoxy Applicator": 84,
  "Night Vision Goggles": 84,
  "Portable Multi-Phase Shield": 85,
  "Sniper Rifle": 85,
  "Remote Mine": 85,
  "Rocket Launcher": 85,
  "Monomolecular Sword": 85,

  // Tech 5 (from page 79)
  "Blinding Blue Laser": 85,
  "Beta Fission Gun": 85,
  "Anti-Gravity Belt": 86,
  "Executive Corpo Suit": 86,
  "Polycarbonate Carapace Armour": 86,
  "Miniaturised Repair Arm": 86,

  // Tech 6 (from page 79)
  "Nanite Repair Injector": 87,
  "Orbital Lance Controller": 87,
};

console.log("📄 Loading equipment data...");
const equipment = JSON.parse(readFileSync(equipmentPath, "utf-8"));

console.log(`✅ Loaded ${equipment.length} equipment items\n`);

let updated = 0;
let notFound = 0;

for (const item of equipment) {
  const page = equipmentPages[item.name];
  if (page) {
    item.page = page;
    updated++;
  } else {
    console.log(`⚠️  No page mapping for: ${item.name}`);
    notFound++;
  }
}

console.log(`\n📊 Results:`);
console.log(`   ✅ Updated: ${updated}`);
console.log(`   ⚠️  Not found: ${notFound}`);

writeFileSync(equipmentPath, JSON.stringify(equipment, null, 2) + "\n");
console.log(`\n💾 Saved to ${equipmentPath}`);

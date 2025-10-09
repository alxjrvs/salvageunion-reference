#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const projectRoot = process.cwd();
const systemsPath = join(projectRoot, "data", "systems.json");

// Page mapping from PDF page 162-163
const systemPages: Record<string, number> = {
  // Tech 1 (from page 162)
  ".50 Cal Machine Gun": 164,
  "Armour Plating": 164,
  "Cargo Pod": 164,
  "Escape Hatch": 164,
  "Chainsaw Arm": 164,
  Floodlights: 165,
  "FM-3 Flamethrower": 165,
  "High Pressure Hose": 165,
  "Hydraulic Crusher": 165,
  "Locomotion System": 165,
  Loudspeakers: 165,
  Mechapult: 166,
  "Mini Mortar": 167,
  "Mining Rig": 167,
  "Red Laser": 167,
  "Rigging Arm": 168,
  "Transport Hold": 168,
  "Riveting Gun": 168,

  // Tech 2 (from page 162)
  "30mm Autocannon": 168,
  "Armoured Shield": 168,
  "Blue Mining Laser": 169,
  "Cargo Bay": 169,
  "Chaff Launcher": 169,
  "Dozer Blades": 169,
  "Grappling Harpoon": 169,
  "Green Laser": 170,
  "Heat Sink": 170,
  "High Gain Antenna": 170,
  "Industrial Body Kit": 170,
  "M2-X Mauler": 170,
  "Module Switch": 170,
  "Nanofibre Net Launcher": 170,
  "Personnel Transport Pod": 171,
  "Refractive Shield Projector": 171,
  "Shotgun Pit": 171,
  "Smoke Machine": 171,
  "Torpedo Tubes": 172,
  "Tracking Node": 172,
  "Welding Laser": 172,

  // Tech 3 (from page 162)
  "120mm Cannon": 172,
  "Articulated Rigging Arm": 173,
  "AFF Coolant Foam": 173,
  "Capacitance Bank": 173,
  "Composite Armour": 173,
  "Ejection System": 173,
  "EM Shield Projector": 174,
  "Fabrication Arm": 174,
  "Heavy Duty Mining Rig": 174,
  "Long Barrelled Green Laser": 175,
  "Mech Melee Armament": 175,
  "Missile Pod": 175,
  "Prawn Sifter": 175,
  "Radiation Sealing": 176,
  "Rail Rifle": 176,
  "Red Pulse Laser": 176,
  "Rotary Minigun": 176,
  "Smuggling Hold": 176,
  "Spider Locomotion System": 177,
  "Target Painter": 177,
  "Vectored Thrust Unit": 177,

  // Tech 4 (from page 163)
  "Adv. Fabrication Arm": 177,
  "Advanced Fabrication Arm": 177,
  "Anti-Mech Mine Layer": 178,
  "Automated Turret System": 178,
  "CACB Laser": 179,
  "Corpo Body Kit": 179,
  "EM Hardening": 179,
  "Grav Assisted Cargo Bay": 179,
  "Hover Locomotion System": 179,
  "Laser Anti-Missile System": 179,
  "Needle Missile Pod": 180,
  Radomes: 180,
  Railgun: 180,
  "Shield Dome": 180,
  "Snub-Nosed Blue Laser": 181,
  "Stabilising Locomotion System": 181,
  "Tesla Coils": 181,

  // Tech 5 (from page 163)
  "Amphibious Locomotion System": 182,
  "Blue Beam Laser": 182,
  "Ejector Pod": 182,
  "Fabrication Bay": 183,
  "Ion Cannon": 183,
  "Mole Torpedo": 183,
  "Multi-Purpose Repair Arm": 183,
  "Monomolecular Blade": 184,
  "Multi-Phase Shield": 184,
  "Plasma Cannon": 184,
  "Reflective Shielding": 184,

  // Tech 6 (from page 163)
  "120mm Heavy Autocannon": 185,
  "Executive Body Kit": 185,
  "Experimental Particle Beam Cannon": 185,
  "Experimental Teleportation Hold": 185,
  "Matter Phase Shield": 186,
  "N15 Fat Boy": 186,
  "Nanite Repair Arm": 187,
  "Teleportation Pod": 187,

  // Additional systems found
  Sandblaster: 167, // Listed on page 162 but marked "Deauthorised"
  "Electro-Magnetic Shield Projector": 174,
  "Automated Weapon Turret": 178,
  "Automated Machine Gun Turret": 178,
  "Automated Green Laser Turret": 178,
  "Automated 120mm Cannon Turret": 178,
  "Aerosolised Nerve Gas Sprayer": 178,
  "Electro-Magnetic Hardening": 179,
};

console.log("📄 Loading systems data...");
const systems = JSON.parse(readFileSync(systemsPath, "utf-8"));

console.log(`✅ Loaded ${systems.length} systems\n`);

let updated = 0;
let notFound = 0;

for (const system of systems) {
  const page = systemPages[system.name];
  if (page) {
    system.page = page;
    updated++;
  } else {
    console.log(`⚠️  No page mapping for: ${system.name}`);
    notFound++;
  }
}

console.log(`\n📊 Results:`);
console.log(`   ✅ Updated: ${updated}`);
console.log(`   ⚠️  Not found: ${notFound}`);

writeFileSync(systemsPath, JSON.stringify(systems, null, 2) + "\n");
console.log(`\n💾 Saved to ${systemsPath}`);

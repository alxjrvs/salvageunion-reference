# Salvage Union Data

A comprehensive, schema-validated JSON dataset and TypeScript ORM for the **Salvage Union** tabletop RPG, published by [Leyline Press](https://leyline.press/).

## Features

✅ **513+ game data items** across 18 categories
✅ **Type-safe TypeScript ORM** with inferred types
✅ **JSON Schema validation** for all data
✅ **Zero runtime dependencies**
✅ **ESM-only** for modern JavaScript
✅ **Full page references** to source material

## Installation

```bash
npm install salvageunion-data
# or
bun add salvageunion-data
```

## Quick Start

```typescript
import { SalvageUnionData } from "salvageunion-data";

const { Abilities, Chassis, Equipment, Systems, Modules } = SalvageUnionData;

// Get all chassis
const allChassis = Chassis.all();
console.log(`Total chassis: ${Chassis.count()}`);

// Find by name
const atlas = Chassis.findByName("Atlas");
if (atlas) {
  console.log(`${atlas.name}: ${atlas.stats.structure_pts} SP`);
}

// Query by tech level
const t3Equipment = Equipment.findByTechLevel(3);

// Get weapons
const weapons = Systems.getWeapons();

// Advanced queries
const heavyArmor = Equipment.where(
  (e) => e.traits?.some((t) => t.type === "armor") && (e.techLevel ?? 0) >= 3,
);
```

## Available Models

All models are accessible via the `SalvageUnionData` export:

| Model                     | Count | Description                      |
| ------------------------- | ----- | -------------------------------- |
| `Abilities`               | 95    | Pilot abilities and skills       |
| `AbilityTreeRequirements` | 20    | Ability tree prerequisites       |
| `BioTitans`               | 6     | Massive bio-engineered creatures |
| `Chassis`                 | 30    | Mech chassis                     |
| `Classes`                 | 11    | Pilot classes                    |
| `Crawlers`                | 5     | Union crawler types              |
| `Creatures`               | 6     | Wasteland creatures              |
| `Drones`                  | 9     | Autonomous drones                |
| `Equipment`               | 44    | Pilot equipment                  |
| `Keywords`                | 73    | Game keywords                    |
| `Meld`                    | 5     | Meld-infected creatures          |
| `Modules`                 | 61    | Mech modules                     |
| `NPCs`                    | 6     | Non-player characters            |
| `Squads`                  | 9     | NPC squads                       |
| `Systems`                 | 99    | Mech weapon systems              |
| `Tables`                  | 14    | Game tables                      |
| `Traits`                  | 43    | Special traits                   |
| `Vehicles`                | 7     | Wasteland vehicles               |

## API Reference

### Common Methods

All models provide these base methods:

```typescript
// Query methods
.all()                          // Get all items
.count()                        // Get count
.find(predicate)                // Find single item
.where(predicate)               // Find all matching
.findById(id)                   // Find by UUID
.findByName(name)               // Find by name
.searchByName(query)            // Partial name search
.findBySource(source)           // Find by source book

// Utility methods
.first()                        // Get first item
.last()                         // Get last item
.random()                       // Get random item
.randomMany(count)              // Get N random items

// Functional methods
.map(fn)                        // Map over items
.some(predicate)                // Check if any match
.every(predicate)               // Check if all match
```

### Model-Specific Methods

#### Equipment

```typescript
Equipment.findByTechLevel(3);
Equipment.findByTrait("armor");
Equipment.getArmor();
Equipment.getWeapons();
Equipment.findByActivationCost(1);
Equipment.getWithActions();
```

#### Chassis

```typescript
Chassis.findByTechLevel(2);
Chassis.findByMinStructurePoints(20);
Chassis.findByMinSystemSlots(4);
Chassis.findByMinModuleSlots(2);
Chassis.findByMinCargoCap(5);
```

#### Systems

```typescript
Systems.findByTechLevel(3);
Systems.findBySalvageValue(2);
Systems.findBySlotsRequired(1);
Systems.findByTrait("melee");
Systems.getWeapons();
Systems.findByDamageType("SP");
Systems.findByMinDamage(3);
```

#### Modules

```typescript
Modules.findByTechLevel(2);
Modules.findBySalvageValue(1);
Modules.findBySlotsRequired(1);
Modules.findByTrait("communicator");
Modules.getRecommended();
Modules.findByActionType("action");
```

#### Abilities

```typescript
Abilities.findByLevel(1);
Abilities.findByTree("Mechanical Knowledge");
Abilities.findByTrait("passive");
Abilities.getAllTrees();
```

## Direct Data Access

You can also import raw JSON data and schemas:

```typescript
// Import raw data
import chassisData from "salvageunion-data/data/chassis.json";
import equipmentData from "salvageunion-data/data/equipment.json";

// Import schemas
import chassisSchema from "salvageunion-data/schemas/chassis.schema.json";
```

## TypeScript Support

Full TypeScript support with inferred types from JSON data:

```typescript
import { SalvageUnionData } from "salvageunion-data";
import type { Chassis, Equipment, System } from "salvageunion-data";

const { Chassis: ChassisModel } = SalvageUnionData;

// Fully typed
const atlas: Chassis | undefined = ChassisModel.findByName("Atlas");

// Type-safe queries
const heavyEquipment: Equipment[] = SalvageUnionData.Equipment.where(
  (e) => (e.techLevel ?? 0) >= 3,
);
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Ensure all data includes page references
2. Validate changes with `bun run validate`
3. Run type checking with `bun run typecheck`
4. Follow existing data structure patterns

## 📜 License

CC-BY-4.0 License

## 🙏 Credits

This data was originally copied from [wfreinhart/salvage-union-tracker](https://github.com/wfreinhart/salvage-union-tracker) and later forked from [sbergot/salvageunion-data](https://github.com/sbergot/salvageunion-data).

Salvage Union is copyrighted by Leyline Press. Salvage Union and the “Powered by Salvage” logo are used with permission of Leyline Press, under the Salvage Union Open Game Licence 1.0b

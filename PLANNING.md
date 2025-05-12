# PLANNING.md: Simple Slot Inventory Module for Foundry VTT

## 1. Project Vision & Goal

To create a straightforward, functional module for Foundry Virtual Tabletop that implements a slot-based inventory system for the Dungeons & Dragons 5th Edition (dnd5e) game system. The primary goal is to provide GMs and players with an alternative way to track character encumbrance based on item slots rather than just weight.

## 2. Core Features (Initial Scope - V1)

* **Max Slot Calculation:** Determine maximum inventory slots for player characters based on a configurable base value plus their Strength modifier (Initial: `10 + STR Mod`).
* **Item Slot Cost:**
    * Allow manual definition of slot cost per item using a custom Foundry flag (`flags.mysimpleinventory.slotCost`).
    * Provide an input field on the item sheet (details tab for physical items) to easily view and edit this flag.
    * Use a default slot cost (Initial: `1`) if the flag is not set or invalid.
* **Slot Tracking:** Automatically calculate the total slots used by items in a character's inventory, considering item quantities.
* **UI Display:** Display the current used slots versus maximum slots clearly on the character sheet (Initial: Inventory tab header).
* **Automatic Updates:** Recalculate and update slot usage automatically when relevant changes occur (items added/removed/updated, character Strength changes).

## 3. Architecture & Tech Stack

* **Platform:** Foundry Virtual Tabletop (Targeting Core v11+)
* **Game System:** dnd5e
* **Module Structure:** Standard Foundry VTT module layout:
    * `module.json` (Manifest file)
    * Main Javascript file (`mysimpleinventory.js` using ES Modules)
    * CSS file (`mysimpleinventory.css`)
* **Core Technologies:**
    * Javascript (ES6+)
    * Foundry VTT API (Hooks, Document Flags, Data Models, UI Integration)
    * HTML (via Handlebars templating injected by Javascript)
    * CSS
    * JSON (for manifest)
* **Data Storage:** Foundry Document Flags (`actor.flags.mysimpleinventory`, `item.flags.mysimpleinventory`) for storing max slots, current slots, and item slot costs.
* **Integration Points:**
    * `Hooks.on('renderActorSheet5eCharacter')`: Inject slot display UI.
    * `Hooks.on('renderItemSheet')`: Inject slot cost input field.
    * `Hooks.on('createItem', 'deleteItem', 'updateItem')`: Trigger recalculation on inventory changes.
    * `Hooks.on('updateActor')`: Trigger recalculation on relevant actor stat changes (Strength).
    * `Hooks.on('ready')`: Perform initial setup and calculations.

## 4. Key Decisions & Constraints (V1)

* Focus on simplicity for the initial version.
* Prioritize manual slot cost entry over complex automatic parsing.
* No handling of container-in-container logic (e.g., bags reducing weight/slots of contents).
* Does not replace or directly interact with the standard dnd5e weight-based encumbrance system by default.
* Primarily targets `character` actor types.

## 5. Development Tools

* Foundry VTT Application (for testing)
* Code Editor / IDE (windsurf)
* Browser Developer Tools (for debugging Foundry client-side code)


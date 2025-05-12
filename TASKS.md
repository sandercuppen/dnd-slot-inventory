# TASKS.md – D&D Slot Inventory

_Last updated: 2025-05-12_

## Completed (V1 Core Features)
- [x] Max Slot Calculation: `10 + STR Mod` logic implemented.
- [x] Manual Item Slot Cost: Custom flag (`flags.dnd-slot-inventory.slotCost`) with UI input on item sheets.
- [x] Default Slot Cost: Defaults to 1 if not set/invalid.
- [x] Slot Tracking: Calculates total slots used, considering item quantities.
- [x] UI Display: Shows used/max slots on character sheet.
- [x] Automatic Updates: Hooks for item/actor changes and initial calculation on Foundry ready.
- [x] Target System: dnd5e, Foundry VTT v11+.
- [x] No container-in-container logic (per V1 constraints).
- [x] No replacement of standard encumbrance system (per V1 constraints).
- [x] Primarily targets `character` actor types.

## In Progress / To Do
- [ ] Testing & Bug Fixes: Manual and/or automated QA.
- [ ] Documentation: Write README/user instructions.
- [ ] Localization: Ensure language files are present and loaded.
- [ ] Polish: UI/UX improvements based on feedback.
* [x] Implement Max Slot Calculation (`BASE_SLOTS + Strength Modifier`).
* [x] Define and utilize item flag for Slot Cost (`flags.mysimpleinventory.slotCost`).
* [x] Add input field to Item Sheet (Details Tab) for editing Slot Cost.
* [x] Implement Used Slot Calculation (iterate inventory, sum `slotCost * quantity`).
* [x] Implement UI display of "Slots: Used / Max" on Character Sheet (Inventory Header).
* [x] Implement automatic recalculation on `createItem`, `deleteItem`.
* [x] Implement automatic recalculation on `updateItem` (for quantity/flag changes).
* [x] Implement automatic recalculation on `updateActor` (for Strength changes).
* [x] Implement `ready` hook for initial slot calculation on world load.
* [x] Add basic CSS styling for UI elements.

## Current / Next Tasks (Post-V1 Refinement)

* [ ] **Testing:** Thoroughly test V1 functionality with various character stats, item types, quantities, and edge cases (e.g., items with 0 quantity, non-numeric slot costs entered).
* [ ] **Bug Fixing:** Address any issues identified during testing.
* [ ] **Hook Robustness:** Verify `updateItem` hook reliably catches all relevant changes (e.g., direct quantity edits on character sheet inventory list, embedded item updates).
* [ ] **Selector Stability:** Review CSS/jQuery selectors used for UI injection (`renderActorSheet5eCharacter`, `renderItemSheet`) for potential fragility with dnd5e system updates. Consider adding fallback selectors or more stable targeting methods if possible (e.g., adding unique IDs/classes if necessary).
* [ ] **CSS Refinement:** Test appearance with default and potentially other common Foundry themes; adjust CSS for better consistency if needed.

## Backlog / Future Ideas (V2+)

* [ ] **Module Settings:**
    * [ ] Allow configuration of `BASE_SLOTS`.
    * [ ] Add setting to enable/disable the module globally.
    * [ ] Add setting for default slot cost if flag is missing.
* [ ] **Automatic Slot Cost Estimation (Optional):**
    * [ ] Add setting to enable estimation based on item weight (e.g., 0-5 lbs = 0.5 slots, 5-10 lbs = 1 slot, etc.).
    * [ ] Ensure manual flag always overrides estimation.
* [ ] **UI Enhancements:**
    * [ ] Add visual indicator (e.g., color change) to slot display when nearing or exceeding maximum.
    * [ ] Display individual item slot cost directly in the inventory list rows on the character sheet.
* [ ] **Refine Item Type Targeting:** Be more specific about which item types get the slot cost input field (or allow configuration).
* [ ] **Compatibility:**
    * [ ] Investigate potential conflicts/synergies with common inventory modules (e.g., Item Piles, Item Collection, Tidy5e Sheet). Document findings or add compatibility layers if feasible.
* [ ] **Container Logic (Basic):**
    * [ ] Define a specific item type or flag for containers that reduce the slot cost of their contents (e.g., a "Slot Reducing Backpack").
    * [ ] Modify calculation logic to ignore/reduce cost for items within such containers.
* [ ] **Localization:** Implement language support using Foundry's localization system (`lang/en.json`, etc.).
* [ ] **Actor Type Support:** Consider extending functionality to NPC sheets if desired, potentially with different rules or settings.
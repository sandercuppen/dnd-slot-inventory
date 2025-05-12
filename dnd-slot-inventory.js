const MODULE_ID = 'dnd-slot-inventory';
const FLAG_SLOT_COST = 'slotCost';
const FLAG_CURRENT_SLOTS = 'currentSlots';
const FLAG_MAX_SLOTS = 'maxSlots';
const BASE_SLOTS = 10; // Base number of slots before adding STR modifier

/**
 * Calculates the maximum and currently used inventory slots for an actor.
 * @param {Actor} actor The actor document.
 * @returns {Promise<void>} A promise that resolves when the actor flags have been updated.
 */
async function calculateSlots(actor) {
  if (!actor || !actor.items) {
    console.warn(`${MODULE_ID} | Actor or actor.items not found for calculation.`);
    return;
  }

  // Calculate Max Slots
  const strengthMod = actor.system?.abilities?.str?.mod ?? 0;
  const maxSlots = BASE_SLOTS + strengthMod;

  // Calculate Current Slots
  let currentSlots = 0;
  for (const item of actor.items) {
    // Get the slot cost flag, default to 1 if not present or not a number
    let slotCost = item.getFlag(MODULE_ID, FLAG_SLOT_COST);
    if (typeof slotCost !== 'number' || isNaN(slotCost)) {
      slotCost = 1; // Default cost
    }

    const quantity = item.system?.quantity ?? 1;
    currentSlots += slotCost * quantity;
  }

  // Update actor flags
  await actor.update({
    [`flags.${MODULE_ID}.${FLAG_CURRENT_SLOTS}`]: currentSlots,
    [`flags.${MODULE_ID}.${FLAG_MAX_SLOTS}`]: maxSlots,
  });
}

// Display slots in character sheet
Hooks.on('renderActorSheet5eCharacter', (app, html, data) => {
  const actor = app.actor;
  const currentSlots = actor.getFlag(MODULE_ID, FLAG_CURRENT_SLOTS) ?? 0;
  const maxSlots = actor.getFlag(MODULE_ID, FLAG_MAX_SLOTS) ?? (BASE_SLOTS + (actor.system?.abilities?.str?.mod ?? 0));

  const inventoryHeader = html.find('.inventory-list .inventory-header .item-controls');
  if (inventoryHeader.length > 0) {
    if (html.find('.dnd-slot-inventory-slots').length === 0) {
      const slotElement = $(`
        <div class="item-control dnd-slot-inventory-slots" title="Inventory Slots Used / Max">
          <i class="fas fa-box-open"></i> ${currentSlots} / ${maxSlots}
        </div>
      `);
      inventoryHeader.prepend(slotElement);
    }
  } else {
    console.warn(`${MODULE_ID} | Could not find inventory header element to add slot display.`);
  }
});

// Add slot cost input to item sheet
Hooks.on('renderItemSheet', (app, html, data) => {
  if (!app.item) return;
  const item = app.item;
  const physicalTypes = ['weapon', 'equipment', 'consumable', 'tool', 'loot', 'backpack', 'container'];
  if (!physicalTypes.includes(item.type)) return;
  const currentSlotCost = item.getFlag(MODULE_ID, FLAG_SLOT_COST) ?? 1;
  const detailsDiv = html.find('.tab[data-tab="details"] .item-properties');
  const formGroupToAdd = $(`
    <div class="form-group">
      <label>Inventory Slots</label>
      <input type="number" step="0.1" name="flags.${MODULE_ID}.${FLAG_SLOT_COST}" value="${currentSlotCost}" placeholder="1"/>
    </div>
  `);
  if (detailsDiv.length > 0) {
    if (html.find(`input[name="flags.${MODULE_ID}.${FLAG_SLOT_COST}"]`).length === 0) {
      detailsDiv.append(formGroupToAdd);
      app.setPosition({ height: 'auto' });
    }
  } else {
    console.warn(`${MODULE_ID} | Could not find details div to add slot cost input for item ${item.name}.`);
  }
});

// Recalculate slots on relevant changes
const recalculateActorSlots = async (document) => {
  if (document instanceof Actor && document.type === 'character') {
    setTimeout(() => calculateSlots(document), 100);
  } else if (document instanceof Item && document.actor && document.actor.type === 'character') {
    setTimeout(() => calculateSlots(document.actor), 100);
  }
};
Hooks.on('createItem', (item, options, userId) => {
  if (game.user.id === userId && item.actor?.type === 'character') {
    recalculateActorSlots(item.actor);
  }
});
Hooks.on('deleteItem', (item, options, userId) => {
  if (game.user.id === userId && item.actor?.type === 'character') {
    recalculateActorSlots(item.actor);
  }
});
Hooks.on('updateItem', (item, change, options, userId) => {
  if (game.user.id === userId && item.actor?.type === 'character' && (change?.system?.quantity !== undefined || change?.flags?.[MODULE_ID]?.[FLAG_SLOT_COST] !== undefined) ) {
    recalculateActorSlots(item.actor);
  }
});
Hooks.on('updateActor', (actor, change, options, userId) => {
  if (game.user.id === userId && actor.type === 'character' && change?.system?.abilities?.str?.value !== undefined) {
    recalculateActorSlots(actor);
  }
});
Hooks.once('ready', () => {
  console.log(`${MODULE_ID} | Initializing D&D Slot Inventory`);
  if (game.user.isGM) {
    game.actors.filter(a => a.type === 'character').forEach(actor => {
      calculateSlots(actor);
    });
  } else {
    game.actors.filter(a => a.isOwner && a.type === 'character').forEach(actor => {
      calculateSlots(actor);
    });
  }
  console.log(`${MODULE_ID} | Initialization complete.`);
});

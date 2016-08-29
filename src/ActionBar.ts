//--------------------------------------------------------------------
//     Copyright (C) 2012, 2016 Sidoine De Wispelaere.
//     Copyright (C) 2012, 2013, 2014 Johnny C. Lam.
//     See the file LICENSE.txt for copying permission.
//--------------------------------------------------------------------

// // Keep data about the player action bars (key bindings mostly)
import { ovale } from './Ovale';
import { ovaleDebug } from './Debug';
import { ovaleProfiler} from './Profiler';
import { L } from './Localization';
import { gsub, strlen, strmatch, strupper, tonumber, wipe, GetActionInfo, GetActionText, GetBindingKey, GetBonusBarIndex, GetMacroItem, GetMacroSpell } from 'stub';

function GetKeyBinding(slot:number) {
	// 	ACTIONBUTTON1..12			=> primary (1..12, 13..24), bonus (73..120)
	// 	MULTIACTIONBAR1BUTTON1..12	=> bottom left (61..72)
	// 	MULTIACTIONBAR2BUTTON1..12	=> bottom right (49..60)
	// 	MULTIACTIONBAR3BUTTON1..12	=> top right (25..36)
	// 	MULTIACTIONBAR4BUTTON1..12	=> top left (37..48)
	let name: string;
	if (slot <= 24 || slot > 72) {
		name = "ACTIONBUTTON" + (((slot - 1)%12) + 1)
	}
	else if (slot <= 36) {
		name = "MULTIACTIONBAR3BUTTON" + (slot - 24)
	}
	else if (slot <= 48) {
		name = "MULTIACTIONBAR4BUTTON" + (slot - 36)
	}
	else if (slot <= 60) {
		name = "MULTIACTIONBAR2BUTTON" + (slot - 48)

	}
	else {
		name = "MULTIACTIONBAR1BUTTON" + (slot - 60)
	}
	
	let key = name && GetBindingKey(name)
	// Shorten the keybinding names.
	if (key && strlen(key) > 4) {
		key = strupper(key)
		// Strip whitespace.
		key = gsub(key, "%s+", "")
		// Convert modifiers to a single character.
		key = gsub(key, "ALT%-", "A")
		key = gsub(key, "CTRL%-", "C")
		key = gsub(key, "SHIFT%-", "S")
		// Shorten numberpad keybinding names.
		key = gsub(key, "NUMPAD", "N")
		key = gsub(key, "PLUS", "+")
		key = gsub(key, "MINUS", "-")
		key = gsub(key, "MULTIPLY", "*")
		key = gsub(key, "DIVIDE", "/")
	}
	return key
}

function ParseHyperlink(hyperlink) {
	let matches = strmatch(hyperlink, "|?c?f?f?(%x*)|?H?([^:]*):?(%d+)|?h?%[?([^%[%]]*)%]?|?h?|?r?")
	return {color: matches[0], linkType: matches[1], linkData: matches[2], text: matches[3]};
}

class OvaleActionBar implements ProfiledModule, DebugModule {
	// Maps each action slot (1..120) to the current action: action[slot] = action
	public action = {}
	// Maps each action slot (1..120) to its current keybind: keybind[slot] = keybind
	public keybind = {}

	// Maps each spell/macro/item ID to its current action slot.
	spell:any = {}
	macro = {}
	item = {}

	RegisterEvent: (name: string, method?: string) => void;
	RegisterMessage: (name: string, method?: string) => void;
	UnregisterEvent: (name: string) => void;
    UnregisterMessage: (name: string) => void;
	Debug: (format: string, ...parameters:any[]) => void;
	DebugTimestamp: (...parameters:any[]) => void;
	StartProfiling: (name: string) => void;
	StopProfiling: (name: string) => void;

	OnEnable() {
		this.RegisterEvent("ACTIONBAR_SLOT_CHANGED")
		this.RegisterEvent("PLAYER_ENTERING_WORLD", "UpdateActionSlots")
		this.RegisterEvent("UPDATE_BINDINGS")
		this.RegisterEvent("UPDATE_BONUS_ACTIONBAR", "UpdateActionSlots")
		this.RegisterMessage("Ovale_StanceChanged", "UpdateActionSlots")
		this.RegisterMessage("Ovale_TalentsChanged", "UpdateActionSlots")
	}
		
	OnDisable() {
		this.UnregisterEvent("ACTIONBAR_SLOT_CHANGED")
		this.UnregisterEvent("PLAYER_ENTERING_WORLD")
		this.UnregisterEvent("UPDATE_BINDINGS")
		this.UnregisterEvent("UPDATE_BONUS_ACTIONBAR")
		this.UnregisterMessage("Ovale_StanceChanged")
		this.UnregisterMessage("Ovale_TalentsChanged")
	}

	ACTIONBAR_SLOT_CHANGED(event: string, slot: number) {
		slot = API_tonumber(slot)
		if (slot == 0) {
			this.UpdateActionSlots(event)
		}
		else if (slot) {
			this.UpdateActionSlot(slot)
		}
	}

	UPDATE_BINDINGS(event: string) {
		this.Debug("%s: Updating key bindings.", event)
		this.UpdateKeyBindings()
	}

	UpdateActionSlots(event: string) {
		this.StartProfiling("OvaleActionBar_UpdateActionSlots")
		this.Debug("%s: Updating all action slot mappings.", event)
		API_wipe(this.action)
		API_wipe(this.item)
		API_wipe(this.macro)
		API_wipe(this.spell)

		let start = 1
		let bonus = API_tonumber(GetBonusBarIndex()) * 12
		let slot;
		if (bonus > 0) {
			start = 13
			for (slot = bonus - 11; slot <= bonus; slot ++) {
				this.UpdateActionSlot(slot)
			}
		}
		for (slot = start; slot <= 72; slot++) {
			this.UpdateActionSlot(slot)
		}
		this.StopProfiling("OvaleActionBar_UpdateActionSlots")
	}

	UpdateActionSlot(slot:number) {
		this.StartProfiling("OvaleActionBar_UpdateActionSlot")
		// Clear old slot && associated actions.
		let action = this.action[slot]
		if (this.spell[action] == slot ) {
			this.spell[action] = null;
		} else if (this.item[action] == slot ) {
			this.item[action] = null;
		} else if (this.macro[action] == slot ) {
			this.macro[action] = null;
		}
		this.action[slot] = null

		// Map the current action in the slot.
		let actionInfo = GetActionInfo(slot)
		let id:number;
		if (actionInfo.actionType == "spell" ) {
			id = API_tonumber(actionInfo.id)
			if (id ) {
				if (! this.spell[id] || slot < this.spell[id] ) {
					this.spell[id] = slot
				}
				this.action[slot] = id
			}
		}
		else if (actionInfo.actionType == "item" ) {
			id = API_tonumber(actionInfo.id)
			if (id ) {
				if (! this.item[id] || slot < this.item[id] ) {
					this.item[id] = slot
				}
				this.action[slot] = id
			}
		else if (actionInfo.actionType == "macro" ) {
			id = API_tonumber(actionInfo.id)
			if (id ) {
				let actionText = GetActionText(slot)
				if (actionText ) {
					if (! this.macro[actionText] || slot < this.macro[actionText] ) {
						this.macro[actionText] = slot
					}
					let macroSpell = GetMacroSpell(id)
					if (macroSpell.id ) {
						if (! this.spell[macroSpell.id] || slot < this.spell[macroSpell.id] ) {
							this.spell[macroSpell.id] = slot
						}
						this.action[slot] = macroSpell.id
					}
					else {
						let macroItem = GetMacroItem(id)
						if (macroItem.link) {
							let link = ParseHyperlink(macroItem.link)
							let itemId = API_tonumber(gsub(link.linkData, ":.*", ""))
							if (itemId ) {
								if (! this.item[itemId] || slot < this.item[itemId] ) {
									this.item[itemId] = slot
								}
								this.action[slot] = itemId
							}
						}
					}
					if (! this.action[slot] ) {
						this.action[slot] = actionText
					}
				}
			}
		}
		if (this.action[slot] ) {
			this.Debug("Mapping button %s to %s.", slot, this.action[slot])
		}
		else
			this.Debug("Clearing mapping for button %s.", slot)
		}

		// Update the keybind for the slot.
		this.keybind[slot] = GetKeyBinding(slot)
		this.StopProfiling("OvaleActionBar_UpdateActionSlot")
	}

	UpdateKeyBindings() {
		this.StartProfiling("OvaleActionBar_UpdateKeyBindings")
		for (let slot = 1; slot <= 120; slot++) {
			this.keybind[slot] = GetKeyBinding(slot)
		}
		this.StopProfiling("OvaleActionBar_UpdateKeyBindings")
	}

	// Get the action slot that matches a spell ID.
	GetForSpell(spellId) {
		return this.spell[spellId]
	}

	// Get the action slot that matches a macro name.
	GetForMacro(macroName) {
		return this.macro[macroName]
	}

	// Get the action slot that matches an item ID.
	GetForItem(itemId) {
		return this.item[itemId]
	}

	// Get the keybinding for an action slot.
	GetBinding(slot) {
		return this.keybind[slot]
	}
}

export const ovaleActionBar = ovale.NewModule("OvaleActionBar",  new OvaleActionBar(), "AceEvent-3.0")
ovaleDebug.RegisterDebugging(ovaleActionBar);
ovaleProfiler.RegisterProfiling(ovaleActionBar);

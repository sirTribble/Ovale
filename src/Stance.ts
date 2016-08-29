/*////////////////////////////////////////////////////////////////////
    Copyright (C) 2013, 2014, 2015 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
//*/

// This addon tracks the player's current stance.

import { ovale } from './Ovale';
import { L } from './Localization';
import { ovaleDebug } from './Debug';
import { ovaleProfiler } from './Profiler';
import { ovaleData } from './Data';
import { ovaleState } from './State';
import { strsub, tconcat, tinsert, tonumber, sort, type, wipe, GetNumShapeshiftForms, GetShapeshiftForm, GetShapeshiftFormInfo, GetSpellInfo } from 'stub';
import AceEvent from 'AceEvent-3.0';

var OVALE = "Ovale";

var SPELL_NAME_TO_STANCE:LuaDictionary<string> = {
	// Druid
	[GetSpellInfo(   768).name] : "druid_cat_form",
	[GetSpellInfo(   783).name] : "druid_travel_form",
	[GetSpellInfo(  1066).name] : "druid_aquatic_form",
	[GetSpellInfo(  5487).name] : "druid_bear_form",
	[GetSpellInfo( 24858).name] : "druid_moonkin_form",
	[GetSpellInfo( 33943).name] : "druid_flight_form",
	[GetSpellInfo( 40120).name] : "druid_swift_flight_form",
	[GetSpellInfo(171745).name] : "druid_claws_of_shirvallah",
	// Rogue
	[GetSpellInfo(  1784).name] : "rogue_stealth"
}

// Table of all valid stance names.
var STANCE_NAME:LuaDictionary<boolean> = {}

export interface StanceState{
	stance: string;
} 

class OvaleStance {
	// Whether the stance information is ready for use by other modules.
	ready = false
	// List of available stances, populated by CreateStanceList()
	stanceList = {}
	// Map stance names to stance ID (index on shapeshift/stance bar).
	stanceId = {}
	// Player's current stance.
	stance = null
	// Table of all valid stance names.
	STANCE_NAME:LuaDictionary<boolean> = {}
	profiler = ovaleProfiler.RegisterProfiling("OvaleStance");
	events = AceEvent.Embed({});

	debug = ovaleDebug.RegisterDebugging('OvaleStance');

	constructor(){
		for (var k in SPELL_NAME_TO_STANCE) {
			STANCE_NAME[SPELL_NAME_TO_STANCE[k]] = true
		}

		var debugOptions = {
			stance : {
				name : L["Stances"],
				type : "group",
				args : { 
					stance : {
						name : L["Stances"],
						type : "input",
						multiline : 25,
						width : "full",
						get : function(info) { return this.DebugStances() }
					}
				}
			}
		}

		// Insert debug options into OvaleDebug.
		for (var k in debugOptions) {
			var v = debugOptions[k];
			ovaleDebug.options.args[k] = v
		}
	}

	OnEnable() {
		this.events.RegisterEvent("PLAYER_ENTERING_WORLD", event => this.UpdateStances())
		this.events.RegisterEvent("UPDATE_SHAPESHIFT_FORM", event => this.UPDATE_SHAPESHIFT_FORM(event));
		this.events.RegisterEvent("UPDATE_SHAPESHIFT_FORMS", event => this.UPDATE_SHAPESHIFT_FORMS(event));
		this.events.RegisterMessage("Ovale_SpellsChanged", event => this.UpdateStances())
		this.events.RegisterMessage("Ovale_TalentsChanged", event => this.UpdateStances())
		ovaleData.RegisterRequirement("stance", "RequireStanceHandler", this)
		ovaleState.RegisterState(this, this.statePrototype)
	}

	OnDisable() {
		ovaleState.UnregisterState(this)
		ovaleData.UnregisterRequirement("stance")
		this.events.UnregisterEvent("PLAYER_ALIVE")
		this.events.UnregisterEvent("PLAYER_ENTERING_WORLD")
		this.events.UnregisterEvent("UPDATE_SHAPESHIFT_FORM")
		this.events.UnregisterEvent("UPDATE_SHAPESHIFT_FORMS")
		this.events.UnregisterMessage("Ovale_SpellsChanged")
		this.events.UnregisterMessage("Ovale_TalentsChanged")
	}

	PLAYER_TALENT_UPDATE(event) {
		// Clear old stance ID since talent update may overwrite old stance with new one with same ID.
		this.stance = null
		this.UpdateStances()
	}

	UPDATE_SHAPESHIFT_FORM(event) {
		this.ShapeshiftEventHandler()
	}

	UPDATE_SHAPESHIFT_FORMS(event) {
		this.ShapeshiftEventHandler()
	}

	// Fill OvaleStance.stanceList with stance bar index <-> Ovale stance name mappings.
	CreateStanceList() {
		this.profiler.StartProfiling("OvaleStance_CreateStanceList")
		wipe(this.stanceList)
		wipe(this.stanceId)
		var name, stanceName
		for (var i = 1; i <= GetNumShapeshiftForms(); i++) {
			name = GetShapeshiftFormInfo(i).name;
			stanceName = SPELL_NAME_TO_STANCE[name]
			if ( stanceName ) {
				this.stanceList[i] = stanceName
				this.stanceId[stanceName] = i
			}
		}
		this.profiler.StopProfiling("OvaleStance_CreateStanceList")
	}

	// Print out the list of stances in alphabetical order.
	array:LuaTable<string> = {}

	DebugStances() {
		wipe(this.array)
		for (var k in this.stanceList) {
			var v = this.stanceList[k];
			if ( this.stance == k ) {
				tinsert(this.array, v + " (active)")
			} else {
				tinsert(this.array, v)
			}
		}
		sort(this.array)
		return tconcat(this.array, "\n")
	}
	
	// Return the name of the given stance || the current stance.
	GetStance(stanceId) {
		stanceId = stanceId || this.stance
		return this.stanceList[stanceId]
	}

	// Return true if the current stance matches the given name.
	// NOTE. Mirrored in statePrototype below.
	IsStance(name) {
		if ( name && this.stance ) {
			if ( type(name) == "number" ) {
				return name == this.stance
			} else {
				return name == this.GetStance(this.stance)
			}
		}
		return false
	}

	IsStanceSpell(spellId:number) {
		var name = GetSpellInfo(spellId).name
		return !!(name && SPELL_NAME_TO_STANCE[name])
	}

	ShapeshiftEventHandler() {
		this.profiler.StartProfiling("OvaleStance_ShapeshiftEventHandler")
		var oldStance = this.stance
		var newStance = GetShapeshiftForm()
		if ( oldStance != newStance ) {
			this.stance = newStance
			ovale.refreshNeeded[ovale.playerGUID] = true
			this.events.SendMessage("Ovale_StanceChanged", this.GetStance(newStance), this.GetStance(oldStance))
		}
		this.profiler.StopProfiling("OvaleStance_ShapeshiftEventHandler")
	}

	UpdateStances() {
		this.CreateStanceList()
		this.ShapeshiftEventHandler()
		this.ready = true
	}

	// Run-time check that the player is in a certain stance.
	// NOTE. Mirrored in statePrototype below.
	RequireStanceHandler(spellId, atTime, requirement, tokens, index, targetGUID) {
		var verified = false
		// If index isn't given, then tokens holds the actual token value.
		var stance = tokens
		if ( index ) {
			stance = tokens[index]
			index = index + 1
		}
		if ( stance ) {
			var isBang = false
			if ( strsub(stance, 1, 1) == "!" ) {
				isBang = true
				stance = strsub(stance, 2)
			}
			stance = tonumber(stance) || stance
			var isStance = this.IsStance(stance)
			if ( !isBang && isStance || isBang && !isStance ) {
				verified = true
			}
			var result = verified && "passed" || "FAILED"
			if ( isBang ) {
				this.debug.Log("    Require NOT stance '%s'. %s", stance, result)
			} else {
				this.debug.Log("    Require stance '%s'. %s", stance, result)
			}
		} else {
			ovale.OneTimeMessage("Warning. requirement '%s' is missing a stance argument.", requirement)
		}
		return verified, requirement, index
	}
	
	// Initialize the state.
	InitializeState(state:StanceState) {
		state.stance = null
	}

	// Reset the state to the current conditions.
	ResetState(state:StanceState) {
		this.profiler.StartProfiling("OvaleStance_ResetState")
		state.stance = this.stance || 0
		this.profiler.StopProfiling("OvaleStance_ResetState")
	}

	// Apply the effects of the spell on the player's state, assuming the spellcast completes.
	ApplySpellAfterCast(state: StanceState, spellId: number, targetGUID: string, startCast: number, endCast: number, isChanneled: boolean, spellcast) {
		this.profiler.StartProfiling("OvaleStance_ApplySpellAfterCast")
		var stance = state.GetSpellInfoProperty(spellId, endCast, "to_stance", targetGUID)
		if ( stance ) {
			if ( type(stance) == "string" ) {
				stance = this.stanceId[stance]
			}
			state.stance = stance
		}
		this.profiler.StopProfiling("OvaleStance_ApplySpellAfterCast")
	}
}

export const ovaleStance = ovale.NewModule("OvaleStance", new OvaleStance(), "AceEvent-3.0");
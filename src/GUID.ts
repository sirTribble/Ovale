/*////////////////////////////////////////////////////////////////////
    Copyright (C) 2012 Sidoine De Wispelaere.
    Copyright (C) 2012, 2013, 2015 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
//*/

/*
	This addon manages mappings between GUIDs, unit IDs, && names.

	A unit ID can only have one GUID.
	A unit ID can only have one name.
	A unit ID may !exist.

	A GUID can have multiple unit IDs.
	A GUID can only have one name.

	A name can have multiple unit IDs.
	A name can have mulitple GUIDs.
//*/

import AceEvent from 'AceEvent-3.0';
import { ovaleDebug } from './Debug';
import { len, floor, tinsert, tremove, unpack, type, GetTime, UnitGUID, UnitName } from 'stub';
import { ovale } from './Ovale';

// PET_UNIT[unitId] = pet's unit ID
var PET_UNIT:LuaDictionary<string> = {}

PET_UNIT["player"] = "pet"
for (let i = 1 ; i <=  5; i++) {
	PET_UNIT["arena" + i] = "arenapet" + i
}
for (let i = 1 ; i <=  4; i++) {
	PET_UNIT["party" + i] = "partypet" + i
}
for (let i = 1 ; i <=  40; i++) {
	PET_UNIT["raid" + i] = "raidpet" + i
}

function getPetOf(unitId:string) {
	return PET_UNIT[unitId] || unitId + "pet";
}

/*
	Unit IDs for which UNIT_AURA events are known to fire.

	UNIT_AURA_UNITS is an ordered list of unit ID priority.
	UNIT_AURA_UNIT is a table that holds the reverse mapping of UNIT_AURA_UNITS.
//*/
var UNIT_AURA_UNITS:LuaTable<string> = {}
tinsert(UNIT_AURA_UNITS, "player")
tinsert(UNIT_AURA_UNITS, "pet")
tinsert(UNIT_AURA_UNITS, "vehicle")
tinsert(UNIT_AURA_UNITS, "target")
tinsert(UNIT_AURA_UNITS, "focus")
for (let i = 1 ; i <=  40; i++) {
	var unitId = "raid" + i
	tinsert(UNIT_AURA_UNITS, unitId)
	tinsert(UNIT_AURA_UNITS, PET_UNIT[unitId])
}
for (let i = 1 ; i <=  4; i++) {
	var unitId = "party" + i
	tinsert(UNIT_AURA_UNITS, unitId)
	tinsert(UNIT_AURA_UNITS, PET_UNIT[unitId])
}
for (let i = 1 ; i <=  4; i++) {
	tinsert(UNIT_AURA_UNITS, "boss" + i)
}
for (let i = 1 ; i <=  5; i++) {
	var unitId = "arena" + i
	tinsert(UNIT_AURA_UNITS, unitId)
	tinsert(UNIT_AURA_UNITS, PET_UNIT[unitId])
}
tinsert(UNIT_AURA_UNITS, "npc")

var UNIT_AURA_UNIT:LuaDictionary<number> = {}
for (let i = 1; i <= len(UNIT_AURA_UNITS); i++) {
	let unitId = UNIT_AURA_UNITS[i];
	UNIT_AURA_UNIT[unitId] = i
}

function compareDefault<T>(a:T, b:T) {
	return a < b
}

type compareFunc<T> = (a:T, b:T) => boolean;

	//<private-static-methods>
		// Binary search algorithm pseudocode from. http.//rosettacode.org/wiki/Binary_search
		// Insert the value at the rightmost insertion point of a sorted array using binary search.
function BinaryInsert<T>(t:LuaTable<T>, value:T, unique: boolean, compare?: compareFunc<T>) {
	compare = compare || compareDefault
	var low = 1, high = len(t);
	while ( low <= high ) {
		// invariants. value >= t[i] for all i < low
		//             value < t[i] for all i > high
		var mid = floor((low + high) / 2)
		if ( compare(value, t[mid]) ) {
			high = mid - 1
		} else if ( !unique || compare(t[mid], value) ) {
			low = mid + 1
		} else {
			return mid
		}
	}
	tinsert(t, low, value)
	return low
}

	// Remove the value in a sorted array using binary search.
function BinaryRemove<T>(t:LuaTable<T>, value:T, compare?: compareFunc<T>) {
	var index = BinarySearch(t, value, compare)
	if ( index ) {
		tremove(t, index)
	}
	return index
}

	// Return the index of the value in a sorted array using binary search.
function BinarySearch<T>(t:LuaTable<T>, value:T, compare?: compareFunc<T>) {
	compare = compare || compareDefault
	var low = 1;
	var high = len(t);

	while ( low <= high ) {
		// invariants. value > t[i] for all i < low
		//             value < t[i] for all i > high
		var mid = floor((low + high) / 2)
		if ( compare(value, t[mid]) ) {
			high = mid - 1
		} else if ( compare(t[mid], value) ) {
			low = mid + 1
		} else {
			return mid
		}
	}
	return null
}

function CompareUnit(leftUnitId: string, rightUnitId: string) {
	return UNIT_AURA_UNIT[leftUnitId] < UNIT_AURA_UNIT[rightUnitId]
}


class OvaleGUID {
	//<public-static-properties>
	// Mappings between GUIDs, unit IDS, && names.
	unitGUID:LuaDictionary<string> = {}
	guidUnit:LuaDictionary<LuaTable<string>> = {}
	unitName:LuaDictionary<string> = {}
	nameUnit:LuaDictionary<LuaTable<string>> = {}
	guidName:LuaDictionary<string> = {}
	nameGUID:LuaDictionary<LuaTable<string>> = {}

	// Table of player pet GUIDs.
	petGUID:LuaDictionary<number> = {}

	// Export UNIT_AURA_UNIT table of units that receive UNIT_AURA events.
	UNIT_AURA_UNIT = UNIT_AURA_UNIT
	//</public-static-properties>

	events = AceEvent.Embed({});
	debug = ovaleDebug.RegisterDebugging("GUID");

	// Comparator for unit IDs based on their unit priorities from UNIT_AURA_UNIT.
	//</private-static-methods>

	//<public-static-methods>
	OnEnable() {
		this.events.RegisterEvent("ARENA_OPPONENT_UPDATE", (event, unitId, eventType) => this.ARENA_OPPONENT_UPDATE(event, unitId, eventType));
		this.events.RegisterEvent("GROUP_ROSTER_UPDATE", event => this.GROUP_ROSTER_UPDATE(event));
		this.events.RegisterEvent("INSTANCE_ENCOUNTER_ENGAGE_UNIT", event => this.INSTANCE_ENCOUNTER_ENGAGE_UNIT(event));
		this.events.RegisterEvent("PLAYER_ENTERING_WORLD", event => this.UpdateAllUnits())
		this.events.RegisterEvent("PLAYER_FOCUS_CHANGED", event => this.PLAYER_FOCUS_CHANGED(event))
		this.events.RegisterEvent("PLAYER_TARGET_CHANGED", (event, cause) => this.PLAYER_TARGET_CHANGED(event, cause));
		this.events.RegisterEvent("UNIT_NAME_UPDATE", (event, unitId) => this.UNIT_NAME_UPDATE(event, unitId));
		this.events.RegisterEvent("UNIT_PET", (event, unitId) => this.UNIT_PET(event, unitId));
		this.events.RegisterEvent("UNIT_TARGET", (event, unitId) => this.UNIT_TARGET(event, unitId));
	}

	OnDisable() {
		this.events.UnregisterEvent("ARENA_OPPONENT_UPDATE")
		this.events.UnregisterEvent("GROUP_ROSTER_UPDATE")
		this.events.UnregisterEvent("INSTANCE_ENCOUNTER_ENGAGE_UNIT")
		this.events.UnregisterEvent("PLAYER_ENTERING_WORLD")
		this.events.UnregisterEvent("PLAYER_FOCUS_CHANGED")
		this.events.UnregisterEvent("PLAYER_TARGET_CHANGED")
		this.events.UnregisterEvent("UNIT_NAME_UPDATE")
		this.events.UnregisterEvent("UNIT_PET")
		this.events.UnregisterEvent("UNIT_TARGET")
	}

	ARENA_OPPONENT_UPDATE(event, unitId, eventType) {
		if ( eventType != "cleared" || this.unitGUID[unitId] ) {
			this.debug.Debug(event, unitId, eventType)
			this.UpdateUnitWithTarget(unitId)
		}
	}

	GROUP_ROSTER_UPDATE(event) {
		this.debug.Debug(event)
		this.UpdateAllUnits()
		this.events.SendMessage("Ovale_GroupChanged")
	}

	INSTANCE_ENCOUNTER_ENGAGE_UNIT(event) {
		this.debug.Debug(event)
		for (let i = 1 ; i <=  4; i++) {
			this.UpdateUnitWithTarget("boss" + i)
		}
	}

	PLAYER_FOCUS_CHANGED(event) {
		this.debug.Debug(event)
		this.UpdateUnitWithTarget("focus")
	}

	PLAYER_TARGET_CHANGED(event, cause) {
		this.debug.Debug(event, cause)
		this.UpdateUnit("target")
	}

	UNIT_NAME_UPDATE(event: string, unitId: string) {
		this.debug.Debug(event, unitId)
		this.UpdateUnit(unitId)
	}

	UNIT_PET(event: string, unitId: string) {
		this.debug.Debug(event, unitId)
		var pet = getPetOf(unitId)
		this.UpdateUnitWithTarget(pet)
		if ( unitId == "player" ) {
			var guid = this.UnitGUID("pet")
			if ( guid ) {
				// Add pet's GUID to the table of player's pet GUIDs.
				this.petGUID[guid] = GetTime()
			}
			this.events.SendMessage("Ovale_PetChanged", guid)
		}
		this.events.SendMessage("Ovale_GroupChanged")
	}

	UNIT_TARGET(event: string, unitId: string) {
		// Changes to the player's target are tracked with PLAYER_TARGET_CHANGED.
		if ( unitId != "player" ) {
			this.debug.Debug(event, unitId)
			var target = unitId + "target"
			this.UpdateUnit(target)
		}
	}

	UpdateAllUnits() {
		for (let _ = 1; _ <= len(UNIT_AURA_UNITS); _++) {
			let unitId = UNIT_AURA_UNITS[_];
			this.UpdateUnitWithTarget(unitId)
		}
	}

	UpdateUnit(unitId: string) {
		var guid = UnitGUID(unitId)
		var name = UnitName(unitId)
		var previousGUID = this.unitGUID[unitId]
		var previousName = this.unitName[unitId]
		/*
			Remove the previous GUID && name mappings for this unit ID if they've changed.
		//*/
		if ( !guid || guid != previousGUID ) {
			// unit <//> GUID
			this.unitGUID[unitId] = null
			if ( previousGUID ) {
				if ( this.guidUnit[previousGUID] ) {
					BinaryRemove(this.guidUnit[previousGUID], unitId, CompareUnit)
				}
				ovale.refreshNeeded[previousGUID] = true
			}
		}
		if ( !name || name != previousName ) {
			// unit <//> name
			this.unitName[unitId] = null
			if ( previousName && this.nameUnit[previousName] ) {
				BinaryRemove(this.nameUnit[previousName], unitId, CompareUnit)
			}
		}
		if ( guid && guid == previousGUID && name && name != previousName ) {
			// GUID <//> name
			this.guidName[guid] = null
			if ( previousName && this.nameGUID[previousName] ) {
				BinaryRemove(this.nameGUID[previousName], guid, CompareUnit)
			}
		}
		/*
			Create new mappings from this unit ID to the current GUID && name.
		//*/
		if ( guid && guid != previousGUID ) {
			// unit <//> GUID
			this.unitGUID[unitId] = guid
			{
				var list = this.guidUnit[guid] || {}
				BinaryInsert(list, unitId, true, CompareUnit)
				this.guidUnit[guid] = list
			}
			this.debug.Debug("'%s' is '%s'.", unitId, guid)
			ovale.refreshNeeded[guid] = true
		}
		if ( name && name != previousName ) {
			// unit <//> name
			this.unitName[unitId] = name
			{
				var list = this.nameUnit[name] || {}
				BinaryInsert(list, unitId, true, CompareUnit)
				this.nameUnit[name] = list
			}
			this.debug.Debug("'%s' is '%s'.", unitId, name)
		}
		if ( guid && name ) {
			// GUID <//> name
			var previousNameFromGUID = this.guidName[guid]
			this.guidName[guid] = name
			if ( name != previousNameFromGUID ) {
				var list = this.nameGUID[name] || {}
				BinaryInsert(list, guid, true)
				this.nameGUID[name] = list
				if ( guid == previousGUID ) {
					this.debug.Debug("'%s' changed names to '%s'.", guid, name)
				} else {
					this.debug.Debug("'%s' is '%s'.", guid, name)
				}
			}
		}
		if ( guid && guid != previousGUID ) {
			this.events.SendMessage("Ovale_UnitChanged", unitId, guid)
		}
	}

	UpdateUnitWithTarget(unitId:string) {
		this.UpdateUnit(unitId)
		this.UpdateUnit(unitId + "target")
	}

	// Return whether the GUID is a player's pet.
	IsPlayerPet(guid) {
		var atTime = this.petGUID[guid]
		return (!!atTime), atTime
	}

	// Return the GUID of the given unit.
	UnitGUID(unitId) {
		if ( unitId ) {
			return this.unitGUID[unitId] || UnitGUID(unitId)
		}
		return null
	}

	// Return a list of unit IDs for the given GUID.
	GUIDUnit(guid) {
		if ( guid && this.guidUnit[guid] ) {
			return unpack(this.guidUnit[guid])
		}
		return null
	}

	// Return the name of the given unit.
	UnitName(unitId) {
		if ( unitId ) {
			return this.unitName[unitId] || UnitName(unitId)
		}
		return null
	}

	// Return a list of the unit IDs with the given name.
	NameUnit(name) {
		if ( name && this.nameUnit[name] ) {
			return unpack(this.nameUnit[name])
		}
		return null
	}

	// Return the name of the given GUID.
	GUIDName(guid) {
		if ( guid ) {
			return this.guidName[guid]
		}
		return null
	}

	// Return a list of the GUIDs with the given name.
	NameGUID(name) {
		if ( name && this.nameGUID[name] ) {
			return unpack(this.nameGUID[name])
		}
		return null
	}
	//</public-static-methods>
}

/*////////////////////////////////////////////////////////////////////
    Copyright (C) 2009, 2010, 2011, 2012 Sidoine De Wispelaere.
    Copyright (C) 2012, 2013, 2014 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
//*/

const OVALE = "Ovale";
import LibStub from 'LibStub';
import AceAddon from 'AceAddon-3.0';
import AceGUI from 'AceGUI-3.0';
import {L} from 'Localization';
import { assert, format, formatv, next, select, strfind, strjoin, strjoinv, strlen, strmatch, tonumber, tostring,
	tostringall, tostringallv, type, unpack, wipe, GetItemInfo, GetTime, UnitCanAttack, UnitClass, UnitExists, UnitGUID,
	UnitHasVehicleUI, UnitIsDead, DEFAULT_CHAT_FRAME, INFINITY } from 'stub';

var OVALE_VERSION = "@project-version@"
var REPOSITORY_KEYWORD = "@" + "project-version" + "@"

// List of the last MAX_REFRESH_INTERVALS elapsed times between refreshes.
var MAX_REFRESH_INTERVALS = 500
var self_refreshIntervals = {}
var self_refreshIndex = 1
//</private-static-properties>

//<public-static-properties>
// Localization string table.
class Ovale {
	playerClass = UnitClass("player").className
	// Player's GUID (initialized after PLAYER_LOGIN event).
	playerGUID:string = null
	// AceDB-3.0 database to handle SavedVariables (managed by OvaleOptions).
	db = null
	//the frame with the icons
	frame = null
	// Checkbox && dropdown definitions from evaluating the script.
	checkBox = {}
	list = {}
	// Checkbox && dropdown GUI controls.
	checkBoxWidget = {}
	listWidget = {}
	// List of units that require refreshing the best action.
	refreshNeeded = {}
	// Prefix of messages received via CHAT_MSG_ADDON for Ovale.
	MSG_PREFIX = OVALE
	bug = false;
	
	// Table of strings to display once per session.
	private oneTimeMessage:LuaDictionary<boolean | "printed"> = {}

	OnCheckBoxValueChanged(widget) {
		// Reflect the value change into the profile (model).
		var name = widget.GetUserData("name")
		this.db.profile.check[name] = widget.GetValue()
		this.SendMessage("Ovale_CheckBoxValueChanged", name)
	}

	OnDropDownValueChanged(widget) {
		// Reflect the value change into the profile (model).
		var name = widget.GetUserData("name")
		this.db.profile.list[name] = widget.GetValue()
		this.SendMessage("Ovale_ListValueChanged", name)
	}

	OnInitialize() {
		BINDING_HEADER_OVALE = OVALE
		var toggleCheckBox = L["Inverser la boîte à cocher "]
		BINDING_NAME_OVALE_CHECKBOX0 = toggleCheckBox + "(1)"
		BINDING_NAME_OVALE_CHECKBOX1 = toggleCheckBox + "(2)"
		BINDING_NAME_OVALE_CHECKBOX2 = toggleCheckBox + "(3)"
		BINDING_NAME_OVALE_CHECKBOX3 = toggleCheckBox + "(4)"
		BINDING_NAME_OVALE_CHECKBOX4 = toggleCheckBox + "(5)"
	}

	OnEnable() {
		this.playerGUID = UnitGUID("player")

		this.RegisterEvent("PLAYER_ENTERING_WORLD")
		this.RegisterEvent("PLAYER_TARGET_CHANGED")
		this.RegisterMessage("Ovale_CombatStarted")
		this.RegisterMessage("Ovale_OptionChanged")

		this.frame = AceGUI.Create(OVALE + "Frame")
		this.UpdateFrame()
	}

	OnDisable() {
		this.UnregisterEvent("PLAYER_ENTERING_WORLD")
		this.UnregisterEvent("PLAYER_TARGET_CHANGED")
		this.UnregisterMessage("Ovale_CombatEnded")
		this.UnregisterMessage("Ovale_OptionChanged")
		this.frame.Hide()
	}

	//Called when the player target change
	//Used to update the visibility e.g. if the user chose
	//to hide Ovale if a friendly unit is targeted
	PLAYER_ENTERING_WORLD() {
		wipe(self_refreshIntervals)
		self_refreshIndex = 1
		this.ClearOneTimeMessages()
	}

	PLAYER_TARGET_CHANGED() {
		this.UpdateVisibility()
	}

	Ovale_CombatStarted(event, atTime) {
		this.UpdateVisibility()
	}

	Ovale_CombatEnded(event, atTime) {
		this.UpdateVisibility()
	}

	Ovale_OptionChanged(event, eventType) {
		if ( eventType == "visibility" ) {
			this.UpdateVisibility()
		} else {
			if ( eventType == "layout" ) {
				this.frame.UpdateFrame()
			}
			this.UpdateFrame()
		}
	}

	IsPreloaded(moduleList) {
		var preloaded = true
		for ( _, moduleName in pairs(moduleList) ) {
			preloaded = preloaded && this[moduleName].ready
		}
		return preloaded
	}

	ToggleOptions() {
		this.frame.ToggleOptions()
	}

	UpdateVisibility() {
		var visible = true
		var profile = this.db.profile

		if ( !profile.apparence.enableIcons ) {
			visible = false
		} else if ( !this.frame.hider.IsVisible() ) {
			visible = false
		} else {
			if ( profile.apparence.hideVehicule && UnitHasVehicleUI("player") ) {
				visible = false
			}
			if ( profile.apparence.avecCible && !UnitExists("target") ) {
				visible = false
			}
			if ( profile.apparence.enCombat && !Ovale.OvaleFuture.inCombat ) {
				visible = false
			}
			if ( profile.apparence.targetHostileOnly && (UnitIsDead("target") || !UnitCanAttack("player", "target")) ) {
				visible = false
			}
		}

		if ( visible ) {
			this.frame.Show()
		} else {
			this.frame.Hide()
		}
	}

	ResetControls() {
		wipe(this.checkBox)
		wipe(this.list)
	}

	UpdateControls() {
		var profile = this.db.profile

		// Create a new CheckBox widget for each checkbox declared in the script.
		wipe(this.checkBoxWidget)
		for ( name, checkBox in pairs(this.checkBox) ) {
			if ( checkBox.text ) {
				var widget = AceGUI.Create("CheckBox")
				// XXX Workaround for GetItemInfo() possibly returning null.
				var text = this.FinalizeString(checkBox.text)
				widget.SetLabel(text)
				if ( profile.check[name] == null ) {
					profile.check[name] = checkBox.checked
				}
				if ( profile.check[name] ) {
					widget.SetValue(profile.check[name])
				}
				widget.SetUserData("name", name)
				widget.SetCallback("OnValueChanged", OnCheckBoxValueChanged)
				this.frame.AddChild(widget)
				this.checkBoxWidget[name] = widget
			} else {
				this.OneTimeMessage("Warning. checkbox '%s' is used but !defined.", name)
			}
		}

		// Create a new Dropdown widget for each list declared in the script.
		wipe(this.listWidget)
		for ( name, list in pairs(this.list) ) {
			if ( next(list.items) ) {
				var widget = AceGUI.Create("Dropdown")
				widget.SetList(list.items)
				if ( !profile.list[name] ) {
					profile.list[name] = list.default
				}
				if ( profile.list[name] ) {
					widget.SetValue(profile.list[name])
				}
				widget.SetUserData("name", name)
				widget.SetCallback("OnValueChanged", OnDropDownValueChanged)
				this.frame.AddChild(widget)
				this.listWidget[name] = widget
			} else {
				this.OneTimeMessage("Warning. list '%s' is used but has no items.", name)
			}
		}
	}

	UpdateFrame() {
		this.frame.ReleaseChildren()
		this.frame.UpdateIcons()
		this.UpdateControls()
		this.UpdateVisibility()
	}

	GetCheckBox(name) {
		var widget
		if ( type(name) == "string" ) {
			widget = this.checkBoxWidget[name]
		} else if ( type(name) == "number" ) {
			// "name" is a number, so count checkboxes } while (!( we reach the k'th one (indexed from 0).))
			var k = 0
			for ( _, frame in pairs(this.checkBoxWidget) ) {
				if ( k == name ) {
					widget = frame
					break
				}
				k = k + 1
			}
		}
		return widget
	}

	IsChecked(name) {
		var widget = this.GetCheckBox(name)
		return widget && widget.GetValue()
	}

	GetListValue(name) {
		var widget = this.listWidget[name]
		return widget && widget.GetValue()
	}

	// Set the checkbox control to the specified on/off (true/false) value.
	SetCheckBox(name, on) {
		var widget = this.GetCheckBox(name)
		if ( widget ) {
			var oldValue = widget.GetValue()
			if ( oldValue != on ) {
				widget.SetValue(on)
				OnCheckBoxValueChanged(widget)
			}
		}
	}

	// Toggle the checkbox control.
	ToggleCheckBox(name) {
		var widget = this.GetCheckBox(name)
		if ( widget ) {
			var on = !widget.GetValue()
			widget.SetValue(on)
			OnCheckBoxValueChanged(widget)
		}
	}

	AddRefreshInterval(milliseconds) {
		if ( milliseconds < INFINITY ) {
			self_refreshIntervals[self_refreshIndex] = milliseconds
			self_refreshIndex = (self_refreshIndex < MAX_REFRESH_INTERVALS) && (self_refreshIndex + 1) || 1
		}
	}

	GetRefreshIntervalStatistics() {
		var sumRefresh, minRefresh, maxRefresh, count = 0, INFINITY, 0, 0
		for ( k, v in ipairs(self_refreshIntervals) ) {
			if ( v > 0 ) {
				if ( minRefresh > v ) {
					minRefresh = v
				}
				if ( maxRefresh < v ) {
					maxRefresh = v
				}
				sumRefresh = sumRefresh + v
				count = count + 1
			}
		}
		var avgRefresh = (count > 0) && (sumRefresh / count) || 0
		return avgRefresh, minRefresh, maxRefresh, count
	}

	FinalizeString(s: string) {
		var [item, id] = strmatch(s, "^(item.)(.+)")
		if ( item ) {
			s = GetItemInfo(tonumber(id)).itemName
		}
		return s
	}

	/*
		Return a string from the parameters.  If the first parameter is a format string,
		use the remaining parameters as parameters for the format string; otherwise,
		concatenate all of the parameters together.
	//*/
	MakeString(s, ...parameters) {
		if ( s && strlen(s) > 0 ) {
			if (select('#', arguments) > 0) {
				if ( strfind(s, "%%%.%d") || strfind(s, "%%[%w]") ) {
					// "s" looks like a format string.
					s = formatv(s, tostringallv(parameters))
				} else {
					s = strjoinv(" ", tostringall(arguments))
				}
			}
		} else {
			s = tostring(null)
		}
		return s
	}

	// Print the parameters to DEFAULT_CHAT_FRAME, headed by the name of the module.
	// NOTE. This method is mirrored to the module prototype for new modules.
	Print(...parameters) {
		var name = this.GetName();
		var s = this.MakeString(arguments)
		// Match output format from AceConsole-3.0 Print() method.
		DEFAULT_CHAT_FRAME.AddMessage(format("|cff33ff99%s|r. %s", name, s))
	}

	// Print the error message && flag the next frame to be traced by OvaleDebug.
	// NOTE. This method is mirrored to the module prototype for new modules.
	Error(...parameter) {
		var s = this.MakeString(arguments);
		this.Print("Fatal error. %s", s)
		this.bug = true
	}

	OneTimeMessage(...parameters) {
		var s = this.MakeString(arguments);
		if ( !this.oneTimeMessage[s] ) {
			this.oneTimeMessage[s] = true
		}
	}

	ClearOneTimeMessages() {
		wipe(this.oneTimeMessage)
	}

	PrintOneTimeMessages() {
		for (let s in this.oneTimeMessage ) {
			if ( this.oneTimeMessage[s] != "printed" ) {
				this.Print(s)
				this.oneTimeMessage[s] = "printed"
			}
		}
	}
}

//</public-static-methods>

//<private-static-properties>
/*
	Ovale module prototype.

	The module prototype has a dummy Log method to mimic the API of the state machine.
	This makes it easier to write module methods that are mirrored to the state machine.
//*/
{
	
}
//</private-static-properties>

export const ovale = AceAddon.NewAddon(new Ovale(), OVALE, "AceEvent-3.0")
_G["Ovale"] = ovale
function DoNothing() {
		// no-op
}

var modulePrototype = {
	Error : ovale.Error,
	Log : DoNothing,
	Print : ovale.Print
}

ovale.SetDefaultModulePrototype(modulePrototype)
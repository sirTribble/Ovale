/*////////////////////////////////////////////////////////////////////
    Copyright (C) 2012 Sidoine De Wispelaere.
    Copyright (C) 2012, 2013, 2014 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
//*/

/*
	This addon is the core of the state machine for the simulator.
//*/

import { ovale } from './Ovale';
import { OvaleQueue } from './Queue';
import { ovaleDebug } from './Debug';

var self_statePrototype = {}
var self_stateAddons = new OvaleQueue("OvaleState_stateAddons")

/*////////////////////////////////////////////////////////////////////////////
		State machine for simulator.
//*/
class State {
	
	// Whether this object is a state machine.
	isState = true
	// Whether the state of the simulator has been initialized.
	isInitialized = null
	// Table of state variables added by scripts that is reset on every refresh.
	futureVariable = null
	// Table of most recent time a state variable that is reset on every refresh was added.
	futureLastEnable = null
	// Table of state variables added by scripts that is reset only when out of combat.
	variable = null
	// Table of most recent time a state variable that is reset when out of combat was added.
	lastEnable = null

	inCombat = false;
	currentTime: number;
	//</state-properties>

	
	//</public-static-methods>

	//<state-methods>
	Initialize() {
		if ( !this.isInitialized ) {
			// OvaleState.InvokeMethod("InitializeState", state)
			// state.isInitialized = true
		}
	}

	Reset() {
		OvaleState.InvokeMethod("ResetState", state)
	}

	// Get the value of the named state variable.  If missing, then return 0.
	GetState(name) {
		return this.futureVariable[name] || this.variable[name] || 0
	}

	/*
		Get the duration in seconds that the simulator has been most recently
		in the named state.
	//*/
	GetStateDuration(name) {
		var lastEnable = this.futureLastEnable[name] || this.lastEnable[name] || this.currentTime
		return this.currentTime - lastEnable
	}

	// Put a value into the named state variable.
	PutState(name, value, isFuture) {
		if ( isFuture ) {
			var oldValue = this.GetState(name)
			if ( value != oldValue ) {
				this.Log("Setting future state. %s from %s to %s.", name, oldValue, value)
				this.futureVariable[name] = value
				this.futureLastEnable[name] = this.currentTime
			}
		} else {
			var oldValue = this.variable[name] || 0
			if ( value != oldValue ) {
				OvaleState.DebugTimestamp("Advancing combat state. %s from %s to %s.", name, oldValue, value)
				this.Log("Advancing combat state. %s from %s to %s.", name, oldValue, value)
				this.variable[name] = value
				this.lastEnable[name] = this.currentTime
			}
		}
	}

	// Logging function. {
	Log( ...) {
		return OvaleDebug.Log(...)
	}
}

class OvaleState {


	//<public-static-properties>
	// The state for the simulator.
	state = {}
	//</public-static-properties>

	//<public-static-methods>
	OnEnable() {
		this.RegisterState(this, this.statePrototype)
	}

	OnDisable() {
		this.UnregisterState(this)
	}


	RegisterState(stateAddon, statePrototype) {
		self_stateAddons.Insert(stateAddon)
		self_statePrototype[stateAddon] = statePrototype

		// Mix-in addon's state prototype into OvaleState.state.
		for (let k in statePrototype) {
			let v = statePrototype[k];
			this.state[k] = v
		}
	}

	UnregisterState(stateAddon) {
		var stateModules = new OvaleQueue("OvaleState_stateModules")
		while ( self_stateAddons.Size() > 0 ) {
			var addon = self_stateAddons.Remove()
			if ( stateAddon != addon ) {
				stateModules.Insert(addon)
			}
		}
		self_stateAddons = stateModules

		// Release resources used by the state machine managed by the addon.
		if ( stateAddon.CleanState ) {
			stateAddon.CleanState(this.state)
		}

		// Remove mix-in methods from addon's state prototype.
		var statePrototype = self_statePrototype[stateAddon]
		if ( statePrototype ) {
			for (let k in statePrototype) {
				this.state[k] = null
			}
		}
		self_statePrototype[stateAddon] = null
	}

	InvokeMethod(methodName, ...parameters) {
		const iterator = self_stateAddons.Iterator();
		let addon;
		while (addon = iterator.Next()) {
			if ( addon[methodName] ) {
				addon[methodName](addon, arguments)
			}
		}
	}
	//</public-static-methods>
//<public-static-methods>
	// Initialize the state.
	InitializeState(state:State) {
		state.futureVariable = {}
		state.futureLastEnable = {}
		state.variable = {}
		state.lastEnable = {}
	}

	// Reset the state to the current conditions.
	ResetState(state:State) {
		for (let k in state.futureVariable) {
			state.futureVariable[k] = null
			state.futureLastEnable[k] = null
		}
		// TODO. What conditions should trigger resetting state variables?
		// For now, reset/remove all state variables if out of combat.
		if ( !state.inCombat ) {
			for (let k in state.variable) {
				state.Log("Resetting state variable '%s'.", k)
				state.variable[k] = null
				state.lastEnable[k] = null
			}
		}
	}

	// Release state resources prior to removing from the simulator.
	CleanState(state:State) {
		for (let k in state.futureVariable) {
			state.futureVariable[k] = null
		}
		for (let k in state.futureLastEnable) {
			state.futureLastEnable[k] = null
		}
		for (let k in state.variable) {
			state.variable[k] = null
		}
		for (let k in state.lastEnable) {
			state.lastEnable[k] = null
		}
	}

}

export const ovaleState = ovale.NewModule("OvaleState", new OvaleState(), "AceEvent-3.0");
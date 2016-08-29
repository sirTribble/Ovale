//--------------------------------------------------------------------
// Copyright (C) 2012, 2013, 2014, 2015 Johnny C. Lam.
// See the file LICENSE.txt for copying permission.
// ----------------------------------------------------------------------
import { ovale } from 'Ovale';
import aceConfig from "AceConfig-3.0";
import aceConfigDialog from "AceConfigDialog-3.0";
import { L } from './Localization';
import libTextDump from "LibTextDump-1.0";
import { format, gsub, strlen, len, tostring, type, GetSpellInfo, GetTime, DEFAULT_CHAT_FRAME } from "stub";
import { ovaleOptions } from './Options';

// Maximum length of the trace log.
const OVALE_TRACELOG_MAXLINES = 4096	// 2^14

var NEW_DEBUG_NAMES = {
			action_bar: "OvaleActionBar",
			aura: "OvaleAura",
			combo_points: "OvaleComboPoints",
			compile: "OvaleCompile",
			damage_taken: "OvaleDamageTaken",
			enemy: "OvaleEnemies",
			guid: "OvaleGUID",
			missing_spells: false,
			paper_doll: "OvalePaperDoll",
			power: "OvalePower",
			snapshot: false,
			spellbook: "OvaleSpellBook",
			state: "OvaleState",
			steady_focus: "OvaleSteadyFocus",
			unknown_spells: false,
		};

class DebugModule {
    constructor(private name: string, private debug:OvaleDebug) {
	}
	
	// Output the parameters as a string to DEFAULT_CHAT_FRAME.
	Debug(...parameters){
		let name = this.name
		if (ovale.db.global.debug[name]) {
			// Match output format from AceConsole-3.0 Print() method.
			DEFAULT_CHAT_FRAME.AddMessage(format("|cff33ff99%s|r: %s", name, ovale.MakeString(arguments)))
		}
	}

	// Output the parameters as a string to DEFAULT_CHAT_FRAME with a timestamp.
	DebugTimestamp(...parameters:any[]) {
		let name = this.name
		if (ovale.db.global.debug[name]) {
			// Add a yellow timestamp to the start.
			let now = GetTime()
			let s = format("|cffffff00%f|r %s", now, ovale.MakeString(arguments))
			// Match output format from AceConsole-3.0 Print() method.
			DEFAULT_CHAT_FRAME.AddMessage(format("|cff33ff99%s|r: %s", name, s))
		}
	}

	Log(...parameters) {
		this.debug.Log(arguments);
	}
}

class OvaleDebug implements ModuleEvents, AceTimerModule {
	RegisterEvent: (name: string, method?: string) => void;
    RegisterMessage: (name: string, method?: string) => void;
    UnregisterEvent: (name: string) => void;
    UnregisterMessage: (name: string) => void;
    GetName: () => string;
	ScheduleTimer: (method:string, interval:number) => void;

	options = {
		name: "Ovale" + " " + L["Debug"],
		type: "group",
		args: {
			toggles: {
				name: L["Options"],
				type: "group",
				order: 10,
				args: {},
				get: function(info: LuaTable<string>) {
					let value = ovale.db.global.debug[info[len(info)]]
					return (value != undefined);
				},
				set: function(info: LuaTable<string>, value){
					value = value || undefined
					ovale.db.global.debug[info[len(info)]] = value
				},
			},
			trace: {
				name: L["Trace"],
				type: "group",
				order: 20,
				args: {
					trace: {
						order: 10,
						type: "execute",
						name: L["Trace"],
						desc: L["Trace the next frame update."],
						func: function() {
							this.DoTrace(true)
						},
					},
					traceLog: {
						order: 20,
						type: "execute",
						name: L["Show Trace Log"],
						func: function() {
							this.DisplayTraceLog()
						},
					},
				},
			}
		}
	}
		
	// If "bug" flag is set, then the next frame refresh is traced.
	bug = false
	// Flag to activate tracing the function calls for the next frame refresh.
	trace = false
	traced = false;
	traceLog: TextDump;
	
	OnInitialize() {
		let appName = this.GetName()
		aceConfig.RegisterOptionsTable(appName, this.options)
		aceConfigDialog.AddToBlizOptions(appName, L["Debug"], "Ovale")
	}

	OnEnable() {
		this.traceLog = libTextDump.New("Ovale" + " - " + L["Trace Log"], 750, 500)
	}

	DoTrace(displayLog) {
		this.traceLog.Clear()
		this.trace = true
		this.Log("=== Trace @%f", GetTime())
		if (displayLog) {
			this.ScheduleTimer("DisplayTraceLog", 0.5)
		}
	}

	ResetTrace() {
		this.bug = false
		this.trace = false
		this.traced = false
	}

	UpdateTrace() {
		// If trace flag is set here, then flag that we just traced one frame.
		if (this.trace){
			this.traced = true
		}
		// If there was a bug, then enable trace on the next frame.
		if (this.bug){
			this.trace = true
		}
		// Toggle trace flag so we don't endlessly trace successive frames.
		if (this.trace && this.traced) {
			this.traced = false
			this.trace = false
		}
	}

	RegisterDebugging(name: string) {
		let ret =new DebugModule(name, this);
		this.options.args.toggles.args[name] = {
			name: name,
			desc: format(L.enable_debugging, name),
			type: "toggle",
		}
		return ret;
	}

	DisplayTraceLog() {
		if (this.traceLog.Lines() == 0) {
			this.traceLog.AddLine("Trace log is empty.")
		}
		this.traceLog.Display()
	}

	UpgradeSavedVariables() {
		let global = ovale.db.global
		let profile = ovale.db.profile

		// All profile-specific debug options are removed.  They are now in the global database.
		profile.debug = null

		// Debugging options have changed names.
		for (var old in NEW_DEBUG_NAMES) {
			var newName = NEW_DEBUG_NAMES[old];
			if (global.debug[old] && newName) {
				global.debug[newName] = global.debug[old]
			}
			global.debug[old] = null
		}

		// If a debug option is toggled off, it is "stored" as nil, not "false".
		for (var k in global.debug) {
			var v = global.debug[k];
			if (!v){
				global.debug[k] = null
			}
		}
	}

	Log(...parameters) {
		if (this.trace) {
			let N = this.traceLog.Lines()
			if (N < OVALE_TRACELOG_MAXLINES - 1) {
				this.traceLog.AddLine(ovale.MakeString(arguments))
			} else if (N == OVALE_TRACELOG_MAXLINES - 1) {
				this.traceLog.AddLine("WARNING: Maximum length of trace log has been reached.")
			}
		}
	}

}

export var ovaleDebug =  ovale.NewModule("OvaleDebug", new OvaleDebug(), "AceTimer-3.0")

var actions:any = {
	debug: {
		name: L["Debug"],
		type: "execute",
		func: function() {
			let appName = ovaleDebug.GetName();
			aceConfigDialog.SetDefaultSize(appName, 800, 550)
			aceConfigDialog.Open(appName)
		},
	},
}
// Insert actions into OvaleOptions.
for (let k in actions) {
	ovaleOptions.options.args.actions.args[k] = actions[k];
}
// Add a global data type for debug options.
ovaleOptions.defaultDB.global = ovaleOptions.defaultDB.global || {}
ovaleOptions.defaultDB.global.debug = {}
ovaleOptions.RegisterOptions(ovaleDebug)

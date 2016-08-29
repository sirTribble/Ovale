/*--------------------------------------------------------------------
    Copyright (C) 2014 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
--------------------------------------------------------------------*/

/*
	Every time a new function is entered and exited, debugprofilestop() is called and the time between
	the two timestamps is calculated and attributed to that function.
*/

import { ovale } from "Ovale";
import AceConfig from "AceConfig-3.0";
import AceConfigDialog from "AceConfigDialog-3.0"
import { L } from 'Localization';
import LibTextDump from "LibTextDump-1.0";
import { ovaleOptions } from './Options';
import { format, ipairs, next, tconcat, tinsert, sort, wipe, GetTime, len, debugprofilestop } from 'stub';
var OVALE = "Ovale";

class ProfiledModule {
	private DoNothing(tag: string) {}

	public StartProfiling: (tag:string) => void;
	public StopProfiling: (tag: string) => void;

	constructor(private profiler: OvaleProfiler) {
	}

	private DoStartProfiling(tag: string) {
		this.profiler.StartProfiling(tag);
	}

	private DoStopProfiling(tag: string){
		this.profiler.StopProfiling(tag);
	}

	public Enable(){
		this.StartProfiling = this.DoStartProfiling;
		this.StopProfiling = this.DoStopProfiling;
	}

	public Disable(){
		this.StartProfiling = this.DoNothing;
		this.StopProfiling = this.DoNothing;
	}
}

class OvaleProfiler implements ModuleEvents {
	addons: LuaDictionary<ProfiledModule> = {}

	profilingOutput:TextDump = null
	
	options = {
		name: OVALE + " " + L["Profiling"],
		type: "group",
		args: {
			profiling: {
				name: L["Profiling"],
				type: "group",
				args: {
					modules: {
						name: L["Modules"],
						type: "group",
						inline: true,
						order: 10,
						args: {},
						get: (info: LuaTable<string>) => {
							let name = info[len(info)]
							let value = ovale.db.global.profiler[name]
							return (value != null)
						},
						set: (info: LuaTable<string>, value: string) => {
							value = value || null;
							let name = info[len(info)]
							ovale.db.global.profiler[name] = value
							if (value) {
								this.EnableProfiling(name)
							} else {
								this.DisableProfiling(name)
							}
						},
					},
					reset: {
						name: L["Reset"],
						desc: L["Reset the profiling statistics."],
						type: "execute",
						order: 20,
						func: () => { this.ResetProfiling() },
					},
					show: {
						name: L["Show"],
						desc: L["Show the profiling statistics."],
						type: "execute",
						order: 30,
						func: () => {
							this.profilingOutput.Clear();
							let s = this.GetProfilingInfo();
							if (s) {
								this.profilingOutput.AddLine(s)
								this.profilingOutput.Display()
							}
						},
					},
				},
			},
		},
	}

	OnInitialize() {
		let appName = "OvaleProfiler";
		AceConfig.RegisterOptionsTable(appName, this.options)
		AceConfigDialog.AddToBlizOptions(appName, L["Profiling"], OVALE)
		
		var actions:any = {
			profiling: {
				name: L["Profiling"],
				type: "execute",
				func: function() {
					AceConfigDialog.SetDefaultSize(appName, 800, 550)
					AceConfigDialog.Open(appName)
				},
			},
		}
		// Insert actions into OvaleOptions.
		for (var k in actions) {
			ovaleOptions.options.args.actions.args[k] = actions[k];
		}
				
		// Add a global data type for debug options.
		ovaleOptions.defaultDB.global = ovaleOptions.defaultDB.global || {}
		ovaleOptions.defaultDB.global.profiler = {}
		ovaleOptions.RegisterOptions(this);
	}

	OnEnable() {
		if (! this.profilingOutput) {
			this.profilingOutput = LibTextDump.New(OVALE + " - " + L["Profiling"], 750, 500)
		}
	}

	OnDisable() {
		this.profilingOutput.Clear()
	}

	RegisterProfiling(name:string) {
		const addon = new ProfiledModule(this);
		this.addons[name] = addon;
		this.options.args.profiling.args.modules.args[name] = {
			name: name,
			desc: format(L["Enable profiling for the %s module."], name),
			type: "toggle",
		}
		this.DisableProfiling(name);
		return addon;
	}

	EnableProfiling(name:string) {
		let addon = this.addons[name]
		if (addon) {
			addon.Enable();
		}
	}

	DisableProfiling(name:string) {
		let addon = this.addons[name]
		if (addon) {
			addon.Disable();
		}
	}
	timestamp = debugprofilestop()
	stack:LuaTable<string> = {}
	stackSize = 0
	timeSpent:LuaDictionary<number> = {}
	timesInvoked:LuaDictionary<number> = {}
		
	StartProfiling(tag: string) {
		let newTimestamp = debugprofilestop()

		// Attribute the time spent up to this call to the previous function.
		if (this.stackSize > 0) {
			let delta = newTimestamp - this.timestamp
			let previous = this.stack[this.stackSize]
			let timeSpent = this.timeSpent[previous] || 0
			timeSpent = timeSpent + delta
			this.timeSpent[previous] = timeSpent
		}

		// Add the current function to the call stack.
		this.timestamp = newTimestamp
		this.stackSize = this.stackSize + 1
		this.stack[this.stackSize] = tag
		let timesInvoked = this.timesInvoked[tag] || 0
		timesInvoked = timesInvoked + 1
		this.timesInvoked[tag] = timesInvoked
	}

	StopProfiling(tag: string) {
		if (this.stackSize > 0) {
			let currentTag = this.stack[this.stackSize]
			if (currentTag == tag){
				let newTimestamp = debugprofilestop()
				let delta = newTimestamp - this.timestamp
				let timeSpent = this.timeSpent[currentTag] || 0
				timeSpent = timeSpent + delta
				this.timeSpent[currentTag] = timeSpent
				this.timestamp = newTimestamp
				this.stackSize = this.stackSize - 1
			}
		}
	}	


	array:LuaTable<string> = {}

	GetProfilingInfo() {
		if (next(this.timeSpent)) {
			// Calculate the width needed to print out the times invoked.
			let width = 1
			let tenPower = 10
			for (let key in this.timesInvoked) {
				let timesInvoked = this.timesInvoked[key];
				while (timesInvoked > tenPower) {
					width = width + 1
					tenPower = tenPower * 10
				}
			}
		
			wipe(this.array)
			let formatString = format("    %%08.3fms: %%0%dd (%%05f) x %%s", width)
			for (let tag in this.timeSpent) {
				let timeSpent = this.timeSpent[tag];
				let timesInvoked = this.timesInvoked[tag]
				tinsert(this.array, format(formatString, timeSpent, timesInvoked, timeSpent / timesInvoked, tag))
			}
			if (next(this.array)) {
				sort(this.array)
				let now = GetTime()
				tinsert(this.array, 1, format("Profiling statistics at %f:", now))
				return tconcat(this.array, "\n")
			}
		}
		return null;
	}
	

	DebuggingInfo() {
		ovale.Print("Profiler stack size = %d", this.stackSize)
		let index = this.stackSize
		while (index > 0 && this.stackSize - index < 10) {
			let tag = this.stack[index]
			ovale.Print("    [%d] %s", index, tag)
			index = index - 1
		}
	}
	
	ResetProfiling() {
		for (let tag in this.timeSpent) {
			this.timeSpent[tag] = null;
		}

		for (let tag in this.timesInvoked) {
			this.timesInvoked[tag] = null;
		}
	}
}

export const ovaleProfiler = ovale.NewModule("OvaleProfiler", new OvaleProfiler());



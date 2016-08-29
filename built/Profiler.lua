 --[[/*--------------------------------------------------------------------
    Copyright (C) 2014 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
--------------------------------------------------------------------*/]]--
local _addonName, _addon = ...
define(_addonName, _addon, "Profiler", {"Ovale", "AceConfig-3.0", "AceConfigDialog-3.0", 'Localization', "LibTextDump-1.0", './Options', 'stub'}, function (__exports, Ovale_1, AceConfig_3_0_1, AceConfigDialog_3_0_1, Localization_1, LibTextDump_1_0_1, Options_1, stub_1)
    local OVALE = "Ovale";
    local OvaleProfiler = (function () 
        local OvaleProfiler = {}
        OvaleProfiler.constructor = function (this)
            this.timestamp = stub_1.debugprofilestop();
            this.stack = {};
            this.stackSize = 0;
            this.timeSpent = {};
            this.timesInvoked = {};
            this.addons = {};
            this.profilingOutput = nil;
            this.options = {
                name= OVALE .. " " .. Localization_1.L["Profiling"],
                type= "group",
                args= {
                    profiling= {
                        name= Localization_1.L["Profiling"],
                        type= "group",
                        args= {
                            modules= {
                                name= Localization_1.L["Modules"],
                                type= "group",
                                inline= true,
                                order= 10,
                                args= {},
                                get= function (info)
                                    local name = info[stub_1.len(info) + 1];
                                    local value = Ovale_1.ovale.db.global.profiler[name + 1];
                                    return (value ~= nil);
                                end,
                                set= function (info, value)
                                    value = value or nil;
                                    local name = info[stub_1.len(info) + 1];
                                    Ovale_1.ovale.db.global.profiler[name + 1] = value;
                                    if (value) then 
                                        this.EnableProfiling(name);
                                    else 
                                        this.DisableProfiling(name);
                                    end
                                end,
                            },
                            reset= {
                                name= Localization_1.L["Reset"],
                                desc= Localization_1.L["Reset the profiling statistics."],
                                type= "execute",
                                order= 20,
                                func= function () this.ResetProfiling(); end,
                            },
                            show= {
                                name= Localization_1.L["Show"],
                                desc= Localization_1.L["Show the profiling statistics."],
                                type= "execute",
                                order= 30,
                                func= function ()
                                    this.profilingOutput.Clear();
                                    local s = this.GetProfilingInfo();
                                    if (s) then 
                                        this.profilingOutput.AddLine(s);
                                        this.profilingOutput.Display();
                                    end
                                end,
                            },
                        },
                    },
                },
            };
            this.array = {};
        end;
        OvaleProfiler.DoNothing = function (this)
        end;
        OvaleProfiler.StartProfiling = function (this, tag)
            local newTimestamp = stub_1.debugprofilestop();
             --[[// Attribute the time spent up to this call to the previous function.]]--
            if (this.stackSize > 0) then 
                local delta = newTimestamp - this.timestamp;
                local previous = this.stack[this.stackSize + 1];
                local timeSpent = this.timeSpent[previous + 1] or 0;
                timeSpent = timeSpent + delta;
                this.timeSpent[previous + 1] = timeSpent;
            end
             --[[// Add the current function to the call stack.]]--
            this.timestamp = newTimestamp;
            this.stackSize = this.stackSize + 1;
            this.stack[this.stackSize + 1] = tag;
            local timesInvoked = this.timesInvoked[tag + 1] or 0;
            timesInvoked = timesInvoked + 1;
            this.timesInvoked[tag + 1] = timesInvoked;
        end;
        OvaleProfiler.StopProfiling = function (this, tag)
            if (this.stackSize > 0) then 
                local currentTag = this.stack[this.stackSize + 1];
                if (currentTag == tag) then 
                    local newTimestamp = stub_1.debugprofilestop();
                    local delta = newTimestamp - this.timestamp;
                    local timeSpent = this.timeSpent[currentTag + 1] or 0;
                    timeSpent = timeSpent + delta;
                    this.timeSpent[currentTag + 1] = timeSpent;
                    this.timestamp = newTimestamp;
                    this.stackSize = this.stackSize - 1;
                end
            end
        end;
        OvaleProfiler.OnInitialize = function (this)
            local appName = this.GetName();
            AceConfig_3_0_1.default:RegisterOptionsTable(appName, this.options);
            AceConfigDialog_3_0_1.default:AddToBlizOptions(appName, Localization_1.L["Profiling"], OVALE);
        end;
        OvaleProfiler.OnEnable = function (this)
            if (not this.profilingOutput) then 
                this.profilingOutput = LibTextDump_1_0_1.default:New(OVALE .. " - " .. Localization_1.L["Profiling"], 750, 500);
            end
        end;
        OvaleProfiler.OnDisable = function (this)
            this.profilingOutput:Clear();
        end;
        OvaleProfiler.RegisterProfiling = function (this, addon, name)
            name = name or addon:GetName();
            this.addons[name + 1] = addon;
            this.options.args.profiling.args.modules.args[name] = {
                name= name,
                desc= stub_1.format(Localization_1.L["Enable profiling for the %s module."], name),
                type= "toggle",
            };
            this.DisableProfiling(name);
        end;
        OvaleProfiler.EnableProfiling = function (this, name)
            local addon = this.addons[name + 1];
            if (addon) then 
                addon.StartProfiling = this.StartProfiling;
                addon.StopProfiling = this.StopProfiling;
            end
        end;
        OvaleProfiler.DisableProfiling = function (this, name)
            local addon = this.addons[name + 1];
            if (addon) then 
                addon.StartProfiling = this.DoNothing;
                addon.StopProfiling = this.DoNothing;
            end
        end;
        OvaleProfiler.ResetProfiling = function (this)
            for local tag,_ in ipairs(this.timeSpent) do tag = tag - 1 
                do
                this.timeSpent[tag + 1] = nil;
                end
            end
            for local tag,_ in ipairs(this.timesInvoked) do tag = tag - 1 
                do
                this.timesInvoked[tag + 1] = nil;
                end
            end
        end;
        OvaleProfiler.GetProfilingInfo = function (this)
            if (stub_1.next(this.timeSpent)) then 
                 --[[// Calculate the width needed to print out the times invoked.]]--
                local width = 1;
                local tenPower = 10;
                for local key,_ in ipairs(this.timesInvoked) do key = key - 1 
                    do
                    local timesInvoked = this.timesInvoked[key + 1];
                    while (timesInvoked > tenPower)  do
                        do
                        width = width + 1;
                        tenPower = tenPower * 10;
                        end
                    end
                    end
                end
                stub_1.wipe(this.array);
                local formatString = stub_1.format("    %%08.3fms: %%0%dd (%%05f) x %%s", width);
                for local tag,_ in ipairs(this.timeSpent) do tag = tag - 1 
                    do
                    local timeSpent = this.timeSpent[tag + 1];
                    local timesInvoked = this.timesInvoked[tag + 1];
                    stub_1.tinsert(this.array, stub_1.format(formatString, timeSpent, timesInvoked, timeSpent / timesInvoked, tag));
                    end
                end
                if (stub_1.next(this.array)) then 
                    tsort(this.array);
                    local now = stub_1.GetTime();
                    stub_1.tinsert(this.array, 1, stub_1.format("Profiling statistics at %f:", now));
                    return stub_1.tconcat(this.array, "\n");
                end
            end
        end;
        OvaleProfiler.DebuggingInfo = function (this)
            Ovale_1.ovale:Print("Profiler stack size = %d", this.stackSize);
            local index = this.stackSize;
            while (index > 0 and this.stackSize - index < 10)  do
                do
                local tag = this.stack[index + 1];
                Ovale_1.ovale:Print("    [%d] %s", index, tag);
                index = index - 1;
                end
            end
        end;
        return OvaleProfiler;
    end)();
    __exports.ovaleProfiler = Ovale_1.ovale:NewModule("OvaleProfiler", __new(OvaleProfiler));
    local actions = {
        profiling= {
            name= Localization_1.L["Profiling"],
            type= "execute",
            func= function ()
                local appName = exports.ovaleProfiler:GetName();
                AceConfigDialog_3_0_1.default:SetDefaultSize(appName, 800, 550);
                AceConfigDialog_3_0_1.default:Open(appName);
            end,
        },
    };
     --[[// Insert actions into OvaleOptions.]]--
    for local k,_ in ipairs(actions) do k = k - 1 
        do
        Options_1.ovaleOptions.options.args.actions.args[k + 1] = actions[k + 1];
        end
    end
     --[[// Add a global data type for debug options.]]--
    Options_1.ovaleOptions.defaultDB.global = Options_1.ovaleOptions.defaultDB.global or {};
    Options_1.ovaleOptions.defaultDB.global.profiler = {};
    Options_1.ovaleOptions:RegisterOptions(OvaleProfiler);
end);

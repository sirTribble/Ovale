local _addonName, _addon = ...
define(_addonName, _addon, "Debug", {'Ovale', "AceConfig-3.0", "AceConfigDialog-3.0", 'Localization', "LibTextDump-1.0", "stub", './Options'}, function (__exports, Ovale_1, AceConfig_3_0_1, AceConfigDialog_3_0_1, Localization_1, LibTextDump_1_0_1, stub_1, Options_1)
     --[[// Maximum length of the trace log.]]--
    local OVALE_TRACELOG_MAXLINES = 4096;  --[[// 2^14]]--
    local NEW_DEBUG_NAMES = {
        action_bar= "OvaleActionBar",
        aura= "OvaleAura",
        combo_points= "OvaleComboPoints",
        compile= "OvaleCompile",
        damage_taken= "OvaleDamageTaken",
        enemy= "OvaleEnemies",
        guid= "OvaleGUID",
        missing_spells= false,
        paper_doll= "OvalePaperDoll",
        power= "OvalePower",
        snapshot= false,
        spellbook= "OvaleSpellBook",
        state= "OvaleState",
        steady_focus= "OvaleSteadyFocus",
        unknown_spells= false,
    };
    local OvaleDebug = (function () 
        local OvaleDebug = {}
        OvaleDebug.constructor = function (this)
            this.options = {
                name= "Ovale" .. " " .. Localization_1.L["Debug"],
                type= "group",
                args= {
                    toggles= {
                        name= Localization_1.L["Options"],
                        type= "group",
                        order= 10,
                        args= {},
                        get= function (info)
                            local value = Ovale_1.ovale.db.global.debug[info[ts.len(info)] + 1];
                            return (value ~= undefined);
                        end,
                        set= function (info, value)
                            value = value or undefined;
                            Ovale_1.ovale.db.global.debug[info[ts.len(info)] + 1] = value;
                        end,
                    },
                    trace= {
                        name= Localization_1.L["Trace"],
                        type= "group",
                        order= 20,
                        args= {
                            trace= {
                                order= 10,
                                type= "execute",
                                name= Localization_1.L["Trace"],
                                desc= Localization_1.L["Trace the next frame update."],
                                func= function ()
                                    this.DoTrace(true);
                                end,
                            },
                            traceLog= {
                                order= 20,
                                type= "execute",
                                name= Localization_1.L["Show Trace Log"],
                                func= function ()
                                    this.DisplayTraceLog();
                                end,
                            },
                        },
                    }
                }
            };
             --[[// If "bug" flag is set, then the next frame refresh is traced.]]--
            this.bug = false;
             --[[// Flag to activate tracing the function calls for the next frame refresh.]]--
            this.trace = false;
            this.traced = false;
        end;
        OvaleDebug.OnInitialize = function (this)
            local appName = this.GetName();
            AceConfig_3_0_1.default:RegisterOptionsTable(appName, this.options);
            AceConfigDialog_3_0_1.default:AddToBlizOptions(appName, Localization_1.L["Debug"], "Ovale");
        end;
        OvaleDebug.OnEnable = function (this)
            this.traceLog = LibTextDump_1_0_1.default:New("Ovale" .. " - " .. Localization_1.L["Trace Log"], 750, 500);
        end;
        OvaleDebug.DoTrace = function (this, displayLog)
            this.traceLog:Clear();
            this.trace = true;
            this.Log("=== Trace @%f", stub_1.GetTime());
            if (displayLog) then 
                this.ScheduleTimer("DisplayTraceLog", 0.5);
            end
        end;
        OvaleDebug.ResetTrace = function (this)
            this.bug = false;
            this.trace = false;
            this.traced = false;
        end;
        OvaleDebug.UpdateTrace = function (this)
             --[[// If trace flag is set here, then flag that we just traced one frame.]]--
            if (this.trace) then 
                this.traced = true;
            end
             --[[// If there was a bug, then enable trace on the next frame.]]--
            if (this.bug) then 
                this.trace = true;
            end
             --[[// Toggle trace flag so we don't endlessly trace successive frames.]]--
            if (this.trace and this.traced) then 
                this.traced = false;
                this.trace = false;
            end
        end;
        OvaleDebug.RegisterDebugging = function (this, addon)
            local ret = addon;
            local name = addon:GetName();
            this.options.args.toggles.args[name] = {
                name= name,
                desc= stub_1.format(Localization_1.L["Enable debugging messages for the %s module."], name),
                type= "toggle",
            };
            ret.Debug = this.Debug;
            ret.DebugTimestamp = this.DebugTimestamp;
            return ret;
        end;
         --[[// Output the parameters as a string to DEFAULT_CHAT_FRAME.]]--
        OvaleDebug.Debug = function (this, ...)
            local parameters = {...}
            local name = this.GetName();
            if (Ovale_1.ovale.db.global.debug[name + 1]) then 
                 --[[// Match output format from AceConsole-3.0 Print() method.]]--
                stub_1.DEFAULT_CHAT_FRAME:AddMessage(stub_1.format("|cff33ff99%s|r: %s", name, Ovale_1.ovale:MakeString(...)));
            end
        end;
         --[[// Output the parameters as a string to DEFAULT_CHAT_FRAME with a timestamp.]]--
        OvaleDebug.DebugTimestamp = function (this, ...)
            local parameters = {...}
            local name = this.GetName();
            if (Ovale_1.ovale.db.global.debug[name + 1]) then 
                 --[[// Add a yellow timestamp to the start.]]--
                local now = stub_1.GetTime();
                local s = stub_1.format("|cffffff00%f|r %s", now, Ovale_1.ovale:MakeString(...));
                 --[[// Match output format from AceConsole-3.0 Print() method.]]--
                stub_1.DEFAULT_CHAT_FRAME:AddMessage(stub_1.format("|cff33ff99%s|r: %s", name, s));
            end
        end;
        OvaleDebug.Log = function (this, ...)
            local parameters = {...}
            if (this.trace) then 
                local N = this.traceLog:Lines();
                if (N < OVALE_TRACELOG_MAXLINES - 1) then 
                    this.traceLog:AddLine(Ovale_1.ovale:MakeString(...));
                elseif (N == OVALE_TRACELOG_MAXLINES - 1) then 
                    this.traceLog:AddLine("WARNING: Maximum length of trace log has been reached.");
                end
            end
        end;
        OvaleDebug.DisplayTraceLog = function (this)
            if (this.traceLog:Lines() == 0) then 
                this.traceLog:AddLine("Trace log is empty.");
            end
            this.traceLog:Display();
        end;
        OvaleDebug.UpgradeSavedVariables = function (this)
            local global = Ovale_1.ovale.db.global;
            local profile = Ovale_1.ovale.db.profile;
             --[[// All profile-specific debug options are removed.  They are now in the global database.]]--
            profile.debug = undefined;
             --[[// Debugging options have changed names.]]--
            for local old,_ in pairs(NEW_DEBUG_NAMES) do  
                do
                local newName = NEW_DEBUG_NAMES[old];
                if (global.debug[old + 1] and newName) then 
                    global.debug[newName + 1] = global.debug[old + 1];
                end
                global.debug[old + 1] = undefined;
                end
            end
             --[[// If a debug option is toggled off, it is "stored" as nil, not "false".]]--
            for local k,_ in ipairs(global.debug) do k = k - 1 
                do
                local v = global.debug[k + 1];
                if (not v) then 
                    global.debug[k + 1] = undefined;
                end
                end
            end
        end;
        return OvaleDebug;
    end)();
    __exports.ovaleDebug = Ovale_1.ovale:NewModule("OvaleDebug", __new(OvaleDebug), "AceTimer-3.0");
    local actions = {
        debug= {
            name= Localization_1.L["Debug"],
            type= "execute",
            func= function ()
                local appName = exports.ovaleDebug:GetName();
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
    Options_1.ovaleOptions.defaultDB.global.debug = {};
    Options_1.ovaleOptions:RegisterOptions(exports.ovaleDebug);
end);

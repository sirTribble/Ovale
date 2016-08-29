 --[[//--------------------------------------------------------------------]]--
 --[[//     Copyright (C) 2012, 2016 Sidoine De Wispelaere.]]--
 --[[//     Copyright (C) 2012, 2013, 2014 Johnny C. Lam.]]--
 --[[//     See the file LICENSE.txt for copying permission.]]--
 --[[//--------------------------------------------------------------------]]--
local _addonName, _addon = ...
define(_addonName, _addon, "ActionBar", {'Ovale', './Debug', './Profiler', 'stub'}, function (__exports, Ovale_1, Debug_1, Profiler_1, stub_1)
    function GetKeyBinding(slot)
         --[[// 	ACTIONBUTTON1..12			=> primary (1..12, 13..24), bonus (73..120)]]--
         --[[// 	MULTIACTIONBAR1BUTTON1..12	=> bottom left (61..72)]]--
         --[[// 	MULTIACTIONBAR2BUTTON1..12	=> bottom right (49..60)]]--
         --[[// 	MULTIACTIONBAR3BUTTON1..12	=> top right (25..36)]]--
         --[[// 	MULTIACTIONBAR4BUTTON1..12	=> top left (37..48)]]--
        local name;
        if (slot <= 24 or slot > 72) then 
            name = "ACTIONBUTTON" .. (((slot - 1) % 12) + 1);
        elseif (slot <= 36) then 
            name = "MULTIACTIONBAR3BUTTON" .. (slot - 24);
        elseif (slot <= 48) then 
            name = "MULTIACTIONBAR4BUTTON" .. (slot - 36);
        elseif (slot <= 60) then 
            name = "MULTIACTIONBAR2BUTTON" .. (slot - 48);
        else 
            name = "MULTIACTIONBAR1BUTTON" .. (slot - 60);
        end
        local key = name and stub_1.GetBindingKey(name);
         --[[// Shorten the keybinding names.]]--
        if (key and stub_1.strlen(key) > 4) then 
            key = stub_1.strupper(key);
             --[[// Strip whitespace.]]--
            key = stub_1.gsub(key, "%s+", "");
             --[[// Convert modifiers to a single character.]]--
            key = stub_1.gsub(key, "ALT%-", "A");
            key = stub_1.gsub(key, "CTRL%-", "C");
            key = stub_1.gsub(key, "SHIFT%-", "S");
             --[[// Shorten numberpad keybinding names.]]--
            key = stub_1.gsub(key, "NUMPAD", "N");
            key = stub_1.gsub(key, "PLUS", "+");
            key = stub_1.gsub(key, "MINUS", "-");
            key = stub_1.gsub(key, "MULTIPLY", "*");
            key = stub_1.gsub(key, "DIVIDE", "/");
        end
        return key;
    end
    function ParseHyperlink(hyperlink)
        local matches = stub_1.strmatch(hyperlink, "|?c?f?f?(%x*)|?H?([^:]*):?(%d+)|?h?%[?([^%[%]]*)%]?|?h?|?r?");
        return { color= matches[0 + 1], linkType= matches[1 + 1], linkData= matches[2 + 1], text= matches[3 + 1] };
    end
    local OvaleActionBar = (function () 
        local OvaleActionBar = {}
        OvaleActionBar.constructor = function (this)
             --[[// Maps each action slot (1..120) to the current action: action[slot] = action]]--
            this.action = {};
             --[[// Maps each action slot (1..120) to its current keybind: keybind[slot] = keybind]]--
            this.keybind = {};
             --[[// Maps each spell/macro/item ID to its current action slot.]]--
            this.spell = {};
            this.macro = {};
            this.item = {};
        end;
        OvaleActionBar.OnEnable = function (this)
            this.RegisterEvent("ACTIONBAR_SLOT_CHANGED");
            this.RegisterEvent("PLAYER_ENTERING_WORLD", "UpdateActionSlots");
            this.RegisterEvent("UPDATE_BINDINGS");
            this.RegisterEvent("UPDATE_BONUS_ACTIONBAR", "UpdateActionSlots");
            this.RegisterMessage("Ovale_StanceChanged", "UpdateActionSlots");
            this.RegisterMessage("Ovale_TalentsChanged", "UpdateActionSlots");
        end;
        OvaleActionBar.OnDisable = function (this)
            this.UnregisterEvent("ACTIONBAR_SLOT_CHANGED");
            this.UnregisterEvent("PLAYER_ENTERING_WORLD");
            this.UnregisterEvent("UPDATE_BINDINGS");
            this.UnregisterEvent("UPDATE_BONUS_ACTIONBAR");
            this.UnregisterMessage("Ovale_StanceChanged");
            this.UnregisterMessage("Ovale_TalentsChanged");
        end;
        OvaleActionBar.ACTIONBAR_SLOT_CHANGED = function (this, event, slot)
            slot = API_tonumber(slot);
            if (slot == 0) then 
                this.UpdateActionSlots(event);
            elseif (slot) then 
                this.UpdateActionSlot(slot);
            end
        end;
        OvaleActionBar.UPDATE_BINDINGS = function (this, event)
            this.Debug("%s: Updating key bindings.", event);
            this.UpdateKeyBindings();
        end;
        OvaleActionBar.UpdateActionSlots = function (this, event)
            this.StartProfiling("OvaleActionBar_UpdateActionSlots");
            this.Debug("%s: Updating all action slot mappings.", event);
            API_wipe(this.action);
            API_wipe(this.item);
            API_wipe(this.macro);
            API_wipe(this.spell);
            local start = 1;
            local bonus = API_tonumber(stub_1.GetBonusBarIndex()) * 12;
            local slot;
            if (bonus > 0) then 
                start = 13;
                do
                slot = bonus - 11;
                while ( slot <= bonus)  do
                    do
                    this.UpdateActionSlot(slot);
                    end
                    slot = slot + 1
                end
            end
            do
            slot = start;
            while ( slot <= 72)  do
                do
                this.UpdateActionSlot(slot);
                end
                slot = slot + 1
            end
            this.StopProfiling("OvaleActionBar_UpdateActionSlots");
        end;
        OvaleActionBar.UpdateActionSlot = function (this, slot)
            this.StartProfiling("OvaleActionBar_UpdateActionSlot");
             --[[// Clear old slot && associated actions.]]--
            local action = this.action[slot];
            if (this.spell[action + 1] == slot) then 
                this.spell[action + 1] = nil;
            elseif (this.item[action] == slot) then 
                this.item[action] = nil;
            elseif (this.macro[action] == slot) then 
                this.macro[action] = nil;
            end
            this.action[slot] = nil;
             --[[// Map the current action in the slot.]]--
            local actionInfo = stub_1.GetActionInfo(slot);
            local id;
            if (actionInfo.actionType == "spell") then 
                id = API_tonumber(actionInfo.id);
                if (id) then 
                    if (not this.spell[id + 1] or slot < this.spell[id + 1]) then 
                        this.spell[id + 1] = slot;
                    end
                    this.action[slot] = id;
                end
            elseif (actionInfo.actionType == "item") then 
                id = API_tonumber(actionInfo.id);
                if (id) then 
                    if (not this.item[id] or slot < this.item[id]) then 
                        this.item[id] = slot;
                    end
                    this.action[slot] = id;
                elseif (actionInfo.actionType == "macro") then 
                    id = API_tonumber(actionInfo.id);
                    if (id) then 
                        local actionText = stub_1.GetActionText(slot);
                        if (actionText) then 
                            if (not this.macro[actionText] or slot < this.macro[actionText]) then 
                                this.macro[actionText] = slot;
                            end
                            local macroSpell = stub_1.GetMacroSpell(id);
                            if (macroSpell.id) then 
                                if (not this.spell[macroSpell.id + 1] or slot < this.spell[macroSpell.id + 1]) then 
                                    this.spell[macroSpell.id + 1] = slot;
                                end
                                this.action[slot] = macroSpell.id;
                            else 
                                local macroItem = stub_1.GetMacroItem(id);
                                if (macroItem.link) then 
                                    local link = ParseHyperlink(macroItem.link);
                                    local itemId = API_tonumber(stub_1.gsub(link.linkData, ":.*", ""));
                                    if (itemId) then 
                                        if (not this.item[itemId] or slot < this.item[itemId]) then 
                                            this.item[itemId] = slot;
                                        end
                                        this.action[slot] = itemId;
                                    end
                                end
                            end
                            if (not this.action[slot]) then 
                                this.action[slot] = actionText;
                            end
                        end
                    end
                end
                if (this.action[slot]) then 
                    this.Debug("Mapping button %s to %s.", slot, this.action[slot]);
                else
                    this.Debug("Clearing mapping for button %s.", slot);
                end
            end
             --[[// Update the keybind for the slot.]]--
            this.keybind[slot] = GetKeyBinding(slot);
            this.StopProfiling("OvaleActionBar_UpdateActionSlot");
        end;
        OvaleActionBar.UpdateKeyBindings = function (this)
            this.StartProfiling("OvaleActionBar_UpdateKeyBindings");
            do
            local local slot = 1;
            while ( slot <= 120)  do
                do
                this.keybind[slot] = GetKeyBinding(slot);
                end
                slot = slot + 1
            end
            this.StopProfiling("OvaleActionBar_UpdateKeyBindings");
        end;
         --[[// Get the action slot that matches a spell ID.]]--
        OvaleActionBar.GetForSpell = function (this, spellId)
            return this.spell[spellId + 1];
        end;
         --[[// Get the action slot that matches a macro name.]]--
        OvaleActionBar.GetForMacro = function (this, macroName)
            return this.macro[macroName];
        end;
         --[[// Get the action slot that matches an item ID.]]--
        OvaleActionBar.GetForItem = function (this, itemId)
            return this.item[itemId];
        end;
         --[[// Get the keybinding for an action slot.]]--
        OvaleActionBar.GetBinding = function (this, slot)
            return this.keybind[slot];
        end;
        return OvaleActionBar;
    end)();
    __exports.ovaleActionBar = Ovale_1.ovale:NewModule("OvaleActionBar", __new(OvaleActionBar), "AceEvent-3.0");
    Debug_1.ovaleDebug:RegisterDebugging(exports.ovaleActionBar);
    Profiler_1.ovaleProfiler:RegisterProfiling(exports.ovaleActionBar);
end);

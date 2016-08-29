 --[[/*////////////////////////////////////////////////////////////////////
    Copyright (C) 2013, 2014 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
//*/]]--
local _addonName, _addon = ...
define(_addonName, _addon, "Pool", {"stub", "Ovale"}, function (__exports, stub_1, Ovale_1)
    local OVALE = "Ovale";
    local OvalePool = (function () 
        local OvalePool = {}
        OvalePool.constructor = function (this, name)
            this.name = name;
            this.pool = nil;
            this.size = 0;
            this.unused = 0;
            this.Drain();
        end;
        OvalePool.Get = function (this)
            stub_1.assert(this.pool ~= nil);
            local item = stub_1.tremove(this.pool);
            if (item) then 
                this.unused = this.unused - 1;
            else 
                this.size = this.size + 1;
                item = {};
            end
            return item;
        end;
        OvalePool.Release = function (this, item)
            stub_1.assert(this.pool ~= nil);
            local clean = this.clean;
            clean(item);
            stub_1.wipe(item);
            stub_1.tinsert(this.pool, item);
            this.unused = this.unused + 1;
        end;
        OvalePool.Drain = function (this)
            this.pool = {};
            this.size = this.size - this.unused;
            this.unused = 0;
        end;
        OvalePool.DebuggingInfo = function (this)
            Ovale_1.ovale:Print("Pool %s has size %d with %d item(s).", stub_1.tostring(this.name), this.size, this.unused);
        end;
        return OvalePool;
    end)();
    __exports.OvalePool = OvalePool;
end);

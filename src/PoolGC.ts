import { tostring } from "@wowts/lua";
import { Print } from "./tools";

export class OvalePoolGC {
    name = "OvalePoolGC";
    size = 0;
    __index = OvalePoolGC;

    constructor(name: string) {
        this.name = name;
    }
    Get() {
        this.size = this.size + 1;
        return {};
    }
    Release(item: any) {
        this.Clean(item);
    }
    Clean(item: any) {}
    Drain() {
        this.size = 0;
    }
    DebuggingInfo() {
        Print("Pool %s has size %d.", tostring(this.name), this.size);
    }
}

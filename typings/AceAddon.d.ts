interface ModuleEvents {
    OnEnable?: () => void;
    OnInitialize?: () => void;
    RegisterEvent?: (name: string, method?: string) => void;
    RegisterMessage?: (name: string, method?: string) => void;
    UnregisterEvent?: (name: string) => void;
    UnregisterMessage?: (name: string) => void;
    GetName?: () => string;
    SendMessage?: (message:string) => void;
}

interface Addon extends ModuleEvents {
    NewModule: <T>(name:string, prototype:T, ...dependencies:string[]) => T;
    db:any;
    Print(message:string, ...parameters):void;
}

interface AceAddon {
    NewAddon<T extends ModuleEvents>(o:T, name: string, ...dependencies:string[]):T & Addon;

    GetAddon(name:string):Addon;
}
 
declare module "AceAddon-3.0" {
    let aceAddon:AceAddon; 
    export default aceAddon;
}
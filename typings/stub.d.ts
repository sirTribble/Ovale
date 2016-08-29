interface Global{
    ({key:string}):any;
}
declare var _G:Global;

/** A 1 base indexed table */
interface LuaTable<T> {
    [index:number]:T;
}

interface LuaDictionary<T> {
    [index: string]:T;
}

interface UiFrame {
    AddMessage(message: string):void;
}

interface Stub {
    CreateFrame(frameType:string, name?:string, parent?:UiFrame, inheritFrame?:string):UiFrame;
    GetActionInfo(slot: number): {actionType: string, id: number, subType: string }
    GetActionText(slot: number): string;
    GetAuctionItemSubClasses(index:number):LuaTable<number>;
    GetBindingKey(command: string): string;
    GetBonusBarIndex(): number;
    GetEquippedItemType(slot:number):string;
    GetInventoryItemID(unitId:string, invSlot:number):number;
    GetItemInfo(itemId: number): { itemName: string, itemLink: string, itemRarity: number, itemLevel: number, itemMinLevel: number, itemType: string, itemSubType: string, 
        itemStackCount: number, itemEquipLoc: string, iconFileDataId: number, itemSellPrice: number, itemClassId: number, itemSubClassId: number }
    GetItemLevel(slot:number):number;
    GetLocale():string;
    GetMacroItem(macro: number): { item: string, link: string }
    GetMacroSpell(macro: number): { name: string, rank: string, id: number }
    GetNormalizedWeaponSpeed(slot:number):number;
    GetNumShapeshiftForms():number;
    GetShapeshiftForm(flag?:boolean):number;
    GetShapeshiftFormInfo(index: number): { icon: string, name: string, active: boolean, castable: boolean }
    GetSpellInfo(id: string|number):{name:string, rank:string, fileId:number, castTime:number, minRange:number, maxRange: number, spellId: number};
    GetTime():number;
    InterfaceOptionsFrame_OpenToCategory(category:string):void;
    UnitCanAttack(attacker: string, attacked: string):boolean;
    UnitClass(unit: string): { classDisplayName: string, className: string, classId: number };
    UnitExists(unit: string): boolean;
    UnitGUID(unit: string): string;
    UnitHasVehicleUI(unit: string): boolean;
    UnitIsDead(unit: string): boolean;
    UnitName(unit:string):string;
   
    INVSLOT_AMMO:number;
    INVSLOT_BACK:number;
    INVSLOT_BODY:number;
    INVSLOT_CHEST:number;
    INVSLOT_FEET:number;
    INVSLOT_FINGER1:number;
    INVSLOT_FINGER2:number;
    INVSLOT_FIRST_EQUIPPED:number;
    INVSLOT_HAND:number;
    INVSLOT_HEAD:number;
    INVSLOT_LAST_EQUIPPED:number;
    INVSLOT_LEGS:number;
    INVSLOT_MAINHAND:number;
    INVSLOT_NECK:number;
    INVSLOT_OFFHAND:number;
    INVSLOT_RANGED:number;
    INVSLOT_SHOULDER:number;
    INVSLOT_TABARD:number;
    INVSLOT_TRINKET1:number;
    INVSLOT_TRINKET2:number;
    INVSLOT_WAIST:number;
    INVSLOT_WRIST:number;
    ITEM_LEVEL:string;

    UIParent: UiFrame;
    DEFAULT_CHAT_FRAME: UiFrame;
    
    assert(condition:boolean):void;
    debugprofilestop():number;
    floor(n:number):number;
    format(format:string, ...parameters:any[]):string;
    formatv(format:string, parameters:LuaTable<any>):string;
    gsub(s: string, pattern: string, replace: string, count?: number):string;
    INFINITY:number;
    ipairs(table:LuaTable<any>):number;
    len(table:LuaTable<any>):number;
    next<T>(table:LuaDictionary<T>|LuaTable<T>):T;
    print(a:string);
    rawset<T>(table:LuaTable<T>, index:number, value:T):void;
    select(index:'#', ...list):number;
    select<T>(index:number, ...list:T[]):T;
    select(index, ...list):any;
    strfind(s:string, pattern: string, initpos?:number, plain?:boolean): { startPos: number, endPos: number };
    strjoin(delimiter:string, ...s: string[]):string;
    strjoinv(delimiter: string, values: LuaTable<string>):string;
    strgsub(s:string, pattern:string, replace:string):string;
    strlen(s:string):number;
    strlower(s: string):string;
    strmatch(string: string, pattern: string, initpos?:number):string[];
    strsub(s: string, startIndex: number, endIndex?:number):string;
    strupper(s:string):string;
    sort<T>(table: LuaTable<T>, comp?:(a:T,b:T)=>boolean):void;
    tconcat<T>(table:LuaTable<T>, separator:string):string;
    tinsert<T>(table:LuaTable<T>, position:number|T, value?:T):void;
    tonumber(s:any, base?:number):number;
    tostring(s:any):string;
    tostringall(...all):LuaTable<string>;
    tostringallv(all:LuaTable<string>):LuaTable<string>;
    tremove<T>(table:LuaTable<T>, index?:number):T;
    type(s:any):string;
    unpack<T>(...s:T[]):T[];
    wipe<T>(t:T):T;
}

declare module "stub" {
    let stub:Stub; 
    export = stub;
}
  

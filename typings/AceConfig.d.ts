interface AceConfig{
    RegisterOptionsTable(appName: string, options: any, title?:string):void;
}

 
declare module "AceConfig-3.0" {
    let aceAddon:AceConfig; 
    export default aceAddon;
}

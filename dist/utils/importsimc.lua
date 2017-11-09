local format = string.format
local __fs = LibStub:GetLibrary("fs", true)
local existsSync = __fs.existsSync
local mkdirSync = __fs.mkdirSync
local readFileSync = __fs.readFileSync
local writeFileSync = __fs.writeFileSync
local readdirSync = __fs.readdirSync
local __Ovale = LibStub:GetLibrary("ovale-ts/Ovale")
local Ovale = __Ovale.Ovale
local eventDispatcher = eventDispatcher
local __Equipment = LibStub:GetLibrary("ovale-ts/Equipment")
local OvaleEquipment = __Equipment.OvaleEquipment
local __SpellBook = LibStub:GetLibrary("ovale-ts/SpellBook")
local OvaleSpellBook = __SpellBook.OvaleSpellBook
local __Stance = LibStub:GetLibrary("ovale-ts/Stance")
local OvaleStance = __Stance.OvaleStance
local __SimulationCraft = LibStub:GetLibrary("ovale-ts/SimulationCraft")
local OvaleSimulationCraft = __SimulationCraft.OvaleSimulationCraft
local __scriptsindex = LibStub:GetLibrary("ovale-ts/scripts/index")
local registerScripts = __scriptsindex.registerScripts
local outputDirectory = "src/scripts"
local profilesDirectory = "c:/Users/Sidoine/Git/simc/profiles/Tier19P"
local root = "../"
local SIMC_CLASS = "deathknight", "demonhunter", "druid", "hunter", "mage", "monk", "paladin", "priest", "rogue", "shaman", "warlock", "warrior"
local function Canonicalize(s)
    local token = "xXxUnDeRsCoReXxX"
    s = s:toLowerCase()
    s = s:replace(Regex("/[\\s\\-\\_\\(\\)\\{\\}\\[\\]]/g"), token)
    s = s:replace(Regex("/\\./g"), "")
    s = s:replace(Regex("/xXxUnDeRsCoReXxX/g"), "_")
    s = s:replace("_+", "_")
    s = s:replace("^_", "")
    s = s:replace("_$", "")
    return s
end
if  not existsSync(outputDirectory) then
    mkdirSync(outputDirectory)
end
do
    for simcClass in SIMC_CLASS do
        local output = 
        local fileName = outputDirectory + "/ovale_" + simcClass + ".ts"
        local file = readFileSync(fileName, {
            encoding = "utf8"
        })
        local lines = file:split("\n")
        local passthrough = true
        for line in lines do
            if passthrough then
                output:push(line)
                if line:indexOf("THE REST OF THIS FILE IS AUTOMATICALLY GENERATED") >= 0 then
                    output:push("// ANY CHANGES MADE BELOW THIS POINT WILL BE LOST.\n")
                    passthrough = false
                end
            else
                break
            end
        end
        writeFileSync(fileName, output:join("\n"))
    end
end
local files = 
do
    local dir = readdirSync(profilesDirectory)
    for name in dir do
        files:push(name)
    end
    files:sort()
end
for filename in files do
    if  not filename:startsWith("generate") then
        local output = 
        local inputName = profilesDirectory + "/" + filename
        local simc = readFileSync(inputName, {
            encoding = "utf8"
        })
        if simc:indexOf("optimal_raid=") < 0 then
            local source, className, specialization
            for line in simc:match(Regex("/[^\\r\\n]+/g")) do
                if  not source then
                    if line:substring(0, 3) == "### " then
                        source = line:substring(4)
                    end
                end
                if  not className then
                    for simcClass in SIMC_CLASS do
                        local length = simcClass.length
                        if line:substring(0, length + 1) == simcClass + "=" then
                            className = simcClass:toUpperCase()
                        end
                    end
                end
                if  not specialization then
                    if line:substring(0, 5) == "spec=" then
                        specialization = line:substring(5)
                    end
                end
                if className and specialization then
                    break
                end
            end
            local config = {
                class = className,
                specialization = specialization
            }
            console:log(filename)
            Ovale.playerGUID = "player"
            Ovale.playerClass = className
            eventDispatcher:DispatchEvent("ADDON_LOADED", "Ovale")
            OvaleEquipment:UpdateEquippedItems()
            OvaleSpellBook:Update()
            OvaleStance:UpdateStances()
            registerScripts()
            local profile = OvaleSimulationCraft:ParseProfile(simc)
            local profileName = profile.annotation.name:substring(1, profile.annotation.name.length - 2)
            local name, desc
            if source then
                desc = format("%s: %s", source, profileName)
            else
                desc = profileName
            end
            name = Canonicalize(desc)
            output:push("")
            output:push("{")
            output:push(format("	const name = \"sc_%s\"", name))
            output:push(format("	const desc = \"[7.0] Simulationcraft: %s\"", desc))
            output:push("	const code = `")
            output:push(OvaleSimulationCraft:Emit(profile, true))
            output:push("`")
            output:push(format("	OvaleScripts.RegisterScript(\"%s\", \"%s\", name, desc, code, \"%s\")", profile.annotation.class, profile.annotation.specialization, "script"))
            output:push("}")
            output:push("")
            local outputFileName = "ovale_" + className:toLowerCase() + ".ts"
            console:log("Appending to " + outputFileName + ": " + name)
            local outputName = outputDirectory + "/" + outputFileName
            writeFileSync(outputName, output:join("\n"), {
                flag = "a"
            })
        end
    end
end
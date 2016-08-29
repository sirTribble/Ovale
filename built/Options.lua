 --[[// Copyright (C) 2012, 2013 Sidoine De Wispelaere.]]--
 --[[// Copyright (C) 2012, 2013, 2014 Johnny C. Lam.]]--
 --[[// See the file LICENSE.txt for copying permission.]]--
local _addonName, _addon = ...
define(_addonName, _addon, "Options", {'Ovale', 'stub', "AceConfig-3.0", "AceConfigDialog-3.0", 'Localization'}, function (__exports, Ovale_1, stub_1, AceConfig_3_0_1, AceConfigDialog_3_0_1, Localization_1)
    local OVALE = "Ovale";
    local OvaleOptions = (function () 
        local OvaleOptions = {}
        OvaleOptions.constructor = function (this)
            this.register = {};
             --[[// AceDB default database.]]--
            this.defaultDB = {
                profile= {
                    check= {},
                    list= {},
                    standaloneOptions= false,
                    apparence= {
                         --[[// Icon group]]--
                        avecCible= false,
                        clickThru= false,
                        enCombat= false,
                        enableIcons= true,
                        hideEmpty= false,
                        hideVehicule= false,
                        margin= 4,
                        offsetX= 0,
                        offsetY= 0,
                        targetHostileOnly= false,
                        verrouille= false,
                        vertical= false,
                         --[[// Icon]]--
                        alpha= 1,
                        flashIcon= true,
                        fontScale= 1,
                        highlightIcon= true,
                        iconScale= 1,
                        numeric= false,
                        raccourcis= true,
                        smallIconScale= 0.8,
                        targetText= "●",
                         --[[// Options]]--
                        iconShiftX= 0,
                        iconShiftY= 0,
                        optionsAlpha= 1,
                         --[[// Two abilities]]--
                        predictif= false,
                        secondIconScale= 1,
                         --[[// Advanced]]--
                        taggedEnemies= false,
                        auraLag= 400,
                    },
                },
            };
             --[[// AceDB options table.]]--
            this.options = {
                type= "group",
                args= {
                    profile= {},
                    apparence= {
                        name= OVALE,
                        type= "group",
                         --[[// Generic getter/setter for options.]]--
                        get= function (info)
                            return Ovale_1.ovale.db.profile.apparence[info[stub_1.len(info)] + 1];
                        end,
                        set= function (info, value)
                            Ovale_1.ovale.db.profile.apparence[info[stub_1.len(info) + 1] + 1] = value;
                             --[[// Pass the name of the parent group as the event parameter.]]--
                            this.SendMessage("Ovale_OptionChanged", info[stub_1.len(info) - 1 + 1]);
                        end,
                        args= {
                            standaloneOptions= {
                                order= 30,
                                name= Localization_1.L["Standalone options"],
                                desc= Localization_1.L["Open configuration panel in a separate, movable window."],
                                type= "toggle",
                                get= function (info)
                                    return Ovale_1.ovale.db.profile.standaloneOptions;
                                end,
                                set= function (info, value)
                                    Ovale_1.ovale.db.profile.standaloneOptions = value;
                                end,
                            },
                            iconGroupAppearance= {
                                order= 40,
                                type= "group",
                                name= Localization_1.L["Groupe d'icônes"],
                                args= {
                                    enableIcons= {
                                        order= 10,
                                        type= "toggle",
                                        name= Localization_1.L["Enabled"],
                                        width= "full",
                                        set= function (info, value)
                                            Ovale_1.ovale.db.profile.apparence.enableIcons = value;
                                            this.SendMessage("Ovale_OptionChanged", "visibility");
                                        end,
                                    },
                                    verrouille= {
                                        order= 10,
                                        type= "toggle",
                                        name= Localization_1.Llock_position,
                                        disabled= function ()
                                            return not Ovale_1.ovale.db.profile.apparence.enableIcons;
                                        end,
                                    },
                                    clickThru= {
                                        order= 20,
                                        type= "toggle",
                                        name= Localization_1.L["Ignorer les clics souris"],
                                        disabled= function ()
                                            return not Ovale_1.ovale.db.profile.apparence.enableIcons;
                                        end,
                                    },
                                    visibility= {
                                        order= 20,
                                        type= "group",
                                        name= Localization_1.Lvisibility,
                                        inline= true,
                                        disabled= function ()
                                            return not Ovale_1.ovale.db.profile.apparence.enableIcons;
                                        end,
                                        args= {
                                            enCombat= {
                                                order= 10,
                                                type= "toggle",
                                                name= Localization_1.L["En combat uniquement"],
                                            },
                                            avecCible= {
                                                order= 20,
                                                type= "toggle",
                                                name= Localization_1.Lshow_wait,
                                            },
                                            targetHostileOnly= {
                                                order= 30,
                                                type= "toggle",
                                                name= Localization_1.L["Cacher si cible amicale ou morte"],
                                            },
                                            hideVehicule= {
                                                order= 40,
                                                type= "toggle",
                                                name= Localization_1.L["Cacher dans les véhicules"],
                                            },
                                            hideEmpty= {
                                                order= 50,
                                                type= "toggle",
                                                name= Localization_1.L["Cacher bouton vide"],
                                            },
                                        },
                                    },
                                    layout= {
                                        order= 30,
                                        type= "group",
                                        name= Localization_1.L["Layout"],
                                        inline= true,
                                        disabled= function ()
                                            return not Ovale_1.ovale.db.profile.apparence.enableIcons;
                                        end,
                                        args= {
                                            moving= {
                                                order= 10,
                                                type= "toggle",
                                                name= Localization_1.L["Défilement"],
                                                desc= Localization_1.L["Les icônes se déplacent"],
                                            },
                                            vertical= {
                                                order= 20,
                                                type= "toggle",
                                                name= Localization_1.Lvertical,
                                            },
                                            offsetX= {
                                                order= 30,
                                                type= "range",
                                                name= Localization_1.L["Horizontal offset"],
                                                desc= Localization_1.L["Horizontal offset from the center of the screen."],
                                                min= -1000, max= 1000,
                                                softMin= -500, softMax= 500, bigStep= 1,
                                            },
                                            offsetY= {
                                                order= 40,
                                                type= "range",
                                                name= Localization_1.L["Vertical offset"],
                                                desc= Localization_1.L["Vertical offset from the center of the screen."],
                                                min= -1000, max= 1000,
                                                softMin= -500, softMax= 500, bigStep= 1,
                                            },
                                            margin= {
                                                order= 50,
                                                type= "range",
                                                name= Localization_1.L["Marge entre deux icônes"],
                                                min= -16, max= 64, step= 1,
                                            },
                                        }
                                    }
                                },
                            },
                            iconAppearance= {
                                order= 50,
                                type= "group",
                                name= Localization_1.L["Icône"],
                                args= {
                                    iconScale= {
                                        order= 10,
                                        type= "range",
                                        name= Localization_1.Licon_scale,
                                        desc= Localization_1.L["La taille des icônes"],
                                        min= 0.5, max= 3, bigStep= 0.01,
                                        isPercent= true,
                                    },
                                    smallIconScale= {
                                        order= 20,
                                        type= "range",
                                        name= Localization_1.Lsmall_icon_scale,
                                        desc= Localization_1.L["La taille des petites icônes"],
                                        min= 0.5, max= 3, bigStep= 0.01,
                                        isPercent= true,
                                    },
                                    fontScale= {
                                        order= 30,
                                        type= "range",
                                        name= Localization_1.Lfont_scale,
                                        desc= Localization_1.L["La taille des polices"],
                                        min= 0.2, max= 2, bigStep= 0.01,
                                        isPercent= true,
                                    },
                                    alpha= {
                                        order= 40,
                                        type= "range",
                                        name= Localization_1.L["Opacité des icônes"],
                                        min= 0, max= 1, bigStep= 0.01,
                                        isPercent= true,
                                    },
                                    raccourcis= {
                                        order= 50,
                                        type= "toggle",
                                        name= Localization_1.L["Raccourcis clavier"],
                                        desc= Localization_1.L["Afficher les raccourcis clavier dans le coin inférieur gauche des icônes"],
                                    },
                                    numeric= {
                                        order= 60,
                                        type= "toggle",
                                        name= Localization_1.L["Affichage numérique"],
                                        desc= Localization_1.L["Affiche le temps de recharge sous forme numérique"],
                                    },
                                    highlightIcon= {
                                        order= 70,
                                        type= "toggle",
                                        name= Localization_1.L["Illuminer l'icône"],
                                        desc= Localization_1.L["Illuminer l'icône quand la technique doit être spammée"],
                                    },
                                    flashIcon= {
                                        order= 80,
                                        type= "toggle",
                                        name= Localization_1.L["Illuminer l'icône quand le temps de recharge est écoulé"],
                                    },
                                    targetText= {
                                        order= 90,
                                        type= "input",
                                        name= Localization_1.L["Caractère de portée"],
                                        desc= Localization_1.L["Ce caractère est affiché dans un coin de l'icône pour indiquer si la cible est à portée"],
                                    },
                                },
                            },
                            optionsAppearance= {
                                order= 60,
                                type= "group",
                                name= Localization_1.L["Options"],
                                args= {
                                    iconShiftX= {
                                        order= 10,
                                        type= "range",
                                        name= Localization_1.L["Décalage horizontal des options"],
                                        min= -256, max= 256, step= 1,
                                    },
                                    iconShiftY= {
                                        order= 20,
                                        type= "range",
                                        name= Localization_1.L["Décalage vertical des options"],
                                        min= -256, max= 256, step= 1,
                                    },
                                    optionsAlpha= {
                                        order= 30,
                                        type= "range",
                                        name= Localization_1.L["Opacité des options"],
                                        min= 0, max= 1, bigStep= 0.01,
                                        isPercent= true,
                                    },
                                },
                            },
                            predictiveIcon= {
                                order= 70,
                                type= "group",
                                name= Localization_1.L["Prédictif"],
                                args= {
                                    predictif= {
                                        order= 10,
                                        type= "toggle",
                                        name= Localization_1.L["Prédictif"],
                                        desc= Localization_1.L["Affiche les deux prochains sorts et pas uniquement le suivant"],
                                    },
                                    secondIconScale= {
                                        order= 20,
                                        type= "range",
                                        name= Localization_1.Lsecond_icon_size,
                                        min= 0.2, max= 1, bigStep= 0.01,
                                        isPercent= true,
                                    },
                                },
                            },
                            advanced= {
                                order= 80,
                                type= "group",
                                name= "Advanced",
                                args= {
                                    taggedEnemies= {
                                        order= 10,
                                        type= "toggle",
                                        name= Localization_1.L["Only count tagged enemies"],
                                        desc= Localization_1.L["Only count a mob as an enemy if it is directly affected by a player's spells."],
                                    },
                                    auraLag= {
                                        order= 20,
                                        type= "range",
                                        name= Localization_1.L["Aura lag"],
                                        desc= Localization_1.L["Lag (in milliseconds) between when an spell is cast and when the affected aura is applied or removed"],
                                        min= 100, max= 700, step= 10,
                                    },
                                },
                            },
                        },
                    },
                    actions= {
                        name= "Actions",
                        type= "group",
                        args= {
                            show= {
                                type= "execute",
                                name= Localization_1.L["Afficher la fenêtre"],
                                guiHidden= true,
                                func= function ()
                                    Ovale_1.ovale.db.profile.apparence.enableIcons = true;
                                    this.SendMessage("Ovale_OptionChanged", "visibility");
                                end
                            },
                            hide= {
                                type= "execute",
                                name= Localization_1.L["Cacher la fenêtre"],
                                guiHidden= true,
                                func= function ()
                                    Ovale_1.ovale.db.profile.apparence.enableIcons = false;
                                    this.SendMessage("Ovale_OptionChanged", "visibility");
                                end
                            },
                            config= {
                                name= "Configuration",
                                type= "execute",
                                func= function () this.ToggleConfig(); end,
                            },
                            refresh= {
                                name= Localization_1.L["Display refresh statistics"],
                                type= "execute",
                                func= function ()
                                    local statistics = Ovale_1.ovale:GetRefreshIntervalStatistics();
                                    Ovale_1.ovale:Print("Refresh intervals: count = %d, avg = %d, min = %d, max = %d (ms)", statistics.count, statistics.avgRefresh, statistics.minRefresh, statistics.maxRefresh);
                                end,
                            },
                        },
                    },
                },
            };
        end;
         --[[// List of registered modules providing options.]]--
        OvaleOptions.OnInitialize = function (this)
            local db = LibStub("AceDB-3.0").New("OvaleDB", this.defaultDB);
            this.options.args.profile = LibStub("AceDBOptions-3.0").GetOptionsTable(db);
            db.RegisterCallback(this, "OnNewProfile", "HandleProfileChanges");
            db.RegisterCallback(this, "OnProfileReset", "HandleProfileChanges");
            db.RegisterCallback(this, "OnProfileChanged", "HandleProfileChanges");
            db.RegisterCallback(this, "OnProfileCopied", "HandleProfileChanges");
            Ovale_1.ovale.db = db;
             --[[// Upgrade saved variables to current format.]]--
            this.UpgradeSavedVariables();
            AceConfig_3_0_1.default:RegisterOptionsTable(OVALE, this.options.args.apparence);
            AceConfig_3_0_1.default:RegisterOptionsTable(OVALE .. " Profiles", this.options.args.profile);
             --[[// Slash commands.]]--
            AceConfig_3_0_1.default:RegisterOptionsTable(OVALE .. " Actions", this.options.args.actions, "Ovale");
            AceConfigDialog_3_0_1.default:AddToBlizOptions(OVALE);
            AceConfigDialog_3_0_1.default:AddToBlizOptions(OVALE .. " Profiles", "Profiles", OVALE);
        end;
        OvaleOptions.OnEnable = function (this)
            this.HandleProfileChanges();
        end;
        OvaleOptions.RegisterOptions = function (this, addon)
            stub_1.tinsert(this.register, addon);
        end;
        OvaleOptions.UpgradeSavedVariables = function (this)
            local profile = Ovale_1.ovale.db.profile;
             --[[// Merge two options that had the same meaning.]]--
            if (profile.display ~= nil and stub_1.type(profile.display) == "boolean") then 
                profile.apparence.enableIcons = profile.display;
                profile.display = nil;
            end
             --[[// The frame position settings changed from left/top to offsetX/offsetY.]]--
            if (profile.left or profile.top) then 
                profile.left = nil;
                profile.top = nil;
                Ovale_1.ovale:OneTimeMessage("The Ovale icon frames position has been reset.");
            end
             --[[// Invoke module-specific upgrade for Saved Variables.]]--
            for local i,_ in ipairs(this.register) do i = i - 1 
                do
                local addon = this.register[i + 1];
                if (addon.UpgradeSavedVariables) then 
                    addon.UpgradeSavedVariables();
                end
                end
            end
             --[[// Re-register defaults so that any tables created during the upgrade are "populated"]]--
             --[[// by the default database automatically.]]--
            Ovale_1.ovale.db.RegisterDefaults(this.defaultDB);
        end;
        OvaleOptions.HandleProfileChanges = function (this)
            this.SendMessage("Ovale_ProfileChanged");
            this.SendMessage("Ovale_ScriptChanged");
        end;
        OvaleOptions.ToggleConfig = function (this)
            if (Ovale_1.ovale.db.profile.standaloneOptions) then 
                local appName = OVALE;
                if (AceConfigDialog_3_0_1.default.OpenFrames[appName + 1]) then 
                    AceConfigDialog_3_0_1.default:Close(appName);
                else 
                    AceConfigDialog_3_0_1.default:Open(appName);
                end
            else 
                stub_1.InterfaceOptionsFrame_OpenToCategory(OVALE);
                 --[[// Invoke the same call twice in a row to workaround a bug with Interface panel]]--
                 --[[// opening without selecting the right category.]]--
                stub_1.InterfaceOptionsFrame_OpenToCategory(OVALE);
            end
        end;
        return OvaleOptions;
    end)();
    __exports.ovaleOptions = Ovale_1.ovale:NewModule("OvaleOptions", __new(OvaleOptions), "AceConsole-3.0", "AceEvent-3.0");
end);

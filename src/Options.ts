
    // Copyright (C) 2012, 2013 Sidoine De Wispelaere.
    // Copyright (C) 2012, 2013, 2014 Johnny C. Lam.
    // See the file LICENSE.txt for copying permission.

// Ovale options and UI

import { ovale } from 'Ovale';
import { tinsert, type, len, InterfaceOptionsFrame_OpenToCategory } from 'stub';
import AceConfig from "AceConfig-3.0";
import AceConfigDialog from "AceConfigDialog-3.0";
import { L } from 'Localization';

var OVALE = "Ovale";
class OvaleOptions implements ModuleEvents {
	SendMessage: (message:string) => void;

	private register: LuaTable<any> = {};
	// AceDB default database.
	defaultDB:any = {
		profile: {
			check: {},
			list: {},
			standaloneOptions: false,
			apparence: {
				// Icon group
				avecCible: false,
				clickThru: false,
				enCombat: false,
				enableIcons: true,
				hideEmpty: false,
				hideVehicule: false,
				margin: 4,
				offsetX: 0,
				offsetY: 0,
				targetHostileOnly: false,
				verrouille: false,
				vertical: false,
				// Icon
				alpha: 1,
				flashIcon: true,
				fontScale: 1,
				highlightIcon: true,
				iconScale: 1,
				numeric: false,
				raccourcis: true,
				smallIconScale: 0.8,
				targetText: "●",
				// Options
				iconShiftX: 0,
				iconShiftY: 0,
				optionsAlpha: 1,
				// Two abilities
				predictif: false,
				secondIconScale: 1,
				// Advanced
				taggedEnemies: false,
				auraLag: 400,
			},
		},
	}

	// AceDB options table.
	options:any = {
		type: "group",
		args: 
		{
			profile: {},
			apparence:
			{
				name: OVALE,
				type: "group",
				// Generic getter/setter for options.
				get: function(info:LuaTable<string>) {
					return ovale.db.profile.apparence[info[len(info)]]
				},
				set: function(info, value) {
					ovale.db.profile.apparence[info[len(info)]] = value
					// Pass the name of the parent group as the event parameter.
					this.SendMessage("Ovale_OptionChanged", info[len(info) - 1])
				},
				args: {
					standaloneOptions: {
						order: 30,
						name: L["Standalone options"],
						desc: L["Open configuration panel in a separate, movable window."],
						type: "toggle",
						get: function(info) {
							return ovale.db.profile.standaloneOptions
						},
						set: function(info, value) {
							ovale.db.profile.standaloneOptions = value
						},
					},
					iconGroupAppearance:
					{
						order: 40,
						type: "group",
						name: L["Groupe d'icônes"],
						args:
						{
							enableIcons: {
								order: 10,
								type: "toggle",
								name: L["Enabled"],
								width: "full",
								set: function(info, value) {
									ovale.db.profile.apparence.enableIcons = value
									this.SendMessage("Ovale_OptionChanged", "visibility")
								},
							},
							verrouille:
							{
								order: 10,
								type: "toggle",
								name: Llock_position,
								disabled: function() {
									return !ovale.db.profile.apparence.enableIcons
								},
							},
							clickThru:
							{
								order: 20,
								type: "toggle",
								name: L["Ignorer les clics souris"],
								disabled: function() {
									return !ovale.db.profile.apparence.enableIcons
								},
							},
							visibility: {
								order: 20,
								type: "group",
								name: Lvisibility,
								inline: true,
								disabled: function() {
									return !ovale.db.profile.apparence.enableIcons
								},
								args: {
									enCombat: {
										order: 10,
										type: "toggle",
										name: L["En combat uniquement"],
									},
									avecCible: {
										order: 20,
										type: "toggle",
										name: Lshow_wait,
									},
									targetHostileOnly: {
										order: 30,
										type: "toggle",
										name: L["Cacher si cible amicale ou morte"],
									},
									hideVehicule: {
										order: 40,
										type: "toggle",
										name: L["Cacher dans les véhicules"],
									},
									hideEmpty: {
										order: 50,
										type: "toggle",
										name: L["Cacher bouton vide"],
									},
								},
							},
							layout: {
								order: 30,
								type: "group",
								name: L["Layout"],
								inline: true,
								disabled: function() {
									return ! ovale.db.profile.apparence.enableIcons
								},
								args: {
									moving: {
										order: 10,
										type: "toggle",
										name: L["Défilement"],
										desc: L["Les icônes se déplacent"],
									},
									vertical: {
										order: 20,
										type: "toggle",
										name: Lvertical,
									},
									offsetX: {
										order: 30,
										type: "range",
										name: L["Horizontal offset"],
										desc: L["Horizontal offset from the center of the screen."],
										min: -1000, max: 1000,
										softMin: -500, softMax: 500, bigStep: 1,
									},
									offsetY: {
										order: 40,
										type: "range",
										name: L["Vertical offset"],
										desc: L["Vertical offset from the center of the screen."],
										min: -1000, max: 1000,
										softMin: -500, softMax: 500, bigStep: 1,
									},
									margin: {
										order: 50,
										type: "range",
										name: L["Marge entre deux icônes"],
										min: -16, max: 64, step: 1,
									},
								}
							}
						},
					},
					iconAppearance:
					{
						order: 50,
						type: "group",
						name: L["Icône"],
						args:
						{
							iconScale:
							{
								order: 10,
								type: "range",
								name: Licon_scale,
								desc: L["La taille des icônes"],
								min: 0.5, max: 3, bigStep: 0.01,
								isPercent: true,
							},
							smallIconScale:
							{
								order: 20,
								type: "range",
								name: Lsmall_icon_scale,
								desc: L["La taille des petites icônes"],
								min: 0.5, max: 3, bigStep: 0.01,
								isPercent: true,
							},
							fontScale:
							{
								order: 30,
								type: "range",
								name: Lfont_scale,
								desc: L["La taille des polices"],
								min: 0.2, max: 2, bigStep: 0.01,
								isPercent: true,
							},
							alpha:
							{
								order: 40,
								type: "range",
								name: L["Opacité des icônes"],
								min: 0, max: 1, bigStep: 0.01,
								isPercent: true,
							},
							raccourcis:
							{
								order: 50,
								type: "toggle",
								name: L["Raccourcis clavier"],
								desc: L["Afficher les raccourcis clavier dans le coin inférieur gauche des icônes"],
							},
							numeric:
							{
								order: 60,
								type: "toggle",
								name: L["Affichage numérique"],
								desc: L["Affiche le temps de recharge sous forme numérique"],
							},
							highlightIcon:
							{
								order: 70,
								type: "toggle",
								name: L["Illuminer l'icône"],
								desc: L["Illuminer l'icône quand la technique doit être spammée"],
							},
							flashIcon:
							{
								order: 80,
								type: "toggle",
								name: L["Illuminer l'icône quand le temps de recharge est écoulé"],
							},
							targetText:
							{
								order: 90,
								type: "input",
								name: L["Caractère de portée"],
								desc: L["Ce caractère est affiché dans un coin de l'icône pour indiquer si la cible est à portée"],
							},
						},
					},
					optionsAppearance:
					{
						order: 60,
						type: "group",
						name: L["Options"],
						args:
						{
							iconShiftX:
							{
								order: 10,
								type: "range",
								name: L["Décalage horizontal des options"],
								min: -256, max: 256, step: 1,
							},
							iconShiftY:
							{
								order: 20,
								type: "range",
								name: L["Décalage vertical des options"],
								min: -256, max: 256, step: 1,
							},
							optionsAlpha:
							{
								order: 30,
								type: "range",
								name: L["Opacité des options"],
								min: 0, max: 1, bigStep: 0.01,
								isPercent: true,
							},
						},
					},
					predictiveIcon:
					{
						order: 70,
						type: "group",
						name: L["Prédictif"],
						args:
						{
							predictif:
							{
								order: 10,
								type: "toggle",
								name: L["Prédictif"],
								desc: L["Affiche les deux prochains sorts et pas uniquement le suivant"],
							},
							secondIconScale:
							{
								order: 20,
								type: "range",
								name: Lsecond_icon_size,
								min: 0.2, max: 1, bigStep: 0.01,
								isPercent: true,
							},
						},
					},
					advanced: {
						order: 80,
						type: "group",
						name: "Advanced",
						args:
						{
							taggedEnemies: {
								order: 10,
								type: "toggle",
								name: L["Only count tagged enemies"],
								desc: L["Only count a mob as an enemy if it is directly affected by a player's spells."],
							},
							auraLag:
							{
								order: 20,
								type: "range",
								name: L["Aura lag"],
								desc: L["Lag (in milliseconds) between when an spell is cast and when the affected aura is applied or removed"],
								min: 100, max: 700, step: 10,
							},
						},
					},
				},
			},
			actions:
			{
				name: "Actions",
				type: "group",
				args: 
				{
					show:
					{
						type: "execute",
						name: L["Afficher la fenêtre"],
						guiHidden: true,
						func: function(){
							ovale.db.profile.apparence.enableIcons = true
							this.SendMessage("Ovale_OptionChanged", "visibility")
						}
					},
					hide:
					{
						type: "execute",
						name: L["Cacher la fenêtre"],
						guiHidden: true,
						func: function() {
							ovale.db.profile.apparence.enableIcons = false
							this.SendMessage("Ovale_OptionChanged", "visibility")
						}
					},
					config: 
					{
						name: "Configuration",
						type: "execute",
						func: function() { this.ToggleConfig() },
					},
					refresh: {
						name: L["Display refresh statistics"],
						type: "execute",
						func: function() {
							var statistics = ovale.GetRefreshIntervalStatistics();
							ovale.Print("Refresh intervals: count = %d, avg = %d, min = %d, max = %d (ms)", statistics.count, statistics.avgRefresh, statistics.minRefresh, statistics.maxRefresh)
						},
					},
				},
			},
		},
	}
		
	// List of registered modules providing options.
	OnInitialize() {
		var  db = LibStub("AceDB-3.0").New("OvaleDB", this.defaultDB)
		this.options.args.profile = LibStub("AceDBOptions-3.0").GetOptionsTable(db)

		db.RegisterCallback( this, "OnNewProfile", "HandleProfileChanges" )
		db.RegisterCallback( this, "OnProfileReset", "HandleProfileChanges" )
		db.RegisterCallback( this, "OnProfileChanged", "HandleProfileChanges" )
		db.RegisterCallback( this, "OnProfileCopied", "HandleProfileChanges" )

		ovale.db = db

		// Upgrade saved variables to current format.
		this.UpgradeSavedVariables()

		AceConfig.RegisterOptionsTable(OVALE, this.options.args.apparence)
		AceConfig.RegisterOptionsTable(OVALE + " Profiles", this.options.args.profile)
		// Slash commands.
		AceConfig.RegisterOptionsTable(OVALE + " Actions", this.options.args.actions, "Ovale")

		AceConfigDialog.AddToBlizOptions(OVALE)
		AceConfigDialog.AddToBlizOptions(OVALE + " Profiles", "Profiles", OVALE)
	}

	OnEnable() {
		this.HandleProfileChanges()
	}

	RegisterOptions(addon: any) {
		tinsert(this.register, addon)
	}

	UpgradeSavedVariables() {
		var  profile = ovale.db.profile

		// Merge two options that had the same meaning.
		if (profile.display != null && type(profile.display) == "boolean") {
			profile.apparence.enableIcons = profile.display
			profile.display = null
		}

		// The frame position settings changed from left/top to offsetX/offsetY.
		if (profile.left || profile.top){
			profile.left = null
			profile.top = null
			ovale.OneTimeMessage("The Ovale icon frames position has been reset.")
		}

		// Invoke module-specific upgrade for Saved Variables.
		for (var i in this.register) {
			var addon = this.register[i];
			if (addon.UpgradeSavedVariables) {
				addon.UpgradeSavedVariables()
			}
		}

		// Re-register defaults so that any tables created during the upgrade are "populated"
		// by the default database automatically.
		ovale.db.RegisterDefaults(this.defaultDB)
	}

	HandleProfileChanges() {
		this.SendMessage("Ovale_ProfileChanged")
		this.SendMessage("Ovale_ScriptChanged")
	}

	ToggleConfig(){
		if (ovale.db.profile.standaloneOptions) {
			var appName = OVALE
			if (AceConfigDialog.OpenFrames[appName]){
				AceConfigDialog.Close(appName)
			} else {
				AceConfigDialog.Open(appName)
			}
		} else {
			InterfaceOptionsFrame_OpenToCategory(OVALE)
			// Invoke the same call twice in a row to workaround a bug with Interface panel
			// opening without selecting the right category.
			InterfaceOptionsFrame_OpenToCategory(OVALE)
		}
	}
}

export const ovaleOptions = ovale.NewModule("OvaleOptions", new OvaleOptions(), "AceConsole-3.0", "AceEvent-3.0")

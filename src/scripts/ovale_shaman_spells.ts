import { OvaleScripts } from "../Scripts";
export function register() {
    let name = "ovale_shaman_spells";
    let desc = "[8.0] Ovale: Shaman spells";
    let code = `

# Alias
SpellList(lava_burst_nocd ascendance_elemental_buff lava_surge_buff)

# Spells
Define(ancestral_guidance 108281)
	SpellInfo(ancestral_guidance cd=120)
	SpellAddBuff(ancestral_guidance ancestral_guidance_buff=1)
Define(ancestral_guidance_buff 108281)
	SpellInfo(ancestral_guidance_buff duration=10)
Define(ancestral_protection_totem 207399)
	SpellInfo(ancestral_protection_totem cd=300)
Define(ancestral_spirit 2008)
Define(ancestral_vigor_buff 207400)
	SpellInfo(ancestral_vigor_buff duration=10)
Define(ancestral_vision 212048)
Define(ascendance_elemental 114050)
	SpellInfo(ascendance_elemental cd=180)
	SpellAddBuff(ascendance_elemental ascendance_elemental_buff=1)
Define(ascendance_elemental_buff 114050)
	SpellInfo(ascendance_elemental_buff duration=15)
Define(ascendance_enhancement 114051)
	SpellInfo(ascendance_enhancement cd=180)
	SpellAddBuff(ascendance_enhancement ascendance_enhancement_buff=1)
Define(ascendance_enhancement_buff 114051)
	SpellInfo(ascendance_enhancement_buff duration=15)
Define(ascendance_restoration 114052)
	SpellInfo(ascendance_restoration cd=180)
Define(ascendance_restoration_buff 114052)
	SpellInfo(ascendance_restoration_buff duration=15)
Define(astral_recall 556)
	SpellInfo(astral_recall cd=600)
Define(astral_shift 108271)
	SpellInfo(astral_shift cd=90 gdc=0 offgcd=1)
	SpellAddBuff(astral_shift astral_shift_buff=1)
Define(astral_shift_buff 108271)
	SpellInfo(astral_shift_buff duration=8)
Define(bloodlust 2825)
	SpellInfo(bloodlust cd=300 gcd=0 offgcd=1)
	SpellAddBuff(bloodlust bloodlust_buff=1)
Define(bloodlust_buff 2825)
	SpellInfo(bloodlust_buff duration=40)
Define(capacitor_totem 192058)
	SpellInfo(capacitor_totem cd=60 interrupt=1)
Define(chain_heal 1064)
	SpellAddBuff(chain_heal tidal_waves_buff=1)
	SpellAddBuff(chain_heal ancestral_vigor_buff=1 talent=ancestral_vigor_talent)
Define(chain_lightning_restoration 421)	
Define(chain_lightning 188443)
	SpellInfo(chain_lightning maelstrom=-4)
	SpellRequire(chain_lightning replace lava_beam=buff,ascendance_elemental_buff)
	SpellAddBuff(chain_lightning stormkeeper_buff=-1 talent=stormkeeper_talent)
	SpellAddBuff(chain_lightning master_of_the_elements_buff=-1 talent=master_of_the_elements_talent specialization=elemental)
Define(cleanse_spirit 51886)
	SpellInfo(cleanse_spirit cd=8)
Define(cloudburst_totem 157153)
	SpellInfo(cloudburst_totem cd=30)
Define(crash_lightning 187874)
	SpellInfo(crash_lightning maelstrom=20 cd=6 cd_haste=melee)
	SpellAddBuff(crash_lightning gathering_storms_buff=1)
Define(crash_lightning_buff 187878)
Define(downpour 207778)
Define(earth_elemental 198103)
	SpellInfo(earth_elemental cd=300)
Define(earth_shield 974)
	SpellAddTargetBuff(earth_shield earth_shield_buff=9)
Define(earth_shield_buff 974)
	SpellInfo(earth_shield_buff duration=600 max_charges=9)
Define(earth_shock 8042)
	SpellInfo(earth_shock maelstrom=60)
	SpellAddTargetDebuff(earth_shock exposed_elements_debuff=1)
	SpellAddBuff(earth_shock master_of_the_elements_buff=-1 talent=master_of_the_elements_talent specialization=elemental)
Define(earthbind_totem 2484)
	SpellInfo(earthbind_totem cd=30)
Define(earthen_wall_buff 201633)
Define(earthen_wall_totem 198838)
	SpellInfo(earthen_wall_totem cd=60)
Define(earthen_spike 188089)
	SpellInfo(earthen_spike cd=20 maelstrom=20)
	SpellAddTargetDebuff(earthen_spike earthen_spike_debuff=1)
Define(earthen_spike_debuff 188089)
	SpellInfo(earthen_spike_debuff duration=10)
Define(earthen_wall_totem 198838)
Define(earthgrab_totem 51485)
	SpellInfo(earthgrab_totem cd=30)
Define(earthquake 61882)
	SpellInfo(earthquake maelstrom=60)
Define(earthquake_debuff 182387)
Define(elemental_blast 117014)  
	SpellInfo(elemental_blast cd=12 travel_time=1)
	SpellAddBuff(elemental_blast master_of_the_elements_buff=-1 talent=master_of_the_elements_talent specialization=elemental)
Define(elemental_blast_crit_buff 118522)
	SpellInfo(elemental_blast_crit_buff duration=10)
Define(elemental_blast_haste_buff 173183)
	SpellInfo(elemental_blast_haste_buff duration=10)
Define(elemental_blast_mastery_buff 173184)
	SpellInfo(elemental_blast_mastery_buff duration=10)
Define(exposed_elements_debuff 269808)
	SpellInfo(exposed_elements_debuff duration=15)
Define(far_sight 6196)
Define(feral_lunge 196884)
	SpellInfo(feral_lunge cd=30)
Define(feral_spirit 51533)
	SpellInfo(feral_spirit cd=120 duration=15)
	SpellInfo(feral_spirit add_cd=-30 talent=elemental_spirits_talent)
	SpellAddBuff(feral_spirit icy_edge_buff=1)
	SpellAddBuff(feral_spirit molten_weapon_buff=1)
Define(fire_elemental 198067)
	SpellInfo(fire_elemental cd=150)
	SpellInfo(fire_elemental replace=storm_elemental talent=storm_elemental_talent)
Define(flame_shock 188389)
	SpellInfo(flame_shock cd=6)
	SpellAddTargetDebuff(flame_shock flame_shock_debuff=1)
Define(flame_shock_debuff 188389)
	SpellInfo(flame_shock_debuff duration=18 haste=spell tick=2)
Define(flame_shock_restoration 188838)
	SpellInfo(flame_shock_restoration cd=6)
Define(flame_shock_restoration_debuff 188389)
	SpellInfo(flame_shock_restoration_debuff duration=21 haste=spell tick=3)
Define(flametongue 193796)
	SpellInfo(flametongue cd=12 cd_haste=melee)
	SpellAddBuff(flametongue flametongue_buff=1)
	SpellAddTargetDebuff(flametongue searing_assault_debuff=1 talent=searing_assault_talent)
Define(flametongue_buff 193796)
	SpellInfo(flametongue_buff duration=16)
Define(frost_shock 196840)
	SpellAddTargetDebuff(frost_shock frost_shock_debuff=1)
	SpellAddBuff(frost_shock icefury_buff=-1)
	SpellAddBuff(frost_shock master_of_the_elements_buff=-1 talent=master_of_the_elements_talent specialization=elemental)
Define(frost_shock_debuff 196840)
	SpellInfo(frost_shock_debuff duration=6)
Define(frostbrand 196834)
	SpellInfo(frostbrand maelstrom=20)
	SpellAddBuff(frostbrand frostbrand_buff=1)
Define(frostbrand_buff 196834)
	SpellInfo(flametongue_buff duration=16)
Define(fury_of_air 197211)
	SpellInfo(fury_of_air maelstrom=3)
	SpellAddBuff(fury_of_air fury_of_air_buff=1)
	SpellAddTargetDebuff(fury_of_air fury_of_air_debuff=1)
	SpellRequire(fury_of_air unusable 1=buff,fury_of_air_buff)
Define(fury_of_air_buff 197211)
Define(fury_of_air_debuff 197385)
	SpellInfo(fury_of_air_debuff duration=3)
Define(gathering_storms_buff 198300)
	SpellInfo(gathering_storms_buff duration=10)
Define(ghost_wolf 2645)
	SpellAddBuff(ghost_wolf ghost_wolf_buff=1)
Define(ghost_wolf_buff 2645)
Define(healing_rain 73920)
	SpellInfo(healing_rain cd=10)
	SpellAddBuff(healing_rain healing_rain_buff=1)
Define(healing_rain_buff 73920)
	SpellInfo(healing_rain_buff duration=10)
Define(healing_stream_totem 5394)
	SpellInfo(healing_stream_totem cd=30)
	SpellInfo(healing_stream_totem charges=2 talent=resto_echo_of_the_elements_talent)
Define(healing_surge 188070)
Define(healing_surge_restoration 8004)
	SpellAddBuff(healing_surge_restoration ancestral_vigor_buff=1 talent=ancestral_vigor_talent)
Define(healing_tide_totem 108280)
	SpellInfo(healing_tide_totem cd=60)
Define(healing_wave 77472)
	SpellAddBuff(healing_wave tidal_waves_buff=-1)
	SpellAddBuff(healing_wave ancestral_vigor_buff=1 talent=ancestral_vigor_talent)
Define(heroism 32182)
	SpellInfo(heroism cd=300 gcd=0)
	SpellAddBuff(heroism heroism_buff=1)
Define(heroism_buff 32182)
	SpellInfo(heroism_buff duration=40)
Define(hex 51514)
	SpellInfo(hex cd=30)
	SpellAddTargetDebuff(hex hex_debuff=1)
Define(hex_debuff 51514)
	SpellInfo(hex_debuff duration=60)
Define(hot_hand_buff 215785)
	SpellInfo(hot_hand_buff duration=15)
Define(icefury 210714)
	SpellInfo(icefury maelstrom=-15 cd=30)
	SpellAddBuff(icefury icefury_buff=4)
	SpellAddBuff(icefury master_of_the_elements_buff=-1 talent=master_of_the_elements_talent specialization=elemental)
Define(icefury_buff 210714)
	SpellInfo(icefury_buff duration=15)
Define(icy_edge_buff 224126)
    SpellInfo(icy_edge_buff duration=15)
Define(landslide_buff 202004)
	SpellInfo(landslide_buff duration=10)
Define(lava_beam 114074)
	SpellInfo(lava_beam maelstrom=-3)
	SpellRequire(lava_beam unusable 1=buff,!ascendance_elemental_buff)
Define(lava_burst 51505)
	SpellInfo(lava_burst cd=8 travel_time=1 maelstrom=-10 charges=1)
	SpellInfo(lava_burst charges=2 talent=echo_of_the_elements_talent specialization=elemental)
	SpellInfo(lava_burst charges=2 talent=resto_echo_of_the_elements_talent specialization=restoration)
	SpellAddBuff(lava_burst master_of_the_elements_buff=1 talent=master_of_the_elements_talent specialization=elemental)
	SpellRequire(lava_burst cd_percent 0=buff,lava_burst_nocd)
Define(lava_lash 60103)
	SpellInfo(lava_lash maelstrom=40)
	SpellRequire(lava_lash maelstrom_percent 0=buff,hot_hand_buff)
Define(lava_surge_buff 77762)
	SpellInfo(lava_surge_buff duration=10)
Define(lightning_bolt_elemental 188196)
	SpellInfo(lightning_bolt_elemental maelstrom=-8 cd=0)
	SpellAddBuff(lightning_bolt_elemental stormkeeper_buff=-1 talent=stormkeeper_talent)
	SpellAddTargetDebuff(lightning_bolt_elemental exposed_elements_debuff=0 talent=exposed_elements_talent)
	SpellAddBuff(lightning_bolt_elemental master_of_the_elements_buff=-1 talent=master_of_the_elements_talent specialization=elemental)
Define(lightning_bolt_enhancement 187837)
	SpellInfo(lightning_bolt_enhancement cd=12 cd_haste=melee)
	SpellInfo(lightning_bolt_enhancement maelstrom=0 max_maelstrom=40 talent=overcharge_talent)
Define(lightning_bolt 403)
Define(lightning_crash_buff 187874)
Define(lightning_rod_debuff 197209)
Define(lightning_shield 192106)
	SpellAddBuff(lightning_shield lightning_shield_buff=1)
	SpellRequire(lightning_shield unusable 1=buff,lightning_shield_buff)
Define(lightning_shield_buff 192106)
	SpellInfo(lightning_shield_buff duration=3600)
Define(liquid_magma_totem 192222)
	SpellInfo(liquid_magma_totem cd=60)
Define(master_of_the_elements_buff 260734)
	SpellInfo(master_of_the_elements_buff duration=15)
Define(molten_weapon_buff 224125)
    SpellInfo(molten_weapon_buff duration=15)
Define(purge 370)
Define(purify_spirit 77130)
	SpellInfo(purify_spirit cd=8)
Define(resurgence 16196)
Define(riptide 61295)
	SpellInfo(riptide cd=6)
	SpellInfo(riptide charges=2 talent=resto_echo_of_the_elements_talent)
	SpellAddTargetBuff(riptide riptide_buff=1)
	SpellAddBuff(riptide tidal_waves_buff=1)
	SpellAddBuff(riptide ancestral_vigor_buff=1 talent=ancestral_vigor_talent)
Define(riptide_buff 61295)
	SpellInfo(riptide_buff duration=18 tick=3 haste=spell)
Define(rockbiter 193786)
	SpellInfo(rockbiter maelstrom=-25 charges=2 cd=6 cd_haste=melee)
	SpellInfo(rockbiter cd=5.1 talent=boulderfist_talent)
Define(searing_assault_debuff 268429)
	SpellInfo(searing_assault_debuff duration=6)
Define(spirit_link_totem 98008)
	SpellInfo(spirit_link_totem cd=180)
Define(spirit_link_totem_buff 98008)
Define(spirit_walk 58875)
	SpellInfo(spirit_walk cd=60)
Define(spirit_wolf_buff 260881)
Define(spiritwalkers_grace 79206)
	SpellInfo(spiritwalkers_grace cd=120)
	SpellInfo(spiritwalkers_grace add_cd=-60 talent=graceful_spirit_talent)
Define(spiritwalkers_grace_buff 79206)
	SpellInfo(spiritwalkers_grace_buff duration=15)
Define(storm_elemental 192249)
	SpellInfo(storm_elemental cd=150)
Define(stormbringer 201845)
Define(stormbringer_buff 201846)
	SpellInfo(stormbringer_buff duration=12)
Define(stormkeeper 191634)
	SpellInfo(stormkeeper cd=60)
	SpellAddBuff(stormkeeper stormkeeper_buff=2)
Define(stormkeeper_buff 191634)
	SpellInfo(stormkeeper_buff duration=15)
Define(stormstrike 17364)
	SpellInfo(stormstrike cd=9 cd_haste=melee maelstrom=30)
	SpellAddBuff(stormstrike gathering_storms_buff=-1)
	SpellAddBuff(stormstrike stormbringer_buff=-1)
	SpellRequire(stormstrike replace windstrike=buff,ascendance_enhancement_buff)
	SpellRequire(stormstrike cd_percent 0=buff,stormbringer_buff)
	SpellRequire(stormstrike maelstrom_percent 0=buff,stormbringer_buff)
Define(sundering 197214)
	SpellInfo(sundering maelstrom=20 cd=40 tag=main)
Define(thunderstorm 51490)
	SpellInfo(thunderstorm cd=45)
Define(tidal_waves 51564)
Define(tidal_waves_buff 53390)
	SpellInfo(tidal_waves_buff duration=15 max_stacks=2)
Define(totem_mastery_elemental 210643)
	SpellAddBuff(totem_mastery_elemental ele_resonance_totem_buff=1)
	SpellAddBuff(totem_mastery_elemental ele_tailwind_totem_buff=1)
	SpellAddBuff(totem_mastery_elemental ele_ember_totem_buff=1)
	SpellAddBuff(totem_mastery_elemental ele_strom_totem_buff=1)
Define(totem_mastery_enhancement 262395)
	SpellAddBuff(totem_mastery_enhancement enh_resonance_totem_buff=1)
	SpellAddBuff(totem_mastery_enhancement enh_tailwind_totem_buff=1)
	SpellAddBuff(totem_mastery_enhancement enh_ember_totem_buff=1)
	SpellAddBuff(totem_mastery_enhancement enh_strom_totem_buff=1)
Define(tremor_totem 8143)
	SpellInfo(tremor_totem cd=60)
Define(unleash_life 73685)
	SpellInfo(unleash_life cd=15)
Define(unleash_life_buff 73685)
	SpellInfo(unleash_life_buff duration=10)
Define(unlimited_power_buff 272737)
Define(water_walking 546)
	SpellAddBuff(water_walking water_walking_buff=1)
Define(water_walking_buff 546)
	SpellInfo(water_walking_buff duration=600)
Define(wellspring 197995)
	SpellInfo(wellspring cd=20)
Define(wind_gust_buff 263806)
Define(wind_rush_totem 192077)
	SpellInfo(wind_rush_totem cd=120)
	SpellAddBuff(wind_rush_totem wind_rush_totem_buff=1)
Define(wind_rush_totem_buff 192082)
	SpellInfo(wind_rush_totem_buff duration=5)
Define(wind_shear 57994)
	SpellInfo(wind_shear cd=12 gcd=0 offgcd=1 interrupt=1)
Define(windstrike 115356)
	SpellInfo(windstrike maelstrom=10 cd=3 cd_haste=melee)
	SpellRequire(windstrike unusable 1=buff,!ascendance_enhancement_buff)
	SpellAddBuff(windstrike stormbringer_buff=-1)
	SpellRequire(windstrike cd_percent 0=buff,stormbringer_buff)
	SpellRequire(windstrike maelstrom_percent 0=buff,stormbringer_buff)

# Totems Buffs
Define(ele_resonance_totem_buff 202192)
	SpellInfo(resonance_totem_buff duration=120)
Define(ele_tailwind_totem_buff 210659)
	SpellInfo(tailwind_totem_buff duration=120)
Define(ele_ember_totem_buff 210658)
	SpellInfo(ember_totem_buff duration=120)
Define(ele_strom_totem_buff 210652)
	SpellInfo(strom_totem_buff duration=120)

Define(enh_resonance_totem_buff 262417)
	SpellInfo(resonance_totem_buff duration=120)
Define(enh_tailwind_totem_buff 262400)
	SpellInfo(tailwind_totem_buff duration=120)
Define(enh_ember_totem_buff 262399)
	SpellInfo(ember_totem_buff duration=120)
Define(enh_strom_totem_buff 262397)
	SpellInfo(strom_totem_buff duration=120)

# Legendary items
Define(echoes_of_the_great_sundering_item 137074)
Define(echoes_of_the_great_sundering_buff 208723)
	SpellAddBuff(earthquake echoes_of_the_great_sundering_buff=0)
	SpellRequire(earthquake maelstrom_percent 0=buff,echoes_of_the_great_sundering_buff)
Define(smoldering_heart 151819)
Define(the_deceivers_blood_pact 137035)

# Talents
Define(aftershock_talent 4)
Define(ancestral_guidance_talent 14)
Define(ancestral_protection_totem_talent 12)
Define(ancestral_vigor_talent 10)
Define(ascendance_talent 21)
Define(boulderfist_talent 1)
Define(cloudburst_totem_talent 18)
Define(crashing_storm_talent 16)
Define(deluge_talent 5)
Define(downpour_talent 17)
Define(earth_shield_talent 8)
Define(earth_shield_talent_restoration 6)
Define(earthen_rage_talent 16)
Define(earthen_spike_talent 20)
Define(earthen_wall_totem_talent 11)
Define(earthgrab_totem_talent 8)
Define(echo_of_the_elements_talent 2)
Define(resto_echo_of_the_elements_talent 4)
Define(elemental_blast_talent 3)
Define(elemental_spirits_talent 19)
Define(exposed_elements_talent 1)
Define(feral_lunge_talent 14)
Define(flash_flood_talent 16)
Define(forceful_winds_talent 5)
Define(fury_of_air_talent 17)
Define(graceful_spirit_talent 14)
Define(hailstorm_talent 11)
Define(high_tide_talent 19)
Define(high_voltage_talent 10)
Define(hot_hand_talent 2)
Define(icefury_talent 18)
Define(landslide_talent 4)
Define(lightning_shield_talent 3)
Define(liquid_magma_totem_talent 12)
Define(master_of_the_elements_talent 5)
Define(natures_guardian_talent 13)
Define(overcharge_talent 12)
Define(primal_elementalist_talent 17)
Define(searing_assault_talent 10)
Define(spirit_wolf_talent 7)
Define(static_charge_talent 9)
Define(storm_elemental_talent 11)
Define(stormkeeper_talent 20)
Define(sundering_talent 18)
Define(torrent_talent 1)
Define(totem_mastery_talent 6)
Define(undulation_talent 2)
Define(unleash_life_talent 3)
Define(unlimited_power_talent 19)
Define(wellspring_talent 20)
Define(wind_rush_totem_talent 15)

`;
    OvaleScripts.RegisterScript("SHAMAN", undefined, name, desc, code, "include");
}

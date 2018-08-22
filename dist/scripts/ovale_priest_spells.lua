local __exports = LibStub:NewLibrary("ovale/scripts/ovale_priest_spells", 80000)
if not __exports then return end
local __Scripts = LibStub:GetLibrary("ovale/Scripts")
local OvaleScripts = __Scripts.OvaleScripts
__exports.register = function()
    local name = "ovale_priest_spells"
    local desc = "[8.0] Ovale: Priest spells"
    local code = [[Define(berserking 26297)
# Increases your haste by s1 for d.
  SpellInfo(berserking cd=180 duration=10 gcd=0 offgcd=1)
  # Haste increased by s1.
  SpellAddBuff(berserking berserking=1)
Define(dark_ascension 280711)
# Immediately activates a new Voidform, then releases an explosive blast of pure void energy, causing 280800s1*2 Shadow damage to all enemies within a1 yds of your target.rnrn|cFFFFFFFFGenerates s2/100 Insanity.|r
  SpellInfo(dark_ascension cd=60 talent=dark_ascension_talent)
Define(dark_void 263346)
# Unleashes an explosion of dark energy around the target, dealing s1 Shadow damage and applying Shadow Word: Pain to all nearby enemies.rnrn|cFFFFFFFFGenerates s2/100 Insanity.|r
  SpellInfo(dark_void cd=30 talent=dark_void_talent insanity=-3000)
Define(mind_blast 8092)
# Blasts the target's mind for s1 Shadow damage.?a185916[rnrn|cFFFFFFFFGenerates /100;s2 Insanity.|r][]
  SpellInfo(mind_blast cd=7.5 insanity=-1200)
Define(mind_flay 15407)
# Assaults the target's mind with Shadow energy, causing o1 Shadow damage over d and slowing their movement speed by s2.?a185916[rnrn|cFFFFFFFFGenerates s4*m3/100 Insanity over the duration.|r][]
  SpellInfo(mind_flay duration=3 channel=3 tick=0.75)
  # Movement speed slowed by s2 and taking Shadow damage every t1 sec.
  SpellAddTargetDebuff(mind_flay mind_flay=1)
  # Movement speed slowed by s2 and taking Shadow damage every t1 sec.
  SpellAddBuff(mind_flay mind_flay=1)
Define(mind_sear 48045)
# Corrosive shadow energy radiates from the target, dealing 49821m2*s2 Shadow damage over 48045d to all enemies within 49821a2 yards of the target.rnrn|cFFFFFFFFGenerates s2*208232m1/100 Insanity over the duration per target hit.|r
  SpellInfo(mind_sear duration=3 channel=3 tick=0.75)
Define(mindbender 123040)
# Summons a Mindbender to attack the target for d. You regenerate 123051m1/100.1 of maximum mana each time the Mindbender attacks.
  SpellInfo(mindbender cd=60 duration=12 talent=mindbender_talent)
Define(rising_death 252346)
# Chance to create multiple potions.
  SpellInfo(rising_death gcd=0 offgcd=1)
Define(shadow_crash 205385)
# Hurl a bolt of slow-moving Shadow energy at the destination, dealing 205386s1 Shadow damage to all targets within 205386A1 yards.rnrn|cFFFFFFFFGenerates /100;s2 Insanity.|r
  SpellInfo(shadow_crash cd=20 talent=shadow_crash_talent insanity=-2000)
Define(shadow_word_death 190719)
  SpellInfo(shadow_word_death channel=0 gcd=0 offgcd=1)
  SpellAddBuff(shadow_word_death shadow_word_death=1)
Define(shadow_word_pain 589)
# A word of darkness that causes s1 Shadow damage instantly, and an additional o2 Shadow damage over d.?a185916[rnrn|cFFFFFFFFGenerates m3/100 Insanity.|r][]
  SpellInfo(shadow_word_pain duration=16 insanity=-400 tick=2)
  # Suffering w2 Shadow damage every t2 sec.
  SpellAddTargetDebuff(shadow_word_pain shadow_word_pain=1)
Define(shadow_word_void 205351)
# Blasts the target with a word of void for s1 Shadow damage.?a185916[rnrn|cFFFFFFFFGenerates /100;s2 Insanity.|r][]
  SpellInfo(shadow_word_void cd=9 talent=shadow_word_void_talent insanity=-1500)
Define(shadowform 232698)
# Assume a Shadowform, increasing your spell damage dealt by s1, and reducing your Physical damage taken by s2.
  SpellInfo(shadowform)
  # Spell damage dealt increased by s1.rnPhysical damage taken reduced by s2.
  SpellAddBuff(shadowform shadowform=1)
  # Spell damage dealt increased by s1.rnPhysical damage taken reduced by s2.
  SpellAddTargetDebuff(shadowform shadowform=1)
Define(surrender_to_madness 193223)
# All your Insanity-generating abilities generate s1 more Insanity and you can cast while moving for d.rnrnThen, you take damage equal to s3 of your maximum health and cannot generate Insanity for 263406d.
  SpellInfo(surrender_to_madness cd=240 duration=60 talent=surrender_to_madness_talent)
  # Generating s1 more Insanity.
  SpellAddBuff(surrender_to_madness surrender_to_madness=1)
Define(vampiric_touch 34914)
# A touch of darkness that causes 34914o2 Shadow damage over 34914d, and heals you for e2*100 of damage dealt.rnrnIf Vampiric Touch is dispelled, the dispeller flees in Horror for 87204d.rnrn|cFFFFFFFFGenerates m3/100 Insanity.|r
  SpellInfo(vampiric_touch duration=21 insanity=-600 tick=3)
  # Suffering w2 Shadow damage every t2 sec.
  SpellAddTargetDebuff(vampiric_touch vampiric_touch=1)
Define(void_bolt 228266)
# For the duration of Voidform, your Void Eruption ability is replaced by Void Bolt:rnrn@spelltooltip205448
  SpellInfo(void_bolt channel=0 gcd=0 offgcd=1)
  SpellAddBuff(void_bolt void_bolt=1)
Define(void_eruption 228260)
# Releases an explosive blast of pure void energy, activating Voidform and causing 228360s1*2 Shadow damage to all enemies within a1 yds of your target.rnrnDuring Voidform, this ability is replaced by Void Bolt.rnrn|cFFFFFFFFRequires C/100 Insanity to activate.|r
  SpellInfo(void_eruption insanity=9000)
Define(void_torrent 205065)
# Raise your dagger into the sky, channeling a torrent of void energy into the target for o Shadow damage over d. Insanity does not drain during this channel.rnrnRequires Voidform.
  SpellInfo(void_torrent cd=60 duration=4 channel=4 tick=1)
  # Dealing s1 Shadow damage to the target every t sec.rnrnInsanity drain temporarily stopped.
  SpellAddTargetDebuff(void_torrent void_torrent=1)
  # Dealing s1 Shadow damage to the target every t sec.rnrnInsanity drain temporarily stopped.
  SpellAddBuff(void_torrent void_torrent=1)
Define(voidform_buff 218413)
# @spelldesc194249
  SpellInfo(voidform_buff gcd=0 offgcd=1)
  SpellAddBuff(voidform_buff voidform_buff=1)
Define(dark_void_talent 9)
# Unleashes an explosion of dark energy around the target, dealing s1 Shadow damage and applying Shadow Word: Pain to all nearby enemies.rnrn|cFFFFFFFFGenerates s2/100 Insanity.|r
Define(misery_talent 8)
# Vampiric Touch also applies Shadow Word: Pain to the target.
Define(dark_ascension_talent 20)
# Immediately activates a new Voidform, then releases an explosive blast of pure void energy, causing 280800s1*2 Shadow damage to all enemies within a1 yds of your target.rnrn|cFFFFFFFFGenerates s2/100 Insanity.|r
Define(dark_void_talent 9)
# Unleashes an explosion of dark energy around the target, dealing s1 Shadow damage and applying Shadow Word: Pain to all nearby enemies.rnrn|cFFFFFFFFGenerates s2/100 Insanity.|r
Define(mindbender_talent 8)
# Summons a Mindbender to attack the target for d. You regenerate 123051m1/100.1 of maximum mana each time the Mindbender attacks.
Define(shadow_crash_talent 15)
# Hurl a bolt of slow-moving Shadow energy at the destination, dealing 205386s1 Shadow damage to all targets within 205386A1 yards.rnrn|cFFFFFFFFGenerates /100;s2 Insanity.|r
Define(shadow_word_void_talent 3)
# Blasts the target with a word of void for s1 Shadow damage.?a185916[rnrn|cFFFFFFFFGenerates /100;s2 Insanity.|r][]
Define(surrender_to_madness_talent 21)
# All your Insanity-generating abilities generate s1 more Insanity and you can cast while moving for d.rnrnThen, you take damage equal to s3 of your maximum health and cannot generate Insanity for 263406d.
    ]]
    code = code .. [[
# Priest spells and functions.

# Spells

	SpellInfo(dark_ascension insanity=-50 cd=60)
	SpellAddBuff(dark_ascension voidform_buff=1)

	SpellInfo(dark_void cd=30 insanity=-30)
	SpellAddTargetDebuff(dark_void shadow_word_pain_debuff=1)
Define(dispel_magic 528)
Define(dispersion 47585)
	SpellInfo(dispersion cd=120)
	SpellAddBuff(dispersion dispersion_buff=1)
Define(dispersion_buff 47585)
	SpellInfo(dispersion_buff duration=6)
Define(divine_star 110744)
	SpellInfo(divine_star cd=15)
Define(fade 586)
	SpellInfo(fade cd=30)
Define(insanity_drain_stacks_buff 194249)
Define(leap_of_faith 73325)
	SpellInfo(leap_of_faith cd=90)
Define(levitate 1706)
Define(mass_dispel 32375)
	SpellInfo(mass_dispel cd=45)

	SpellInfo(mind_blast cd=7.5 cd_haste=spell insanity=-12 charges=1)
	SpellInfo(mind_blast replace=shadow_word_void talent=shadow_word_void_talent)
	SpellInfo(mind_blast insanity_percent=120 talent=fortress_of_the_mind_talent)
	SpellRequire(mind_blast insanity_percent 200=buff,surrender_to_madness_buff)
	SpellRequire(mind_blast cd 6=buff,voidform_buff)
	SpellAddBuff(mind_blast shadowy_insight_buff=0 talent=shadowy_insight_talent)
Define(mind_bomb 205369)
	SpellInfo(mind_bomb cd=30)
Define(mind_bomb_debuff 205369)
	SpellInfo(mind_bomb_debuff duration=2)
Define(mind_control 605)

	SpellInfo(mind_flay channel=3 insanity=-4 haste=spell)
	SpellInfo(mind_flay insanity_percent=120 talent=fortress_of_the_mind_talent)
	SpellRequire(mind_flay insanity_percent 200=buff,surrender_to_madness_buff)

	SpellInfo(mind_sear channel=3 haste=spell)
Define(mind_vision 2096)

	SpellInfo(mindbender cd=60 tag=main)
	SpellInfo(mindbender replace=shadowfiend talent=!mindbender_talent)
Define(mindbender_discipline 123040)
	SpellInfo(mindbender cd=60 tag=main)
	SpellInfo(mindbender replace=shadowfiend talent=!disc_mindbender_talent)
Define(penance 47540)
	SpellInfo(penance cd=9 channel=2)
Define(power_word_fortitude 21562)
Define(power_word_shield 17)
	SpellInfo(power_word_shield cd=6 cd_haste=spell)
	SpellInfo(power_word_shield cd=0 specialization=discipline)
Define(power_word_solace 129250)	
	SpellInfo(power_word_solace cd=12 cd_haste=spell)
Define(psychic_horror 64044)
	SpellInfo(psychic_horror cd=45)
Define(psychic_scream 8122)
	SpellInfo(psychic_scream cd=60)
	SpellInfo(psychic_scream replace=mind_bomb talent=mind_bomb_talent)
Define(purify_disease 213634)
	SpellInfo(purify_disease cd=8)
Define(purge_the_wicked 204197)
	SpellInfo(purge_the_wicked replace=shadow_word_pain talent=purge_the_wicked_talent specialization=discipline)
	SpellAddTargetDebuff(purge_the_wicked purge_the_wicked_debuff=1)
Define(purge_the_wicked_debuff 204197)
	SpellInfo(purge_the_wicked_debuff duration=20 haste=spell tick=2)
Define(rapture 47536)
	SpellInfo(rapture cd=90)
Define(rapture_buff 47536)
	SpellInfo(rapture_buff duration=10)
Define(resurrection 2006)
Define(schism 214621)
	SpellInfo(schism cd=24)
	SpellAddTargetDebuff(schism schism_debuff=1)
Define(schism_debuff 214621)
	SpellInfo(schism_debuff duration=9)
Define(shackle_undead 9484)

	SpellInfo(shadow_crash cd=20 insanity=-20 tag=shortcd)
	SpellRequire(shadow_crash insanity_percent 200=buff,surrender_to_madness_buff)
Define(shadow_mend 186263)

	SpellInfo(shadow_word_death target_health_pct=20 insanity=-15 cd=9 charges=2)
	SpellRequire(shadow_word_death insanity_percent 200=buff,surrender_to_madness_buff)

	SpellInfo(shadow_word_pain insanity=-4)
	SpellInfo(shadow_word_pain replace=purge_the_wicked talent=!purge_the_wicked_talent specialization=discipline)
	SpellAddTargetDebuff(shadow_word_pain shadow_word_pain_debuff=1)
	SpellRequire(shadow_word_pain insanity_percent 200=buff,surrender_to_madness_buff)
Define(shadow_word_pain_debuff 589)
	SpellInfo(shadow_word_pain_debuff duration=16 haste=spell tick=2)

	SpellInfo(shadow_word_void cd=9 charges=2 insanity=-15 tag=main)
	SpellInfo(shadow_word_void replace=mind_blast talent=!shadow_word_void_talent)
	SpellRequire(shadow_word_void cd 7.5=buff,voidform_buff)
	SpellRequire(shadow_word_void insanity_percent 200=buff,surrender_to_madness_buff)
Define(shadowfiend 34433)
	SpellInfo(shadowfiend cd=180 tag=main)
	SpellInfo(shadowfiend replace=mindbender talent=mindbender_talent specialization=shadow)
	SpellInfo(shadowfiend replace=mindbender_discipline talent=disc_mindbender_talent specialization=discipline)

	SpellRequire(shadowform unusable 1=buff,voidform_buff)
Define(shadowform_buff 232698)
Define(shadowy_insight_buff 124430)
	SpellInfo(shadowy_insight_buff duration=12)
Define(silence 15487)
	SpellInfo(silence cd=45 gcd=0 interrupt=1)
Define(smite 585)

	SpellInfo(surrender_to_madness cd=240)
	SpellAddBuff(surrender_to_madness surrender_to_madness_buff=1)
Define(surrender_to_madness_buff 193223)
	SpellInfo(surrender_to_madness_buff duration=60)
Define(vampiric_embrace 15286)
	SpellInfo(vampiric_embrace cd=120)
	SpellAddBuff(vampiric_embrace vampiric_embrace_buff=1)
Define(vampiric_embrace_buff 15286)
	SpellInfo(vampiric_embrace_buff duration=15)

	SpellInfo(vampiric_touch insanity=-6)
	SpellRequire(vampiric_touch insanity_percent 200=buff,surrender_to_madness_buff)
	SpellAddTargetDebuff(vampiric_touch vampiric_touch_debuff=1)
	SpellAddTargetDebuff(vampiric_touch shadow_word_pain_debuff=1 talent=misery_talent)
Define(vampiric_touch_debuff 34914)
	SpellInfo(vampiric_touch_debuff duration=21 haste=spell tick=3)

	SpellInfo(void_bolt cd=4.5 insanity=-16 cd_haste=spell)
	SpellRequire(void_bolt unusable 1=buff,!voidform_buff)
	SpellRequire(void_bolt insanity_percent 200=buff,surrender_to_madness_buff)
	SpellAddTargetDebuff(void_bolt shadow_word_pain_debuff=refresh)
	SpellAddTargetDebuff(void_bolt vampiric_touch_debuff=refresh)

	SpellInfo(void_eruption insanity=90 shared_cd=void_bolt tag=main)
	SpellInfo(void_eruption insanity=60 talent=legacy_of_the_void_talent)
	SpellAddBuff(void_eruption voidform_buff=1)
	SpellRequire(void_eruption unusable 1=buff,voidform_buff)
	SpellRequire(void_eruption replace void_bolt=buff,voidform_buff)

	SpellInfo(void_torrent cd=60 tag=main unusable=1)
	SpellRequire(void_torrent unusable 0=buff,voidform_buff)
Define(void_torrent_buff 263165) # TODO Insanity does not drain during this buff
	SpellInfo(void_torrent_buff duration=4) 
Define(voidform 228264)
Define(voidform_buff 194249)

AddFunction CurrentInsanityDrain {
	if BuffPresent(dispersion_buff) 0 
	if BuffPresent(void_torrent_buff) 0 # for some reason, this does not work as expected
	if BuffPresent(voidform_buff) BuffStacks(voidform_buff)/2 + 9
	0
}

# Azerite Traits
Define(thought_harvester_trait 273319)
	Define(harvested_thoughts_buff 273321)

#Talents
Define(afterlife_talent 9)
Define(angelic_feather_talent 6)
Define(angels_mercy_talent 4)
Define(apotheosis_talent 20)
Define(auspicious_spirits_talent 13)
Define(benediction_talent 16)
Define(binding_heal_talent 14)
Define(body_and_soul_talent 4)
Define(castigation_talent 1)
Define(censure_talent 11)
Define(circle_of_healing_talent 15)
Define(contrition_talent 14)
Define(cosmic_ripple_talent 7)


Define(divine_star_talent 17)
Define(dominant_mind_talent 11)
Define(enduring_renewal_talent 3)
Define(enlightenment_talent 1)
Define(evangelism_talent 21)
Define(fortress_of_the_mind_talent 1)
Define(guardian_angel_talent 8)
Define(halo_talent 18)
Define(holy_word_salvation_talent 21)
Define(last_word_talent 10)
Define(legacy_of_the_void_talent 19)
Define(lenience_talent 19)
Define(light_of_the_naaru_talent 19)
Define(lingering_insanity_talent 16)
Define(luminous_barrier_talent 20)
Define(mania_talent 6)
Define(masochism_talent 5)
Define(mind_bomb_talent 11)
Define(disc_mindbender_talent 8)


Define(perseverance_talent 5)
Define(power_word_solace_talent 9)
Define(psychic_horror_talent 12)
Define(psychic_voice_talent 10)
Define(purge_the_wicked_talent 16)
Define(sanlayn_talent 5)
Define(schism_talent 3)
Define(shadow_covenant_talent 15)



Define(shadowy_insight_talent 2)
Define(shield_discipline_talent 7)
Define(shining_force_talent 12)
Define(sins_of_the_many_talent 13)
Define(surge_of_light_talent 13)

Define(trail_of_light_talent 2)
Define(twist_of_fate_talent_discipline 2)
Define(twist_of_fate_talent 7)


]]
    OvaleScripts:RegisterScript("PRIEST", nil, name, desc, code, "include")
end

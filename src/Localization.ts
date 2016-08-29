/*////////////////////////////////////////////////////////////////////
    Copyright (C) 2014 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
//*/

import { tostring, GetLocale } from 'stub';

var locale = GetLocale()

export const L = {
numeric_display: "Numeric display",
display_two_abilities: "Display two abilities && !only one",
show_remaining_time_numeric: "Show the remaining time in numerical form",
show_ovale: "Show Ovale",
show_keyboard_shortcuts: "Show keyboard shortcuts in the icon bottom-left corner",
aoe: `Attack multiple targets.
Adapts to the total number of enemies.`,
aoe_short: "Multiple-targets rotation",
appearance: "Appearance",
arcane_mage_burn_phase: "Suggest Burn actions",
aura_lag: "Aura lag",
blood: "Blood",
buffs: "Buffs",
hide_empty_buttons: "Hide empty buttons",
hide_in_vehicles: "Hide in vehicles",
hide_ovale: "Hide Ovale",
hide_friendly_or_dead: "Hide if friendly || dead target",
range_indicator: "Range indicator",
cd: `Long cooldown abilities.
Cast as soon as possible || for increased-damage phases.`,
character_displayed_for_range: "This text is displayed on the icon to show if the target is in range",
click_to_select_the_script: "Click to select the script.",
click_to_hide_show_options: "Click to hide/show options",
code: "Code",
copy_to_custom_script: "Copy to custom script",
latency_correction: "Latency correction",
debug_aura: "Track aura management.",
debug_compile: "Track when the script is compiled.",
debug_enemies: "Track enemy detection.",
debug_guid: "Track changes to the UnitID/GUID pairings.",
debug_missing_spells: "Warn if a known spell ID is used that is missing from the spellbook.",
debug_unknown_spells: "Warn if an unknown spell ID is used in the script.",
enable_debugging: "Enable debugging messages for the %s module.",
options_horizontal_shift: "Options horizontal shift",
options_vertical_shift: "Options vertical shift",
scrolling: "Scrolling",
overwrite_existing_custom_script: "Overwrite existing custom script?",
show_in_combat_only: "Show in combat only",
flash_brightness: "Flash brightness",
flash_size: "Flash size",
flash_spells: "Flash spells",
flash_spells_on_action_bars: "Flash spells on action bars when they are ready to be cast. Requires SpellFlashCore",
flash_threshold: "Flash threshold",
focus: "Focus",
icon_group: "Icon group",
icon: "Icon",
ignore_mouse_clicks: "Ignore mouse clicks",
highlight_icon: "Highlight icon",
highlight_icon_when_ability_spammed: "Hightlight icon when ability should be spammed",
hightlight_icon_when_ability_ready: "Flash the icon when the ability is ready",
interrupt: "Interrupts",
interrupts: "Interrupts",
toggle_check_box: "Toggle check box",
lag_between_spellcast_and_aura: "Lag (in milliseconds) between when an spell is cast && when the affected aura is applied || removed",
icons_scale: "The icons scale",
small_icons_scale: "The small icons scale",
font_scale: "The font scale",
scroll_icons: "Scroll the icons",
long_cooldown_abilities: "Long cooldown abilities",
main: "Main attack",
main_attack: "Main attack",
mana_gain: "Mana gain",
margin_between_icons: "Margin between icons",
moving: "Attacks to use while moving",
multidot: "Damage-over-time on multiple targets",
none: "None",
not_in_melee_range: "Not in melee range",
offgcd: `Out of global cooldown ability.
Cast alongside your main attack.`,
only_enemy_if_affected_by_spells: "Only count a mob as an enemy if it is directly affected by a player's spells.",
only_count_tagged_enemies: "Only count tagged enemies",
icons_opacity: "Icons opacity",
options_opacity: "Options opacity",
options: "Options",
overrides: "Overrides",
next_nonfiller_attack: "Next non-filler attack.",
two_abilities: "Two abilities",
keyboard_shortcuts: "Keyboard shortcuts",
right_click_for_options: "Right-Click for options.",
scripts: "Script",
default_scripts: "Default script",
custom_scripts: "Custom script",
short_cd: `Short cooldown abilities.
Cast as soon as possible.`,
short_cooldown_abilities: "Short cooldown abilities",
show_hidden: "Show hidden",
show_minimap_icon: "Show minimap icon",
show_icon_next_spell: "Show the icon of the next spell to cast",
show_wait: "Show the wait icon",
if_has_target: "If has target",
simulationcraft_overrides_description: "Script code inserted immediately after Include() script statements to override standard definitions, e.g., |cFFFFFF00SpellInfo(tigers_fury tag=main)|r",
simulationcraft_profile: "SimulationCraft Profile",
summon_pet: "Summon pet.",
icon_scale: "Icon scale",
small_icon_scale: "Small icon scale",
second_icon_size: "Second icon size",
simulationcraft_profile_content: "The contents of a SimulationCraft profile.",
script_translated_from_sc_profile: "The script translated from the SimulationCraft profile.",
time_to_begin_flashing_before_ready: "Time (in milliseconds) to begin flashing the spell to use before it is ready.",
lock_position: "Lock position",
vertical: "Vertical",
visibility: "Visibility",
};

if ( locale == "deDE" ) {

L.numeric_display = "Numerische Anzeige"
L.display_two_abilities = "Zeige zwei Fähigkeiten und nicht nur eine"
L.show_remaining_time_numeric = "Zeige die verbleibende Zeit in numerischer Form"
L.show_ovale = "Ovale anzeigen"
L.show_keyboard_shortcuts = "Zeige Tastaturkürzel in der linken unteren Ecke des Icons"
L.aoe = "Flächenschaden"
L.aoe_short = "Flächenschaden"
L.appearance = "Aussehen"
// Larcane_mage_burn_phase = ""
L.aura_lag = "Aura-Verzögerung"
L.blood = "Blut"
L.buffs = "Stärkungszauber"
L.hide_empty_buttons = "Leere Buttons ausblenden"
L.hide_in_vehicles = "In Fahrzeugen ausblenden"
L.hide_ovale = "Ovale ausblenden"
L.hide_friendly_or_dead = "Ausblenden bei freundlichem oder totem Ziel"
L.range_indicator = "Reichweitenanzeige"
L.cd = `Fähigkeit mit langer Abklingzeit.
So bald wie möglich benutzen oder für besondere Phasen aufheben.`
L.character_displayed_for_range = "Dieser Text wird auf dem Icon angezeigt, um anzuzeigen ob das Ziel in Reichweite ist"
L.click_to_select_the_script = "Anklicken, um das Skript auszuwählen"
L.click_to_hide_show_options = "Klicken, um Optionen anzuzeigen/zu verbergen"
L.code = "Code"
L.copy_to_custom_script = "In eigenes Skript kopieren"
L.latency_correction = "Latenzkorrektur"
L.debug_aura = "Aura-Management nachverfolgen"
L.debug_compile = "Wenn das Skript übersetzt wird, nachverfolgen"
L.debug_enemies = "Feinderkennung nachverfolgen"
L.debug_guid = "Änderungen in der UnitID/GUID-Paarung nachverfolgen"
L.debug_missing_spells = "Warnen, wenn eine bekannte Spell-ID benutzt wird, die nicht im Zauberbuch vorhanden ist."
L.debug_unknown_spells = "Warnen, wenn eine unbekannte Spell-ID im Skript verwendet wird."
L.options_horizontal_shift = "Optionen horizontal verschieben"
L.options_vertical_shift = "Optionen vertikal verschieben"
L.scrolling = "Scrollend"
L.overwrite_existing_custom_script = "Existierendes eigenes Skript überschreiben?"
L.show_in_combat_only = "Nur im Kampf anzeigen"
L.flash_brightness = "Aufblitz-Leuchtkraft" // Needs review
L.flash_size = "Aufblitz-Größe" // Needs review
L.flash_spells = "Aufblitzende Zauber" // Needs review
L.flash_spells_on_action_bars = "Aufblitzende Zauber in der Aktionsleiste, wenn sie zur Nutzung bereit sind. Benötigt SpellFlashCore." // Needs review
L.flash_threshold = "Aufblitz-Schwellenwert" // Needs review
L.focus = "Fokus"
L.icon_group = "Icon-Gruppe"
L.icon = "Icon"
L.ignore_mouse_clicks = "Mausklicks ignorieren"
L.highlight_icon = "Icon hervorheben"
L.highlight_icon_when_ability_spammed = "Icon hervorheben, wenn Fähigkeit gespammt werden sollte"
L.hightlight_icon_when_ability_ready = "Icon blinken lassen, wenn die Fähigkeit bereit ist"
L.interrupt = "Unterbrechungen" // Needs review
L.interrupts = "Unterbrechungen" // Needs review
L.toggle_check_box = "Checkbox umschalten"
L.lag_between_spellcast_and_aura = "Verzögerung (in Millisekunden) zwischen Auslösen des Zaubers und dem Zeitpunkt, wenn der Effekt eintritt oder entfernt wird"
L.icons_scale = "Die Icongröße"
L.small_icons_scale = "Die Größe der kleinen Icons"
L.font_scale = "Die Schriftgröße"
L.scroll_icons = "Die Icons scrollen"
L.long_cooldown_abilities = "Fähigkeiten mit langer Abklingzeit" // Needs review
L.main = "Hauptangriff"
L.main_attack = "Hauptangriff"
L.mana_gain = "Managewinn"
L.margin_between_icons = "Abstand zwischen den Icons"
L.moving = "Angriffe während der Bewegung"
L.multidot = "Schaden über Zeit auf mehreren Zielen"
L.none = "Nichts"
L.not_in_melee_range = "nicht in Nahkampfreichweite"
L.offgcd = `Fähigkeit ohne globalem Cooldown.
Neben dem Hauptangriff benutzen.`
// Lonly_enemy_if_affected_by_spells = ""
// Lonly_count_tagged_enemies = ""
L.icons_opacity = "Undurchsichtigkeit der Icons"
L.options_opacity = "Undurchsichtigkeit der Optionen"
L.options = "Auswahl"
// Loverrides = ""
L.next_nonfiller_attack = "vorhersagen"
L.two_abilities = "Zwei Fähigkeiten"
L.keyboard_shortcuts = "Tastaturkürzel"
L.right_click_for_options = "Rechts-Klick für Optionen"
L.scripts = "Skript"
L.default_scripts = "Standard Script" // Needs review
L.custom_scripts = "Eigenes Skript"
L.short_cd = `Fähigkeiten mit kurzer Abklingzeit
Benutzen, sobald sie bereit sind.`
L.short_cooldown_abilities = "Fähigkeiten mit kurzer Abklingzeit" // Needs review
L.show_hidden = "zeige versteckte"
L.show_minimap_icon = "Zeige Symbol an der Minikarte" // Needs review
L.show_icon_next_spell = "Zeige das Icon der nächsten zu benutzenden Fähigkeit"
L.show_wait = "Zeige das Warte-Icon"
L.show_wait = "nur mit Ziel"
// Lsimulationcraft_overrides_description = ""
// Lsimulationcraft_profile = ""
L.summon_pet = "Begleiter beschwören"
L.icon_scale = "Icongröße"
L.small_icon_scale = "Größe der kleinen Icons"
L.font_scale = "Schriftgröße"
L.second_icon_size = "Größe des zweiten Icons"
L.simulationcraft_profile_content = "Der Inhalt eines SimulationCraft Profils." // Needs review
// Lscript_translated_from_sc_profile = ""
L.time_to_begin_flashing_before_ready = "Beginnzeit (ms) des Aufblitzens eines Zaubers, bevor er benutzbar wird." // Needs review
L.lock_position = "Position sperren"
L.vertical = "Vertikal"
L.visibility = "Sichtbarkeit"

} 
else if ( locale == "esES" ) {

L.numeric_display = "Visualización numérica"
L.display_two_abilities = "Mostrar dos habilidades y no solo una"
L.show_remaining_time_numeric = "Ver tiempo restante de forma numérica"
L.show_ovale = "Mostrar Ovale"
L.show_keyboard_shortcuts = "Mostrar atajo de teclado en la esquina inferior izquierda del icono"
L.aoe = `Atacar a múltiples objetivos.
Se adapta al número total de enemigos.`
L.aoe_short = "Rotación multi-target"
L.appearance = "Apariencia"
L.arcane_mage_burn_phase = "Acción de daño rápido sugerida"
L.aura_lag = "Retardo de aura"
L.blood = "Sangre"
L.buffs = "Buffos"
L.hide_empty_buttons = "Ocultar botones vacios"
L.hide_in_vehicles = "Ocultar en vehiculo"
L.hide_ovale = "Ocultar Ovale"
L.hide_friendly_or_dead = "Ocultar si el objetivo es aliado o está muerto"
L.range_indicator = "Indicador de distancia" // Needs review
L.cd = `Habilidades con largo cooldown.
Utilízalas lo antes posible para fases que requieran mucho daño.`
L.character_displayed_for_range = "Este texto se muestra sobre el icono si el objetivo está a rango"
L.click_to_select_the_script = "Haz clic para seleccionar el script"
L.click_to_hide_show_options = "Click para Ocultar/ver opciones"
L.code = "Código" // Needs review
L.copy_to_custom_script = "Copiar al script personalizado"
L.latency_correction = "Correción de latencia"
L.debug_aura = "Comprobar gestión de auras."
L.debug_compile = "Comprobar cuándo el script se compila."
L.debug_enemies = "Comprobar la detección de enemigos."
L.debug_guid = "COmprobar cambios en el emparejamiento UnitID/GUID."
L.debug_missing_spells = "Avisar si falta algún ID de hechizo del libro de hechizos."
L.debug_unknown_spells = "Avisar si se utiliza algún ID de hechizo desconocido en el script."
L.options_horizontal_shift = "Desplazamiento horizontal de las opciones"
L.options_vertical_shift = "Desplazamiento vertical de las opciones"
L.scrolling = "rueda de desclazamiento"
L.overwrite_existing_custom_script = "¿Deseas sobreescribir el script personalizado actual?"
L.show_in_combat_only = "Mostrar sólo en combate"
L.flash_brightness = "Brillo del destello"
L.flash_size = "Tamaño del destello"
L.flash_spells = "Destello de hechizos"
L.flash_spells_on_action_bars = "Activar destello de hechizos en las barras de acción cuando éstos están listos para ser utilizados. Requiere SpellFleshCore"
L.flash_threshold = "Umbral del destello"
L.focus = "Foco"
L.icon_group = "Grupo de iconos"
L.icon = "Icono"
L.ignore_mouse_clicks = "Ignorar las pulsaciones del ratón"
L.highlight_icon = "Iluminar el icono"
L.highlight_icon_when_ability_spammed = "Iluminar el icono cuando la habilidad debe ser utilizada repetidamente"
L.hightlight_icon_when_ability_ready = "Iluminar el icono cuando la habilidad esta lista"
L.interrupt = "interrumpir"
L.interrupts = "interrupciones"
L.toggle_check_box = "Activar/desactivar la caja de selección"
L.lag_between_spellcast_and_aura = "Retraso (en milisegundos) entre el lanzamiento de un hechizo y el momento en que el aura correspondiente es aplicada"
L.icons_scale = "Tamaño de los iconos"
L.small_icons_scale = "Tamaño de los iconos pequeños"
L.font_scale = "Tamaño del texto"
L.scroll_icons = "Los iconos pueden desplazarse"
L.long_cooldown_abilities = "Cooldowns largos"
L.main = "principal"
L.main_attack = "Ataque Principal"
L.mana_gain = "maná"
L.margin_between_icons = "Separación entre los iconos"
L.moving = "Ataques a utilizar en situaciones de movimiento"
L.multidot = "DOTs en múltiples objetivos"
L.none = "Nada"
L.not_in_melee_range = "Fuera del rango de melé"
L.offgcd = "Habilidad fuera del cooldown global"
// Lonly_enemy_if_affected_by_spells = ""
// Lonly_count_tagged_enemies = ""
L.icons_opacity = "Opacidad de los iconos"
L.options_opacity = "Opacidad de las opciones"
L.options = "Opciones"
L.overrides = "Forzados"
L.next_nonfiller_attack = "predecir"
L.two_abilities = "Dos habilidades"
L.keyboard_shortcuts = "Accesos directos de teclado"
L.right_click_for_options = "Pulsar con el botón derecho para mostrar opciones"
L.scripts = "Script"
L.default_scripts = "Script por defecto"
L.custom_scripts = "Script personalizado"
L.short_cd = "cd corto"
L.short_cooldown_abilities = "Habilidades de cooldown corto"
L.show_hidden = "Mostrar ocultos"
L.show_minimap_icon = "Mostrar el icono del minimapa"
L.show_icon_next_spell = "Mostrar el icono del siguiente hechizo a lanzar"
L.show_wait = "mostrar el icono de pausa"
L.show_wait = "Si hay objetivo" // Needs review
L.simulationcraft_overrides_description = "Utilizar el código insertado inmediatamente después de las sentencias Include() para forzar las definiciones estándar, p.e. |cFFFFFF00SpellInfo(tigers_fury tag=main)|r"
L.simulationcraft_profile = "Perfil de SimulationCraft"
L.summon_pet = "Invocar mascota"
L.icon_scale = "Tamaño de los iconos"
L.small_icon_scale = "Tamaño de los iconos pequeños"
L.font_scale = "Tamaño del texto"
L.second_icon_size = "Tamaño del segundo icono" // Needs review
L.simulationcraft_profile_content = "Los contenidos del perfil de SimulationCraft"
L.script_translated_from_sc_profile = "El script traducido del perfil de SimulationCraft"
L.time_to_begin_flashing_before_ready = "Tiempo de antelación(en milisegundos) para que comience el destello de un hechizo antes de que esté listo"
L.lock_position = "Bloquear posición"
L.vertical = "Vertical" // Needs review
L.visibility = "Visibilidad"

} else if ( locale == "esMX" ) {

L.numeric_display = "Visualización numérica"
L.display_two_abilities = "Mostrar dos habilidades y no solo una"
L.show_remaining_time_numeric = "Ver tiempo restante de forma numérica"
L.show_ovale = "Mostrar Ovale"
L.show_keyboard_shortcuts = "Mostrar atajo de teclado en la esquina inferior izquierda del icono"
L.aoe = `Atacar a múltiples objetivos.
Se adapta al número total de enemigos.` // Needs review
L.aoe_short = "Rotación multi-target"
L.appearance = "Apariencia"
L.arcane_mage_burn_phase = "Acción de daño rápido sugerida"
L.aura_lag = "Retardo de aura" // Needs review
L.blood = "Sangre"
L.buffs = "Buffs" // Needs review
L.hide_empty_buttons = "Ocultar botones vacíos"
L.hide_in_vehicles = "Ocultar en vehículo"
L.hide_ovale = "Ocultar Ovale"
L.hide_friendly_or_dead = "Ocultar si el objetivo es aliado o está muerto"
L.range_indicator = "Indicador de distancia"
L.cd = `Habilidades con cooldown largo.
Utilízalas lo antes posible o para fases que requieran mucho daño.` // Needs review
L.character_displayed_for_range = "Este texto se muestra sobre el icono si el objetivo está en el rango"
L.click_to_select_the_script = "Haz clic para seleccionar el script." // Needs review
L.click_to_hide_show_options = "Click para ocultar/ver opciones"
L.code = "Código"
L.copy_to_custom_script = "Copiar al script personalizado" // Needs review
L.latency_correction = "Correción de latencia"
L.debug_aura = "Comprobar gestión de auras." // Needs review
L.debug_compile = "Comprobar cuando el script se compila." // Needs review
L.debug_enemies = "Comprobar la detección de enemigos." // Needs review
L.debug_guid = "Comprobar cambios en el emparejamiento UnitID/GUID." // Needs review
L.debug_missing_spells = "Avisar si falta algún ID de hechizo del libro de hechizos." // Needs review
L.debug_unknown_spells = "Avisar si se utiliza algún ID de hechizo desconocido en el script." // Needs review
L.options_horizontal_shift = "Desplazamiento horizontal de las opciones" // Needs review
L.options_vertical_shift = "Desplazamiento vertical de las opciones" // Needs review
L.scrolling = "Rueda de desplazamiento"
L.overwrite_existing_custom_script = "¿Deseas sobrescribir el script personalizado actual?" // Needs review
L.show_in_combat_only = "Mostrar sólo en combate"
L.flash_brightness = "Brillo del destello"
L.flash_size = "Tamaño del destello"
L.flash_spells = "Destello del hechizo"
L.flash_spells_on_action_bars = "Activar destello de hechizos en las barras de acción cuando éstos están listos para ser utilizados. Requiere SpellFleshCore" // Needs review
L.flash_threshold = "Umbral del destello"
L.focus = "Foco"
L.icon_group = "Grupo de iconos" // Needs review
L.icon = "Icono" // Needs review
L.ignore_mouse_clicks = "Ignorar las pulsaciones del ratón"
L.highlight_icon = "Iluminar el icono"
L.highlight_icon_when_ability_spammed = "Iluminar el icono cuando la habilidad debe ser utilizada repetidamente"
L.hightlight_icon_when_ability_ready = "Iluminar el icono cuando la habilidad está lista"
L.interrupt = "Interrupciones"
L.interrupts = "Interrupciones"
L.toggle_check_box = "Activar/desactivar la caja de selección"
L.lag_between_spellcast_and_aura = "Retraso (en milisegundos) entre el lanzamiento de un hechizo y el momento en que el aura correspondiente es aplicada o removida" // Needs review
L.icons_scale = "Tamaño de los iconos"
L.small_icons_scale = "Tamaño de los iconos pequeños"
L.font_scale = "Tamaño del texto"
L.scroll_icons = "Los iconos pueden desplazarse"
L.long_cooldown_abilities = "Cooldowns largos"
L.main = "Ataque principal" // Needs review
L.main_attack = "Ataque Principal"
L.mana_gain = "Aumento de maná" // Needs review
L.margin_between_icons = "Separación entre los iconos"
L.moving = "Ataques a utilizar en situaciones de movimiento" // Needs review
L.multidot = "DOTs en múltiples objetivos" // Needs review
L.none = "Nada" // Needs review
L.not_in_melee_range = "Fuera del rango de melé" // Needs review
L.offgcd = "Habilidad fuera del cooldown global" // Needs review
// Lonly_enemy_if_affected_by_spells = ""
// Lonly_count_tagged_enemies = ""
L.icons_opacity = "Opacidad de los iconos" // Needs review
L.options_opacity = "Opacidad de las opciones" // Needs review
L.options = "Opciones" // Needs review
L.overrides = "Forzados"
L.next_nonfiller_attack = "Siguiente ataque no de relleno." // Needs review
L.two_abilities = "Dos habilidades" // Needs review
L.keyboard_shortcuts = "Atajos del teclado" // Needs review
L.right_click_for_options = "Pulsar con el botón derecho para mostrar opciones." // Needs review
L.scripts = "Script" // Needs review
L.default_scripts = "Script por defecto"
L.custom_scripts = "Script personalizado" // Needs review
L.short_cd = `Habilidades de cooldown corto.
L.ánzalas tan pronto sea posible.` // Needs review
L.short_cooldown_abilities = "Habilidades de cooldown corto"
L.show_hidden = "Mostrar scripts ocultos" // Needs review
L.show_minimap_icon = "Mostrar el icono del minimapa" // Needs review
L.show_icon_next_spell = "Mostrar el icono del siguiente hechizo a lanzar" // Needs review
L.show_wait = "Mostrar el icono de pausa" // Needs review
L.show_wait = "Si hay objetivo" // Needs review
L.simulationcraft_overrides_description = "Utilizar el código insertado inmediatamente después de las sentencias Include() para forzar las definiciones estándar, ej. |cFFFFFF00SpellInfo(tigers_fury tag=main)|r"
L.simulationcraft_profile = "Perfil de SimulationCraft"
L.summon_pet = "Invocar mascota." // Needs review
L.icon_scale = "Tamaño de los iconos" // Needs review
L.small_icon_scale = "Tamaño de los iconos pequeños" // Needs review
L.font_scale = "Tamaño del texto" // Needs review
L.second_icon_size = "Tamaño del segundo icono" // Needs review
L.simulationcraft_profile_content = "Contenidos del perfil de SimulationCraft"
L.script_translated_from_sc_profile = "Script traducido del perfil de SimulationCraft"
L.time_to_begin_flashing_before_ready = "Tiempo de antelación (en milisegundos) para que comience el destello de un hechizo antes de que esté listo"
L.lock_position = "Bloquear posición" // Needs review
L.vertical = "Vertical" // Needs review
L.visibility = "Visibilidad" // Needs review

} else if ( locale == "frFR" ) {

L.numeric_display = "Affichage numérique"
L.display_two_abilities = "Affiche les deux prochains sorts et pas uniquement le suivant"
L.show_remaining_time_numeric = "Affiche le temps de recharge sous forme numérique"
L.show_ovale = "Afficher la fenêtre"
L.show_keyboard_shortcuts = "Afficher les raccourcis clavier dans le coin inférieur gauche des icônes"
L.aoe = "Attaque multi-cible" // Needs review
L.aoe_short = "rotation Multicible" // Needs review
L.appearance = "Apparence"
// Larcane_mage_burn_phase = ""
L.aura_lag = "latence de l'Aura" // Needs review
L.blood = "Saignement"
L.buffs = "Améliorations"
L.hide_empty_buttons = "Cacher bouton vide"
L.hide_in_vehicles = "Cacher dans les véhicules"
L.hide_ovale = "Cacher la fenêtre"
L.hide_friendly_or_dead = "Cacher si cible amicale ou morte"
L.range_indicator = "Caractère de portée"
L.cd = `Techniques à longs temps de recharge.
L.ancer dès que possible ou conserver pour les phases de dégâts amplifiés.`
L.character_displayed_for_range = "Ce caractère est affiché dans un coin de l'icône pour indiquer si la cible est à portée"
L.click_to_select_the_script = "cliquez pour sélectionner le script." // Needs review
L.click_to_hide_show_options = "Cliquer pour afficher/cacher les options"
L.code = "Code"
L.copy_to_custom_script = "Copier sur Script personnalisé"
L.latency_correction = "Correction de la latence"
L.debug_aura = "Suivre la gestion des auras."
L.debug_compile = "Suivre lorsque le script est compilé."
L.debug_enemies = "Suivre la détection des ennemis."
L.debug_guid = "Suivre les changements des paires de UnitID et GUID."
L.debug_missing_spells = "Prévenir si le ID d'un sort qui n'est pas dans le livre de sorts est utilisé."
L.debug_unknown_spells = "Prévenir si le ID d'un sort inconnu est utilisé dans le script."
L.options_horizontal_shift = "Décalage horizontal des options"
L.options_vertical_shift = "Décalage vertical des options"
L.scrolling = "Défilement"
L.overwrite_existing_custom_script = "Ecraser le Script personnalisé préexistant?"
L.show_in_combat_only = "En combat uniquement"
L.flash_brightness = "Luminosité du flash" // Needs review
L.flash_size = "Taille du flash" // Needs review
L.flash_spells = "Flash du sort" // Needs review
// Lflash_spells_on_action_bars = ""
// Lflash_threshold = ""
L.focus = "Focus"
L.icon_group = "Groupe d'icônes"
L.icon = "Icône"
L.ignore_mouse_clicks = "Ignorer les clics souris"
L.highlight_icon = "Illuminer l'icône"
L.highlight_icon_when_ability_spammed = "Illuminer l'icône quand la technique doit être spammée"
L.hightlight_icon_when_ability_ready = "Illuminer l'icône quand le temps de recharge est écoulé"
// Linterrupt = ""
L.interrupts = "Interrupts" // Needs review
L.toggle_check_box = "Inverser la boîte à cocher "
L.lag_between_spellcast_and_aura = "Latence (en milliseconde) quand un sort est lancé et quand une aura est appliqué ou retiré." // Needs review
L.icons_scale = "La taille des icônes"
L.small_icons_scale = "La taille des petites icônes"
L.font_scale = "La taille des polices"
L.scroll_icons = "Les icônes se déplacent"
L.long_cooldown_abilities = "Techniques à longs temps de recharge" // Needs review
L.main = "Attaque principale"
L.main_attack = "Attaque principale" // Needs review
L.mana_gain = "Regain de mana"
L.margin_between_icons = "Marge entre deux icônes"
L.moving = "Attaques à utiliser en mouvement"
L.multidot = "Multicible pour DoTs"
L.none = "Aucun"
L.not_in_melee_range = "Pas à distance pour corps à corps" // Needs review
L.offgcd = `Attaque hors temps de recharge globale.
L.ancer en parallèle de l'attaque principale.`
// Lonly_enemy_if_affected_by_spells = ""
// Lonly_count_tagged_enemies = ""
L.icons_opacity = "Opacité des icônes"
L.options_opacity = "Opacité des options"
L.options = "Options"
// Loverrides = ""
// Lnext_nonfiller_attack = ""
L.two_abilities = "Deux sorts"
L.keyboard_shortcuts = "Raccourcis clavier"
L.right_click_for_options = "clique droit pour les options" // Needs review
L.scripts = "Script"
L.default_scripts = "Script défaut" // Needs review
L.custom_scripts = "Script personnalisé"
L.short_cd = `Compétence à court temps de recharge.
L.ancer dès que possible.`
L.short_cooldown_abilities = "Compétence à court temps de recharge" // Needs review
// Lshow_hidden = ""
L.show_minimap_icon = "montrer l'icone de la minimap" // Needs review
L.show_icon_next_spell = "Affiche l'icône du prochain sort à lancer"
L.show_wait = "Montrer l'icône d'attente"
L.show_wait = "Si cible uniquement"
// Lsimulationcraft_overrides_description = ""
// Lsimulationcraft_profile = ""
L.summon_pet = "Invoquer familier" // Needs review
L.icon_scale = "Taille des icônes"
L.small_icon_scale = "Taille des petites icônes"
L.font_scale = "Taille des polices"
L.second_icon_size = "Taille du second icône"
// Lsimulationcraft_profile_content = ""
// Lscript_translated_from_sc_profile = ""
// Ltime_to_begin_flashing_before_ready = ""
L.lock_position = "Verrouiller position"
L.vertical = "Vertical"
L.visibility = "Visibilité"

} else if ( locale == "itIT" ) {

L.numeric_display = "Esposizione Numerica"
L.display_two_abilities = "Espone due abilita' e non solo una"
L.show_remaining_time_numeric = "Mostra il tempo rimanente in forma numerica"
L.show_ovale = "Mostra Ovale"
L.show_keyboard_shortcuts = "Mostra le scorciatoie da tastiera nell'icona in basso a sinistra"
L.aoe = "Attacchi a Bersaglio Multiplo"
L.aoe_short = "AdE"
L.appearance = "Apparenza"
// Larcane_mage_burn_phase = ""
L.aura_lag = "Aura lag"
L.blood = "Sangue"
L.buffs = "Benefici"
L.hide_empty_buttons = "Nascondi bottoni vuoti"
L.hide_in_vehicles = "Nascondi nei veicoli"
L.hide_ovale = "Nascondi Ovale"
L.hide_friendly_or_dead = "Nascondi se il bersaglio e' amico o morto"
L.range_indicator = "Indicatori distanza"
L.cd = `Abilita' con cooldown lungo.
L.anciare quando possibile o mantenere per moltiplicare i danni un specifiche fasi.`
L.character_displayed_for_range = "Questo testo e' mostrato sull'icona per mostrare se il bersaglio e' nel raggio d'azione"
L.click_to_select_the_script = "Clicca per selezionare lo script."
L.click_to_hide_show_options = "Premere per nascondere/mostrare le opzioni"
L.code = "Codice"
L.copy_to_custom_script = "Copia in script personalizzato"
L.latency_correction = "Correzione Latenza"
L.debug_aura = "Debug aura"
L.debug_compile = "Debug compilazione"
L.debug_enemies = "Debug nemici"
L.debug_guid = "Debug GUID"
L.debug_missing_spells = "Debug instantesimi mancanti"
L.debug_unknown_spells = "Debug Incantesimi sconosciuti"
L.options_horizontal_shift = "Opzioni spostamento orizzontare"
L.options_vertical_shift = "Opzioni spostamento verticale"
L.scrolling = "Scorrimento"
L.overwrite_existing_custom_script = "Sovrascrivere lo script personalizzato esistente ?"
L.show_in_combat_only = "Mostra solo in combattimento"
L.flash_brightness = "Mostra luminosità" // Needs review
L.flash_size = "Mostra grandezza" // Needs review
L.flash_spells = "Mostra incantesimi" // Needs review
// Lflash_spells_on_action_bars = ""
// Lflash_threshold = ""
L.focus = "Focus"
L.icon_group = "Gruppo d'Icone"
L.icon = "Icona"
L.ignore_mouse_clicks = "Ignora pressioni mouse"
L.highlight_icon = "Evidenzia icona"
L.highlight_icon_when_ability_spammed = "Evidenzia icona quando l'abilita' dovrebbe essere spammata"
L.hightlight_icon_when_ability_ready = "Illumina l'icona quando l'abilita' e' pronta"
L.interrupt = "Interrompi" // Needs review
L.interrupts = "Interrompi" // Needs review
L.toggle_check_box = "Inverti spunta"
L.lag_between_spellcast_and_aura = "Lag (in millisecondi) tra quando un incantesimo è lanciato e quando l'aura d'effetto è applicata o rimossa"
L.icons_scale = "La scala dell'icona"
L.small_icons_scale = "La scala dell'icona piccola"
L.font_scale = "La scala del carattere"
L.scroll_icons = "Scorri le icone"
L.long_cooldown_abilities = "Abilita' con cooldown lungo" // Needs review
L.main = "Attacco Principale"
L.main_attack = "Attacco Principale" // Needs review
L.mana_gain = "Guadagno Mana"
L.margin_between_icons = "Margine tra le icone"
L.moving = "in movimento"
L.multidot = "Danni a Tempo su bersagli multipli"
L.none = "Nessuno"
L.not_in_melee_range = "non in mischia"
L.offgcd = `Abilita' fuori dal Cooldown globale.
Da lanciare assieme agli attacchi principali.`
// Lonly_enemy_if_affected_by_spells = ""
// Lonly_count_tagged_enemies = ""
L.icons_opacity = "Opacita' icone"
L.options_opacity = "Opzioni di opacita'"
L.options = "Opzioni"
// Loverrides = ""
L.next_nonfiller_attack = "predizione"
L.two_abilities = "Due abilita'"
L.keyboard_shortcuts = "Scorciatoie da tastiera"
L.right_click_for_options = "Click-Destro per opzioni."
L.scripts = "Script"
// Ldefault_scripts = ""
L.custom_scripts = "Script Personalizzato"
L.short_cd = "recupero corto"
L.short_cooldown_abilities = "Recupero corto" // Needs review
L.show_hidden = "Mostra nascosti"
L.show_minimap_icon = "Mostra icona minimappa" // Needs review
L.show_icon_next_spell = "Descrizione Add-on"
L.show_wait = "mostra aspetta"
L.show_wait = "Se si ha un bersaglio"
// Lsimulationcraft_overrides_description = ""
// Lsimulationcraft_profile = ""
L.summon_pet = "evoca pet"
L.icon_scale = "Scala icone"
L.small_icon_scale = "Scala piccole icone"
L.font_scale = "Scala caratteri"
L.second_icon_size = "Dimensione seconda icona"
// Lsimulationcraft_profile_content = ""
// Lscript_translated_from_sc_profile = ""
// Ltime_to_begin_flashing_before_ready = ""
L.lock_position = "Blocca Posizione"
L.vertical = "Verticale"
L.visibility = "Visibilità"

} else if ( locale == "koKR" ) {

L.numeric_display = "숫자 표시"
L.display_two_abilities = "두번째 능력을 표시합니다."
L.show_remaining_time_numeric = "숫자 형태로 남은 시간을 표시합니다."
L.show_ovale = "Ovale 표시"
L.show_keyboard_shortcuts = "아이콘 좌측 하단 코너에 단축키를 표시합니다."
L.aoe = "다중 대상 공격" // Needs review
L.aoe_short = "AOE" // Needs review
L.appearance = "외형"
// Larcane_mage_burn_phase = ""
// Laura_lag = ""
L.blood = "Blood"
L.buffs = "버프"
L.hide_empty_buttons = "빈 버튼 숨김"
L.hide_in_vehicles = "차량 탑승시 숨김"
L.hide_ovale = "Ovale 숨김"
L.hide_friendly_or_dead = "우호적 대상이나 죽은 대상 선택시 숨김"
L.range_indicator = "범위 지시기"
L.cd = `긴 재사용 대기시간 능력입니다.
Cast as soon as possible || keep for multiplied damage phases.`
L.character_displayed_for_range = "이 문자는 대상이 범위에 있을때 아이콘에 표시됩니다."
// Lclick_to_select_the_script = ""
L.click_to_hide_show_options = "클릭시 옵션 숨김/표시"
L.code = "코드"
// Lcopy_to_custom_script = ""
L.latency_correction = "대기시간 수정"
// Ldebug_aura = ""
// Ldebug_compile = ""
// Ldebug_enemies = ""
// Ldebug_guid = ""
// Ldebug_missing_spells = ""
// Ldebug_unknown_spells = ""
L.options_horizontal_shift = "가로 간격"
L.options_vertical_shift = "세로 간격"
L.scrolling = "스크룰"
// Loverwrite_existing_custom_script = ""
L.show_in_combat_only = "전투 상태일때만 표시"
L.flash_brightness = "번쩍임 밝기" // Needs review
L.flash_size = "번쩍임 크기" // Needs review
L.flash_spells = "주문 번쩍임" // Needs review
// Lflash_spells_on_action_bars = ""
// Lflash_threshold = ""
L.focus = "주시 대상"
// Licon_group = ""
// Licon = ""
L.ignore_mouse_clicks = "마우스 클릭 무시"
L.highlight_icon = "아이콘 강조"
L.highlight_icon_when_ability_spammed = "Hightlight icon when ability should be spammed"
L.hightlight_icon_when_ability_ready = "능력이 준비되면 아이콘을 반짝입니다."
// Linterrupt = ""
// Linterrupts = ""
L.toggle_check_box = "체크 박스 토글"
// Llag_between_spellcast_and_aura = ""
L.icons_scale = "아이콘 크기"
L.small_icons_scale = "작은 아이콘의 크기를 설정합니다."
L.font_scale = "폰크 크기"
L.scroll_icons = "아이콘 스크룰"
L.long_cooldown_abilities = "긴 재사용 대기시간 능력입니다" // Needs review
L.main = "Main Attack"
// Lmain_attack = ""
L.mana_gain = "마나 획득"
L.margin_between_icons = "아이콘 간격"
// Lmoving = ""
L.multidot = "Damage Over Time on multiple targets"
L.none = "None"
// Lnot_in_melee_range = ""
L.offgcd = `전역 재사용 대기시간 능력입니다.
Cast alongside your Main Attack.`
// Lonly_enemy_if_affected_by_spells = ""
// Lonly_count_tagged_enemies = ""
L.icons_opacity = "아이콘 투명도"
L.options_opacity = "투명도 옵션을 설정합니다."
// Loptions = ""
// Loverrides = ""
// Lnext_nonfiller_attack = ""
L.two_abilities = "두번째 능력"
L.keyboard_shortcuts = "키보드 단축키"
// Lright_click_for_options = ""
// Lscripts = ""
// Ldefault_scripts = ""
// Lcustom_scripts = ""
// Lshort_cd = ""
// Lshort_cooldown_abilities = ""
// Lshow_hidden = ""
// Lshow_minimap_icon = ""
// Lshow_icon_next_spell = ""
// Lshow_wait = ""
L.show_wait = "만약 대상이 있다면"
// Lsimulationcraft_overrides_description = ""
// Lsimulationcraft_profile = ""
// Lsummon_pet = ""
L.icon_scale = "아이콘 크기"
L.small_icon_scale = "작은 아이콘 크기"
L.font_scale = "폰트 크기"
L.second_icon_size = "두번째 아이콘 크기"
// Lsimulationcraft_profile_content = ""
// Lscript_translated_from_sc_profile = ""
// Ltime_to_begin_flashing_before_ready = ""
L.lock_position = "위치 잠금"
L.vertical = "수직선"
// Lvisibility = ""

} else if ( locale == "ptBR" ) {

L.numeric_display = "Mostrar números"
L.display_two_abilities = "Mostrar duas habilidades e não apenas uma"
L.show_remaining_time_numeric = "Mostrar o tempo restante de forma numérica"
L.show_ovale = "Mostrar Ovale"
L.show_keyboard_shortcuts = "Mostrar atalhos { teclado canto inferior esquerdo { ícone"
L.aoe = "Atacar alvos múltiplos" // Needs review
L.aoe_short = "AOE" // Needs review
L.appearance = "Aparência"
// Larcane_mage_burn_phase = ""
// Laura_lag = ""
L.blood = "Sangue"
L.buffs = "Buffs"
L.hide_empty_buttons = "Esconder botões vazios"
L.hide_in_vehicles = "Esconder em veículos"
L.hide_ovale = "Esconder Ovale"
L.hide_friendly_or_dead = "Esconder se o alvo for amigável ou morto"
L.range_indicator = "Indicador de alcance"
L.cd = `Habilidades de cooldown longo.
Use assim que possível ou espere por fases com dano maior.`
L.character_displayed_for_range = "Este texto é mostrado no ícone para apontar se o alvo está no alcance"
// Lclick_to_select_the_script = ""
L.click_to_hide_show_options = "Clique para mostrar/esconder opções"
L.code = "Código"
// Lcopy_to_custom_script = ""
L.latency_correction = "Correção de latência"
// Ldebug_aura = ""
// Ldebug_compile = ""
// Ldebug_enemies = ""
// Ldebug_guid = ""
// Ldebug_missing_spells = ""
// Ldebug_unknown_spells = ""
L.options_horizontal_shift = "Opções de mudança horizontal"
L.options_vertical_shift = "Opções de mduança vertical"
L.scrolling = "Rolagem"
// Loverwrite_existing_custom_script = ""
L.show_in_combat_only = "Mostrar só em combate"
L.flash_brightness = "Intensidade { brilho" // Needs review
L.flash_size = "Tamanho { brilho" // Needs review
L.flash_spells = "Brilho { feitiço" // Needs review
// Lflash_spells_on_action_bars = ""
// Lflash_threshold = ""
L.focus = "Foco"
// Licon_group = ""
// Licon = ""
L.ignore_mouse_clicks = "Ignorar cliques { mouse"
L.highlight_icon = "Iluminar ícone"
L.highlight_icon_when_ability_spammed = "Iluminar ícone quando habilidade deverá ser spamada"
L.hightlight_icon_when_ability_ready = "Iluminar ícone quando habilidade estiver pronta"
// Linterrupt = ""
// Linterrupts = ""
L.toggle_check_box = "Alternar checar caixa"
// Llag_between_spellcast_and_aura = ""
L.icons_scale = "Escala dos ícones"
L.small_icons_scale = "Escala dos ícones pequenos"
L.font_scale = "Escala da fonte"
L.scroll_icons = "Rolar os ícones"
L.long_cooldown_abilities = "Habilidades de cooldown longo" // Needs review
L.main = "Ataque principal"
L.main_attack = "Ataque principal" // Needs review
L.mana_gain = "Ganho de mana"
L.margin_between_icons = "Margem entre ícones"
// Lmoving = ""
L.multidot = "Dano Através { Tempo em múltiplos alvos"
L.none = "Nenhum"
// Lnot_in_melee_range = ""
L.offgcd = `Habilidade fora { cooldown global.
Use junto { seu Ataque Principal.`
// Lonly_enemy_if_affected_by_spells = ""
// Lonly_count_tagged_enemies = ""
L.icons_opacity = "Opacidade dos ícones"
L.options_opacity = "Opacidade das opções"
// Loptions = ""
// Loverrides = ""
// Lnext_nonfiller_attack = ""
L.two_abilities = "Duas habilidades"
L.keyboard_shortcuts = "Atalhos { teclado"
// Lright_click_for_options = ""
// Lscripts = ""
// Ldefault_scripts = ""
// Lcustom_scripts = ""
// Lshort_cd = ""
// Lshort_cooldown_abilities = ""
// Lshow_hidden = ""
// Lshow_minimap_icon = ""
// Lshow_icon_next_spell = ""
// Lshow_wait = ""
L.show_wait = "Se tiver alvo"
// Lsimulationcraft_overrides_description = ""
// Lsimulationcraft_profile = ""
// Lsummon_pet = ""
L.icon_scale = "Escala { ícone"
L.small_icon_scale = "Escala { ícone pequeno"
L.font_scale = "Escala da fonte"
L.second_icon_size = "Tamanho { segundo ícone"
// Lsimulationcraft_profile_content = ""
// Lscript_translated_from_sc_profile = ""
// Ltime_to_begin_flashing_before_ready = ""
L.lock_position = "Travar posição"
L.vertical = "Vertical"
// Lvisibility = ""

} else if ( locale == "ruRU" ) {

L.numeric_display = "Цифровой дисплей"
L.display_two_abilities = "Показать две способности вместо одной"
L.show_remaining_time_numeric = "Показать отсчет времени в цифровой форме"
L.show_ovale = "Показать Ovale"
L.show_keyboard_shortcuts = "Показывать сочетания клавиш в левом нижнем углу"
L.aoe = "Атака нескольких противников"
L.aoe_short = "Приоритет при атаке нескольких противников"
L.appearance = "Внешний вид"
L.arcane_mage_burn_phase = "Предложить взрывные действия" // Needs review
L.aura_lag = "Задержка ауры"
L.blood = "Кровь"
L.buffs = "Баффы"
L.hide_empty_buttons = "Скрыть пустые кнопки"
L.hide_in_vehicles = "Скрывать на транспорте"
L.hide_ovale = "Скрыть Ovale"
L.hide_friendly_or_dead = "Скрывать если союзник или цель мертва"
L.range_indicator = "Индикатор дистанции"
L.cd = `Способности с большим кулдауном (временем восстановления). 
Использовать сразу, как только возможно или придерживать для фаз повышенного урона.`
L.character_displayed_for_range = "Этот текст показывается на иконке если цель в радиусе досягаемости"
L.click_to_select_the_script = "Клик для выбора скрипта"
L.click_to_hide_show_options = "Нажмите, чтобы скрыть/показать опции"
L.code = "Код"
L.copy_to_custom_script = "Скопировать в Пользовательский скрипт"
L.latency_correction = "Коррекция задержки"
L.debug_aura = "Отслеживать управление аурами."
L.debug_compile = "Отслеживать компиляцию скрипта."
L.debug_enemies = "Отслеживать появление противников."
L.debug_guid = "Отслеживать изменения в парах UnitID/GUID."
L.debug_missing_spells = "Предупреждать, если используется ID заклинания отсутствующего в книге заклинаний"
L.debug_unknown_spells = "Предупреждать о неизвестном ID заклинания в скрипте."
L.options_horizontal_shift = "Горизонтальное смещение опций"
L.options_vertical_shift = "Вертикальное смещение опций"
L.scrolling = "Прокрутка (Скроллинг)"
L.overwrite_existing_custom_script = "Перезаписать существующий Пользовательский скрипт?"
L.show_in_combat_only = "Показывать только в бою"
L.flash_brightness = "Яркость подсветки"
L.flash_size = "Размер подсветки"
L.flash_spells = "Подсветка умения"
L.flash_spells_on_action_bars = "Подсвечивать способности, на панели умений, когда они готовы. Требуется SpellFlashCore"
L.flash_threshold = "Преддверие вспышкой"
L.focus = "Фокус"
L.icon_group = "Группа иконок"
L.icon = "Иконка"
L.ignore_mouse_clicks = "Игнорировать клики мыши"
L.highlight_icon = "Подсветка иконок"
L.highlight_icon_when_ability_spammed = "Подсвечивать иконки когда способность должна \"спамиться\""
L.hightlight_icon_when_ability_ready = "Мигать когда способность готова"
L.interrupt = "Прерывания"
L.interrupts = "Прерывания"
L.toggle_check_box = "Переключить флажок"
L.lag_between_spellcast_and_aura = "Задержка (в милисекундах) между произнесением заклинания и применением/пропаданием ауры"
L.icons_scale = "Размер иконок"
L.small_icons_scale = "Размер маленьких иконок"
L.font_scale = "Размер шрифта"
L.scroll_icons = "Переместить иконки"
L.long_cooldown_abilities = "Способности с большим кулдауном"
L.main = "Основная атака"
L.main_attack = "Основная атака"
L.mana_gain = "Мана (очки маны)"
L.margin_between_icons = "Расстояние между иконками"
L.moving = "Атаки, используемые при движении"
L.multidot = "ДОТы на нескольких целях"
L.none = "Нет"
L.not_in_melee_range = "Вне радиуса ближней атаки"
L.offgcd = `Не участвуют в глобальном КД.
Активируются вне зависимости от Ваших атак.
`
// Lonly_enemy_if_affected_by_spells = ""
// Lonly_count_tagged_enemies = ""
L.icons_opacity = "Прозрачность иконок"
L.options_opacity = "Прозрачность настроек"
L.options = "Опции"
L.overrides = "Перезаписанные" // Needs review
L.next_nonfiller_attack = "Следующая не \"заполняющая\" атака."
L.two_abilities = "Две способности"
L.keyboard_shortcuts = "Горячие клавиши"
L.right_click_for_options = "Правая кнопка для настроек"
L.scripts = "Скрипт"
L.default_scripts = "Скрипт по умолчанию" // Needs review
L.custom_scripts = "Пользовательский скрипт"
L.short_cd = `Способности с малым временем восстановления.
Используются так часто, как только возможно.`
L.short_cooldown_abilities = "Способности с малым временем восстановления"
L.show_hidden = "показать скрытые скрипты"
L.show_minimap_icon = "Показать иконку на миникарте"
L.show_icon_next_spell = "Показывать иконку следующего произносимого заклинания"
L.show_wait = "Показывать иконку ожидания"
L.show_wait = "Если выбрана цель"
L.simulationcraft_overrides_description = "Код скрипта вставляется сразу после выражения Include() для перезаписи стандартных определений, например  |cFFFFFF00SpellInfo(tigers_fury tag=main)|r" // Needs review
L.simulationcraft_profile = "Профайл SimulationCraft" // Needs review
L.summon_pet = "Призвать питомца."
L.icon_scale = "Размер иконки"
L.small_icon_scale = "Масштаб маленькой иконки"
L.font_scale = "Размер шрифта"
L.second_icon_size = "Размер второй иконки"
L.simulationcraft_profile_content = "Содержимре профайла SimulationCraft" // Needs review
L.script_translated_from_sc_profile = "Преобразованный скрипт из профайла SimulationCraft" // Needs review
L.time_to_begin_flashing_before_ready = "Время (в миллисекундах) за которое, до готовности, способность подсветится."
L.lock_position = "Блокировка позиции"
L.vertical = "Вертикально"
L.visibility = "Показывать"

} else if ( locale == "zhCN" ) {

L.numeric_display = "数字显示"
L.display_two_abilities = "显示下2个需要释放的技能而不仅是1个"
L.show_remaining_time_numeric = "用数字显示剩余时间"
L.show_ovale = "显示Ovale"
L.show_keyboard_shortcuts = "在图标左下角显示快捷键"
L.aoe = "多目标攻击" // Needs review
L.aoe_short = "AOE输出循环"
L.appearance = "环境"
// Larcane_mage_burn_phase = ""
L.aura_lag = "触发与移除效果延迟" // Needs review
L.blood = "鲜血"
L.buffs = "增益"
L.hide_empty_buttons = "隐藏空按钮的背景"
L.hide_in_vehicles = "使用载具时隐藏"
L.hide_ovale = "隐藏Ovale"
L.hide_friendly_or_dead = "当目标是友方或已死亡时隐藏"
L.range_indicator = "距离显示"
L.cd = `长CD的爆发技能与物品。
卡CD使用或在boss增伤阶段使用。`
L.character_displayed_for_range = "显示在技能图标上的符号以检测与目标的距离"
L.click_to_select_the_script = "点击以选取脚本"
L.click_to_hide_show_options = "点击来隐藏/显示选项"
L.code = "代码"
L.copy_to_custom_script = "复制到自定义脚本"
L.latency_correction = "延迟修正"
L.debug_aura = "追踪光环管理."
L.debug_compile = "追踪已编译脚本."
L.debug_enemies = "追踪敌人侦测."
L.debug_guid = "追踪UnitID/GUID配对变化."
L.debug_missing_spells = "使用的已知法术ID在法术书中无法找到时提醒."
L.debug_unknown_spells = "脚本中使用了未知的法术ID时提醒."
L.options_horizontal_shift = "选项水平移位"
L.options_vertical_shift = "选项垂直移位"
L.scrolling = "滑动动画显示下一个技能"
L.overwrite_existing_custom_script = "覆盖已存在的自定义脚本?"
L.show_in_combat_only = "仅在战斗中显示"
L.flash_brightness = "闪光亮度"
L.flash_size = "闪光尺寸"
L.flash_spells = "法术闪光"
L.flash_spells_on_action_bars = "当技能冷却结束时显示闪光效果。需要插件SpellFLashCore"
L.flash_threshold = "闪光阈值" // Needs review
L.focus = "焦点"
L.icon_group = "图标分组"
L.icon = "图标"
L.ignore_mouse_clicks = "忽略鼠标点击"
L.highlight_icon = "高亮显示图标"
L.highlight_icon_when_ability_spammed = "当技能应重复使用时高亮显示图标"
L.hightlight_icon_when_ability_ready = "技能就绪时闪烁图标"
L.interrupt = "打断施法"
L.interrupts = "打断施法"
L.toggle_check_box = "开启/关闭选择框"
L.lag_between_spellcast_and_aura = "释放一个技能与其触发/移除效果之间的延迟" // Needs review
L.icons_scale = "图标大小"
L.small_icons_scale = "小型图标大小"
L.font_scale = "字体大小"
L.scroll_icons = "滚动图标"
L.long_cooldown_abilities = "长CD的技能与物品" // Needs review
L.main = "主要攻击技能"
L.main_attack = "主要攻击技能" // Needs review
L.mana_gain = "法力获取"
L.margin_between_icons = "图标间距"
L.moving = "移动中使用攻击"
L.multidot = "多目标持续伤害"
L.none = "无"
L.not_in_melee_range = "脱离近战范围"
L.offgcd = `无公共冷却的技能与物品
可以在你使用主攻技能的同时使用。`
// Lonly_enemy_if_affected_by_spells = ""
// Lonly_count_tagged_enemies = ""
L.icons_opacity = "图标透明度"
L.options_opacity = "选项透明度"
L.options = "选项"
// Loverrides = ""
L.next_nonfiller_attack = "下一个非填充性技能。"
L.two_abilities = "两个技能" // Needs review
L.keyboard_shortcuts = "快捷键"
L.right_click_for_options = "右键点击打开选项"
L.scripts = "脚本"
L.default_scripts = "默认脚本" // Needs review
L.custom_scripts = "自定义脚本"
L.short_cd = `短CD技能.
卡CD使用`
L.short_cooldown_abilities = "短CD技能"
L.show_hidden = "显示隐藏的脚本"
L.show_minimap_icon = "在小地图上显示图标"
L.show_icon_next_spell = "显示下一个需要施放的技能的图标"
L.show_wait = "显示等待图标"
L.show_wait = "当目标存在时"
// Lsimulationcraft_overrides_description = ""
// Lsimulationcraft_profile = ""
L.summon_pet = "召唤宠物。"
L.icon_scale = "图标大小"
L.small_icon_scale = "小型图标大小"
L.font_scale = "字体大小"
L.second_icon_size = "第二图标大小"
// Lsimulationcraft_profile_content = ""
// Lscript_translated_from_sc_profile = ""
L.time_to_begin_flashing_before_ready = "在技能冷却时间结束之前开始闪光的提前量（毫秒）" // Needs review
L.lock_position = "锁定位置"
L.vertical = "垂直"
L.visibility = "可见设置"

} else if ( locale == "zhTW" ) {

L.numeric_display = "顯示數字"
L.display_two_abilities = "顯示兩排技能圖示"
L.show_remaining_time_numeric = "技能剩餘時間以數字顯示"
L.show_ovale = "顯示窗口"
L.show_keyboard_shortcuts = "顯示快捷列左下角的超出距離提醒圖示"
L.aoe = `AOE 範圍攻擊
根據敵人的總數來選擇。` // Needs review
L.aoe_short = "AOE 範圍攻擊"
L.appearance = "框架外觀設定"
L.arcane_mage_burn_phase = "奧法暴衝階段" // Needs review
L.aura_lag = "增益/減益效果延遲"
L.blood = "血量"
L.buffs = "提示能施放的增益法術"
L.hide_empty_buttons = "隱藏空的按鈕"
L.hide_in_vehicles = "使用載具時隱藏"
L.hide_ovale = "隱藏窗口"
L.hide_friendly_or_dead = "隱藏友好或已死亡的目標"
L.range_indicator = "範圍提醒"
L.cd = `冷卻時間長的技能 (大招)
盡快施放，或在爆發期使用。`
L.character_displayed_for_range = "自訂一段文字，如果目標是在範圍內，這段文字會在圖示上顯示提醒你。"
L.click_to_select_the_script = "左鍵選擇腳本。"
L.click_to_hide_show_options = "點擊隱藏/顯示選項"
L.code = "腳本"
L.copy_to_custom_script = "複製到自訂腳本"
L.latency_correction = "延遲校正"
L.debug_aura = "追蹤光環管理" // Needs review
L.debug_compile = "追蹤已編譯腳本" // Needs review
L.debug_enemies = "追蹤敵人偵測" // Needs review
L.debug_guid = "追蹤UnitID/GUID配對變化" // Needs review
L.debug_missing_spells = "使用的已知法術ID在法術書中無法找到時提醒" // Needs review
L.debug_unknown_spells = "腳本中使用了未知法術ID時提醒" // Needs review
L.options_horizontal_shift = "水平移動框架"
L.options_vertical_shift = "垂直移動框架"
L.scrolling = "滾動圖示"
L.overwrite_existing_custom_script = "是否覆寫已存在自訂腳本?"
L.show_in_combat_only = "只在戰鬥中顯示"
L.flash_brightness = "閃爍亮度"
L.flash_size = "閃爍尺寸"
L.flash_spells = "法術閃爍"
L.flash_spells_on_action_bars = "法術能使用時，閃爍技能列中的圖示。需要 SpellFlashCore。"
L.flash_threshold = "閃爍條件"
L.focus = "專注目標"
L.icon_group = "圖示群組"
L.icon = "圖示"
L.ignore_mouse_clicks = "忽略滑鼠點擊"
L.highlight_icon = "高亮度顯示圖示邊框"
L.highlight_icon_when_ability_spammed = "技能能使用時高亮度顯示圖示邊框"
L.hightlight_icon_when_ability_ready = "圖示變亮時，表示技能可以使用。"
L.interrupt = "斷法技能"
L.interrupts = "斷法技能"
L.toggle_check_box = "開啟/關閉選擇框"
L.lag_between_spellcast_and_aura = "法術施放後和受到光環影響之間的延遲時間 (毫秒)"
L.icons_scale = "調整圖示大小"
L.small_icons_scale = "調整小圖示大小"
L.font_scale = "調整字體大小"
L.scroll_icons = "圖示以滾動方式顯示"
L.long_cooldown_abilities = "冷卻時間長的大招"
L.main = "主要攻擊"
L.main_attack = "主要攻擊"
L.mana_gain = "法力獲得"
L.margin_between_icons = "圖示間距"
L.moving = "移動時可使用的攻擊技能"
L.multidot = "對多個目標的持續性傷害 DOT"
L.none = "無"
L.not_in_melee_range = "超出近戰範圍指示"
L.offgcd = `不受共用冷卻時間影響的技能
和主要攻擊技能一起施放。`
L.only_enemy_if_affected_by_spells = "計算直接受到玩家法術影響的敵人。"
L.only_count_tagged_enemies = "只有直接受影響的敵人"
L.icons_opacity = "圖示透明度"
L.options_opacity = "選項透明度"
L.options = "選項"
// Loverrides = ""
L.next_nonfiller_attack = "下一個非填補攻擊。" // Needs review
L.two_abilities = "預測"
L.keyboard_shortcuts = "顯示快捷鍵"
L.right_click_for_options = "右鍵開啟選項。"
L.scripts = "腳本"
L.default_scripts = "預設腳本"
L.custom_scripts = "自訂腳本"
L.short_cd = `冷卻時間短的技能
儘快施放，或卡GCD、無招可放時使用。`
L.short_cooldown_abilities = "冷卻時間短的技能"
L.show_hidden = "顯示隱藏的腳本"
L.show_minimap_icon = "顯示小地圖按鈕"
L.show_icon_next_spell = "顯示下一個要施放的技能圖示"
L.show_wait = "顯示等待圖示"
L.show_wait = "有目標才顯示"
// Lsimulationcraft_overrides_description = ""
L.simulationcraft_profile = "SimulationCraft 設定檔"
L.summon_pet = "召喚寵物。"
L.icon_scale = "圖示大小"
L.small_icon_scale = "小圖示大小"
L.font_scale = "字體大小"
L.second_icon_size = "第二圖示大小"
L.simulationcraft_profile_content = "SimulationCraft 設定檔內容。"
L.script_translated_from_sc_profile = "依據 SimulationCraft 設定檔轉譯的腳本。"
L.time_to_begin_flashing_before_ready = "法術能夠使用前，多久開始閃爍 (毫秒)"
L.lock_position = "鎖定圖示位置"
L.vertical = "垂直圖示"
L.visibility = "可見性設定" // Needs review

}

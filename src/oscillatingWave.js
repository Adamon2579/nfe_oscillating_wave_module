import { updateActor } from "./updateActor.js";
import { CONTEXT_CAST_COLD, CONTEXT_INIT } from "./utils/constants.js";

export class OscillatingWave {

    start(verbose = true) {
        Hooks.on("ready", () => {
            if (verbose) {
                fetch('./modules/nfe_oscillating_wave_module/module.json')
                    .then(response => response.json())
                    .then(jsonResponse => console.log(`Starting module : OscillatingWave v${jsonResponse.version}`))
                    .catch(e => console.log(`Starting module : OscillatingWave (error retrieving version number)`));
            }

            //init actors
            game.actors.forEach(actor => {
                if (actor.items.filter(item => item.name === 'The Oscillating Wave').length > 0) { //FIXME find a better way than using name
                    console.log('nfe-oscillating-wave-module found an oscillating wave psychic');
                    updateActor(actor, CONTEXT_INIT);
                }
            });

            Hooks.on("renderChatMessage", (message, html) => {

                //Filter messages sent by you
                if (message.user === game.user) {

                    //Filter Spell / effects affected by conservation of energy
                    //Spells
                    if (message.content.includes("hb_conservation-of-energy")) {//FIXME extract this check in a specialized function where I also check if it is indeed a cast spell
                        console.log('nfe-oscillating-wave-module intercepted a spell with the conservation of energy trait');
                        //let actualMessage = game.messages.get(message.id);
                        //actualMessage.update({ "content": "test message automaticaly updated by module" })


                        //Handle first choice
                        const COE_FIRE_EFFECT_UUID = 'Compendium.world.ow-effects.Item.JBlR5VyoWad5fMVQ'; //FIRE
                        const COE_COLD_EFFECT_UUID = 'Compendium.world.ow-effects.Item.XjNDVHeHaj3cBOml'; //COLD

                        const existingFireState = message.actor.itemTypes.effect.find((e) => e.flags.core?.sourceId === COE_FIRE_EFFECT_UUID);
                        const existingColdState = message.actor.itemTypes.effect.find((e) => e.flags.core?.sourceId === COE_COLD_EFFECT_UUID);

                        if (!existingFireState && !existingColdState) {
                            createChatCardButton(message, html);
                        }

                        else if (existingFireState) {
                            updateActor(message.actor, CONTEXT_CAST_COLD);
                        }

                        else {
                            updateActor(message.actor, CONTEXT_CAST_FIRE);
                        }

                    }

                    //Effects (with mindshift trait) => can choose not to do anything


                }
            });
        });
    }
}

// Hooks.on(
//     "renderChatMessage",
//     async (message, html) => {
//         if (canvas.initialized) {
//             const speaker = await fromUuid(`Actor.${message.speaker.actor}`);
//             if (
//                 (message.flags?.pf2e?.context?.type === "attack-roll" ||
//                     message.flags?.pf2e?.context?.type === "spell-attack-roll" ||
//                     message.flags?.pf2e?.context?.type === "saving-throw") &&
//                 speaker.isOwner
//             ) {
//                 updateWeaknessType(message, speaker);
//                 handleEsotericWarden(message);
//             }
//         }
//         createChatCardButton(message, html);
//     },
//     { once: false }
// );


// `<div class="pf2e chat-card item-card"\n    \n    
// data-spell-lvl="1"\n    
// data-cast-level="1"\n    
// data-actor-id="DCF5rS3rTeLVd6Bg"\n    
// data-item-id="eAmLCBzZ5P48xd7D"\n    \n>\n    
// <header class="card-header flexrow">\n        
// <img src="icons/magic/fire/flame-burning-earth-orange.webp" 
// title="Produce Flame" width="36" height="36" />\n        
// <h3>Produce Flame</h3>\n        
// <h4>Cantrip 1</h4>\n    
// </header>\n\n    
// <section class="item-properties tags">                
// <span class="tag" data-trait="concentrate" data-description="PF2E.TraitDescriptionConcentrate">Concentrate</span>\n                
// <span class="tag" data-trait="manipulate" data-description="PF2E.TraitDescriptionManipulate">Manipulate</span>\n            
// <hr class="vr" />            
// <span class="tag tag_alt" data-trait="" data-description="PF2E.TraitDescriptionAttack">Attack</span>\n            
// <span class="tag tag_alt" data-trait="" data-description="PF2E.TraitDescriptionCantrip">Cantrip</span>\n            
// <span class="tag tag_alt" data-trait="" data-description="PF2E.TraitDescriptionEvocation">Evocation</span>\n            
// <span class="tag tag_alt" data-trait="" data-description="PF2E.TraitDescriptionFire">Fire</span>\n            
// <span class="tag tag_alt" data-trait="" data-description="PF2E.TraitDescriptionOccult">Occult</span>\n    
// </section>\n\n    <section class="card-content">\n        
// <p>A small ball of flame appears in the palm of your hand, and you lash out with it either in melee or at range. Make a spell attack roll against your target's AC. This is normally a ranged attack, but you can also make a melee attack against a creature in your unarmed reach.</p>\n<p>On a success, you deal 1d4 fire damage plus your spellcasting ability modifier. On a critical success, the target takes double damage and <a class="inline-roll roll" data-mode="roll" data-flavor="" data-formula="(1)d4[persistent,fire]" data-tooltip="1d4 persistent fire" data-damage-roll="" draggable="true" data-persistent=""><i class="fa-solid fa-dice-d4"></i>1d4 persistent fire</a> damage.</p>\n<hr>\n<p><strong>Heightened (+1)</strong> Increase the damage by 1d4 and the persistent damage on a critical hit by 1d4.</p>\n    
// </section>\n\n    <section class="card-buttons">\n                
// <section class="owner-buttons">\n                        
// <div class="spell-attack-buttons">\n                            
// <button type="button" data-action="spell-attack" data-visibility="owner">Attack</button>\n                            
// <button type="button" data-action="spell-attack-2" data-visibility="owner">MAP -5</button>\n                            
// <button type="button" data-action="spell-attack-3" data-visibility="owner">MAP -10</button>\n                        
// </div>\n                        
// <div class="spell-button">\n                            
// <button type="button" data-action="spell-damage" data-visibility="owner">Damage</button>\n                        
// </div>\n                
// </section>\n    
// </section>\n\n    
// <footer class="card-footer">\n            
// <span>Components: SV</span>\n            
// <span>Range: 30 feet</span>\n            
// <span>Targets: 1 creature</span>\n            
// <span>Cast Time: 2</span>\n    
// </footer>\n</div>`
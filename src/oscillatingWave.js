import { updateActor } from "./updateActor.js";
import { createChatCardButton } from "./utils/chatCard.js";
import { CONTEXT_CAST_COLD, CONTEXT_CAST_FIRE, CONTEXT_INIT } from "./utils/constants.js";

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
            console.log('nfe-oscillating-wave-module Actors initialisation finished')

            Hooks.on("renderChatMessage", (message, html) => {

                //Filter messages sent by you
                if (message.user === game.user) {

                    if (canvas.initialized) {

                        //Filter Spell / effects affected by conservation of energy
                        //Spells
                        if (message.flags?.pf2e?.context?.type === 'spell-cast' && message.content.includes('Conservation of Energy')) {//FIXME extract this check in a specialized function where I also check if it is indeed a cast spell
                            console.log('nfe-oscillating-wave-module intercepted a spell with the conservation of energy trait');

                            const COE_FIRE_EFFECT_UUID = 'Compendium.world.ow-effects.Item.JBlR5VyoWad5fMVQ'; //FIRE
                            const COE_COLD_EFFECT_UUID = 'Compendium.world.ow-effects.Item.XjNDVHeHaj3cBOml'; //COLD

                            const existingFireState = message.actor.itemTypes.effect.find((e) => e.flags.core?.sourceId === COE_FIRE_EFFECT_UUID);
                            const existingColdState = message.actor.itemTypes.effect.find((e) => e.flags.core?.sourceId === COE_COLD_EFFECT_UUID);

                            //Handle first choice
                            if (!existingFireState && !existingColdState) {
                                createChatCardButton(message, html);
                            }

                            //Handle switch to cold
                            else if (existingFireState) {
                                updateActor(message.actor, CONTEXT_CAST_COLD);
                            }

                            //handle switch to fire
                            else {
                                updateActor(message.actor, CONTEXT_CAST_FIRE);
                            }

                        }

                        //Effects (with mindshift trait) => can choose not to do anything
                    }
                }
            });
        });
    };
};

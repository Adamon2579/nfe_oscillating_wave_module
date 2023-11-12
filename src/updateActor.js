import { CONTEXT_INIT, CONTEXT_REFOCUS, CONTEXT_CAST_FIRE, CONTEXT_CAST_COLD } from "./utils/constants.js";

//Updates the actor with the correct effect from compendium
async function updateActor(actor, context) {
    //FIXME check if uuid is constant between worlds
    const COE_STABLE_EFFECT_UUID = 'Compendium.world.ow-effects.Item.QtfZ7PHfYaoXQYWS'; // Effect: STABLE
    const COE_FIRE_EFFECT_UUID = 'Compendium.world.ow-effects.Item.JBlR5VyoWad5fMVQ'; //FIRE
    const COE_COLD_EFFECT_UUID = 'Compendium.world.ow-effects.Item.XjNDVHeHaj3cBOml'; //COLD

    const existingStableState = actor.itemTypes.effect.find((e) => e.flags.core?.sourceId === COE_STABLE_EFFECT_UUID);
    const existingFireState = actor.itemTypes.effect.find((e) => e.flags.core?.sourceId === COE_FIRE_EFFECT_UUID);
    const existingColdState = actor.itemTypes.effect.find((e) => e.flags.core?.sourceId === COE_COLD_EFFECT_UUID);

    const coeStableEffect = await fromUuid(COE_STABLE_EFFECT_UUID);
    const coeFireEffect = await fromUuid(COE_FIRE_EFFECT_UUID);
    const coeColdEffect = await fromUuid(COE_COLD_EFFECT_UUID);

    if (context === CONTEXT_INIT && !existingStableState && !existingFireState && !existingColdState) {
        const source = coeStableEffect.toObject();
        source.flags = mergeObject(source.flags ?? {}, { core: { sourceId: COE_STABLE_EFFECT_UUID } });
        await actor.createEmbeddedDocuments("Item", [source]);
    }

    if (context === CONTEXT_REFOCUS) {
        if (existingFireState) {
            await existingFireState.delete();
        }
        if (existingColdState) {
            await existingColdState.delete();
        }
        if (!existingStableState) {
            const source = coeStableEffect.toObject();
            source.flags = mergeObject(source.flags ?? {}, { core: { sourceId: COE_STABLE_EFFECT_UUID } });
            await actor.createEmbeddedDocuments("Item", [source]);
        }
    }

    if (context = CONTEXT_CAST_FIRE) {
        if (existingStableState) {
            await existingStableState.delete();
        }
        if (existingColdState) {
            await existingColdState.delete();
        }
        if (!existingFireState) {
            const source = coeFireEffect.toObject();
            source.flags = mergeObject(source.flags ?? {}, { core: { sourceId: COE_FIRE_EFFECT_UUID } });
            await actor.createEmbeddedDocuments("Item", [source]);
        }
    }

    if (context = CONTEXT_CAST_COLD) {
        if (existingStableState) {
            await existingStableState.delete();
        }
        if (existingFireState) {
            await existingFireState.delete();
        }
        if (!existingColdState) {
            const source = coeColdEffect.toObject();
            source.flags = mergeObject(source.flags ?? {}, { core: { sourceId: COE_COLD_EFFECT_UUID } });
            await actor.createEmbeddedDocuments("Item", [source]);
        }
    }
}

export { updateActor };
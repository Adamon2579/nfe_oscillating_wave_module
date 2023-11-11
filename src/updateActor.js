//Updates the actor with the correct effect from compendium
async function updateActor(actor, effect) {
    //TODO use effect to know what effect to add to the actor
    const COE_STABLE_EFFECT_UUID = 'Compendium.world.ow-effects.Item.QtfZ7PHfYaoXQYWS'; // Effect: STABLE
    const COE_FIRE_EFFECT_UUID = 'Compendium.world.ow-effects.Item.JBlR5VyoWad5fMVQ'; //FIRE
    const COE_COLD_EFFECT_UUID = 'Compendium.world.ow-effects.Item.XjNDVHeHaj3cBOml'; //COLD

    const coeStableEffect = await fromUuid(COE_STABLE_EFFECT_UUID);
    const source = coeStableEffect.toObject();
    source.flags = mergeObject(source.flags ?? {}, { core: { sourceId: COE_STABLE_EFFECT_UUID } });

    const existing = actor.itemTypes.effect.find((e) => e.flags.core?.sourceId === COE_STABLE_EFFECT_UUID);
    if (existing) {
        //await existing.delete();
    } else {
        await actor.createEmbeddedDocuments("Item", [source]);
    }

}

export { updateActor };
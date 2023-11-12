import { updateActor } from "../updateActor.js";
import { CONTEXT_CAST_COLD, CONTEXT_CAST_FIRE } from "./constants.js";

//Creates the button in the chat tile for actions and feats
async function createChatCardButton(message, html) {
    const actionOrigin = message.flags.pf2e?.origin;

    if (actionOrigin?.type === 'spell') {
        const user = game.user;
        const speaker = message.actor;
        html = html.find(".message-content");
        const contentArea = html.find(".card-content");
        contentArea.append(
            $(
                `<button class='nfe-ow-button' ${speaker.isOwner ? "" : 'style="visibility:hidden"'} title="Add energy">    
                    Add energy
                </button>`
            ).on({
                click: () => {
                    updateActor(actor, CONTEXT_CAST_FIRE);
                },
            })
        );
        contentArea.append(
            $(
                `<button class='nfe-ow-button' ${speaker.isOwner ? "" : 'style="visibility:hidden"'} title="Remove energy">    
                    Remove energy
                </button>`
            ).on({
                click: () => {
                    updateActor(actor), CONTEXT_CAST_COLD;
                },
            })
        );
    }
}

export { createChatCardButton };
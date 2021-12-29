/* eslint-disable sort-keys */
/* eslint-disable no-undef */
import { customError } from "../../utils/customError.js";
import { BaseCommand } from "../../base/BaseCommand.js";
import { APPLICATIONS } from "../../utils/constants.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class CreateActivityCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "create-activity",
                description: "Creates activities like youtube-together, etc.",
                options: [
                    {
                        type: "STRING",
                        name: "activity",
                        description: "Activity name to generate invite for",
                        required: true
                    },
                    {
                        type: "CHANNEL",
                        name: "channel",
                        channelTypes: ["GUILD_VOICE"],
                        description: "The channel for which to generate invite",
                        required: true
                    }
                ]
            },
            category: "General"
        });
    }

    async execute(ctx) {
        const channel = ctx.context.options.getChannel("channel");
        const activityName = ctx.context.options.getString("activity");

        const applicationId = APPLICATIONS[activityName.toLowerCase()];

        if (!applicationId) {
            return ctx.send({
                embeds: [
                    makeEmbed("error", `Invalid application name, valid choices are: ${Object.keys(APPLICATIONS).map(x => `\`${x}\``).join(", ")}`)
                ]
            });
        }

        const createInvite = await channel.createInvite({
            temporary: false,
            maxAge: 86400,
            maxUses: 0,
            targetApplication: applicationId,
            targetType: 2

        }).catch(e => customError("CREATE_ACTIVITY_INVITE", e));

        ctx.send({
            embeds: [
                makeEmbed("info", `This is the invite link [Click here to join](https://discord.gg/${createInvite.code}) for activity \`${activityName}\``)
            ]
        });
    }
}

require("dotenv").config({path: "../.env"})
const {REST , Routes , SlashCommandBuilder} = require("discord.js")

async function Command(){
    const commands = [    // Setting up the commands 
        new SlashCommandBuilder()
        .setName("urlfetcher")
        .setDescription("It fetches the metadata of the provided url")
        .addStringOption( option => {
            option.setName("url")
            option.setDescription("Paste link here --- ")
            option.setRequired(true)

            return option
        })
        .toJSON() // Because DC api can only process json format data
    ]

    const restClient = new REST({version:10})  // creating a client for rest api
    restClient.setToken(process.env.TOKEN)     // Providing the bot id so that it can authenticate and make changes

    await restClient.put( Routes.applicationCommands(process.env.CLIENT_ID), {body:commands}) //creating a put rooute and sending body
    console.log("Command successfully registered!!!")
}

Command()
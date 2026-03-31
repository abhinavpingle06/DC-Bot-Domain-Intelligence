require("dotenv").config()
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js")
const UrlValidator = require("./utils/validateURL")
const getMetadata = require("./services/metadata")
const getDomain = require("./services/domain")
const HostingProvider = require('./services/hosting')
const getProduct = require("./services/ProductsList")
const getRedirectUrl = require("./utils/redirect")

const client = new Client(   //Creating a new client for our bot
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,      // Its permissions
            GatewayIntentBits.MessageContent
        ]
    }
)

client.on("messageCreate", (message) => {
    if (message.content.toLowerCase() == "hello" || message.content.toLowerCase() == "hi" || message.content.toLowerCase() == "hey")
        message.reply({ content: "Hi From Web Info Bot 🤖" })
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName == "urlfetcher") {
        try {
            const url = interaction.options.getString('url')

            await interaction.deferReply()    // Our reply might take seconds , so it commands it to wait for response

            const redirectUrl = await getRedirectUrl(url)
            const urlObj = await UrlValidator(redirectUrl)   // validates the provided url 
            if (urlObj == false)
                return await interaction.editReply({ content: "Invalid url provided! 🤖" })

            const [titleInfo, domainInfo, hostInfo] = await Promise.all([getMetadata(urlObj.link), getDomain(urlObj.hostname), HostingProvider(urlObj.link, urlObj.hostname)]);
            console.log(urlObj.hostname)
            console.log(domainInfo)
            console.log(hostInfo)
            console.log(titleInfo)

            const ProductsList = await getProduct(hostInfo.Organization)
            console.log(ProductsList)

            const fewProducts = []
            if (ProductsList) {
                var i = ProductsList.length - 1
                const len = ProductsList.length
                var count = 0
                while (count < 10) {
                    if (i >= 0) {
                        fewProducts.push(ProductsList[i])
                        i--
                        count++
                        continue
                    }
                    break
                }
            }

            const embed = new EmbedBuilder()
                .setTitle("Fetched Information")
                .setColor(0x00ffcc)
                .setFields(
                    { name: 'Title', value: String(titleInfo.data)??"", inline: false },
                    { name: 'Domain', value: String(domainInfo.domain)??"", inline: false },
                    { name: 'Age', value: String(domainInfo.currAge)??"", inline: true },
                    { name: 'Registry Date', value: `${domainInfo.registryMonth} ${domainInfo.registryYear}`, inline: true },
                    { name: 'Expiry Date', value: `${domainInfo.expiryMonth} ${domainInfo.expiryYear}`, inline: true },
                    { name: 'Server', value: String(hostInfo.server)??"", inline: true },
                    { name: 'Organization', value: String(hostInfo.Organization)??"", inline: true },
                    { name: 'IPCountry', value: String(hostInfo.IPcountry)??"", inline: true },
                    // { name: 'SSL', value: hostInfo.sslValidity ? "Valid":"No" },
                    { name: 'Associated Products', value: fewProducts.join("\n")??"", inline: true }

                )

            interaction.editReply({ embeds: [embed] })

        } catch (error) {
            console.log(error)
        }
    }
})

client.login(process.env.TOKEN)
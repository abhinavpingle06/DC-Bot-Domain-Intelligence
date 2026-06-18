require("dotenv").config()
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js")
const express = require("express")

const UrlValidator = require("./utils/validateURL")
const getMetadata = require("./services/metadata")
const getDomain = require("./services/domain")
const HostingProvider = require('./services/hosting')
const getProduct = require("./services/ProductsList")
const getRedirectUrl = require("./utils/redirect")

const app = express()
app.use(express.json())

const client = new Client(   //Creating a new client for our bot
    {                        //A client is nothing but a user
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,      // Its permissions
            GatewayIntentBits.MessageContent
        ]
    }
)

app.post("/api/urlfetcher", async (req,res) => {
    try {
        const { url } = req.body;
        const urlObj = UrlValidator(url)   // validates the provided url and extracts the data like hostname
        if (urlObj == false)
            return res.json({ "status": 400, "content": "Invalid url provided! 🤖" })

        const [titleInfo, domainInfo, hostInfo] = await Promise.all([getMetadata(urlObj.link), getDomain(urlObj.hostname), HostingProvider(urlObj.link, urlObj.hostname)]);
        // console.log(urlObj.hostname)
        // console.log(domainInfo)
        // console.log(hostInfo)
        // console.log(titleInfo)

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

        return res.json({
            "status":200,
            "titleInfo":titleInfo, 
            "domainInfo":domainInfo, 
            "hostInfo":hostInfo, 
            "fewProducts":fewProducts 
        })
    } catch (error) {
        console.log(error)
        return res.json({ "status":500, "content": "Error!! Server isn't responding... 🤖" })
    }
})

app.get("/", async (req, res) => {
    console.log("Server Started on Port 3000")
    return res.json({"Status":"Success"})
})

app.listen(3000, () => {
    console.log("The server has started on port 3000")
})


client.on("messageCreate", (message) => {
    if (message.content.toLowerCase() == "hello" || message.content.toLowerCase() == "hi" || message.content.toLowerCase() == "hey")
        message.reply({ content: "Hi From Web Info Bot 🤖" })
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName == "urlfetcher") {   //Command should be url fetcher
        try {
            const url = interaction.options.getString('url')
            console.log(url)
            await interaction.deferReply()    // Our reply might take seconds , so it commands it to wait for response

            const res = await fetch('http://localhost:3000/api/urlfetcher',{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({"url":url})
            })
            
            const data = await res.json();
            const status = data.status;
            if(status==500 || status == 400 ){
                return await interaction.editReply({ content: status })
            }

            const titleInfo = data.titleInfo;
            const domainInfo = data.domainInfo;
            const hostInfo = data.hostInfo;
            const fewProducts = data.fewProducts;
            
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
                    { name: 'SSL', value: hostInfo.sslValidity ? "Valid":"No" },
                    { name: 'Associated Products', value: fewProducts.join("\n")??"", inline: true }

                )

            interaction.editReply({ embeds: [embed] })

        } catch (error) {
            console.log(error)
            return await interaction.editReply({ content: "Issue with forming reply. Try again! " })
        }
    }
})

client.login(process.env.TOKEN)
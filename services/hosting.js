const dns = require("node:dns/promises")

async function HostingProvider(url , hostname) {
    try {
        console.log("In Hosting Provider")
        const res = await fetch(url , {signal:AbortSignal.timeout(8000)})
        console.log("Fetched the link")
        const serverName = res.headers.get("server") || "UNKNOWN"
        console.log(serverName)

        //getting ip address info 
        const dnsData = await dns.lookup(hostname)
        console.log("Fettch the IP")
        const ip = dnsData.address
        
        const dnsRes = await fetch(`https://ipwhois.app/json/${ip}?strict=true`)
        console.log("Got DNS response")
        const dnsjson =  await dnsRes.json()
        const owner = dnsjson.org || "UNKNOWN"
        const country = dnsjson.country || "UNKNOWN"
        const ssl = url.startsWith("https");
        console.log(owner , country , ssl)
        console.log("SUCCESS IN HOST INFO")

        return {
            server : serverName , 
            Organization : owner,
            IPcountry : country,
            sslValidity : ssl
        }
         
    } catch (error) {
        console.log(error)
    }
    
}

// const url = "https://www.youtube.com/watch?v=Gv9MezPAchI"
// const url = "https://github.com/Abhi-corebits/Authentication-Authorization-FastAPI"
// url = "https://login.twilio.com/u/login?state=twilio"
// const url = "https://www.amazon.com/Wicked-Bonus-Jon-M-Chu/dp/B0DGZV9Z5Z/ref=sr_1_1?dib=eyJ2IjoiMSJ9.ejnUNCr2Icf49Lcc9E6_lJ0ShrjBTgOcecKjoahL7EuVm9iujf9bSMqbqyiXV7yFqY2yZmX8fKhW1_5ctm_nP5hVPnxkVtSMU8C_H7ECVdsaLajhR-FGhRmQynKPXUlHjPGNjSvc1HnL5_SKQZvtFBAqPi5nh7LwuTm6lgaQk5FLhM7WRO8Ygom0p6aq332XDoEq70NCsD0Ci4MrV1PWASgjerxIR3sLwSeV9qpBOcg.0UcrvFrK-18tTJCytq8T7I255Uv3AMh2_6q6F8CdqJY&dib_tag=se&keywords=en&qid=1766678640&sr=8-1HostingProvider(url)"
// HostingProvider(url)
module.exports = HostingProvider


// rul = "https://discord.com/developers/applications/1452888455561347387/skus"
// rul = "https://www.youtube.com/watch?v=Gv9MezPAchI"
// UrlValidator(rul)
function UrlValidator(url){
    try {
        urlObj = new URL(url)
        console.log("Successfully converted into url object");
        // console.log(`We Got url: ${url} & after validation:${urlObj.hostname} ${urlObj.href} ${urlObj.origin}`);
   
        return {
            "link":urlObj.href ,
            "origin": urlObj.origin ,
            "hostname" : urlObj.hostname 
        }
        
    } catch (error) {
        return false       
    }
}


module.exports = UrlValidator

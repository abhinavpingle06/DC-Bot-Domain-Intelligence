// const urlValidator = require("../utils/validateURL")
const cheerio = require("cheerio")

async function getMetadata(url) {
    try {
        // console.log("Succcessfully In metadata")
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }, signal: AbortSignal.timeout(8000)
        }) //timeout is useed to tell how many max seconds to wait for response.
        
        // console.log("Succcessfully fetch")
        const html = await res.text() //This provides the html of whole page 
        const $ = cheerio.load(html)
        const metadata = $("title").text().trim() || "Failed to fetch Title"
        console.log(metadata)
        // console.log("Successsfully Fetched the Title");

        return { data: metadata } //This metadata will be send forward to gemini to provide some info about the link

    } catch (error) {

        console.log(error);
    }
}
// // const url = "https://www.youtube.com/watch?v=Gv9MezPAchI"
// // const url = "https://github.com/Abhi-corebits/Authentication-Authorization-FastAPI"
// const url = "https://www.amazon.com/s?k=gaming&_encoding=UTF8&content-id=amzn1.sym.edf433e2-b6d4-408e-986d-75239a5ced10&pd_rd_r=b28a8b44-78a2-459d-9b0e-c1e8750687e7&pd_rd_w=kZo2Z&pd_rd_wg=GvWXt&pf_rd_p=edf433e2-b6d4-408e-986d-75239a5ced10&pf_rd_r=EGDPVEF6K7P64Z347TDF&ref=pd_hp_d_atf_unk"
// getMetadata(url)

module.exports = getMetadata


const fetch = require("node-fetch"); // Node <18

async function getRedirectUrl(shortUrl) {
    try {
        const res = await fetch(shortUrl, {
            redirect: "follow",               // follows all redirects
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        return res.url; // final URL after all redirects
    } catch (err) {
        console.error("Error:", err.message);
        return null;
    }
}

module.exports = getRedirectUrl

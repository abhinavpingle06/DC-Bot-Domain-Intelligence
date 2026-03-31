// const urlValidator = require("../utils/validateURL")

async function getDomain(hostname){
    try {
        console.log("In getDomain")
        const month = ["Jan" , "Feb" , 'March' , "Apr" , "May" , "June" , "July" , "Aug" , "sep" , "Oct" , "Nov" , "Dec"]

        const data = hostname 
        const dataArr = data.split(".")
        const domain = dataArr.length <= 2 ? data : dataArr.slice(-2).join(".")  // To get the domain only and remove the unnecessary parts

        const res = await fetch(`https://rdap.org/domain/${domain}` )
        const body = await res.json()
        console.log("Fetched Domain info")
        
        const domainName = body.ldhName
        const registration = body.events?.find((event) => event.eventAction === 'registration') //we get objct of registration 
        const expiration = body.events?.find((event) => event.eventAction === 'expiration')
        const lastUpdation = body.events?.find((event) => event.eventAction === 'last changed') // You can use if you want , I dropped this from my project 

        const registrationYear = new Date(registration.eventDate).getFullYear()  // we take out the dates from the obj
        const registrationMonth = new Date(registration.eventDate).getMonth() 
        // console.log(registrationYear , month[registrationMonth]); // Registration Dates

        const expirationYear = new Date(expiration.eventDate).getFullYear()
        const expirationMonth = new Date(expiration.eventDate).getMonth() 
        // console.log(month[expirationMonth] , expirationYear)

        //Calc Age
        const currentYear = new Date().getFullYear()
        const age = currentYear - registrationYear
        console.log("Success In Domain fetching")
        
        return {
            domain:domainName , 
            registryMonth : month[registrationMonth] , 
            registryYear : registrationYear,
            currAge : age , 
            expiryMonth : month[expirationMonth],
            expiryYear : expirationYear 
        }

    } catch (error) {
        console.log(error);
        
    }
}


module.exports= getDomain
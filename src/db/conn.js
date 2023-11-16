const mongoose = require("mongoose");


//connect with mongodb Compass

// mongoose.connect("mongodb://127.0.0.1:27017/youtubeRegistration").then(() => {
//     console.log(`connection successful`);
// }).catch((e) => {
//     console.log(`no connection`);
// })



//Connect with Atlas cluster


const username = encodeURIComponent(process.env.secret_username);
const password = encodeURIComponent(process.env.secret_password);

mongoose.connect(`mongodb+srv://${username}:${password}@cluster1.2chku1z.mongodb.net/youtubeRegistration`).then(() => {
    console.log(`connection successful`);
}).catch((e) => {
    console.log(e);
})



// mongodb+srv://${username}:${password}@cluster0.mwrxqlz.mongodb.net/youtubeRegistration           //Project0
// mongodb+srv://${username}:${password}@cluster1.2chku1z.mongodb.net/youtubeRegistration           //mernprj
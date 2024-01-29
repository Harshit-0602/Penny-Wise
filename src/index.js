import dotenv from "dotenv"
import { app } from "./app.js";
dotenv.config({
    path: "./.env"
});
import { connectdb } from "./db/index.js"

connectdb().then(() => {
    console.log("DATABASE connection successfull...!!!!!");
    app.listen(process.env.port, () => {
        console.log(`Sever is running on port : ${process.env.port}`);
    })
}
).catch((err) => {
    console.log("Error Occurred while connection to the Database : "+err);
})
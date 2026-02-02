import mongoose from "mongoose";

export async function database() {
    
    let uri = process.env.MONGO_URI;
    if(uri){
        mongoose.connect(uri)
            .then(() => {console.log("Connected")})
    }
}
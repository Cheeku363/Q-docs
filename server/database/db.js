import mongoose from "mongoose";

const Connection = async (URL) =>{
    
    try{
        await mongoose.connect(URL, {useUnifiedTopology: true, useNewUrlParser: true})
        console.log('Mongodb Connected');
    } catch (error){
        console.log('Error while connection', error);
    }
}

export default Connection
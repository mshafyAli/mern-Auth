import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
dotenv.config();


// DataBase
 async function run(){
    try{
        await mongoose.connect(process.env.MONGO)
        console.log('Successfully connected to MongoDB');
    }catch(e){
        console.log(e);
        await mongoose.disconnect();
        process.exit(1);
    }
}
    run().catch(console.dir)
     process.on('SIGINT', async () => {
        console.log('app is terminating');
        await mongoose.disconnect();
        process.exit(0);
        
});

const app = express();
app.use('/api/user',userRoutes)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
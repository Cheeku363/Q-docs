import { Server } from 'socket.io'
import express from 'express';
import { createServer } from 'http';
import path from 'path';

const PORT = process.env.PORT || 9000
const URL = process.env.MONGODB_URI || "mongodb://chirag:828398@docs-clone-shard-00-00.w6joi.mongodb.net:27017,docs-clone-shard-00-01.w6joi.mongodb.net:27017,docs-clone-shard-00-02.w6joi.mongodb.net:27017/docs-clone?ssl=true&replicaSet=atlas-tll2l1-shard-0&authSource=admin&retryWrites=true&w=majority"

import {getDocument, updateDocument} from './controller/documentController.js'

import Connection from './database/db.js';

Connection(URL);


if(process.env.NODE_ENV === 'production'){
    app.use(express.static('./client/build'));
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, "./client/build", "index.html"))
    })
}


const io = new Server(PORT, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', socket => {
    socket.on('get-document', async documentId => {
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', document.data);

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        })

        socket.on('save-document', async data => {
            await updateDocument(documentId, data);
        })
    })
});
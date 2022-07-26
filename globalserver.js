import os from 'os';
import socket from 'socket.io-client';
import fs from "fs";
import {
    int,
    er,
    warn,
    fb,
    load
} from './src/logger.js';
export default async function (api) {
        try {
            const io = socket.connect("https://server.fongdz.me");
            const botdescription = await fs.promises.readFile("./description.txt", { encoding: "utf8" });
            io.on('connect', () => int("[SERVER] Connected to server!"));
            io.on('disconnect', r => warn("[SERVER] Disconnected from server!"));
            
            io.send({
                linkbot:api.getCurrentUserID(),
                botname:global.config.botname,
                prefix:global.config.prefix,
                language:global.config.lang,
                system:os.type(),
                description:botdescription,
                version:global.package.version
            });
            warn("[SERVER] Starting sent bot info!");
        } catch (e) {
            er("[SERVER] Error: " + e);
        }
}
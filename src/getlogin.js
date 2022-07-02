import fs from 'fs';
import {
    int,
    er,
    warn,
    fb,
    load
} from './logger.js';

export default function getLoginFolder () {
    if (fs.existsSync('./loginfile')) {
        int('Login Folder Exists!');
    } else {
        try {
            fs.mkdirSync('./loginfile');
            er('Can not find Login Folder')
            warn('Creating Login Folder...');
            int('Created Login Folder Successfully!');
        } catch (err) {
            er(err);
            er("[ERROR] Cannot create login folder! Please check your system and try again...");
            process.exit(100);
        }
    }
}

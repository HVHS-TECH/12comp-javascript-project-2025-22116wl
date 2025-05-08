import { initialise, authenticate, read, write, updateVal } from './fb_io.mjs';
window.fb_initialise = initialise;
window.fb_authenticate = authenticate;
window.fb_read = read;
window.fb_write = write;
window.fb_update = updateVal;
import { initializeApp }        from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase }          from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { set, get, ref, update, query, orderByChild, limitToFirst } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var fb_db;

function initialise() {
    console.log('initialising');

    fb_db = getDatabase(initializeApp(
        {
            apiKey: "AIzaSyCwPcoDMGchHrJSuN_CWiQciiIJcnhYJVE",
            authDomain: "comp-2025-wilfred-leices-a7207.firebaseapp.com",
            databaseURL: "https://comp-2025-wilfred-leices-a7207-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "comp-2025-wilfred-leices-a7207",
            storageBucket: "comp-2025-wilfred-leices-a7207.firebasestorage.app",
            messagingSenderId: "155933616174",
            appId: "1:155933616174:web:78589529167648f04f97bf"
        }
    ));

    console.info(fb_db);
}

function authenticate() {
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();
    
    // The following makes Google ask the user to select the account
    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });
    
    signInWithPopup(AUTH, PROVIDER).then((result) => {
        console.log('success');
        console.log(result);
    })
    
    .catch((error) => {
        console.log('error!');
        console.log(error);
    });
}


function read(path) {
    const REF = ref(fb_db, path);

    get(REF).then((snapshot) => {
        var fb_data = snapshot.val();

        if (fb_data != null) {
            console.log(fb_data);
            return fb_data;
        } else {
            console.log('no data found');
        }

    }).catch((error) => {
        console.log('error in reading database');
        console.log(error);
    });
}

function write(path, data) {
    const REF = ref(fb_db, path);
    console.info(fb_db);

    console.log(REF);

    set(REF, data).then(() => {
        console.log('written successfully!');
    }).catch((error) => {
        console.log('error');
        console.log(error);
    });
}

function update(path, data) {
    const REF = ref(fb_db, path);

    update(REF, data).then(() => {
        console.log('updated successfully');
    }).catch((error) => {
        console.log('error');
        console.log(error);
    });
}

export { initialise, authenticate, read, write, update };
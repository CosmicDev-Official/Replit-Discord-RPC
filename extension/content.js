let cachedurl;
let cachedfile;
let cachedpos;

function pageLoadHandler() { // Waits until the page is fully loaded before initiating the main code
    let scurl = window.location.href.split("https://replit.com/")[1].split("/")[0];
    if (scurl.startsWith("@")) {
        let editorIndicator = document.querySelector('[data-cy="current-position"]');
        if (editorIndicator != null) {
            main();
            console.log("[REPLIT RPC]: Page fully loaded")
        } else {
            setTimeout(pageLoadHandler, 1000);
        }
    } else {
        main();
        console.log("[REPLIT RPC]: Page fully loaded")
    }
}

function getUser() { // Getså user information (such as username)
	let hsb = document.querySelector('[data-cy="header-signup-button"]');
	if (hsb == null) {
		user = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
		return {loggedIn: true, username: user.props.user.username}
	} else {
		return {loggedIn: false, username: null}
	}
    console.log("[REPLIT RPC]: Loaded user information")
}

function getCurrentFile() { // Gets the current file if the user is in the editor
    let tab = document.querySelector('[aria-selected="true"]');
    if (tab != null) {
        tab.getElementsByClassName("css-ppdyzn")[0];
        return tab.textContent
    } else {
        let result;
        setTimeout(function() {
            result = getCurrentFile();
        })
        return result
    }
}

function getCurrentPage() { // Gets the current user page
	let scurl = window.location.href.split("https://replit.com/")[1].split("/");
	let cp = document.querySelector('[data-cy="current-position"]');
	if (cp != null) {
		return {page: "editing", file: getCurrentFile(), line: cp.textContent, repl: scurl[1]}
	} else if (scurl[0].startsWith("@")) {
		return {page: "profile", user: scurl[0].split("@")[0], file: null}
	} else if (scurl[0] == "templates") {
		return {page: "templates", file: null}
	} else if (scurl[0] == "deployments") {
		return {page: "deployments", file: null}
	} else if (scurl[0] == "cycles") {
		return {page: "cycles", file: null}
	} else if (scurl[0] == "bounties") {
		return {page: "bounties", file: null}
	} else if (scurl[0] == "~") {
        return {page: "home", file: null}
    } else {
        return {page: "unsupported", file: null}
    }
}

function main() {
    let send = false;
    let page = getCurrentPage();
    let file = page.file;
    if (window.location.href != cachedurl) {
        send = true;
        cachedurl = window.location.href;
    } if (file != null && file != cachedfile) {
        send = true;
        cachedfile = file;
    } if (cachedpos != page.line) {
        send = true;
        cachedpos = page.line;
    } if (send == true) {
        chrome.runtime.sendMessage({message: page}, function(response) {
            console.log("Received response from background.js:", response);
        });
    }
    setTimeout(main, 100);
}

console.log("[REPLIT RPC]: Replit Discord RPC Loading");
pageLoadHandler();

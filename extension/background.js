let connected = false;
let socket;

function main() {
    if (connected == false) {
        try {
            socket = new WebSocket("ws://localhost:3060");
            socket.addEventListener("open", (event) => {
                connected = true;
            });
            socket.addEventListener("close", (event) => {
                connected = false;
            });
        } catch {
            console.log("Failed connection to the WebSocket");
        }
    }
    setTimeout(main, 2000);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    socket.send(request);
    sendResponse({response: "fsfs"});
});

main();
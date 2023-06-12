//Material Design auto init
M.AutoInit();

let socket = io.connect("https://localhost:8000");//use env

socket.on("connect", () => {
    console.log('connected');
});

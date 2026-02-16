let client;
let currentTopic = "";

const triggerBtn = document.getElementById('triggerBtn');
const audio = document.getElementById('alertSound');

// Request permission for background alerts
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function initApp() {
    const val = document.getElementById('roomID').value;
    if (!val) return alert("Enter Secret Frequency");

    currentTopic = "ankit_ultra_" + val;
    client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

    client.on('connect', () => {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('control-section').style.display = 'block';
        client.subscribe(currentTopic);
    });

    client.on('message', (topic, payload) => {
        const data = JSON.parse(payload.toString());
        if (data.sender !== client.options.clientId) {
            triggerAlert();
        }
    });
}

triggerBtn.addEventListener('click', () => {
    client.publish(currentTopic, JSON.stringify({
        sender: client.options.clientId,
        type: 'PULSE'
    }));
    if (navigator.vibrate) navigator.vibrate(40);
});

function triggerAlert() {
    // 1. Lock Screen Pop
    if (Notification.permission === "granted") {
        new Notification("Special Signal Received ❤️", {
            body: "Your partner is waiting for you in the app.",
            icon: "https://cdn-icons-png.flaticon.com/512/252/252035.png",
        });
    }

    // 2. Premium Alert Logic
    audio.play();
    if (navigator.vibrate) navigator.vibrate([400, 200, 400]);

    // Visual Flash
    document.body.style.boxShadow = "inset 0 0 100px rgba(226, 176, 74, 0.2)";
    setTimeout(() => { document.body.style.boxShadow = "none"; }, 2000);
}

function openAbout() { document.getElementById('aboutModal').style.display = 'block'; }
function closeAbout() { document.getElementById('aboutModal').style.display = 'none'; }
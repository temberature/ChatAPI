
const apiKeyInput = document.getElementById("api-key-input");
// Get API key from cookie
const getApiKey = () => {
    // Retrieve the API key from localStorage
    const apiKey = localStorage.getItem('api_key');
    return apiKey ? apiKey : null;
};

// Set API key cookie
const setApiKey = (apiKey) => {
    // Store the API key in localStorage
    localStorage.setItem('api_key', apiKey);
};

// Load saved API key
apiKeyInput.value = getApiKey();

// Save API key on input change
apiKeyInput.addEventListener("input", () => {
    setApiKey(apiKeyInput.value);
});
addEventListeners();

let messages = [];

function sendMessage() {
    const input = document.querySelector(".chat-input input");
    const message = input.value;
    if (!message) return;

    const stopInput = document.getElementById("stop-input").value;
    const stop = stopInput && stopInput.split(",");
    // Construct the request body
    const requestBody = {
        model: document.getElementById("model-input").value,
        messages: messages,
        temperature: parseFloat(document.getElementById("temperature-input").value),
        top_p: parseFloat(document.getElementById("top-p-input").value),
        n: parseInt(document.getElementById("n-input").value),
        stream: document.getElementById("stream-input").checked,
        stop: stop,
        max_tokens: parseInt(document.getElementById("max-tokens-input").value),
        presence_penalty: parseFloat(document.getElementById("presence-penalty-input").value),
        frequency_penalty: parseFloat(document.getElementById("frequency-penalty-input").value),
        logit_bias: JSON.parse(document.getElementById("logit-bias-input").value || "{}"),
    };
    addMessage({ role: "user", content: message });
    input.value = "";
    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${document.getElementById("api-key-input").value}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            var message = data.choices[0].message;
            addMessage(message);
        })
        .catch(error => {
            console.error("Error:", error);
            addMessage("Sorry, there was an error processing your message.", "received");
        });

    
}
function addMessage(message) {
    messages.push(message);
    console.log(messages);
    // var response = JSON.parse(xhr.responseText);
    var chatLog = document.getElementById('chat-box');

    var chatMessage = document.createElement('div');
    chatMessage.classList.add('message');
    chatMessage.classList.add(message.role);
    chatMessage.innerText = message.content;
    chatLog.appendChild(chatMessage);
    // Get the chat box element
    var chatBox = document.getElementById('chat-box');

    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;

    return;
    // const container = document.querySelector(".chat-messages");
    // const message = arguments[0];
    // const type = message.startsWith("received") ? "received" : "sent";
    // const messageElement = document.createElement("div");
    // messageElement.classList.add("message", type);
    // messageElement.innerHTML = `
}
function addEventListeners() {
    const sendBtn = document.querySelector(".chat-input button");
    sendBtn.addEventListener("click", sendMessage);

    const inputBox = document.querySelector(".chat-input input");
    inputBox.addEventListener("keyup", event => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
}



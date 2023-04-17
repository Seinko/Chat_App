const chat = document.querySelector('.chat');
const form = document.getElementsByTagName('form')[0];
const messageInput = document.getElementById('input-message');
const chatPlaceholder = document.getElementById('chat-placeholder');

const CHANNEL_ID = 'yWFvWDvgyvPoV6bX';

const firstNames = ['Magic', 'Magical', 'Magnanimous', 'Magnetic', 'Magnificent', 'Majestic', 'Manicured', 'Secret', 'Sneaky', 'Mighty', 'Scratchy', 'Screaming', 'Fat', 'Savage', 'Sassy', 'Violent', 'Critical', 'Risky', 'Annoying', 'Brave', 'Charming', 'Cheesy', 'Broken', 'Comical', 'Boneless', 'Crazy', 'Entertaining', 'Stinky', 'Funny', 'Gangster', 'Hilarious', 'Hysterical', 'Jokester', 'Loud', 'Mad', 'Angry', 'Holy', 'Silly', 'Tragic', 'Trickster', 'Wacky', 'Careless', 'Weird', 'Wild'];

const lastNames = ['Bird', 'Reptile', 'Fish', 'Cat', 'Jaguar', 'Dog', 'Panther', 'Horse', 'Tiger', 'Lion', 'Kangaroo', 'Elephant', 'Dolphin', 'Monkey', 'Donkey', 'Puma', 'Human', 'Frog', 'Owl', 'Toucan', 'Eagle', 'Parrot', 'Ostrich', 'Emu', 'Crocodile', 'Lizard', 'Turtle', 'Snake', 'Chameleon', 'Salmon', 'Tuna', 'Catfish', 'Trout', 'Pike', 'Bee', 'Crab', 'Bat', 'Shrimp', 'Mosquito', 'Spider', 'Snail', 'Lobster', 'Oyster', 'Cow', 'Pig', 'Goat', 'Turkey', 'Chicken', 'Duck', 'Rabbit', 'Fox', 'Deer', 'Panda'];

function randomName() {
    return (
        firstNames[Math.floor(Math.random() * firstNames.length)] +
        '_' +
        lastNames[Math.floor(Math.random() * lastNames.length)]
    );
}

// defining new scaledrone
const drone = new Scaledrone(CHANNEL_ID, {
    data: {
        name: randomName(),
    },
});

// connecting to scaledrone
drone.on('open', (error) => {
    if (error) {
        return console.log(error);
    }

    // room definition and connecting to room
    var room = drone.subscribe('observable-mez');
    room.on('open', function (error) {
        if (error) {
        return console.error(error);
        }
        console.log("Joined to mez's room");
    });

    // message handler
    room.on('message', function (message) {
        const member = message.member.clientData.name;
        const text = message.data;
        const memberId = message.clientId;
        const droneId = drone.clientId;

        addMessageToChat(member, text, memberId, droneId);
        chat.scrollTop = chat.scrollHeight;
    });
});

// add recived message to chat
function addMessageToChat(member, text, memberId, droneId) {
    if (chatPlaceholder.style.display === 'flex') {
        chatPlaceholder.style.display = 'none';
    }
    let html = '';
    if (memberId === droneId) {
        html = "<div class='my-message'>";
    } else {
        html = "<div class='message'>";
    }
    html += `
    <p>${member}</p>
    <h4>${text}</h4>
    </div>
    `;
    chat.innerHTML += html;
}

// onsubmit send message to certain room
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const value = messageInput.value;
    if (value.trim() === '') {
        return;
    } else {
        messageInput.value = '';
        drone.publish({
        room: 'observable-mez',
        message: value,
        });
    }
});
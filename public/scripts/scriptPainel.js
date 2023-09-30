document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const streamerForm = document.querySelector('#streamerForm');
    streamerForm.addEventListener('submit', event => {
        event.preventDefault();

        const name = document.querySelector('#name').value;
        const twitchURL = document.querySelector('#twitchURL').value;
        const instagramURL = document.querySelector('#instagramURL').value;
        const twitterURL = document.querySelector('#twitterURL').value;

        socket.emit('addStreamer', { name, twitchURL, instagramURL, twitterURL });
    });

    const createLinks = () => {
        const streamerList = document.querySelector('#streamerList');
        streamerList.innerHTML = '';

        axios.get(`http://localhost:3000/joaovictorvx.api.lives`).then(streamers => {
            streamers.data.forEach(streamer => {
                const listItem = document.createElement('li');
                listItem.textContent = streamer.name;

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remover';
                removeButton.className = 'remove-button';
                removeButton.addEventListener("click", () => {
                    const nameDelete = removeButton.parentElement.textContent.replace("Remover", "").trim()

                    axios.delete(`http://localhost:3000/joaovictorvx.api.delete.lives?name=${nameDelete}`).then(() => {
                        createLinks()
                        socket.emit("updateStreamers", "Update")
                    })
                })

                listItem.appendChild(removeButton);
                streamerList.appendChild(listItem);
            });
        })
    }

    socket.on("updateStreamers", streamers => {
        createLinks()
    });

    createLinks()
})
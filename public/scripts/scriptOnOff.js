/* @DESENVOLVEDOR JV */

async function checkAllStreamersStatus() {
  const twitchStreamLinks = [
    "https://www.twitch.tv/rafaao",
    "https://www.twitch.tv/flashfps_",
    "https://www.twitch.tv/thimarfpss",
    "https://www.twitch.tv/trembalaxd_",
    "https://www.twitch.tv/gelinrp",
    "https://www.twitch.tv/gordaopd",
    "https://www.twitch.tv/dudinhawn",
    "https://www.twitch.tv/cogumello_",
    "https://www.twitch.tv/bygaharp",
    "https://www.twitch.tv/raf1nhafps",
    "https://www.twitch.tv/leandrosp_",
    "https://www.twitch.tv/gz_rp",
    "https://www.twitch.tv/fezaofps",
    "https://www.twitch.tv/strakerr11",
    "https://www.twitch.tv/cantellifps",
    "https://www.twitch.tv/sanderjoga",
    "https://www.twitch.tv/eaimaka",
    "https://www.twitch.tv/escobar_md",
    "https://www.twitch.tv/davinafps",
    "https://www.twitch.tv/biaxfpss",
    "https://www.twitch.tv/velosojsfps",
    "https://www.twitch.tv/moraafps",
    "https://www.twitch.tv/gihrp",
    "https://www.twitch.tv/esotikiss",
    "https://www.twitch.tv/pepofps1",
    "https://www.twitch.tv/lkfpss1",
    "https://www.twitch.tv/drizszF9",
    "https://www.twitch.tv/cristalfoxx",
    "https://www.twitch.tv/birao_fps",
    "https://www.twitch.tv/howz1n_",
    "https://www.twitch.tv/sheikfps_",
    "https://www.twitch.tv/obryanrp",
    "https://www.twitch.tv/revoadafpss",
    "https://www.twitch.tv/fonsecafpss",
    "https://www.twitch.tv/natty_viictoriia",
    "https://www.twitch.tv/senaz1n",
    "https://www.twitch.tv/saainttzada",
    "https://www.twitch.tv/strollx",
    "https://www.twitch.tv/dmeney",
    "https://www.twitch.tv/ryanv3_"
  ];

  const twitchClientId = "faxsoydixvpqrncuis1a76u6czvxhr";

  try {
    for (const link of twitchStreamLinks) {
      const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${extractUsernameFromLink(link)}`, {
        headers: {
          "Client-ID": twitchClientId,
          "Authorization": "Bearer dqh7tr609no3gfh7ezy6hcrvnt0910"
        }
      });

      const data = await response.json();
      const streamerElement = getStreamerElementByLink(link);

      if (streamerElement) {
        let statusIndicator = streamerElement.querySelector('#status-indicator');

        if (!statusIndicator) {
          statusIndicator = document.createElement('span');
          statusIndicator.id = 'status-indicator';
          streamerElement.appendChild(statusIndicator);
        }

        if (data && data.data && data.data.length > 0) {
          // Streamer está online
          updateStatusIndicator(statusIndicator, "ON");
        }
      }
    }

    // Atraso após a primeira solicitação
    await delay(3000);

    // Chamar a função novamente
    checkAllStreamersStatus();
  } catch (error) {
    console.error("Ocorreu um erro ao verificar o status dos streamers:", error);
  }
}

function extractUsernameFromLink(link) {
  const match = link.match(/twitch\.tv\/(\w+)/i);
  return match ? match[1] : "";
}

// Encontra o elemento da caixa "streamer" com base no link do Twitch
function getStreamerElementByLink(link) {
  const streamerElements = document.getElementsByClassName('streamer');
  for (const element of streamerElements) {
    const twitchLink = element.querySelector('a')?.getAttribute('href');
    if (twitchLink === link) {
      return element;
    }
  }
  return null;
}

function updateStatusIndicator(statusIndicator, status) {
  if (statusIndicator) {
    if (status.toLowerCase() === 'ao vivo') {
      statusIndicator.textContent = status;
      statusIndicator.classList.add('ao', 'vivo'); // Adicionando as classes "ao" e "vivo" para estilização
    } else {
      statusIndicator.textContent = ''; // Removendo o texto se o status não for "AO VIVO"
      statusIndicator.classList.remove('ao', 'vivo'); // Removendo as classes "ao" e "vivo"
    }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Inicia a verificação do status dos streamers
checkAllStreamersStatus();

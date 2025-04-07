async function fetchData() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function setup() {
  const allEpisodes = await fetchData();

  if (!allEpisodes || !allEpisodes.length) {
    showAnError();
    return;
  }

  const initialEpisodes = [...allEpisodes];

  makePageForEpisodes(allEpisodes, initialEpisodes);
  setupSearch(allEpisodes, initialEpisodes);
  setupEpisodeSelect(allEpisodes, initialEpisodes);
}

function makePageForEpisodes(episodeList, initialEpisodes) {
  const episodeContainer = document.getElementById("episodeContainer");
  episodeContainer.innerHTML = "";

  episodeList.forEach((episode) => {
    const article = document.createElement("article");
    article.classList.add("article");

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - S${padNumber(
      episode.season
    )}E${padNumber(episode.number)}`;
    article.appendChild(title);

    if (episode.image && episode.image.medium) {
      const image = document.createElement("img");
      image.src = episode.image.medium;
      image.alt = episode.name;
      article.appendChild(image);
    }

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";
    article.appendChild(summary);

    const episodeLink = document.createElement("a");
    episodeLink.href = episode.url;
    episodeLink.textContent = "View on TVMaze";
    episodeLink.target = "_blank";
    article.appendChild(episodeLink);

    episodeContainer.appendChild(article);
  });

  displayEpisodeCount(episodeList.length, initialEpisodes.length);
}

function padNumber(number) {
  return number.toString().padStart(2, "0");
}

function setupSearch(allEpisodes, initialEpisodes) {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (event) => {
    const episodeSelect = document.getElementById("episodeSelect");
    episodeSelect.value = "allEpisodes";
    const searchTerm = event.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
      );
    });
    makePageForEpisodes(filteredEpisodes, initialEpisodes);
  });
}

function setupEpisodeSelect(allEpisodes, initialEpisodes) {
  const episodeSelect = document.getElementById("episodeSelect");
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${padNumber(episode.season)}E${padNumber(
      episode.number
    )} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });

  episodeSelect.addEventListener("change", (event) => {
    const searchInput = document.getElementById("searchInput");
    searchInput.value = "";
    const selectedId = parseInt(event.target.value);
    if (selectedId) {
      const selectedEpisode = allEpisodes.find(
        (episode) => episode.id === selectedId
      );
      makePageForEpisodes([selectedEpisode], initialEpisodes);
    } else {
      makePageForEpisodes(allEpisodes, initialEpisodes);
    }
  });
}

function displayEpisodeCount(displayed, total) {
  const displayCount = document.getElementById("displayCount");
  displayCount.textContent = `Displaying ${displayed} / ${total} episodes`;
}

function showAnError() {
  let errorContainer = document.createElement("div");
  errorContainer.textContent =
    "Sorry the web-site is not working. Please try later.";
  document.getElementById("episodeContainer").appendChild(errorContainer);
}

window.onload = setup; //DO NOT EDIT THIS LINE

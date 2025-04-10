let allShows = null; // Store fetched shows
let currentShowId = null; // Store the ID of the currently selected show
let cachedEpisodes = {}; // Store fetched episodes for each show

function setup() {
    const showSelect = document.createElement("select");
    showSelect.id = "showSelect";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a show";
    showSelect.appendChild(defaultOption);
    document.querySelector("#root header").insertBefore(showSelect, document.getElementById("searchInput"));

    const episodeContainer = document.getElementById("episodeContainer");
    episodeContainer.innerHTML = "<p>Loading shows, please wait...</p>";

    fetch('https://api.tvmaze.com/shows')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allShows = data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            populateShowSelect(allShows);
            episodeContainer.innerHTML = "<p>Select a show to display episodes.</p>";
        })
        .catch(error => {
            console.error("Error fetching shows:", error);
            episodeContainer.innerHTML = "<p class='error'>Error loading shows. Please try again later.</p>";
        });

    const showSelectElement = document.getElementById("showSelect");
    showSelectElement.addEventListener("change", handleShowChange);
}

function populateShowSelect(shows) {
    const showSelect = document.getElementById("showSelect");
    shows.forEach(show => {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        showSelect.appendChild(option);
    });
}

function handleShowChange(event) {
    currentShowId = event.target.value;
    const episodeContainer = document.getElementById("episodeContainer");
    episodeContainer.innerHTML = "<p>Loading episodes, please wait...</p>";
    document.getElementById("episodeSelect").innerHTML = '<option value="">All Episodes</option>'; // Reset episode select

    if (currentShowId) {
        if (cachedEpisodes[currentShowId]) {
            allEpisodes = cachedEpisodes[currentShowId];
            makePageForEpisodes(allEpisodes);
            setupSearch(allEpisodes);
            setupEpisodeSelect(allEpisodes);
        } else {
            fetch(`https://api.tvmaze.com/shows/${currentShowId}/episodes`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    cachedEpisodes[currentShowId] = data;
                    allEpisodes = data;
                    makePageForEpisodes(allEpisodes);
                    setupSearch(allEpisodes);
                    setupEpisodeSelect(allEpisodes);
                })
                .catch(error => {
                    console.error("Error fetching episodes:", error);
                    episodeContainer.innerHTML = "<p class='error'>Error loading episodes for this show.</p>";
                });
        }
    } else {
        episodeContainer.innerHTML = "<p>Select a show to display episodes.</p>";
        document.getElementById("displayCount").textContent = "";
        allEpisodes = null;
    }
}

function makePageForEpisodes(episodeList) {
    const episodeContainer = document.getElementById("episodeContainer");
    episodeContainer.innerHTML = "";

    episodeList.forEach(episode => {
        const article = document.createElement("article");
        article.classList.add("article");

        const title = document.createElement("h2");
        title.textContent = `${episode.name} - S${padNumber(episode.season)}E${padNumber(episode.number)}`;
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

    displayEpisodeCount(episodeList.length, allEpisodes ? allEpisodes.length : 0);
}

function padNumber(number) {
    return number.toString().padStart(2, '0');
}

function setupSearch(episodes) {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredEpisodes = episodes.filter(episode => {
            return episode.name.toLowerCase().includes(searchTerm) ||
                   (episode.summary && episode.summary.toLowerCase().includes(searchTerm));
        });
        makePageForEpisodes(filteredEpisodes);
    });
}

function setupEpisodeSelect(episodes) {
    const episodeSelect = document.getElementById("episodeSelect");
    episodes.forEach(episode => {
        const option = document.createElement("option");
        option.value = episode.id;
        option.textContent = `S${padNumber(episode.season)}E${padNumber(episode.number)} - ${episode.name}`;
        episodeSelect.appendChild(option);
    });

    episodeSelect.addEventListener("change", (event) => {
        const selectedId = parseInt(event.target.value);
        if (selectedId) {
            const selectedEpisode = episodes.find(episode => episode.id === selectedId);
            makePageForEpisodes([selectedEpisode]);
        } else {
            makePageForEpisodes(episodes);
        }
    });
}

function displayEpisodeCount(displayed, total){
    const displayCount = document.getElementById("displayCount");
    displayCount.textContent = `Displaying ${displayed} / ${total} episodes`;
}

window.onload = setup;
//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();

  console.log(allEpisodes);
  makePageForEpisodes(allEpisodes);
}

let allEpisodes = document.createElement("div");
allEpisodes.classList = "allEpisode";
let root = document.getElementById("root");
root.appendChild(allEpisodes);

let episodeCard = document.createElement("div");
episodeCard.classList = "episodeCard";
allEpisodes.appendChild(episodeCard);

let oneEpisode = getOneEpisode();
let episodeName = oneEpisode.name;

let episodeNum = oneEpisode.number;

let seasonNum = oneEpisode.season;

let title = document.createElement("h3");
title.textContent = `${episodeName} - S0${seasonNum} E0${episodeNum}`;
title.classList = "title";
console.log(title.textContent);

let episodeImage = oneEpisode.image.medium;
const image = document.createElement("img");
image.src = episodeImage;

let episodeSum = oneEpisode.summary;
const shortSum = document.createElement("div");
shortSum.innerHTML = episodeSum;

episodeCard.appendChild(title);
episodeCard.appendChild(image);
episodeCard.appendChild(shortSum);

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;

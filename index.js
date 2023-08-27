const base_api = "https://steam-api-mass.onrender.com";
var click_category = null;
var game_id = null;
const inforGame = document.getElementsByClassName("inforgame");
const intro = document.getElementById("intro");
const tags = document.getElementById("tags");
const b = document.getElementsByClassName("body");

// Get all games
const getAllGames = async () => {
  try {
    const url = `${base_api}/games?limit=12`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
    // console.log("dataGames", data);
  } catch (error) {
    console.log("err", error.message);
  }
};

//Render all games
const renderAllGames = async () => {
  try {
    const data = await getAllGames();
    const categoryList = document.getElementsByClassName("icon_game");
    const detailList = document.getElementsByClassName("detail");
    for (let i = 0; i < data.data.length; i++) {
      inforGame[i].setAttribute("id", `${data.data[i].appid}`);
      categoryList[i].src = data.data[i].header_image;
      detailList[i].children[0].innerHTML = data.data[i].name;
      if (data.data[i].price === 0) {
        detailList[i].children[1].innerHTML = `Free To Play`;
      } else {
        detailList[i].children[1].innerHTML = `$${data.data[i].price}`;
      }
    }
  } catch (error) {
    console.log("err", error.message);
  }
};
b.load = renderAllGames();

//Get category game
const getCategoryList = async () => {
  try {
    const url = `${base_api}/genres?limit=12`;
    const response = await fetch(url);
    const data = await response.json();
    //  console.log(data);
    return data;
  } catch (error) {
    console.log("err", error.message);
  }
};

const renderCategoryList = async () => {
  try {
    const data = await getCategoryList();
    const categoryList = document.getElementById("category_list");
    let categoryHtml = "";
    for (let i = 0; i < data.data.length; i++) {
      const categoryItemHTML = `<li>${data.data[i].name}</li>`;
      categoryHtml += categoryItemHTML;
    }
    categoryList.innerHTML = categoryHtml;
    const categories = document.querySelectorAll("#category_list li");
    categories.forEach(function (item) {
      item.addEventListener("click", function (e) {
        const click_category = this.innerText;
        clearGameDisplay();
        renderCategory(click_category);
      });
    });
  } catch (error) {
    console.log("err", error.message);
  }
};
renderCategoryList();

const display = document.getElementById("display");
const clearGameDisplay = () => {
  display.innerHTML = "";
};

const getCategoryGame = async (click_category) => {
  try {
    const url = `${base_api}/games?genres=${click_category}&limit=12`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("err", error.message);
  }
};

//Render category list
const renderCategory = async (click_category) => {
  try {
    const data = await getCategoryGame(click_category);
    let gameHtml = "";
    for (let i = 0; i < data.data.length; i++) {
      const gameItemHTML = `<div class="wrapper" onclick="renderDetailsGame(${
        data.data[i].appid
      })">
      <div id="intro">
          <div></div>
          <div></div>
        </div>
    <div class="inforgame" id="${data.data[i].appid}">
      <img src="${data.data[i].header_image}" class="icon_game" width="100%">
      <div class="detail">
        <p>${data.data[i].name}</p>
        <p>${
          data.data[i].price === 0 ? "Free To Play" : "$" + data.data[i].price
        }</p>
      </div>
    </div>
  </div>`;
      gameHtml += gameItemHTML;
    }
    display.innerHTML = gameHtml;
  } catch (error) {
    console.log("err", error.message);
  }
};

// Get search name
let queryString = "";
const keyWord = document.getElementById("search_input");
const btnSearch = document.getElementById("search_icon");
btnSearch.onclick = async function (e) {
  e.preventDefault();
  queryString = keyWord.value;
  const data = await getBySearchName(queryString);
  clearGameDisplay();
  renderGameBySearch(data);
};
/* btnSearch.addEventListener("click", async (e) => {
  e.preventDefault();
  queryString = keyWord.value;
  console.log("queryString", queryString);
  const dataGamebySearches = await getBySearchName(queryString);
  console.log("dataGamebySearches", dataGamebySearches);
  renderGameBySearch(dataGamebySearches);
}); */

const getBySearchName = async (queryString) => {
  try {
    const url = `${base_api}/games?q=${queryString}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("err", error.message);
  }
};

const renderGameBySearch = async (data) => {
  try {
    let gameHtml = "";
    for (let i = 0; i < data.data.length; i++) {
      let gameItemHTML = `<div class="wrapper">
    <div class="inforgame">
      <img src="${data.data[i].header_image}" class="icon_game" width="100%">
      <div class="detail">
        <p>${data.data[i].name}</p>
        <p>$${data.data[i].price}</p>
      </div>
    </div>
  </div>`;
      gameHtml += gameItemHTML;
    }
    display.innerHTML = gameHtml;
  } catch (error) {
    console.log("err", error.message);
  }
};

//Render details game
for (let i = 0; i < inforGame.length; i++) {
  inforGame[i].addEventListener("click", function () {
    game_id = this.id;
    clearGameDisplay();
    renderDetailsGame(game_id);
  });
}

const fetchDetails = async (game_id) => {
  try {
    const url = `${base_api}/single-game/${game_id}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("err", error.message);
  }
};

const renderDetailsGame = async (game_id) => {
  try {
    const data = await fetchDetails(game_id);
    let gameHtml = "";
    let tagsHtml = "";
    for (let i = 0; i < data.data.steamspy_tags.length; i++) {
      tagsHtml += `<div>${data.data.steamspy_tags[i]}</div>`;
    }
    let gameItemHTML = `
    <div id="display_detail" class="showing_game" style="background-image: url('${
      data.data.background
    }'")>
    <div class="wrapper">
    <div id="intro">
    <div>${data.data.name}</div>
    <div>${data.data.price === 0 ? "Free To Play" : "$" + data.data.price}</div>
    </div>
    <div class="inforgame_detail">
      <img src="${data.data.header_image}" class="icon_game" maxWidth="50%">
      <div class="detail_game">
        <p>${data.data.description}</p><br>
        <p>Developer: + ${data.data.developer}</p>
      </div>
    </div>
    <div id="tags">
    ${tagsHtml}
    </div>
  </div>
  </div>`;
    gameHtml = gameItemHTML;
    display.innerHTML = gameHtml;
  } catch (error) {
    console.log("err", error.message);
  }
};

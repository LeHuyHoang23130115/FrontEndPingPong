const mainMenu = document.querySelector(".main-menu");
const chooseLevel = document.querySelector(".choose-level");

const chooseLevelBtn = document.querySelector("#select-level");
const backBtn = document.querySelector("#choose-level-back");

chooseLevelBtn.addEventListener("click", () => {
    mainMenu.style.display = "none";
    chooseLevel.style.display = "flex";
})

backBtn.addEventListener("click", () => {
    mainMenu.style.display = "flex";
    chooseLevel.style.display = "none";
})
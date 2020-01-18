let maxW = window.matchMedia("(max-width:499px)");
let minW = window.matchMedia("(min-width:500px)");
let caiVid = document.querySelector(".container video");
let mb = document.getElementsByClassName("menu-bar");

mb[0].style.background = "rgba(255,255,255,1)";

if (maxW.matches) {
   caiVid.src = "./background image/mobileme.mp4";
}
if (minW.matches){
   caiVid.src = "./background image/aboutback.mp4";
}
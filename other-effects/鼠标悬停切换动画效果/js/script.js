import animate from "https://cdn.jsdelivr.net/npm/animateplus@2/animateplus.js";

animate({
  elements: ".service-block",
  duration: 2000,
  delay: index => index * 100,
  transform: ["scale(0)", "scale(1)"]
})
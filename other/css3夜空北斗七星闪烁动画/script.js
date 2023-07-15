createStar();

function createStar() {
    for (var a = 0; a <= 40; a++) {
        var b = this.newStar();
        b.style.top = Math.random() * 100 + "%";
        b.style.left = Math.random() * 100 + "%";
        b.style.width = "7.5px";
        b.style.height = "7.5px";
        b.animation = "none";
        document.body.appendChild(b)
    }
}

function newStar() {
    var a = document.createElement("div");
    a.innerHTML = '<div class="star">';
    return a.firstChild
};
console.log("Hello");

var imgArr = ["https://static.pexels.com/photos/3247/nature-forest-industry-rails.jpg", "http://wellnesscounselingmilwaukee.com/wp-content/uploads/2015/07/4-Nature-Wallpapers-2014-1.jpg", "http://www.wallpapereast.com/static/images/beauty-nature-reflections-wallpaper-high-quality-bk1vfmp010.jpg", "http://www.planwallpaper.com/static/images/2ba7dbaa96e79e4c81dd7808706d2bb7_large.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg", "http://kingofwallpapers.com/pictures-of-nature/pictures-of-nature-011.jpg"];

var capArr = ["Railroad", "Park", "Desert Lake", "Boardwalk", "Fall Creek", "Summer River"];

var total = imgArr.length;
var currentPic = 0;

function openLightbox() {
  document.getElementById('lightbox').style.display = "block";
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = "none";
}

function nextPic() {
  var next = window.currentPic;
  next++;
  generatePic(next);
}

function prevPic() {
  var prev = window.currentPic;
  prev--;
  generatePic(prev);
}

function generatePic(n) {

    window.currentPic = n;
    console.log("currentPic is "+currentPic);
    console.log("generating "+n+"th pic");
    if (n <= 0) {
        document.getElementById("prev").style.display = "none";
    }
    else {
        document.getElementById("prev").style.display = "block";
    }
    if (n >= total - 1) {
        document.getElementById("next").style.display = "none";
    }
    else {
        document.getElementById("next").style.display = "block";
    }
    document.getElementById("lightbox-pic").src = imgArr[n];
    // document.getElementById("caption").innerHTML = capArr[n];
    var nth = n++;
    document.getElementById("numPic").innerHTML = String(n) + "/" + String(total);

}

function ImageRepeat() {

    for (var i=0; i< imgArr.length; i++) {
        
        //Create div with class "tile"
        var tile = document.createElement("div");
        tile.className = "tile";
        
        //Create div with class "thumbnail"
        var thumbnail = document.createElement("div");
        thumbnail.className = "thumbnail";

        // Create div with class "crop"
        var crop = document.createElement("div");
        crop.className = "crop";

        // var span = document.createElement('span');
        // span.innerHTML = '<img id="'+i+'" src="'+imgArr[i]+'" alt="'+capArr[i]+'" onclick="openLightbox();currentPic('+i+')>';

        //Create image and set source 
        var image = document.createElement("IMG");
        image.className = "grid-image"
        image.src = imgArr[i];
        image.alt = capArr[i];
        image.id = i;
        image.onclick = function() {openLightbox(); generatePic(this.id);};
        console.log(i);
        
        // Append image -> crop -> thumbnail -> tile -> gallery
        crop.appendChild(image);
        thumbnail.appendChild(crop);
        tile.appendChild(thumbnail);
        document.getElementById("gallery").appendChild(tile);
    }

    console.log("successfully loaded images");

}

ImageRepeat();



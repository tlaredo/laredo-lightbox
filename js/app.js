console.log("Hello");

// Process for loading photos:
//  1. Get gallery_id for photo gallery using flickr.urls.lookupGallery(url)
//  2. Get standard photo response from flickr.galleries.getPhotos(gallery_id, format)
//      Retreive farm-id, server-id, id, secret-id, format and store them in 5 arrays
//  3. Use these values to get photo source URL, in following format:
//      https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
//      Use string concatonation to generate URLs


// function loadDoc() {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             document.getElementById("demo").innerHTML = this.responseText;
//         }
//     };
//     xhttp.open("GET", "ajax_info.txt", true);
//     xhttp.send();
// }

var imageURL = [];
var photoID = [];
var farmID = [];
var serverID = [];
var secretID = [];

function getGallery_id() {
    var xmlGallery_id = new XMLHttpRequest();
    xmlGallery_id.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc, gallery_id, title, description, totalPhotos;
            var response = xmlGallery_id;
            console.log(response);

            parser = new DOMParser();
            xmlDoc = parser.parseFromString(this.response,"text/xml");

            gallery_id = xmlDoc.getElementsByTagName("gallery")[0].getAttribute("id");
            count_photos = xmlDoc.getElementsByTagName("gallery")[0].getAttribute("count_photos");
            title = xmlDoc.getElementsByTagName("title")[0].childNodes[0];
            description = xmlDoc.getElementsByTagName("description")[0].childNodes[0];
            console.log(gallery_id);
            console.log(count_photos);
            console.log(title);
            console.log(description);

            // Call funciton for loading getPhotos
            getPhotos(gallery_id, count_photos);
        }
    };

    xmlGallery_id.open("GET", "https://api.flickr.com/services/rest/?&method=flickr.urls.lookupGallery&api_key=cf93eae365c8cc4fdb8deb6116db8542&url=http://www.flickr.com/photos/flickr/galleries/72157669781709702/", true);
    xmlGallery_id.send();
}

getGallery_id();

function getPhotos(gallery_id, count_photos) {
    var xmlGetPhotos = new XMLHttpRequest();
    xmlGetPhotos.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc, photo, id, secret, server, farm;
            var response = xmlGetPhotos;
            console.log(response);

            parser = new DOMParser();
            xmlDoc = parser.parseFromString(this.response,"text/xml");


            console.log(photo);
            console.log(count_photos);

            for (var i = 0; i < count_photos; ++i) {
                photo = xmlDoc.getElementsByTagName("photo")[i];
                window.photoID.push(photo.getAttribute("id"));
                window.farmID.push(photo.getAttribute("farm"));
                window.serverID.push(photo.getAttribute("server"));
                window.secretID.push(photo.getAttribute("secret"));
            }

            console.log(photoID);
            console.log(farmID);
            console.log(serverID);
            console.log(secretID);

        }
    }

    
    var apiCall = 'https://api.flickr.com/services/rest/?&method=flickr.galleries.getPhotos&api_key=cf93eae365c8cc4fdb8deb6116db8542&gallery_id='+gallery_id+'/';

    xmlGetPhotos.open("GET", apiCall, true);
    xmlGetPhotos.send();
}

// Call function for generating URLs with data from getPhotos

// Prevent elements on page from loading once we get loadAPI finished

var imgArr = ["https://static.pexels.com/photos/3247/nature-forest-industry-rails.jpg", "http://wellnesscounselingmilwaukee.com/wp-content/uploads/2015/07/4-Nature-Wallpapers-2014-1.jpg", "http://www.gannett-cdn.com/-mm-/ebba134b48d4840ef5fa962f5413dde0535b58f0/c=0-181-3257-4524&r=537&c=0-0-534-712/local/-/media/2015/08/24/DetroitFreePress/DetroitFreePress/635760455385917378-AP-Michigan-Media-Day-Footba-1-.jpg", "http://www.planwallpaper.com/static/images/2ba7dbaa96e79e4c81dd7808706d2bb7_large.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg", "http://kingofwallpapers.com/pictures-of-nature/pictures-of-nature-011.jpg"];

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








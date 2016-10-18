/* ================== TABLE OF CONTENTS ================

    1. Initialize global arrays and variables
    2. Load Flickr API Functions
    3. Populate Page with Images
    4. Lightbox Functions

   =============== END TABLE OF CONTENTS ===============
*/


//  ===============  1. INITIALIZE GLOBAL ARRAYS AND VARIABLES ===============

var imageURL = []; //Stores image URLs (created from generateURL())
var photoID = []; //Stores image ids (from API response)
var farmID = []; //Stores farm ids (from API response)
var serverID = []; //Stores server ids (from API response)
var secretID = []; //Stores secret ids (from API response)
var total; //Stores total # of photos
var currentPic = 0; //Used in lightbox functions

//  ===============  END 1. INITIALIZE GLOBAL ARRAYS AND VARIABLES ===============


//  ===============  2. LOAD FLICKR API FUNCTIONS ===============

/* Process for loading photos with Flickr API:
    Step 1. Get gallery_id for photo gallery using flickr.urls.lookupGallery(url)
    Step 2. Get standard photo response (XML format) from flickr.galleries.getPhotos(gallery_id)
        -> Retreive farm, server, id, and secret ids and store them in 4 arrays
    Step 3. Use these values to get photo source URL, in following format:
        https://farm{farm}.staticflickr.com/{server}/{id}_{secret}.jpg
        Use string concatonation to generate URLs
*/

// Step 1: Function to get gallery_id for photo gallery using flickr.urls.lookupGallery() method
function getGalleryID() {
    var xmlGalleryId = new XMLHttpRequest();

    // Function executes when we receive response from flickr API
    xmlGalleryId.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Create gallery-specific variables
            var xmlDoc, galleryID, title, description, countPhotos;
            // Used to generate primary photo
            var primaryID, primaryServer, primaryFarm, primarySecret;
            var response = xmlGalleryId;
            console.log(response);

            //Parse through XML response
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(this.response,"text/xml");

            //Set gallery tags (e.g. num photos, title, description) from API response
            galleryID = xmlDoc.getElementsByTagName("gallery")[0].getAttribute("id");
            countPhotos = xmlDoc.getElementsByTagName("gallery")[0].getAttribute("count_photos");
            title = xmlDoc.getElementsByTagName('title')[0].childNodes[0].data;
            description = xmlDoc.getElementsByTagName('description')[0].childNodes[0].data;
            
            // Set primary photo attributes
            primaryID = xmlDoc.getElementsByTagName("gallery")[0].getAttribute("primary_photo_id");
            primaryServer = xmlDoc.getElementsByTagName("gallery")[0].getAttribute("primary_photo_server");
            primaryFarm = xmlDoc.getElementsByTagName("gallery")[0].getAttribute("primary_photo_farm");
            primarySecret = xmlDoc.getElementsByTagName("gallery")[0].getAttribute("primary_photo_secret");

            // Set gallery info
            galleryInfo(title, description, countPhotos);

            // Set primary cover photo
            setPrimaryPhoto(primaryID, primarySecret, primaryServer, primaryFarm);

            //Once tags for gallery are loaded, call getPhotos to get set of photos from gallery
            getPhotos(galleryID);
            total = countPhotos; //Set global variable
        }
    };

    // API call created by appending method and parameters to URL. We make REST request and receive XML response.
    var apiCall = 'https://api.flickr.com/services/rest/?&method=flickr.urls.lookupGallery&api_key=cf93eae365c8cc4fdb8deb6116db8542&url=http://www.flickr.com/photos/flickr/galleries/72157669781709702/';

    // Call API
    xmlGalleryId.open("GET", apiCall, true);
    xmlGalleryId.send();
}

//  Step 2: Function to get standard photo response from flickr.galleries.getPhotos() method. Extract farm-id, server-id, id, and secret-id and store them in 4 arrays
function getPhotos(gallery_id) {
    var xmlGetPhotos = new XMLHttpRequest();
    xmlGetPhotos.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Create photo-specific variables
            var xmlDoc, photo;
            var response = xmlGetPhotos;
            console.log(response);

            parser = new DOMParser();
            xmlDoc = parser.parseFromString(this.response,"text/xml");

            // Traverse through DOM to access id, farm, server, and secret ids from response. Store each value in their respective arrays.
            for (var i = 0; i < total; ++i) {
                photo = xmlDoc.getElementsByTagName("photo")[i];
                photoID.push(photo.getAttribute("id"));
                farmID.push(photo.getAttribute("farm"));
                serverID.push(photo.getAttribute("server"));
                secretID.push(photo.getAttribute("secret"));
            }

            // With all photo data loaded, call generateURLs() to load imageURL array
            generateURLs();
        }
    }

    var apiCall = 'https://api.flickr.com/services/rest/?&method=flickr.galleries.getPhotos&api_key=cf93eae365c8cc4fdb8deb6116db8542&gallery_id='+gallery_id+'/';

    // Call API
    xmlGetPhotos.open("GET", apiCall, true);
    xmlGetPhotos.send();
}

// Step 3: Using ids from getPhotos function, use string concatonation to generate src URLs for each photo. Per flickr's API documentation, each photo's source is in the following format: https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
function generateURLs() {
    // Iterate through all ids in arrays and concat them together to get src URL. 
    // Push result into imageURL array
    for (var i = 0; i < total; ++i) {
        var farm = farmID[i];
        var server = serverID[i];
        var id = photoID[i];
        var secret = secretID[i];
        var URL = 'https://farm'+farm+'.staticflickr.com/'+server+'/'+id+'_'+secret+'.jpg';
        imageURL.push(URL);
    }
    console.log(imageURL);
    // Call ImageRepeat() to populate page with images.
    ImageRepeat();
}

// Set primary cover photo based on API response
function setPrimaryPhoto(id, secret, server, farm) {
    var URL = 'https://farm'+farm+'.staticflickr.com/'+server+'/'+id+'_'+secret+'.jpg';
    document.getElementById("gallery-info").style.background = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.75)), url('+URL+')';
}

// Set gallery title, description, and total number of photos based on API response
function galleryInfo(title, description, countPhotos) {
    //Create h1 tag for gallery title
    var galleryTitle = document.createElement("h1");
    galleryTitle.className = "gallery-title";
    galleryTitle.innerHTML = title;

    //Create h3 tag for gallery description
    var galleryDescription = document.createElement("h3");
    galleryDescription.className = "gallery-description";
    galleryDescription.innerHTML = description;
    
    //Create h3 tag for photo count
    var galleryPhotoCount = document.createElement("h3");
    galleryPhotoCount.className = "gallery-photo-count";
    galleryPhotoCount.innerHTML = countPhotos+" photos";

    //Create a tag for gallery URL
    var galleryURL = document.createElement("a");
    galleryURL.href = "https://www.flickr.com/photos/flickr/galleries/72157669781709702/";
    galleryURL.innerHTML = "https://www.flickr.com/photos/flickr/galleries/72157669781709702/";
    galleryURL.target = "_blank";

    //Append all tags to gallery-info ID
    document.getElementById("gallery-info").appendChild(galleryTitle);
    document.getElementById("gallery-info").appendChild(galleryDescription);
    document.getElementById("gallery-info").appendChild(galleryPhotoCount);
    document.getElementById("gallery-info").appendChild(galleryURL);
}

getGalleryID();

//  ===============  END 2. LOAD FLICKR API FUNCTIONS ===============


//  ===============  3. POPULATE PAGE WITH IMAGES ===============

//Generates grid of images on page by creating HTML elements dynamically.
function ImageRepeat() {

    for (var i=0; i< 15; i++) {
        
        //Create div with class "tile"
        var tile = document.createElement("div");
        tile.className = "tile";
        
        //Create div with class "thumbnail"
        var thumbnail = document.createElement("div");
        thumbnail.className = "thumbnail";

        // Create div with class "crop"
        var crop = document.createElement("div");
        crop.className = "crop";

        //Create image and set source, id, and onclick attributes
        var image = document.createElement("IMG");
        image.className = "grid-image"
        image.src = imageURL[i];
        image.id = i;
        //If you click on this photo, it activates lightbox and generates pic for this image's corresponding id.
        image.onclick = function() {openLightbox(); generatePic(this.id);};
        
        // Append image -> crop -> thumbnail -> tile -> gallery
        crop.appendChild(image);
        thumbnail.appendChild(crop);
        tile.appendChild(thumbnail);
        document.getElementById("gallery").appendChild(tile);
    }

    document.querySelector('footer').style.display = "block";
    document.getElementById('back-to-home').style.display = "block";

    console.log("successfully loaded images");

}

//  ===============  3. END POPULATE PAGE WITH IMAGES ===============


//  ===================== 4. LIGHTBOX FUNCTIONS ========================

// Activate lightbox (show lightbox div)
function openLightbox() {
    document.getElementById('lightbox').style.display = "block";
}

// Exit lightbox (hide lightbox div)
function closeLightbox(event) {
    if (event.target.className == "lightbox-background") {
        document.getElementById('lightbox').style.display = "none";
        document.getElementById('back-to-home').style.display = "block";
    }
    if (event.target.className == "close cursor") {
        document.getElementById('lightbox').style.display = "none";
        document.getElementById('back-to-home').style.display = "block";
    }
}

// Goes to next pic (uses global variable 'currentPic' to generate next pic)
function nextPic() {
    var next = window.currentPic;
    next++;
    generatePic(next);
}

// Goes to previous pic (uses global variable 'currentPic' to generate prev pic)
function prevPic() {
    var prev = window.currentPic;
    prev--;
    generatePic(prev);
}

var completed = false;

// Generates the photo to be displayed in the lightbox. Changes source of lightbox-pic with correct image URL. Also changes "{num_pic}/{total}" display.
function generatePic(n) {
    document.getElementById('back-to-home').style.display = "none";
    
    if (n == total) {
        n = 0;
    }

    if (n === -1) {
        n = total - 1;
    }

    window.currentPic = n; //Reset current pic


    //Prevent prev/next arrows from showing when on first/last photos (respectively)
    // if (n <= 0) {
    //     document.getElementById("prev").style.display = "none";
    // }
    // else {
    //     document.getElementById("prev").style.display = "block";
    // }
    // if (n >= total - 1) {
    //     document.getElementById("next").style.display = "none";
    // }
    // else {
    //     document.getElementById("next").style.display = "block";
    // }

    var height, width;
    var img = new Image();

    img.onload = function(){
        height = img.height;
        width = img.width;
        if (height < width) {
            document.getElementById("lightbox-pic").className = "landscape";
        }
        else if (height > width) {
            document.getElementById("lightbox-pic").className = "portrait";
        }
        else {
            document.getElementById("lightbox-pic").className = "square";
        }
    }
    img.src = imageURL[n];
    document.getElementById("lightbox-pic").src = imageURL[n];
    var nth = n++;
    document.getElementById("num-pic").innerHTML = String(n) + "/" + String(total);

}

//  ===================== END 4. LIGHTBOX FUNCTIONS ========================

# Laredo Lightbox

Laredo Lightbox is a mobile-responsive web application that extracts photos from a Flickr photo gallery and presents them in a clean grid layout. When you click on a photo, you can view it in lightbox view and navigate between the different photos in the gallery.

## [View Demo](http://laredolightbox.us/)

## Notes About Demo

This was built with pure JavaScript and with no external libraries. For demonstration purposes, I hardcoded the URL for the photo gallery in my JavaScript file. The photo gallery that I used in this demo is [Camera Day](https://www.flickr.com/photos/flickr/galleries/72157669781709702/). The cover photo, gallery title, gallery description, number of photos, and photo sources are all extracted from Flickr's API.

## Future Additions

In the future, I plan on creating a form where you can enter the URL for any valid Flickr photo gallery and have it display on my application. I would also add the ability to swipe between photos on mobile instead of tapping next/prev buttons.

## API Reference

I used two Flickr API methods in this project:
[flickr.urls.lookupGallery](https://www.flickr.com/services/api/flickr.urls.lookupGallery.html). 
Input: api_key, gallery URL
Returns: gallery_id, gallery title, description, number of photos, and the elements needed to get the gallery's cover photo

[flickr.urls.getPhotos](https://www.flickr.com/services/api/flickr.galleries.getPhotos.html).
Input: api_key, gallery_id
Returns: Standard Photo Response (XML format), which contains a photo's farm-id, photo-id, secret-id, and server-id.

With these four ids, I used string concatenation to generate each photo's source URL. The format for each photo source URL is "https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg"



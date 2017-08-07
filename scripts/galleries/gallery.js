// Gallery.js: Manages the dynamic operation of a gallery.

var galleryIndex=4;

var images=0;
var pathPrefix="";

function collectionToArray(collection) {
    // Helper function: Convert an HTMLCollection to a JS array.
    // Why there isn't an easier way to do this, I have no idea.
    return Array.prototype.slice.call(collection);
}

function prepImages() {
    // Only initialize if not already initialized
    if (images!==0) return;

    images=collectionToArray(document.getElementById("left").children);
    images.push(document.getElementById("focus"));
    images=images.concat(collectionToArray(document.getElementById("right").children));

    pathPrefix=document.getElementById("gallery-path").value;
}

// Fills in data on the current image
function fillMetadata() {
    var currentImage=gallery.images[galleryIndex];

    // Large and important items
    document.getElementById("gallery-title").innerHTML=currentImage.name;
    document.getElementById("gallery-description").innerHTML=currentImage.description;
    if (currentImage.inStock==undefined)
        currentImage.inStock=true;
    document.getElementById("out-of-stock").style.display=currentImage.inStock ? "none" : "block";

    // Input field
    var input=document.getElementById("gallery-units");
    if (currentImage.minCount==undefined)
        currentImage.minCount=1;
    input.min=currentImage.minCount;
    if (currentImage.defaultCount==undefined)
        currentImage.defaultCount=1;
    input.value=currentImage.defaultCount;
    if (currentImage.maxCount==undefined)
        input.removeAttribute("max");
    else
        input.max=currentImage.maxCount;
    if (currentImage.stepCount==undefined)
        currentImage.stepCount=1;
    input.step=currentImage.stepCount;

    // Price
    if (currentImage.price==undefined)
        currentImage.price=100;
    var price=currentImage.price;
    document.getElementById("gallery-dollars").innerHTML=Math.floor(price/100);
    price=price%100;
    var cents=price.toString();
    if (cents.length<2)
        cents="0"+cents;
    document.getElementById("gallery-cents").innerHTML=cents;

    // Enable/disable inputs and add to cart depending on stock
    input.disabled=!currentImage.inStock;
    document.getElementById("gallery-order").disabled=input.disabled;

    // Now, update image element alt-text and title
    prepImages();
    for (var i=0; i<images.length; ++i) {
        var n=images[i].getAttribute("imagenumber");
        if (gallery.images[n].alt==undefined)
            gallery.images[n].alt=gallery.images[n].name;
        images[i].alt=gallery.images[n].alt;
        if (gallery.images[n].title==undefined)
            gallery.images[n].title="";
        images[i].title=gallery.images[n].title;
    }
}
document.addEventListener("DOMContentLoaded", fillMetadata);

function rotateGallery(offset) {
    if (offset==0) return; // Sanity check

    if (offset!=Math.floor(offset))
        rotateGallery(Math.floor(offset));

    // Prepare the images array
    prepImages();

    numImages=gallery.length; // Shorthand

    for (var i=0; i<images.length; i++) {
        var number=parseInt(images[i].getAttribute("imagenumber"))+offset;
        while (number<1) // Wraparound negative
            number+=numImages; // Since number is 0 or negative
        while (number>numImages) // Wraparound positive
            number-=numImages;

        images[i].setAttribute("imagenumber", number);
        images[i].src=pathPrefix+number+".jpg";
    }

    // Update image description data
    galleryIndex=document.getElementById("focus").getAttribute("imagenumber");
    fillMetadata();
}
const accessKey = "YOUR_UNSPLASH_API_KEY";

const formEl = document.querySelector("form");
const inputEl = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
const showMore = document.getElementById("show-more-button");

let inputData = "";
let page = 1;



async function searchImages() {
    inputData = inputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;

    if (page === 1) {
        searchResults.innerHTML = "";
    }

    results.map((result) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("search-result");
        
        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description;
        image.setAttribute('data-id', result.id); // Include the photo's ID
        
        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = result.alt_description;
        
        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);
        searchResults.appendChild(imageWrapper);
    });

    page++;
    if (page > 1) {
        showMore.style.display = "block";
    }
}

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

showMore.addEventListener("click", () => {
    searchImages();
});



async function openPhotoPopup(photoId) {
    const url = `https://api.unsplash.com/photos/${photoId}?client_id=${accessKey}`;
    const response = await fetch(url);
    const photoDetails = await response.json();
    
    const popup = document.querySelector('.image-popup');
    const popupImg = popup.querySelector('.large-img');
    const downloadButton = popup.querySelector('.download-btn');

    // Set the src and alt attributes of the img element
    popupImg.src = photoDetails.urls.regular;
    popupImg.alt = photoDetails.alt_description;

    // Set the href attribute of the download button to the link provided in the HTML code snippet
    downloadButton.href = photoDetails.links.html;

    // Show the popup
    popup.classList.remove('hide');

    // Add event listener to the close button
    const closeButton = popup.querySelector('.close-btn');
    closeButton.addEventListener('click', function() {
        // Hide the popup when the close button is clicked
        popup.classList.add('hide');
    });
}



const randomImageCount = 10; // Number of random images to load


async function loadRandomImages() {
    const url = `https://api.unsplash.com/photos/random?count=${randomImageCount}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();

    data.forEach((result) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("search-result");
        
        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description;
        image.setAttribute('data-id', result.id); // Include the photo's ID
        
        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = result.alt_description;

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);
        searchResults.appendChild(imageWrapper);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    loadRandomImages();
});


// Add click event listener to the search results container
searchResults.addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG') {
        const photoId = e.target.getAttribute('data-id');
        openPhotoPopup(photoId);
    }
});


popup.innerHTML += '<button class="close-popup">Close</button>';
popup.querySelector('.close-popup').addEventListener('click', function() {
    popup.classList.add('hide');
});


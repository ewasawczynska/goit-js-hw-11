import * as pixabay from './pixabay';
import Notiflix from 'notiflix';
import _, { remove } from 'lodash';

const gallery = document.querySelector('.gallery');
const searchQuery = document.querySelector('input');
const searchForm = document.querySelector('form');
const button = document.querySelector('button');
const moreButton = document.querySelector('.load-more');

let pageImage = 1;
let limit = 40;
let pageQuery = null;
let isLoading = false;
let imagesCounter = null;

const totalPages = 500 / limit;

pixabay.init();

function searchImages(event) {
  event.preventDefault();
  pageImage += 1;
  gallery.innerHTML = '';
  pageQuery = searchQuery.value;
  getImages(pageQuery, pageImage, displayImages);
  if (pageImage > 1) {
    moreButton.addEventListener('submit', searchImages);
  }
}

async function getImages(query, page, callback) {
  try {
    const result = await pixabay.searchImage(query, page);
    callback(result);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    isLoading = false;
    moreButton.classList.remove('load-more');
    moreButton.classList.add('lmstyle');
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    console.log(error);
  }
}

function displayImages(data) {
  // imagesCounter = data.totalHits;
  // Notiflix.Notify.success(`Hooray! We found ${imagesCounter} images.`);
  pushGallery(data.hits);
  if (pageImage > 1) {
    moreButton.addEventListener('click', searchImages);
  }
}

function pushGallery(items) {
  const markup = items
    .map(
      item =>
        ` <div class="photo-card">
      <a href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" title="${item.tags}" loading="lazy"/></a>
        <div class="info">
          <p class="info-item">
            <b>Likes </b>${item.likes}
          </p>
          <p class="info-item">
            <b>Views </b>${item.views}
          </p>
          <p class="info-item">
            <b>Comments </b>${item.comments}
          </p>
          <p class="info-item">
            <b>Downloads </b>${item.downloads}
          </p>
        </div>
      </div> `
    )
    .join(' ');
  gallery.innerHTML += markup;
}

function addGallery(data) {
  pushGallery(data.hits);
}

searchForm.addEventListener('submit', searchImages);

// gallery.onscroll = function () {
//   if (window.scrollY > document.body.offsetHeight - window.outerHeight) {
//     body.style.height = document.body.offsetHeight + 200 + 'px';
//   }
// };

moreButton.addEventListener('submit', () => {
  if (pageImage > totalPages) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
});

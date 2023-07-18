import * as pixabay from './pixabay';
import Notiflix from 'notiflix';
import _ from 'lodash';
import Waypoint from 'waypoints/lib/noframework.waypoints.min.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const searchQuery = document.querySelector('input');
const searchForm = document.querySelector('form');
const button = document.querySelector('button');
const moreButton = document.querySelector('.load-more');
const simplelightbox = new SimpleLightbox('.photo-card a', {
  captionsData: '',
  captionPosition: 'bottom',
});

let pageImage = 1;
// let limit = 40;
let pageQuery = null;
let isLoading = false;
let imagesCounter = null;

// const totalPages = 500 / limit;

pixabay.init();

function searchImages(event) {
  event.preventDefault();
  let pageImage = 1;
  gallery.innerHTML = '';
  pageQuery = searchQuery.value;
  getImages(pageQuery, pageImage, displayImages);
  searchQuery.value = '';
  // if (pageImage > 1) {
  //   moreButton.addEventListener('submit', searchImages);
  // }
  // if ((gallery = '')) {
  // }
}

async function getImages(pageQuery, page, callback) {
  try {
    const result = await pixabay.searchImage(pageQuery, page);
    callback(result);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    isLoading = false;
    // moreButton.classList.remove('load-more');
    // moreButton.classList.add('lmstyle');
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    console.log(error);
  }
}

function displayImages(data) {
  imagesCounter = data.totalHits;
  Notiflix.Notify.success(`Hooray! We found ${imagesCounter} images.`);
  pushGallery(data.hits);
  // if (pageImage > 1) {
  //   moreButton.addEventListener('click', searchImages);
  // }
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
  simplelightbox.refresh();
}

function addGallery(data) {
  pushGallery(data.hits);
}

searchForm.addEventListener('submit', searchImages);

// // gallery.onscroll = function () {
// //   if (window.scrollY > document.body.offsetHeight - window.outerHeight) {
// //     body.style.height = document.body.offsetHeight + 200 + 'px';
// //   }
// // };

// // moreButton.addEventListener('submit', () => {
// //   if (pageImage > totalPages) {
// //     Notiflix.Notify.info(
// //       "We're sorry, but you've reached the end of search results."
// //     );
// //   }
// // });

// // const infinite = new Waypoint.Infinite({
// //   element: $('.gallery')[0],
// // });

function infiniteScroll() {
  const scrollPosition = window.pageYOffset;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  if (!(scrollPosition + windowHeight >= documentHeight) || isLoading) return;
  isLoading = true;
  if (check()) {
    getImages(pageQuery, ++pageImage, addGallery);
    return;
  }
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function check() {
  if (pageImage <= imagesCounter / 20) {
    return true;
  }
  return false;
}

document.addEventListener('scroll', _.throttle(infiniteScroll, 300));

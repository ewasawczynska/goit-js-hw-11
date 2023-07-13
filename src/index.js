import * as pixabay from './pixabay';
import Notiflix from 'notiflix';

const gallery = document.querySelector('.gallery');
const searchQuery = document.querySelector('input');
const searchForm = document.querySelector('form');

let pageImage = 1;
let pageQuery = null;
let isLoading = false;
let imagesCounter = null;

function searchImages(event) {
  event.preventDefault();
  pageImage;
  gallery.innerHTML = '';
  pageQuery = searchQuery.value;
  getImages(pageQuery, pageImage, displayImages);
}

async function getImages(query, page, callback) {
  try {
    const result = await pixabay.searchImage(query, page);
    callback(result);
    isLoading;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    console.log(error);
  }
}

function displayImages(data) {
  imagesCounter = data.totalHits;
  Notiflix.Notify.success('Hooray! We found ${totalHits} images.');
  pushGallery(data.hits);
}

function pushGallery(items) {}

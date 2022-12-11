import './css/styles.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

import { refs } from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { murkup } from './js/markup';
import ApiService from './js/service';

let img = 0;
const apiService = new ApiService();

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(event) {
  event.preventDefault();
  clearMurkup();
  apiService.query = event.target.searchQuery.value.trim();
  if (apiService.query === '') {
    Notify.info('Please enter a more specific name', {
      showOnlyTheLastOne: true,
    });
    return;
  }

  try {
    let data = await apiService.fetchArticles();
    apiService.calckTotalPages(data.totalHits);

    if (data.hits.length === 0) {
      refs.loadBnt.classList.add('is-hidden');
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          showOnlyTheLastOne: true,
        }
      );

      return;
    }
    render(data);
    if (apiService.totalPages == 1) {
      refs.loadBnt.classList.add('is-hidden');
    } else {
      refs.loadBnt.classList.remove('is-hidden');
    }

    Notify.info(
      `Hooray! We found ${data.totalHits} images.
      Available number of pages ${apiService.totalPages}`,
      {
        showOnlyTheLastOne: true,
      }
    );
  } catch (error) {
    Notify.failure('халепа', {
      showOnlyTheLastOne: true,
    });
  }
}

function render(data) {
  const articlesList = data.hits.map(murkup);

  refs.list.insertAdjacentHTML('beforeend', articlesList.join(''));

  const gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
  });
}

function clearMurkup() {
  refs.list.innerHTML = '';
  apiService.resetPage();
}

refs.loadBnt.addEventListener('click', onLoadMore);

async function onLoadMore() {
  apiService.incrementPage();
  if (!apiService.isShownLoadMoreBtn) {
    refs.loadBnt.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  let data = await apiService.fetchArticles();
  // if (data) {
  //   refs.loadBnt.classList.add('is-hidden');
  //   Notify.info("We're sorry, but you've reached the end of search results.");
  // }
  try {
    render(data);
    console.log(data);
  } catch (error) {
    refs.loadBnt.classList.add('is-hidden');
    throw new Error(response.status);
  }
}

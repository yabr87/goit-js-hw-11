import { refs } from './refs';
import axios from 'axios';

// const axios = require('axios').default;
const API_KEY = '31865177-941795f6a9b4b09e4f4c303b4';
const BASE_URL = 'https://pixabay.com/api/';
const parameters = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalPages = 0;
    this.perPage = 40;
  }

  async fetchArticles() {
    const query = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${parameters}&per_page=${this.perPage}&page=${this.page}`
    );

    return await query.data;
  }

  incrementPage() {
    this.page += 1;
    console.log(this.page);
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get isShownLoadMoreBtn() {
    return this.page < this.totalPages;
  }

  calckTotalPages(total) {
    return (this.totalPages = Math.ceil(total / this.perPage));
  }

  // // Notify.info(`показано: ${apiService.incrementImg(data.totalHits)}`);
  incrementImg(total) {
    let result = 0;
    if (this.page < this.totalPages) {
      result = this.page * this.perPage;
    }
    if (this.page === this.totalPages) {
      result = (this.page - 1) * this.perPage + (total % this.perPage);
    }
    console.log(result);
    return result;
  }
}

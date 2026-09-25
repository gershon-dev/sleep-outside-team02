import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const validCategories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];
const requestedCategory = getParam('category');
const category = validCategories.includes(requestedCategory)
  ? requestedCategory
  : 'tents';
const dataSource = new ProductData();
const listElement = document.querySelector('.product-list');
const statusElement = document.querySelector('.product-list-status');
const productList = new ProductList(category, dataSource, listElement);

async function initProductList() {
  try {
    await productList.init();
    statusElement.textContent = '';
  } catch (error) {
    statusElement.textContent =
      'Products could not be loaded. Please try again later.';
    statusElement.title = error.message;
  }
}

initProductList();

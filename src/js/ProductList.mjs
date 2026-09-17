function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <picture>
        <source media="(min-width: 1000px)" srcset="${product.Images.PrimaryLarge}">
        <source media="(min-width: 600px)" srcset="${product.Images.PrimaryMedium}">
        <img src="${product.Images.PrimarySmall}" alt="Image of ${product.Name}">
      </picture>
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);

    const titleElement = document.querySelector(".title");
    if (titleElement && this.category) {
      const formattedCategory = this.category.replace("-", " ");
      titleElement.innerText = `Top Products: ${formattedCategory.charAt(0).toUpperCase() + formattedCategory.slice(1)}`;
    }
  }

  renderList(list) {
    this.listElement.innerHTML = "";
    const htmlStrings = list.map(productCardTemplate);
    this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
  }
}
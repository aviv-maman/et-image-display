// For Search (form elements & variables)
let page = 1,
  results = [],
  gridResultsElement,
  gridFavoritesElement;

// For loading state
let spinnerIcons,
  searchIcon,
  refreshIcon,
  isLoading = false,
  searchBtn,
  loadMoreBtn;

//Modal elements
let modalImage,
  modalTitle,
  modalUser,
  modalUserImageURL,
  modalViews,
  modalDownloads,
  modalLikes,
  modalID,
  modalPageURL,
  modalType,
  modalTags,
  modalPreviewURL,
  modalPreviewDimensions,
  modalWebformatURL,
  modalWebformatDimensions,
  modalLargeImageURL,
  modalDimensions,
  modalImageSize,
  modalUserURL;

const toggleLoading = () => {
  spinnerIcons = document.getElementsByClassName('spinner-icon');
  searchIcon = document.getElementById('search-icon');
  refreshIcon = document.getElementById('refresh-icon');
  searchBtn = document.getElementById('search-btn');
  loadMoreBtn = document.getElementById('load-more-btn');
  isLoading = !isLoading;
  searchBtn.disabled = isLoading;
  loadMoreBtn.disabled = isLoading;
  if (isLoading) {
    for (let i = 0; i < spinnerIcons.length; i++) {
      spinnerIcons[i].style.display = 'block';
    }
    searchIcon.style.display = 'none';
    refreshIcon.style.display = 'none';
  } else {
    for (let i = 0; i < spinnerIcons.length; i++) {
      spinnerIcons[i].style.display = 'none';
    }
    searchIcon.style.display = 'block';
    refreshIcon.style.display = 'block';
  }
};

// Initial load
document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    gridResultsElement = document.getElementsByClassName('grid')[1];
    gridResultsElement.innerHTML = '';
    searchImages('', 1).then((res) => {
      renderResults(res.hits);
    });
    gridFavoritesElement = document.getElementsByClassName('grid')[0];
    gridFavoritesElement.innerHTML = '';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    renderResults(favorites, gridFavoritesElement);
    renderCategories();
  }
};

const onSearch = async (e) => {
  e.preventDefault();
  page = 1;
  results = [];
  const queryInput = e.target.query;
  const categoriesInput = e.target.categories;
  const res = await searchImages(queryInput.value, categoriesInput.value, 1);
  gridResultsElement.innerHTML = '';
  renderResults(res.hits);
};

const loadMore = async () => {
  const query = document.getElementById('query').value;
  page++;
  const res = await searchImages(query, page);
  renderResults(res.hits);
};

const renderResults = (results = [], element = gridResultsElement, renderEl = 'main') => {
  results.forEach((item) => {
    item.isInFavorites = checkIfInFavorites(item.id);
    const figure = document.createElement('figure');
    figure.classList.add('card-1');
    figure.classList.add('h-effect');
    figure.onclick = () => {
      prepareModalData(item.id);
      openModal();
    };

    const image = document.createElement('img');
    image.src = item.largeImageURL;
    image.classList.add('card-image');
    figure.appendChild(image);

    const addToFavoritesBtn = document.createElement('button');
    addToFavoritesBtn.classList.add('fav-button');
    addToFavoritesBtn.onclick = () => toggleFavorite(item.id);
    const favoriteBadge = document.createElement('img');
    favoriteBadge.id = renderEl === 'main' ? `${item.id}-fav-btn1` : `${item.id}-fav-btn2`;
    favoriteBadge.width = 16;
    favoriteBadge.height = 16;
    favoriteBadge.src = item.isInFavorites ? './icons/heart-filled-icon.svg' : './icons/heart-icon.svg';
    addToFavoritesBtn.appendChild(favoriteBadge);
    const topDiv = document.createElement('div');
    topDiv.appendChild(addToFavoritesBtn);

    const figcaption = document.createElement('figcaption');
    figure.appendChild(figcaption);

    topDiv.classList.add('effect-top');
    figcaption.appendChild(topDiv);

    const bottomDiv = document.createElement('div');
    bottomDiv.classList.add('effect-bottom');
    figcaption.appendChild(bottomDiv);

    const tagWrapper = document.createElement('div');
    tagWrapper.classList.add('tag-wrapper');
    item.tags.split(', ').forEach((tag) => {
      const span = document.createElement('span');
      span.classList.add('tag-1');
      span.innerHTML = tag;
      tagWrapper.appendChild(span);
      topDiv.appendChild(tagWrapper);
    });

    const viewsBadge = document.createElement('div');
    viewsBadge.classList.add('tag-2');
    const viewsIcon = document.createElement('img');
    viewsIcon.src = './icons/eye-icon.svg';
    viewsIcon.width = 16;
    viewsIcon.height = 16;
    viewsBadge.appendChild(viewsIcon);
    const viewsText = document.createElement('span');
    viewsText.innerHTML = item.views;
    viewsBadge.appendChild(viewsText);

    const downloadsBadge = document.createElement('div');
    downloadsBadge.classList.add('tag-2');
    const downloadsIcon = document.createElement('img');
    downloadsIcon.src = './icons/download-icon.svg';
    downloadsIcon.width = 16;
    downloadsIcon.height = 16;
    downloadsBadge.appendChild(downloadsIcon);
    const downloadsText = document.createElement('span');
    downloadsText.innerHTML = item.downloads;
    downloadsBadge.appendChild(downloadsText);

    const likesBadge = document.createElement('div');
    likesBadge.classList.add('tag-2');
    const likesIcon = document.createElement('img');
    likesIcon.src = './icons/thumb-up-icon.svg';
    likesIcon.width = 16;
    likesIcon.height = 16;
    likesBadge.appendChild(likesIcon);
    const likesText = document.createElement('span');
    likesText.innerHTML = item.likes;
    likesBadge.appendChild(likesText);

    bottomDiv.appendChild(viewsBadge);
    bottomDiv.appendChild(downloadsBadge);
    bottomDiv.appendChild(likesBadge);

    element.appendChild(figure);
  });
};

const searchImages = async (query, category = '', page = 1, pageSize = 12) => {
  toggleLoading();
  if (category === 'all') category = '';
  try {
    const API_KEY = '39601786-1601cac9077ffbe35beb1c0a6';
    const res = await fetch(
      `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&category=${category}&page=${page}&per_page=${pageSize}`,
      {
        cache: 'force-cache',
      }
    );

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      const errorWithInfo = { ...error, statusCode: res.status, statusText: res.statusText };
      throw errorWithInfo;
    }

    const data = await res.json();
    results.push(...data.hits);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      //(EvalError || RangeError || ReferenceError || SyntaxError || TypeError || URIError)
      console.error(`${error.name} - ${error.message}`);
    }
    throw error;
  } finally {
    toggleLoading();
  }
};

//Data preparation for modal
const prepareModalData = (id) => {
  const selectedItem = results.find((item) => item.id === id);
  modalImage = document.getElementById('modal-image');
  modalImage.src = selectedItem.largeImageURL;
  modalImage.alt = `img ${selectedItem.id}`;

  modalTitle = document.getElementById('modal-title');
  modalTitle.innerHTML = `IMG #${selectedItem.id}`;

  modalUser = document.getElementById('modal-user');
  modalUser.innerHTML = selectedItem.user;

  modalUserImageURL = document.getElementById('modal-userImageURL');
  modalUserImageURL.src = selectedItem.userImageURL;
  modalUserImageURL.alt = selectedItem.user;

  modalViews = document.getElementById('modal-views');
  modalViews.innerHTML = selectedItem.views;

  modalDownloads = document.getElementById('modal-downloads');
  modalDownloads.innerHTML = selectedItem.downloads;

  modalLikes = document.getElementById('modal-likes');
  modalLikes.innerHTML = selectedItem.likes;

  modalID = document.getElementById('modal-id');
  modalID.innerHTML = selectedItem.id;

  modalPageURL = document.getElementById('modal-pageURL');
  modalPageURL.href = selectedItem.pageURL;
  modalPageURL.innerHTML = selectedItem.pageURL;

  modalType = document.getElementById('modal-type');
  modalType.innerHTML = selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1);

  modalTags = document.getElementById('modal-tags');
  modalTags.innerHTML = selectedItem.tags;

  modalPreviewURL = document.getElementById('modal-previewURL');
  modalPreviewURL.href = selectedItem.previewURL;
  modalPreviewURL.innerHTML = selectedItem.previewURL;

  modalPreviewDimensions = document.getElementById('modal-previewDimensions');
  modalPreviewDimensions.innerHTML = `${selectedItem.previewWidth}x${selectedItem.previewHeight} px`;

  modalWebformatURL = document.getElementById('modal-webformatURL');
  modalWebformatURL.href = selectedItem.webformatURL;
  modalWebformatURL.innerHTML = selectedItem.webformatURL;

  modalPreviewDimensions = document.getElementById('modal-webformatDimensions');
  modalPreviewDimensions.innerHTML = `${selectedItem.webformatWidth}x${selectedItem.previewHeight} px`;

  modalLargeImageURL = document.getElementById('modal-largeImageURL');
  modalLargeImageURL.href = selectedItem.largeImageURL;
  modalLargeImageURL.innerHTML = selectedItem.largeImageURL;

  modalDimensions = document.getElementById('modal-dimensions');
  modalDimensions.innerHTML = `${selectedItem.imageWidth}x${selectedItem.imageHeight} px`;

  modalImageSize = document.getElementById('modal-imageSize');
  modalImageSize.innerHTML = `${selectedItem.imageSize} bytes`;

  modalUserURL = document.getElementById('modal-userURL');
  modalUserURL.href = `https://pixabay.com/users/${selectedItem.user}-${selectedItem.user_id}/`;
  modalUserURL.innerHTML = selectedItem.user;
};

// Function to open the modal
const openModal = () => {
  const modal = document.getElementById('img-modal');
  modal.style.display = 'block';
};

// Function to close the modal
const closeModal = () => {
  const modal = document.getElementById('img-modal');
  modal.style.display = 'none';
};

// Function to close the modal on an outside click
const onOutsideClick = (e) => {
  const modal = document.getElementById('img-modal');
  if (e.target == modal) {
    closeModal();
  }
};

// Event listener
window.addEventListener('click', onOutsideClick);

const addToFavorites = (id) => {
  const selectedItem = results.find((item) => item.id === id);
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.push(selectedItem);
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

const removeFromFavorites = (id) => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites?.filter((item) => item.id !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

// Check if image is in Favorites
const checkIfInFavorites = (id) => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites || favorites === null) {
    return false;
  } else {
    const isInFavorites = favorites?.find((item) => item.id === id);
    return isInFavorites;
  }
};

const toggleFavorite = (id) => {
  const favoriteBadge = document.getElementById(`${id}-fav-btn1`);
  const isInFavorites = checkIfInFavorites(id);
  if (isInFavorites) {
    removeFromFavorites(id);
    favoriteBadge.src = './icons/heart-icon.svg';

    // Update favorites badge in favorites section
    const favoriteBadgeSearchSection = document.getElementById(`${id}-fav-btn2`);
    favoriteBadgeSearchSection.src = isInFavorites ? './icons/heart-filled-icon.svg' : './icons/heart-icon.svg';
  } else {
    addToFavorites(id);
    favoriteBadge.src = './icons/heart-filled-icon.svg';
  }
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  gridFavoritesElement.innerHTML = '';
  renderResults(favorites, gridFavoritesElement, 'favorites');
};

const clearFavorites = () => {
  localStorage.removeItem('favorites');
  gridFavoritesElement.innerHTML = '';
};

const categories = [
  'all',
  'backgrounds',
  'fashion',
  'nature',
  'science',
  'education',
  'feelings',
  'health',
  'people',
  'religion',
  'places',
  'animals',
  'industry',
  'computer',
  'food',
  'sports',
  'transportation',
  'travel',
  'buildings',
  'business',
  'music',
];

const renderCategories = () => {
  const categoriesElement = document.getElementById('categories');
  categories.forEach((category) => {
    const categoryElement = document.createElement('option');
    categoryElement.classList.add('category');
    categoryElement.innerHTML = category.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
      return str.toUpperCase();
    });
    categoryElement.value = category;
    categoriesElement.appendChild(categoryElement);
  });
};

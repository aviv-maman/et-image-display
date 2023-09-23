// For Search (form elements & variables)
let [page, results, grid] = [1, [], null];

// For loading state
let [spinnerIcons, searchIcon, refreshIcon, isLoading, searchBtn, loadMoreBtn] = [null, null, null, false, null, null];

//Modal elements
let [
  modalImage,
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
  modalUserURL,
] = [];

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
    grid = document.getElementsByClassName('grid')[0];
    grid.innerHTML = '';
    searchImages('', 1).then((res) => {
      renderResults(res.hits);
    });
  }
};

const onSearch = async (e) => {
  e.preventDefault();
  page = 1;
  results = [];
  const queryInput = e.target.query;
  const res = await searchImages(queryInput.value, 1);
  grid.innerHTML = '';
  renderResults(res.hits);
};

const loadMore = async () => {
  const query = document.getElementById('query').value;
  page++;
  const res = await searchImages(query, page);
  renderResults(res.hits);
};

const renderResults = (results = []) => {
  results.forEach((item) => {
    const div = document.createElement('div');
    div.classList.add('card-1');
    div.onclick = () => {
      prepareModalData(item.id);
      openModal();
    };

    const image = document.createElement('img');
    image.src = item.largeImageURL;
    image.classList.add('card-image');
    div.appendChild(image);

    grid.appendChild(div);
  });
};

const searchImages = async (query, page = 1, pageSize = 12) => {
  toggleLoading();
  try {
    const API_KEY = '39601786-1601cac9077ffbe35beb1c0a6';
    const res = await fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&page=${page}&per_page=${pageSize}`, {
      cache: 'force-cache',
    });

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

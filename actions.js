let page = 1;
let results = [];

let grid;

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

    const image = document.createElement('img');
    image.src = item.webformatURL;
    image.classList.add('card-image');
    div.appendChild(image);

    grid.appendChild(div);
  });
};

const searchImages = async (query, page = 1, pageSize = 12) => {
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
  }
};

import express from 'express';

const router = express.Router();
const API_KEY = process.env.PIXABAY_API_KEY;
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

router.get('/', async (req, res) => {
  const { query = '', category = '', page = 1, pageSize = 12 } = req.query;
  const chosenCategory = category || categories[Math.floor(Math.random() * categories.length)];

  const pixabayRes = await fetch(
    `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&category=${chosenCategory}&page=${page}&per_page=${pageSize}`
  );

  const responseJson = await pixabayRes.json();
  res.setHeader('Cache-Control', 'public, max-age=3600').status(200).json(responseJson);
});

export default router;

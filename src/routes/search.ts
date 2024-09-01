import express from 'express';

const router = express.Router();
const API_KEY = process.env.PIXABAY_API_KEY;

router.get('/', async (req, res) => {
  const { query, image_type, category, page, pageSize } = req.query;

  const pixabayRes = await fetch(
    `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=${image_type}&category=${category}&page=${page}&per_page=${pageSize}`,
  );

  const responseJson = await pixabayRes.json();
  res.setHeader('Cache-Control', 'public, max-age=3600').status(200).json(responseJson);
});

export default router;

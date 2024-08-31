export type ImgSearchRes = {
  hits: {
    collections: number;
    comments: number;
    downloads: number;
    id: number;
    imageHeight: number;
    imageSize: number;
    imageWidth: number;
    isInFavorites?: number;
    largeImageURL: string; //https://pixabay.com/get/g90827ce_1280.jpg
    likes: number;
    pageURL: string; //'https://pixabay.com/photos/corn-corn-cob-food-sweet-corn-8983537/';
    previewHeight: number;
    previewURL: string; //'https://cdn.pixabay.com/photo/2024/08/20/14/40/corn-8983537_150.jpg';
    previewWidth: number;
    tags: string; //Comma-separated string, for example: 'corn, corn cob, food'
    type: 'all' | 'photo' | 'illustration' | 'vector';
    user: string;
    userImageURL: string; //'https://cdn.pixabay.com/user/2024/03/29/16-15-30-223_250x250.jpg';
    user_id: number;
    views: number;
    webformatHeight: number;
    webformatURL: string; //'https://pixabay.com/get/gae5ae0050_640.jpg';
    //Example: 640
    webformatWidth: number;
  }[];
  total: number;
  totalHits: number;
};

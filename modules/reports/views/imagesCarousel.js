import { urlImages } from '../../config/datasources.js';
import { el } from '../../html/elements.js';
import { modal } from '../../html/modal.js';
import { carousel } from '../../html/carousel.js';

function getTime(url) {
  let time = url.substring(
    url.lastIndexOf("_") + 1, 
    url.lastIndexOf(".")
);

return moment(time, 'HHmmss').format('HH:mm:ss');
}

function arrangeImageUrls(imageUrls) {
  var webcamImages = [];
  var reportImages = [];
  
  for (let url of imageUrls) {
    if (url.indexOf('.') > 0) { //Check if item is image file
      if (url.length < 30) {  
        reportImages.push(el('img', {class: "report-img", src:urlImages+url}));
      } else {      
        webcamImages.push(el('img', {class: "webcam-img", src:urlImages+url, alt: getTime(url)}));
      }
    }
  }
  return [webcamImages, reportImages];
}

export function updateImageCarousels(imageUrls) {
  let images = arrangeImageUrls(imageUrls);
  let webCarousel = carousel({
    id: 'webcam-images-carousel',
    items: images[0],
  })

  let reportCarousel = carousel({
    id: 'report-images-carousel',
    items: images[1]
  })
  
  document.querySelector('#root-modal-report-images')
  .replaceChildren(modal({
    id: `modal-report-images`,
    title: `Bilder fra dagen`,
    body: reportCarousel,
  }));

  document.querySelector('#img-webcam-historic')
  .replaceChildren(webCarousel); 
}
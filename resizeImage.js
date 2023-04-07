function resizeImage(img) {
  var canvas = document.createElement('canvas');
  canvas.width = customWidth;
  canvas.height = customHeight;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, customWidth, customHeight);
  return canvas.toDataURL();
}

var images = document.querySelectorAll('img');

for (var i = 0; i < images.length; i++) {
  var img = images[i];
  if (img.src.endsWith('.jpg') || img.src.endsWith('.jpeg') || img.src.endsWith('.png')) {
    img.src = resizeImage(img);
  }
}

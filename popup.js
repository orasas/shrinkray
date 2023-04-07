document.getElementById('fileInput').addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    document.getElementById('dimensions').style.display = 'block';
  } else {
    document.getElementById('dimensions').style.display = 'none';
  }
});

document.getElementById('resize').addEventListener('click', async function () {
  const width = document.getElementById('width').value;
  const height = document.getElementById('height').value;
  const fileInput = document.getElementById('fileInput');

  if (width && height && fileInput.files.length) {
    const file = fileInput.files[0];
    const fileURL = URL.createObjectURL(file);

    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('resize').disabled = true;

    try {
      const resizedImageDataUrl = await Promise.race([
        resizeImage(fileURL, width, height),
        timeout(15000)
      ]);

      document.getElementById('loading').classList.add('hidden');
      document.getElementById('resize').disabled = false;

      document.getElementById('dimensions').style.display = 'none';
      document.getElementById('result').classList.remove('hidden');
      document.getElementById('download').href = resizedImageDataUrl;
    } catch (error) {
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('resize').disabled = false;
      alert('Image resizing took too long. Please try again with a smaller image or smaller dimensions.');
    }
  } else {
    alert('Please upload an image and enter valid width and height values.');
  }
});

document.getElementById('newImage').addEventListener('click', function () {
  document.getElementById('result').classList.add('hidden');
  document.getElementById('fileInput').value = '';
  document.getElementById('width').value = '';
  document.getElementById('height').value = '';
});

async function resizeImage(fileURL, width, height) {
  function resize(img, customWidth, customHeight) {
    var canvas = document.createElement('canvas');
    canvas.width = customWidth;
    canvas.height = customHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, customWidth, customHeight);
    return canvas.toDataURL();
  }

  return new Promise((resolve) => {
    var img = new Image();
    img.src = fileURL;
    img.onload = function () {
      const fileFormat = fileURL.split('.').pop().toLowerCase();
      if (fileFormat === 'jpg' || fileFormat === 'jpeg' || fileFormat === 'png') {
        resolve(resize(img, width, height));
      }
    };
  });
}

function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
}

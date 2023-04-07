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
        resizeImage(file, width, height),
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

async function resizeImage(file, width, height) {
  const fileURL = URL.createObjectURL(file);
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  const resizedImageDataUrl = canvas.toDataURL(file.type);
  return resizedImageDataUrl;
}

function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
}

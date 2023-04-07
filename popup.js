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

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tab.id;

    const resizedImageDataUrl = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: resizeImage,
      args: [fileURL, width, height]
    });

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('resize').disabled = false;

    document.getElementById('dimensions').style.display = 'none';
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('download').href = resizedImageDataUrl[0].result;

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
      if (img.src.endsWith('.jpg') || img.src.endsWith('.jpeg') || img.src.endsWith('.png')) {
        resolve(resize(img, width, height));
      }
    };
  });
}

document.getElementById('resize').addEventListener('click', async function () {
  const width = document.getElementById('width').value;
  const height = document.getElementById('height').value;

  if (width && height) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tab.id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: resizeImage,
      args: [width, height]
    });
  } else {
    alert('Please enter valid width and height values.');
  }
});

async function resizeImage(width, height) {
  function resize(img, customWidth, customHeight) {
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
      img.src = resize(img, width, height);
    }
  }
}

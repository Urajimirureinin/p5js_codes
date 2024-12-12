javascript:(function() {var video = document.querySelector('video');if (video) {var sources = video.querySelectorAll('source');var videoUrl = video.src;if (sources.length > 0) {videoUrl = sources[0].src;}if (videoUrl) {var a = document.createElement('a');a.href = videoUrl;a.download = videoUrl.split('/').pop();a.style.display = 'none';document.body.appendChild(a);a.click();document.body.removeChild(a);alert('Downloading video: ' + a.download);} else {alert('No video URL found.');}} else {alert('No video element found on this page.');}})();

javascript:(function() {var video = document.querySelector('video');if (video) {var sources = video.querySelectorAll('source');var videoUrl = video.src;if (sources.length > 0) {videoUrl = sources[0].src;} if (videoUrl) {fetch(videoUrl).then(response => response.blob()).then(blob => {var url = window.URL.createObjectURL(blob);var a = document.createElement('a');a.style.display = 'none';a.href = url;a.download = videoUrl.split('/').pop();document.body.appendChild(a);a.click();window.URL.revokeObjectURL(url);document.body.removeChild(a);alert('Downloading video: ' + a.download);}).catch(err => console.error('Error downloading video:', err));} else {alert('No video URL found.');}} else {alert('No video element found on this page.');}})();
/**
 * Universal Media Uploader
 * @param {File|Blob} file - ব্যবহারকারীর সিলেক্ট করা ফাইল
 * @param {Function} onProgress - প্রোগ্রেস কলব্যাক (percentage)
 * @returns {Promise<Object>} - Firebase-এর জন্য প্রস্তুত মেটাডাটা
 */
const MEDIA_API_BASE = 'https://your-api-domain.com'; // আপনার ব্যাকএন্ড API ডোমেইন

async function uploadMedia(file, onProgress = null) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('কোনো ফাইল সিলেক্ট করা হয়নি!'));
    }

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${MEDIA_API_BASE}/media/upload`, true);

    // প্রোগ্রেস ট্র্যাকিং (UI-তে দেখানোর জন্য)
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    // আপলোড সম্পন্ন হলে
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(response.message || 'Upload failed.'));
          }
        } catch (e) {
          reject(new Error('Invalid response from server.'));
        }
      } else {
        reject(new Error(`Server error: ${xhr.status}. Upload failed.`));
      }
    };

    // নেটওয়ার্ক ফেইলিউর
    xhr.onerror = () => {
      reject(new Error('Network error. Check your internet connection.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Upload timed out. Please try again.'));
    };

    xhr.send(formData);
  });
}

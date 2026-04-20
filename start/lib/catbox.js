const fileType = require('file-type');
const FormData = require('form-data');
const fetch = require('node-fetch');
const axios = require('axios');
const MAX_FILE_SIZE_MB = 200; // Maximum file size

async function uploadMedia(buffer) {
  try {
    const { ext } = await fileType.fromBuffer(buffer);
    
    // Create form data with the buffer
    const formData = new FormData();
    formData.append('file', buffer, `file.${ext}`);
    
    // Use David Cyril API
    const response = await axios.post('https://apis.davidcyril.name.ng/uploader/catbox', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 60000
    });
    
    if (response.data && response.data.success && response.data.url) {
      return response.data.url;
    } else {
      throw new Error('Upload failed: Invalid response from API');
    }
  } catch (error) {
    console.error("Error during media upload:", error);
    throw new Error('Failed to upload media');
  }
}

async function handleMediaUpload(quoted, conn, mime) {
  if (!quoted || !mime) {
    throw new Error('No valid media to upload!');
  }

  try {
    const media = await conn.downloadAndSaveMediaMessage(quoted);

    const fs = require('fs');
    const buffer = fs.readFileSync(media);

    const fileSizeMB = buffer.length / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      fs.unlinkSync(media); 
      return `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`;
    }

    const mediaUrl = await uploadMedia(buffer);

    fs.unlinkSync(media);

    return mediaUrl;
  } catch (error) {
    console.error('Error handling media upload:', error);
    throw new Error('Failed to handle media upload');
  }
}

module.exports = {
  uploadMedia,
  handleMediaUpload,
};
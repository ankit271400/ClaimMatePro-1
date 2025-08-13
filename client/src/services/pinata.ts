import axios from 'axios';

const PINATA_API_URL = 'https://api.pinata.cloud';

class PinataService {
  private apiKey: string | null = null;
  private secretKey: string | null = null;

  constructor() {
    // These would be set through environment variables or user input
    this.apiKey = import.meta.env.VITE_PINATA_API_KEY || null;
    this.secretKey = import.meta.env.VITE_PINATA_SECRET_KEY || null;
  }

  setCredentials(apiKey: string, secretKey: string) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    localStorage.setItem('pinata_api_key', apiKey);
    localStorage.setItem('pinata_secret_key', secretKey);
  }

  loadCredentials() {
    if (!this.apiKey || !this.secretKey) {
      this.apiKey = localStorage.getItem('pinata_api_key');
      this.secretKey = localStorage.getItem('pinata_secret_key');
    }
  }

  private getHeaders() {
    this.loadCredentials();
    
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Pinata credentials not set. Please configure your API keys.');
    }

    return {
      'pinata_api_key': this.apiKey,
      'pinata_secret_api_key': this.secretKey,
    };
  }

  async testAuthentication() {
    try {
      const response = await axios.get(`${PINATA_API_URL}/data/testAuthentication`, {
        headers: this.getHeaders(),
      });
      return response.data.authenticated;
    } catch (error) {
      console.error('Pinata authentication failed:', error);
      return false;
    }
  }

  async uploadFile(file: File, metadata?: { name?: string; description?: string }) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (metadata) {
        const pinataMetadata = {
          name: metadata.name || file.name,
          description: metadata.description || '',
        };
        formData.append('pinataMetadata', JSON.stringify(pinataMetadata));
      }

      const response = await axios.post(`${PINATA_API_URL}/pinning/pinFileToIPFS`, formData, {
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        hash: response.data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        size: response.data.PinSize,
      };
    } catch (error) {
      console.error('File upload to Pinata failed:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async uploadJSON(data: object, metadata?: { name?: string; description?: string }) {
    try {
      const body = {
        pinataContent: data,
        pinataMetadata: metadata || {},
      };

      const response = await axios.post(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, body, {
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
      });

      return {
        hash: response.data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      };
    } catch (error) {
      console.error('JSON upload to Pinata failed:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  async getFileList() {
    try {
      const response = await axios.get(`${PINATA_API_URL}/data/pinList`, {
        headers: this.getHeaders(),
      });
      return response.data.rows;
    } catch (error) {
      console.error('Failed to get file list from Pinata:', error);
      throw new Error('Failed to retrieve file list');
    }
  }

  async unpinFile(hash: string) {
    try {
      await axios.delete(`${PINATA_API_URL}/pinning/unpin/${hash}`, {
        headers: this.getHeaders(),
      });
      return true;
    } catch (error) {
      console.error('Failed to unpin file:', error);
      throw new Error('Failed to unpin file from IPFS');
    }
  }
}

export const pinataService = new PinataService();
export default PinataService;
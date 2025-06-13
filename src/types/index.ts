export interface UploadResponse {
    url: string;
    public_id: string;
    secure_url: string;
}

export interface Photo {
    id: string;
    url: string;
    title: string;
    description?: string;
    createdAt: Date;
}

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  email_verified: string;
  sub: string; // Google user ID
}
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
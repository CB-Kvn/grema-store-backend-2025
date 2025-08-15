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

export interface CreateBannerData {
  name: string;
  dateInit: Date;
  dateEnd: Date;
  imageUrl: string;
  status: BannerStatus;
}

export interface UpdateBannerData {
  name?: string;
  dateInit?: Date;
  dateEnd?: Date;
  imageUrl?: string;
  status?: BannerStatus;
}

export enum BannerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED'
}
export interface ApiResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}
export interface JobApplicationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  resume: File;
  coverLetter?: File;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  workAuthorization?: string;
  visaSponsorship?: string;
  referral?: string;
  referralName?: string;
  school?: string;
  degree?: string;
  positionName: string;
}

export interface VolunteerApplicationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  resume: File;
  positionName: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  phoneNumber: string;
  inquiryType: string;
  inquiryTitle: string;
  message: string;
}

export interface WaitlistRequest {
  name: string;
  email: string;
  phone: string;
}

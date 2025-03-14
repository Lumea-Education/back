// API Response Types
export interface ApiResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

// Job Application Types
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

// Volunteer Application Types
export interface VolunteerApplicationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  resume: File;
  positionName: string;
}

// Contact Request Types
export interface ContactRequest {
  name: string;
  email: string;
  phoneNumber: string;
  inquiryType: string;
  inquiryTitle: string;
  message: string;
}

// Waitlist Entry Types
export interface WaitlistRequest {
  name: string;
  email: string;
  phone: string;
}

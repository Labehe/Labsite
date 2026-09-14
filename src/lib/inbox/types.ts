export type InquiryType = "contact_form" | "student_application" | "collaboration_proposal";
export type InquiryStatus = "new" | "reviewing" | "responded" | "archived" | "rejected";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject?: string;
  category: string;
  message: string;
  type: InquiryType;
  status: InquiryStatus;
  created_at: string;
  
  // Student Application Specific Fields
  degree_level?: string;
  university?: string;
  research_interest?: string;
  cover_letter?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  category: string;
  message: string;
  type?: InquiryType;
}

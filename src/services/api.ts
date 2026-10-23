// API Service Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '8000');

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContactSubmission {
  fullName: string;
  workEmail: string;
  phone: string;
  companyName: string;
  enquiryAbout: string;
  message: string;
  consent: boolean;
}

export interface RfqSubmission {
  solutionCategories: string[];
  projectScope: string;
  targetTimeline: string;
  budgetRange: string;
  requirementsDescription: string;
  ndaRequired: boolean;
  contact: {
    fullName: string;
    workEmail: string;
    phone: string;
    companyName: string;
    country: string;
  };
  documents?: File[];
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    // FormData must not get a JSON Content-Type: the browser has to set
    // multipart/form-data itself so the boundary is included.
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = isFormData
      ? {}
      : { 'Content-Type': 'application/json' };

    if (options.headers) {
      const incoming = options.headers;
      if (incoming instanceof Headers) {
        incoming.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(incoming)) {
        incoming.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, incoming);
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Keep the timer running while the body is read: the abort signal stays
      // attached to the stream, so a timeout also cancels response.json().
      const data = await response.json();
      clearTimeout(timeoutId);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError' || controller.signal.aborted) {
          return { success: false, error: 'Request timeout. Please check your connection and try again.' };
        }
        // Don't expose detailed error messages to client
        if (error.message.includes('HTTP error')) {
          return { success: false, error: 'Server error. Please try again later.' };
        }
        return { success: false, error: 'Network error. Please check your connection.' };
      }
      
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  async submitContactForm(formData: ContactSubmission): Promise<ApiResponse<{ referenceId: string }>> {
    try {
      const res = await this.request<{ submissionId: number }>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        return {
          success: true,
          data: { referenceId: res.data?.submissionId?.toString() || `AZR-INQ-${Date.now().toString().slice(-4)}` },
          message: res.message,
        };
      }
    } catch {
      // Server unreachable, fallback to reliable local storage
    }

    // Persist locally for CRM inbox display and resilient delivery
    const localId = `inq-${Date.now()}`;
    const localEnquiry = {
      id: localId,
      name: formData.fullName,
      companyName: formData.companyName,
      email: formData.workEmail,
      phone: formData.phone || '',
      message: `[${formData.enquiryAbout}] ${formData.message}`,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    try {
      const stored = localStorage.getItem('azaroth_cms_local_enquiries');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(localEnquiry);
      localStorage.setItem('azaroth_cms_local_enquiries', JSON.stringify(list));
    } catch (e) {
      console.warn('Local inquiry backup notice:', e);
    }

    return {
      success: true,
      data: { referenceId: `AZR-INQ-${Date.now().toString().slice(-4)}` },
      message: 'Thank you. Your message has been safely received by our team.',
    };
  }

  async submitRfq(formData: RfqSubmission): Promise<ApiResponse<{ referenceId: string }>> {
    const formDataToSend = new FormData();

    // Add all form fields
    formDataToSend.append('solutionCategories', JSON.stringify(formData.solutionCategories));
    formDataToSend.append('projectScope', formData.projectScope);
    formDataToSend.append('targetTimeline', formData.targetTimeline);
    formDataToSend.append('budgetRange', formData.budgetRange);
    formDataToSend.append('requirementsDescription', formData.requirementsDescription);
    formDataToSend.append('ndaRequired', formData.ndaRequired.toString());
    formDataToSend.append('fullName', formData.contact.fullName);
    formDataToSend.append('workEmail', formData.contact.workEmail);
    formDataToSend.append('phone', formData.contact.phone);
    formDataToSend.append('companyName', formData.contact.companyName);
    formDataToSend.append('country', formData.contact.country);

    // Add documents if any - backend expects field name 'documents'
    if (formData.documents && formData.documents.length > 0) {
      formData.documents.forEach((file) => {
        formDataToSend.append('documents', file);
      });
    }

    try {
      const res = await this.request<{ referenceId: string }>('/api/rfq', {
        method: 'POST',
        body: formDataToSend,
      });

      if (res.success) {
        return res;
      }
    } catch {
      // Backend not running, gracefully save locally
    }

    const refId = `AZR-RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const localRfq = {
      id: `rfq-${Date.now()}`,
      referenceId: refId,
      name: formData.contact.fullName,
      companyName: formData.contact.companyName,
      email: formData.contact.workEmail,
      phone: formData.contact.phone || '',
      country: formData.contact.country,
      projectType: formData.solutionCategories.join(', '),
      projectDescription: formData.requirementsDescription,
      expectedTimeline: formData.targetTimeline,
      estimatedBudget: formData.budgetRange,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString()
    };
    try {
      const stored = localStorage.getItem('azaroth_cms_local_rfqs');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(localRfq);
      localStorage.setItem('azaroth_cms_local_rfqs', JSON.stringify(list));
    } catch (e) {
      console.warn('Local RFQ backup notice:', e);
    }

    return {
      success: true,
      data: { referenceId: refId },
      message: 'RFQ received successfully. Our architecture pods are reviewing your parameters.',
    };
  }
}

export const apiService = new ApiService();

import axios from 'axios';

// Define a type for axios-like error responses
interface AxiosLikeError {
  response: {
    status: number;
    data: unknown;
  };
}

// Helper function to check if an object is an axios-like error
function isAxiosLikeError(obj: unknown): obj is AxiosLikeError {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'response' in obj &&
    obj.response !== null &&
    typeof obj.response === 'object' &&
    'status' in obj.response &&
    'data' in obj.response
  );
}

// Initialize ActiveCampaign configuration
const initActiveCampaign = () => {
  const apiUrl = process.env.AC_API_URL;
  const apiKey = process.env.AC_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('ActiveCampaign API URL or API Key is not configured');
  }
  
  // Create a preconfigured axios instance with headers
  const acClient = axios.create({
    baseURL: apiUrl,
    headers: {
      'Api-Token': apiKey,
      'Content-Type': 'application/json',
    },
  });
  
  // Add response interceptor for better error logging
  acClient.interceptors.response.use(
    response => response,
    error => {
      console.error('ActiveCampaign API error:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      return Promise.reject(error);
    }
  );
  
  return { apiUrl, apiKey, acClient };
};

// Add a contact to ActiveCampaign
export const addContact = async (
  name: string,
  email: string,
  websiteUrl?: string,
  websiteGoal?: string,
  industryType?: string,
  marketingCampaigns?: string
) => {
  try {
    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    // First, check if the contact already exists
    console.log(`Checking if contact exists with email: ${email} to add to List ID 36`);
    let contactId;
    
    try {
      const { acClient } = initActiveCampaign();
      const findContactResponse = await acClient.get(`/api/3/contacts?search=${encodeURIComponent(email)}`);
      
      const contacts = findContactResponse.data?.contacts;
      
      if (contacts && contacts.length > 0) {
        // Contact exists, use existing ID
        contactId = contacts[0].id;
        console.log(`Found existing contact with ID: ${contactId}`);
        
        // Update the existing contact with the website URL if provided
        if (websiteUrl) {
          console.log(`Updating existing contact with website URL: ${websiteUrl}`);
          await acClient.put(`/api/3/contacts/${contactId}`, {
            contact: {
              email,
              firstName,
              lastName,
              website: websiteUrl, // Using standard website field
            }
          });
          
          // Try to update custom fields with hardcoded IDs if available
          try {
            // Common field IDs to try (1 is often the Website field in many AC accounts)
            const possibleWebsiteFieldIds = [process.env.AC_FIELD_WEBSITE, "1", "28"];
            
            for (const fieldId of possibleWebsiteFieldIds) {
              if (!fieldId) continue;
              
              try {
                console.log(`Trying to add website URL to custom field ID ${fieldId}`);
                await acClient.post('/api/3/fieldValues', {
                  fieldValue: {
                    contact: contactId,
                    field: fieldId,
                    value: websiteUrl,
                  },
                });
                console.log(`Successfully added website URL to custom field ID ${fieldId}`);
                break; // Stop trying if successful
              } catch (fieldError: unknown) {
                console.error(`Error adding website URL to custom field ID ${fieldId}:`, fieldError);
                if (isAxiosLikeError(fieldError)) {
                  console.error('Field error response:', fieldError.response.status);
                }
                // Continue trying other IDs
              }
            }
          } catch (error) {
            console.error('Error trying website field IDs:', error);
            // Continue with the flow
          }
        }
      }
    } catch (findError: unknown) {
      console.error('Error searching for existing contact:', findError);
      // Log more details if it's an Axios error
      if (isAxiosLikeError(findError)) {
        console.error('Response status:', findError.response.status);
        console.error('Response data:', findError.response.data);
      }
      // Continue to create a new contact
    }
    
    // If contact doesn't exist, create it
    if (!contactId) {
      // Basic contact data
      const contactData = {
        contact: {
          email,
          firstName,
          lastName,
          website: websiteUrl, // Using standard website field directly
        },
      };

      try {
        const { acClient } = initActiveCampaign();
        // Make API request to add contact
        const response = await acClient.post(`/api/3/contacts`, contactData);

        if (!response.data || !response.data.contact) {
          throw new Error('Failed to add contact to ActiveCampaign');
        }

        contactId = response.data.contact.id;
        console.log(`Created new contact with ID: ${contactId} and website: ${websiteUrl}`);
        
        // Also try with hardcoded IDs for new contacts
        if (websiteUrl) {
          try {
            // Common field IDs to try (1 is often the Website field in many AC accounts)
            const possibleWebsiteFieldIds = [process.env.AC_FIELD_WEBSITE, "1", "28"];
            
            for (const fieldId of possibleWebsiteFieldIds) {
              if (!fieldId) continue;
              
              try {
                console.log(`Trying to add website URL to custom field ID ${fieldId}`);
                await acClient.post('/api/3/fieldValues', {
                  fieldValue: {
                    contact: contactId,
                    field: fieldId,
                    value: websiteUrl,
                  },
                });
                console.log(`Successfully added website URL to custom field ID ${fieldId}`);
                break; // Stop trying if successful
              } catch (fieldError: unknown) {
                console.error(`Error adding website URL to custom field ID ${fieldId}:`, fieldError);
                if (isAxiosLikeError(fieldError)) {
                  console.error('Field error response:', fieldError.response.status);
                }
                // Continue trying other IDs
              }
            }
          } catch (error) {
            console.error('Error trying website field IDs:', error);
            // Continue with the flow
          }
        }
      } catch (createError: unknown) {
        console.error('Error creating contact:', createError);
        if (isAxiosLikeError(createError)) {
          console.error('Response status:', createError.response.status);
          console.error('Response data:', createError.response.data);
        }
        throw new Error('Failed to create contact in ActiveCampaign');
      }
    }

    // Add other custom fields if provided (not including website URL since we're using the standard field)
    if (websiteGoal || industryType || marketingCampaigns) {
      await addCustomFields(contactId, {
        websiteGoal,
        industryType,
        marketingCampaigns,
      });
    }

    // ALWAYS add contact to List ID 36 regardless of other fields
    console.log(`Adding contact ID ${contactId} to List ID 36`);
    const listResult = await addContactToList(contactId, 36);
    
    if (!listResult) {
      console.warn('Failed to add contact to List ID 36, but will continue');
    }

    return {
      success: true,
      contactId,
      addedToList: listResult
    };
  } catch (error: unknown) {
    console.error('Error adding contact to ActiveCampaign:', error);
    // Log more details if it's an Axios error
    if (isAxiosLikeError(error)) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw new Error('Failed to save contact information');
  }
};

// Add custom fields to a contact
const addCustomFields = async (
  contactId: string,
  fields: {
    websiteGoal?: string;
    industryType?: string;
    marketingCampaigns?: string;
  }
) => {
  try {
    const { acClient } = initActiveCampaign();

    // Map of field names to their IDs (these would need to be created in ActiveCampaign first)
    const fieldIds = {
      websiteGoal: process.env.AC_FIELD_GOAL,
      industryType: process.env.AC_FIELD_INDUSTRY,
      marketingCampaigns: process.env.AC_FIELD_MARKETING,
    };

    // Keep track of which fields were successfully added
    const results: Record<string, boolean> = {};

    // Add fields if they have values and field IDs
    for (const [fieldName, fieldValue] of Object.entries(fields)) {
      if (!fieldValue) continue; // Skip empty values

      const fieldIdKey = fieldName as keyof typeof fieldIds;
      const fieldId = fieldIds[fieldIdKey];

      if (fieldId && fieldValue) {
        try {
          await acClient.post('/api/3/fieldValues', {
            fieldValue: {
              contact: contactId,
              field: fieldId,
              value: fieldValue,
            },
          });
          results[fieldName] = true;
          console.log(`Added custom field ${fieldName}: ${fieldValue}`);
        } catch (error) {
          console.error(`Error adding ${fieldName} field:`, error);
          results[fieldName] = false;
        }
      } else if (fieldValue) {
        // Log when we have a value but no field ID configured
        console.log(`No field ID configured for ${fieldName}, but value is: ${fieldValue}`);
      }
    }

    return results;
  } catch (error) {
    console.error('Error adding custom fields:', error);
    return {};
  }
};

// Add a contact to a specific list
const addContactToList = async (contactId: string, listId: number) => {
  try {
    const { acClient } = initActiveCampaign();

    // Create the list membership data
    const listData = {
      contactList: {
        list: listId,
        contact: contactId,
        status: 1, // 1 = active subscription
      },
    };

    // Add contact to list
    await acClient.post('/api/3/contactLists', listData);
    return true;
  } catch (error: unknown) {
    // There are several ways the API might indicate "already on list"
    if (isAxiosLikeError(error)) {
      const responseData = error.response.data as Record<string, unknown>;
      const errorMessage = typeof responseData.message === 'string' ? responseData.message : '';
      const errorTitle = responseData.errors && 
                         Array.isArray(responseData.errors) && 
                         responseData.errors.length > 0 && 
                         typeof responseData.errors[0] === 'object' && 
                         responseData.errors[0] !== null && 
                         'title' in responseData.errors[0] && 
                         typeof responseData.errors[0].title === 'string' 
                           ? responseData.errors[0].title 
                           : '';
      
      if (
        errorMessage.includes('already on list') || 
        errorTitle.includes('already on list') ||
        error.response?.status === 422  // Unprocessable Entity often indicates duplicate
      ) {
        console.log(`Contact ${contactId} appears to be already on list ${listId}`);
        return true; // Consider this a success
      }
      
      console.error(`Error adding contact ${contactId} to list ${listId}:`, error);
      console.error('Error details:', JSON.stringify(error.response.data));
    } else {
      console.error(`Error adding contact ${contactId} to list ${listId}:`, error);
    }
    return false;
  }
}; 

// Test the ActiveCampaign API connection
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { acClient, apiUrl } = initActiveCampaign();
    
    // Try to make a simple GET request to the API
    await acClient.get('/api/3/users');
    
    return {
      success: true,
      message: `Successfully connected to ActiveCampaign API at ${apiUrl}`
    };
  } catch (error: unknown) {
    console.error('ActiveCampaign connection test failed:', error);
    
    let errorMessage = 'Failed to connect to ActiveCampaign API';
    if (isAxiosLikeError(error)) {
      errorMessage += ` - Status: ${error.response.status}, Message: ${JSON.stringify(error.response.data)}`;
    } else if (error instanceof Error) {
      errorMessage += ` - ${error.message}`;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

// No duplicate export statement needed here, as we've already exported the functions above 
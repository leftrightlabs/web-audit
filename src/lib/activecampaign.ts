import axios from 'axios';

// Initialize ActiveCampaign configuration
const initActiveCampaign = () => {
  const apiUrl = process.env.ACTIVECAMPAIGN_API_URL;
  const apiKey = process.env.ACTIVECAMPAIGN_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('ActiveCampaign API URL or API Key is not configured');
  }

  return {
    apiUrl,
    apiKey,
  };
};

// Add a contact to ActiveCampaign
export const addContact = async (
  name: string,
  email: string,
  websiteUrl?: string,
  businessGoal?: string,
  industry?: string,
  runningAds?: string
) => {
  try {
    const { apiUrl, apiKey } = initActiveCampaign();

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    // Basic contact data
    const contactData = {
      contact: {
        email,
        firstName,
        lastName,
      },
    };

    // Make API request to add contact
    const response = await axios.post(`${apiUrl}/api/3/contacts`, contactData, {
      headers: {
        'Api-Token': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.contact) {
      throw new Error('Failed to add contact to ActiveCampaign');
    }

    const contactId = response.data.contact.id;

    // Add custom fields if they exist
    if (websiteUrl || businessGoal || industry || runningAds) {
      await addCustomFields(contactId, {
        websiteUrl,
        businessGoal,
        industry,
        runningAds,
      });
    }

    // Add contact to the Brand Audit list
    await addContactToList(contactId, 'Brand Audit');

    return {
      success: true,
      contactId,
    };
  } catch (error) {
    console.error('Error adding contact to ActiveCampaign:', error);
    throw new Error('Failed to save contact information');
  }
};

// Add custom fields to a contact
const addCustomFields = async (
  contactId: string,
  fields: {
    websiteUrl?: string;
    businessGoal?: string;
    industry?: string;
    runningAds?: string;
  }
) => {
  try {
    const { apiUrl, apiKey } = initActiveCampaign();

    // Map of field names to their IDs (these would need to be created in ActiveCampaign first)
    const fieldIds = {
      websiteUrl: process.env.AC_FIELD_WEBSITE_URL,
      businessGoal: process.env.AC_FIELD_BUSINESS_GOAL,
      industry: process.env.AC_FIELD_INDUSTRY,
      runningAds: process.env.AC_FIELD_RUNNING_ADS,
    };

    // Create field value requests for each field
    const fieldUpdates = Object.entries(fields)
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        const fieldId = fieldIds[key as keyof typeof fieldIds];
        if (!fieldId) return null;

        return axios.post(
          `${apiUrl}/api/3/fieldValues`,
          {
            fieldValue: {
              contact: contactId,
              field: fieldId,
              value: value,
            },
          },
          {
            headers: {
              'Api-Token': apiKey,
              'Content-Type': 'application/json',
            },
          }
        );
      })
      .filter(Boolean);

    // Execute all field updates
    if (fieldUpdates.length > 0) {
      await Promise.all(fieldUpdates);
    }

    return true;
  } catch (error) {
    console.error('Error adding custom fields to contact:', error);
    return false; // Continue even if custom fields fail
  }
};

// Add contact to a specific list
const addContactToList = async (contactId: string, listName: string) => {
  try {
    const { apiUrl, apiKey } = initActiveCampaign();

    // Get list ID from environment variables or set a default
    // You would need to create this list in ActiveCampaign and set its ID in env vars
    const listId = process.env.AC_LIST_BRAND_AUDIT;

    if (!listId) {
      console.warn('ActiveCampaign list ID not configured');
      return false;
    }

    // Add contact to list
    await axios.post(
      `${apiUrl}/api/3/contactLists`,
      {
        contactList: {
          list: listId,
          contact: contactId,
          status: '1', // 1 = active subscription
        },
      },
      {
        headers: {
          'Api-Token': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    return true;
  } catch (error) {
    console.error('Error adding contact to list:', error);
    return false; // Continue even if adding to list fails
  }
}; 
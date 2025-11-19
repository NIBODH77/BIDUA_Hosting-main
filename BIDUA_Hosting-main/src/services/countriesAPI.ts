// Countries API interface
export interface Country {
  id: number;
  name: string;
  code: string;
  alpha3_code?: string;
  phone_code?: string;
  currency_code?: string;
  currency_name?: string;
  flag_emoji?: string;
  is_active: boolean;
}

export interface CountrySimple {
  value: string;
  label: string;
  phone_code?: string;
  currency?: string;
}

class CountriesAPI {
  private static baseURL = 'http://localhost:8000/api/v1';

  static async getCountriesSimple(): Promise<CountrySimple[]> {
    try {
      const response = await fetch(`${this.baseURL}/countries/simple`);
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.statusText}`);
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Fallback to hardcoded list if API fails
      return this.getFallbackCountries();
    }
  }

  static async getCountries(search?: string, limit?: number, skip?: number): Promise<{
    data: Country[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      has_more: boolean;
    };
  }> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (limit) params.append('limit', limit.toString());
      if (skip) params.append('skip', skip.toString());

      const response = await fetch(`${this.baseURL}/countries?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  static async getCountryByCode(code: string): Promise<Country | null> {
    try {
      const response = await fetch(`${this.baseURL}/countries/code/${code}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch country: ${response.statusText}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching country:', error);
      return null;
    }
  }

  // Fallback countries list (same as before but formatted)
  private static getFallbackCountries(): CountrySimple[] {
    const fallbackList = [
      'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina',
      'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
      'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
      'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
      'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
      'Congo (Congo-Brazzaville)', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus',
      'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
      'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji',
      'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
      'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hungary',
      'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
      'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
      'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
      'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
      'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
      'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
      'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea',
      'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
      'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
      'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
      'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
      'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
      'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
      'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
      'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];

    return fallbackList.map(name => ({
      value: name,
      label: name
    }));
  }
}

export default CountriesAPI;
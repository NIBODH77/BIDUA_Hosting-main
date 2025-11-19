import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.core.database import DATABASE_URL, Base
from app.models.countries import Country
from sqlalchemy import text


# Comprehensive country data with ISO codes, phone codes, currencies, and flags
COUNTRIES_DATA = [
    {"name": "Afghanistan", "code": "AF", "alpha3_code": "AFG", "numeric_code": "004", "phone_code": "+93", "currency_code": "AFN", "currency_name": "Afghan Afghani", "flag_emoji": "🇦🇫"},
    {"name": "Albania", "code": "AL", "alpha3_code": "ALB", "numeric_code": "008", "phone_code": "+355", "currency_code": "ALL", "currency_name": "Albanian Lek", "flag_emoji": "🇦🇱"},
    {"name": "Algeria", "code": "DZ", "alpha3_code": "DZA", "numeric_code": "012", "phone_code": "+213", "currency_code": "DZD", "currency_name": "Algerian Dinar", "flag_emoji": "🇩🇿"},
    {"name": "Andorra", "code": "AD", "alpha3_code": "AND", "numeric_code": "020", "phone_code": "+376", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇦🇩"},
    {"name": "Angola", "code": "AO", "alpha3_code": "AGO", "numeric_code": "024", "phone_code": "+244", "currency_code": "AOA", "currency_name": "Angolan Kwanza", "flag_emoji": "🇦🇴"},
    {"name": "Antigua and Barbuda", "code": "AG", "alpha3_code": "ATG", "numeric_code": "028", "phone_code": "+1", "currency_code": "XCD", "currency_name": "East Caribbean Dollar", "flag_emoji": "🇦🇬"},
    {"name": "Argentina", "code": "AR", "alpha3_code": "ARG", "numeric_code": "032", "phone_code": "+54", "currency_code": "ARS", "currency_name": "Argentine Peso", "flag_emoji": "🇦🇷"},
    {"name": "Armenia", "code": "AM", "alpha3_code": "ARM", "numeric_code": "051", "phone_code": "+374", "currency_code": "AMD", "currency_name": "Armenian Dram", "flag_emoji": "🇦🇲"},
    {"name": "Australia", "code": "AU", "alpha3_code": "AUS", "numeric_code": "036", "phone_code": "+61", "currency_code": "AUD", "currency_name": "Australian Dollar", "flag_emoji": "🇦🇺"},
    {"name": "Austria", "code": "AT", "alpha3_code": "AUT", "numeric_code": "040", "phone_code": "+43", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇦🇹"},
    {"name": "Azerbaijan", "code": "AZ", "alpha3_code": "AZE", "numeric_code": "031", "phone_code": "+994", "currency_code": "AZN", "currency_name": "Azerbaijani Manat", "flag_emoji": "🇦🇿"},
    {"name": "Bahamas", "code": "BS", "alpha3_code": "BHS", "numeric_code": "044", "phone_code": "+1", "currency_code": "BSD", "currency_name": "Bahamian Dollar", "flag_emoji": "🇧🇸"},
    {"name": "Bahrain", "code": "BH", "alpha3_code": "BHR", "numeric_code": "048", "phone_code": "+973", "currency_code": "BHD", "currency_name": "Bahraini Dinar", "flag_emoji": "🇧🇭"},
    {"name": "Bangladesh", "code": "BD", "alpha3_code": "BGD", "numeric_code": "050", "phone_code": "+880", "currency_code": "BDT", "currency_name": "Bangladeshi Taka", "flag_emoji": "🇧🇩"},
    {"name": "Barbados", "code": "BB", "alpha3_code": "BRB", "numeric_code": "052", "phone_code": "+1", "currency_code": "BBD", "currency_name": "Barbadian Dollar", "flag_emoji": "🇧🇧"},
    {"name": "Belarus", "code": "BY", "alpha3_code": "BLR", "numeric_code": "112", "phone_code": "+375", "currency_code": "BYN", "currency_name": "Belarusian Ruble", "flag_emoji": "🇧🇾"},
    {"name": "Belgium", "code": "BE", "alpha3_code": "BEL", "numeric_code": "056", "phone_code": "+32", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇧🇪"},
    {"name": "Belize", "code": "BZ", "alpha3_code": "BLZ", "numeric_code": "084", "phone_code": "+501", "currency_code": "BZD", "currency_name": "Belize Dollar", "flag_emoji": "🇧🇿"},
    {"name": "Benin", "code": "BJ", "alpha3_code": "BEN", "numeric_code": "204", "phone_code": "+229", "currency_code": "XOF", "currency_name": "West African CFA Franc", "flag_emoji": "🇧🇯"},
    {"name": "Bhutan", "code": "BT", "alpha3_code": "BTN", "numeric_code": "064", "phone_code": "+975", "currency_code": "BTN", "currency_name": "Bhutanese Ngultrum", "flag_emoji": "🇧🇹"},
    {"name": "Bolivia", "code": "BO", "alpha3_code": "BOL", "numeric_code": "068", "phone_code": "+591", "currency_code": "BOB", "currency_name": "Bolivian Boliviano", "flag_emoji": "🇧🇴"},
    {"name": "Bosnia and Herzegovina", "code": "BA", "alpha3_code": "BIH", "numeric_code": "070", "phone_code": "+387", "currency_code": "BAM", "currency_name": "Bosnia and Herzegovina Convertible Mark", "flag_emoji": "🇧🇦"},
    {"name": "Botswana", "code": "BW", "alpha3_code": "BWA", "numeric_code": "072", "phone_code": "+267", "currency_code": "BWP", "currency_name": "Botswana Pula", "flag_emoji": "🇧🇼"},
    {"name": "Brazil", "code": "BR", "alpha3_code": "BRA", "numeric_code": "076", "phone_code": "+55", "currency_code": "BRL", "currency_name": "Brazilian Real", "flag_emoji": "🇧🇷"},
    {"name": "Brunei", "code": "BN", "alpha3_code": "BRN", "numeric_code": "096", "phone_code": "+673", "currency_code": "BND", "currency_name": "Brunei Dollar", "flag_emoji": "🇧🇳"},
    {"name": "Bulgaria", "code": "BG", "alpha3_code": "BGR", "numeric_code": "100", "phone_code": "+359", "currency_code": "BGN", "currency_name": "Bulgarian Lev", "flag_emoji": "🇧🇬"},
    {"name": "Burkina Faso", "code": "BF", "alpha3_code": "BFA", "numeric_code": "854", "phone_code": "+226", "currency_code": "XOF", "currency_name": "West African CFA Franc", "flag_emoji": "🇧🇫"},
    {"name": "Burundi", "code": "BI", "alpha3_code": "BDI", "numeric_code": "108", "phone_code": "+257", "currency_code": "BIF", "currency_name": "Burundian Franc", "flag_emoji": "🇧🇮"},
    {"name": "Cabo Verde", "code": "CV", "alpha3_code": "CPV", "numeric_code": "132", "phone_code": "+238", "currency_code": "CVE", "currency_name": "Cape Verdean Escudo", "flag_emoji": "🇨🇻"},
    {"name": "Cambodia", "code": "KH", "alpha3_code": "KHM", "numeric_code": "116", "phone_code": "+855", "currency_code": "KHR", "currency_name": "Cambodian Riel", "flag_emoji": "🇰🇭"},
    {"name": "Cameroon", "code": "CM", "alpha3_code": "CMR", "numeric_code": "120", "phone_code": "+237", "currency_code": "XAF", "currency_name": "Central African CFA Franc", "flag_emoji": "🇨🇲"},
    {"name": "Canada", "code": "CA", "alpha3_code": "CAN", "numeric_code": "124", "phone_code": "+1", "currency_code": "CAD", "currency_name": "Canadian Dollar", "flag_emoji": "🇨🇦"},
    {"name": "Central African Republic", "code": "CF", "alpha3_code": "CAF", "numeric_code": "140", "phone_code": "+236", "currency_code": "XAF", "currency_name": "Central African CFA Franc", "flag_emoji": "🇨🇫"},
    {"name": "Chad", "code": "TD", "alpha3_code": "TCD", "numeric_code": "148", "phone_code": "+235", "currency_code": "XAF", "currency_name": "Central African CFA Franc", "flag_emoji": "🇹🇩"},
    {"name": "Chile", "code": "CL", "alpha3_code": "CHL", "numeric_code": "152", "phone_code": "+56", "currency_code": "CLP", "currency_name": "Chilean Peso", "flag_emoji": "🇨🇱"},
    {"name": "China", "code": "CN", "alpha3_code": "CHN", "numeric_code": "156", "phone_code": "+86", "currency_code": "CNY", "currency_name": "Chinese Yuan", "flag_emoji": "🇨🇳"},
    {"name": "Colombia", "code": "CO", "alpha3_code": "COL", "numeric_code": "170", "phone_code": "+57", "currency_code": "COP", "currency_name": "Colombian Peso", "flag_emoji": "🇨🇴"},
    {"name": "Comoros", "code": "KM", "alpha3_code": "COM", "numeric_code": "174", "phone_code": "+269", "currency_code": "KMF", "currency_name": "Comorian Franc", "flag_emoji": "🇰🇲"},
    {"name": "Congo (Congo-Brazzaville)", "code": "CG", "alpha3_code": "COG", "numeric_code": "178", "phone_code": "+242", "currency_code": "XAF", "currency_name": "Central African CFA Franc", "flag_emoji": "🇨🇬"},
    {"name": "Costa Rica", "code": "CR", "alpha3_code": "CRI", "numeric_code": "188", "phone_code": "+506", "currency_code": "CRC", "currency_name": "Costa Rican Colón", "flag_emoji": "🇨🇷"},
    {"name": "Cote d'Ivoire", "code": "CI", "alpha3_code": "CIV", "numeric_code": "384", "phone_code": "+225", "currency_code": "XOF", "currency_name": "West African CFA Franc", "flag_emoji": "🇨🇮"},
    {"name": "Croatia", "code": "HR", "alpha3_code": "HRV", "numeric_code": "191", "phone_code": "+385", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇭🇷"},
    {"name": "Cuba", "code": "CU", "alpha3_code": "CUB", "numeric_code": "192", "phone_code": "+53", "currency_code": "CUP", "currency_name": "Cuban Peso", "flag_emoji": "🇨🇺"},
    {"name": "Cyprus", "code": "CY", "alpha3_code": "CYP", "numeric_code": "196", "phone_code": "+357", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇨🇾"},
    {"name": "Czech Republic", "code": "CZ", "alpha3_code": "CZE", "numeric_code": "203", "phone_code": "+420", "currency_code": "CZK", "currency_name": "Czech Koruna", "flag_emoji": "🇨🇿"},
    {"name": "Denmark", "code": "DK", "alpha3_code": "DNK", "numeric_code": "208", "phone_code": "+45", "currency_code": "DKK", "currency_name": "Danish Krone", "flag_emoji": "🇩🇰"},
    {"name": "Djibouti", "code": "DJ", "alpha3_code": "DJI", "numeric_code": "262", "phone_code": "+253", "currency_code": "DJF", "currency_name": "Djiboutian Franc", "flag_emoji": "🇩🇯"},
    {"name": "Dominica", "code": "DM", "alpha3_code": "DMA", "numeric_code": "212", "phone_code": "+1", "currency_code": "XCD", "currency_name": "East Caribbean Dollar", "flag_emoji": "🇩🇲"},
    {"name": "Dominican Republic", "code": "DO", "alpha3_code": "DOM", "numeric_code": "214", "phone_code": "+1", "currency_code": "DOP", "currency_name": "Dominican Peso", "flag_emoji": "🇩🇴"},
    {"name": "Ecuador", "code": "EC", "alpha3_code": "ECU", "numeric_code": "218", "phone_code": "+593", "currency_code": "USD", "currency_name": "US Dollar", "flag_emoji": "🇪🇨"},
    {"name": "Egypt", "code": "EG", "alpha3_code": "EGY", "numeric_code": "818", "phone_code": "+20", "currency_code": "EGP", "currency_name": "Egyptian Pound", "flag_emoji": "🇪🇬"},
    {"name": "El Salvador", "code": "SV", "alpha3_code": "SLV", "numeric_code": "222", "phone_code": "+503", "currency_code": "USD", "currency_name": "US Dollar", "flag_emoji": "🇸🇻"},
    {"name": "Equatorial Guinea", "code": "GQ", "alpha3_code": "GNQ", "numeric_code": "226", "phone_code": "+240", "currency_code": "XAF", "currency_name": "Central African CFA Franc", "flag_emoji": "🇬🇶"},
    {"name": "Eritrea", "code": "ER", "alpha3_code": "ERI", "numeric_code": "232", "phone_code": "+291", "currency_code": "ERN", "currency_name": "Eritrean Nakfa", "flag_emoji": "🇪🇷"},
    {"name": "Estonia", "code": "EE", "alpha3_code": "EST", "numeric_code": "233", "phone_code": "+372", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇪🇪"},
    {"name": "Eswatini", "code": "SZ", "alpha3_code": "SWZ", "numeric_code": "748", "phone_code": "+268", "currency_code": "SZL", "currency_name": "Swazi Lilangeni", "flag_emoji": "🇸🇿"},
    {"name": "Ethiopia", "code": "ET", "alpha3_code": "ETH", "numeric_code": "231", "phone_code": "+251", "currency_code": "ETB", "currency_name": "Ethiopian Birr", "flag_emoji": "🇪🇹"},
    {"name": "Fiji", "code": "FJ", "alpha3_code": "FJI", "numeric_code": "242", "phone_code": "+679", "currency_code": "FJD", "currency_name": "Fijian Dollar", "flag_emoji": "🇫🇯"},
    {"name": "Finland", "code": "FI", "alpha3_code": "FIN", "numeric_code": "246", "phone_code": "+358", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇫🇮"},
    {"name": "France", "code": "FR", "alpha3_code": "FRA", "numeric_code": "250", "phone_code": "+33", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇫🇷"},
    {"name": "Gabon", "code": "GA", "alpha3_code": "GAB", "numeric_code": "266", "phone_code": "+241", "currency_code": "XAF", "currency_name": "Central African CFA Franc", "flag_emoji": "🇬🇦"},
    {"name": "Gambia", "code": "GM", "alpha3_code": "GMB", "numeric_code": "270", "phone_code": "+220", "currency_code": "GMD", "currency_name": "Gambian Dalasi", "flag_emoji": "🇬🇲"},
    {"name": "Georgia", "code": "GE", "alpha3_code": "GEO", "numeric_code": "268", "phone_code": "+995", "currency_code": "GEL", "currency_name": "Georgian Lari", "flag_emoji": "🇬🇪"},
    {"name": "Germany", "code": "DE", "alpha3_code": "DEU", "numeric_code": "276", "phone_code": "+49", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇩🇪"},
    {"name": "Ghana", "code": "GH", "alpha3_code": "GHA", "numeric_code": "288", "phone_code": "+233", "currency_code": "GHS", "currency_name": "Ghanaian Cedi", "flag_emoji": "🇬🇭"},
    {"name": "Greece", "code": "GR", "alpha3_code": "GRC", "numeric_code": "300", "phone_code": "+30", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇬🇷"},
    {"name": "Grenada", "code": "GD", "alpha3_code": "GRD", "numeric_code": "308", "phone_code": "+1", "currency_code": "XCD", "currency_name": "East Caribbean Dollar", "flag_emoji": "🇬🇩"},
    {"name": "Guatemala", "code": "GT", "alpha3_code": "GTM", "numeric_code": "320", "phone_code": "+502", "currency_code": "GTQ", "currency_name": "Guatemalan Quetzal", "flag_emoji": "🇬🇹"},
    {"name": "Guinea", "code": "GN", "alpha3_code": "GIN", "numeric_code": "324", "phone_code": "+224", "currency_code": "GNF", "currency_name": "Guinean Franc", "flag_emoji": "🇬🇳"},
    {"name": "Guinea-Bissau", "code": "GW", "alpha3_code": "GNB", "numeric_code": "624", "phone_code": "+245", "currency_code": "XOF", "currency_name": "West African CFA Franc", "flag_emoji": "🇬🇼"},
    {"name": "Guyana", "code": "GY", "alpha3_code": "GUY", "numeric_code": "328", "phone_code": "+592", "currency_code": "GYD", "currency_name": "Guyanese Dollar", "flag_emoji": "🇬🇾"},
    {"name": "Haiti", "code": "HT", "alpha3_code": "HTI", "numeric_code": "332", "phone_code": "+509", "currency_code": "HTG", "currency_name": "Haitian Gourde", "flag_emoji": "🇭🇹"},
    {"name": "Honduras", "code": "HN", "alpha3_code": "HND", "numeric_code": "340", "phone_code": "+504", "currency_code": "HNL", "currency_name": "Honduran Lempira", "flag_emoji": "🇭🇳"},
    {"name": "Hungary", "code": "HU", "alpha3_code": "HUN", "numeric_code": "348", "phone_code": "+36", "currency_code": "HUF", "currency_name": "Hungarian Forint", "flag_emoji": "🇭🇺"},
    {"name": "Iceland", "code": "IS", "alpha3_code": "ISL", "numeric_code": "352", "phone_code": "+354", "currency_code": "ISK", "currency_name": "Icelandic Króna", "flag_emoji": "🇮🇸"},
    {"name": "India", "code": "IN", "alpha3_code": "IND", "numeric_code": "356", "phone_code": "+91", "currency_code": "INR", "currency_name": "Indian Rupee", "flag_emoji": "🇮🇳"},
    {"name": "Indonesia", "code": "ID", "alpha3_code": "IDN", "numeric_code": "360", "phone_code": "+62", "currency_code": "IDR", "currency_name": "Indonesian Rupiah", "flag_emoji": "🇮🇩"},
    {"name": "Iran", "code": "IR", "alpha3_code": "IRN", "numeric_code": "364", "phone_code": "+98", "currency_code": "IRR", "currency_name": "Iranian Rial", "flag_emoji": "🇮🇷"},
    {"name": "Iraq", "code": "IQ", "alpha3_code": "IRQ", "numeric_code": "368", "phone_code": "+964", "currency_code": "IQD", "currency_name": "Iraqi Dinar", "flag_emoji": "🇮🇶"},
    {"name": "Ireland", "code": "IE", "alpha3_code": "IRL", "numeric_code": "372", "phone_code": "+353", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇮🇪"},
    {"name": "Israel", "code": "IL", "alpha3_code": "ISR", "numeric_code": "376", "phone_code": "+972", "currency_code": "ILS", "currency_name": "Israeli New Shekel", "flag_emoji": "🇮🇱"},
    {"name": "Italy", "code": "IT", "alpha3_code": "ITA", "numeric_code": "380", "phone_code": "+39", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇮🇹"},
    {"name": "Jamaica", "code": "JM", "alpha3_code": "JAM", "numeric_code": "388", "phone_code": "+1", "currency_code": "JMD", "currency_name": "Jamaican Dollar", "flag_emoji": "🇯🇲"},
    {"name": "Japan", "code": "JP", "alpha3_code": "JPN", "numeric_code": "392", "phone_code": "+81", "currency_code": "JPY", "currency_name": "Japanese Yen", "flag_emoji": "🇯🇵"},
    {"name": "Jordan", "code": "JO", "alpha3_code": "JOR", "numeric_code": "400", "phone_code": "+962", "currency_code": "JOD", "currency_name": "Jordanian Dinar", "flag_emoji": "🇯🇴"},
    {"name": "Kazakhstan", "code": "KZ", "alpha3_code": "KAZ", "numeric_code": "398", "phone_code": "+7", "currency_code": "KZT", "currency_name": "Kazakhstani Tenge", "flag_emoji": "🇰🇿"},
    {"name": "Kenya", "code": "KE", "alpha3_code": "KEN", "numeric_code": "404", "phone_code": "+254", "currency_code": "KES", "currency_name": "Kenyan Shilling", "flag_emoji": "🇰🇪"},
    {"name": "Kiribati", "code": "KI", "alpha3_code": "KIR", "numeric_code": "296", "phone_code": "+686", "currency_code": "AUD", "currency_name": "Australian Dollar", "flag_emoji": "🇰🇮"},
    {"name": "Kuwait", "code": "KW", "alpha3_code": "KWT", "numeric_code": "414", "phone_code": "+965", "currency_code": "KWD", "currency_name": "Kuwaiti Dinar", "flag_emoji": "🇰🇼"},
    {"name": "Kyrgyzstan", "code": "KG", "alpha3_code": "KGZ", "numeric_code": "417", "phone_code": "+996", "currency_code": "KGS", "currency_name": "Kyrgyzstani Som", "flag_emoji": "🇰🇬"},
    {"name": "Laos", "code": "LA", "alpha3_code": "LAO", "numeric_code": "418", "phone_code": "+856", "currency_code": "LAK", "currency_name": "Lao Kip", "flag_emoji": "🇱🇦"},
    {"name": "Latvia", "code": "LV", "alpha3_code": "LVA", "numeric_code": "428", "phone_code": "+371", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇱🇻"},
    {"name": "Lebanon", "code": "LB", "alpha3_code": "LBN", "numeric_code": "422", "phone_code": "+961", "currency_code": "LBP", "currency_name": "Lebanese Pound", "flag_emoji": "🇱🇧"},
    {"name": "Lesotho", "code": "LS", "alpha3_code": "LSO", "numeric_code": "426", "phone_code": "+266", "currency_code": "LSL", "currency_name": "Lesotho Loti", "flag_emoji": "🇱🇸"},
    {"name": "Liberia", "code": "LR", "alpha3_code": "LBR", "numeric_code": "430", "phone_code": "+231", "currency_code": "LRD", "currency_name": "Liberian Dollar", "flag_emoji": "🇱🇷"},
    {"name": "Libya", "code": "LY", "alpha3_code": "LBY", "numeric_code": "434", "phone_code": "+218", "currency_code": "LYD", "currency_name": "Libyan Dinar", "flag_emoji": "🇱🇾"},
    {"name": "Liechtenstein", "code": "LI", "alpha3_code": "LIE", "numeric_code": "438", "phone_code": "+423", "currency_code": "CHF", "currency_name": "Swiss Franc", "flag_emoji": "🇱🇮"},
    {"name": "Lithuania", "code": "LT", "alpha3_code": "LTU", "numeric_code": "440", "phone_code": "+370", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇱🇹"},
    {"name": "Luxembourg", "code": "LU", "alpha3_code": "LUX", "numeric_code": "442", "phone_code": "+352", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇱🇺"},
    {"name": "Madagascar", "code": "MG", "alpha3_code": "MDG", "numeric_code": "450", "phone_code": "+261", "currency_code": "MGA", "currency_name": "Malagasy Ariary", "flag_emoji": "🇲🇬"},
    {"name": "Malawi", "code": "MW", "alpha3_code": "MWI", "numeric_code": "454", "phone_code": "+265", "currency_code": "MWK", "currency_name": "Malawian Kwacha", "flag_emoji": "🇲🇼"},
    {"name": "Malaysia", "code": "MY", "alpha3_code": "MYS", "numeric_code": "458", "phone_code": "+60", "currency_code": "MYR", "currency_name": "Malaysian Ringgit", "flag_emoji": "🇲🇾"},
    {"name": "Maldives", "code": "MV", "alpha3_code": "MDV", "numeric_code": "462", "phone_code": "+960", "currency_code": "MVR", "currency_name": "Maldivian Rufiyaa", "flag_emoji": "🇲🇻"},
    {"name": "Mali", "code": "ML", "alpha3_code": "MLI", "numeric_code": "466", "phone_code": "+223", "currency_code": "XOF", "currency_name": "West African CFA Franc", "flag_emoji": "🇲🇱"},
    {"name": "Malta", "code": "MT", "alpha3_code": "MLT", "numeric_code": "470", "phone_code": "+356", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇲🇹"},
    {"name": "Marshall Islands", "code": "MH", "alpha3_code": "MHL", "numeric_code": "584", "phone_code": "+692", "currency_code": "USD", "currency_name": "US Dollar", "flag_emoji": "🇲🇭"},
    {"name": "Mauritania", "code": "MR", "alpha3_code": "MRT", "numeric_code": "478", "phone_code": "+222", "currency_code": "MRU", "currency_name": "Mauritanian Ouguiya", "flag_emoji": "🇲🇷"},
    {"name": "Mauritius", "code": "MU", "alpha3_code": "MUS", "numeric_code": "480", "phone_code": "+230", "currency_code": "MUR", "currency_name": "Mauritian Rupee", "flag_emoji": "🇲🇺"},
    {"name": "Mexico", "code": "MX", "alpha3_code": "MEX", "numeric_code": "484", "phone_code": "+52", "currency_code": "MXN", "currency_name": "Mexican Peso", "flag_emoji": "🇲🇽"},
    {"name": "Micronesia", "code": "FM", "alpha3_code": "FSM", "numeric_code": "583", "phone_code": "+691", "currency_code": "USD", "currency_name": "US Dollar", "flag_emoji": "🇫🇲"},
    {"name": "Moldova", "code": "MD", "alpha3_code": "MDA", "numeric_code": "498", "phone_code": "+373", "currency_code": "MDL", "currency_name": "Moldovan Leu", "flag_emoji": "🇲🇩"},
    {"name": "Monaco", "code": "MC", "alpha3_code": "MCO", "numeric_code": "492", "phone_code": "+377", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇲🇨"},
    {"name": "Mongolia", "code": "MN", "alpha3_code": "MNG", "numeric_code": "496", "phone_code": "+976", "currency_code": "MNT", "currency_name": "Mongolian Tögrög", "flag_emoji": "🇲🇳"},
    {"name": "Montenegro", "code": "ME", "alpha3_code": "MNE", "numeric_code": "499", "phone_code": "+382", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇲🇪"},
    {"name": "Morocco", "code": "MA", "alpha3_code": "MAR", "numeric_code": "504", "phone_code": "+212", "currency_code": "MAD", "currency_name": "Moroccan Dirham", "flag_emoji": "🇲🇦"},
    {"name": "Mozambique", "code": "MZ", "alpha3_code": "MOZ", "numeric_code": "508", "phone_code": "+258", "currency_code": "MZN", "currency_name": "Mozambican Metical", "flag_emoji": "🇲🇿"},
    {"name": "Myanmar", "code": "MM", "alpha3_code": "MMR", "numeric_code": "104", "phone_code": "+95", "currency_code": "MMK", "currency_name": "Myanmar Kyat", "flag_emoji": "🇲🇲"},
    {"name": "Namibia", "code": "NA", "alpha3_code": "NAM", "numeric_code": "516", "phone_code": "+264", "currency_code": "NAD", "currency_name": "Namibian Dollar", "flag_emoji": "🇳🇦"},
    {"name": "Nauru", "code": "NR", "alpha3_code": "NRU", "numeric_code": "520", "phone_code": "+674", "currency_code": "AUD", "currency_name": "Australian Dollar", "flag_emoji": "🇳🇷"},
    {"name": "Nepal", "code": "NP", "alpha3_code": "NPL", "numeric_code": "524", "phone_code": "+977", "currency_code": "NPR", "currency_name": "Nepalese Rupee", "flag_emoji": "🇳🇵"},
    {"name": "Netherlands", "code": "NL", "alpha3_code": "NLD", "numeric_code": "528", "phone_code": "+31", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇳🇱"},
    {"name": "New Zealand", "code": "NZ", "alpha3_code": "NZL", "numeric_code": "554", "phone_code": "+64", "currency_code": "NZD", "currency_name": "New Zealand Dollar", "flag_emoji": "🇳🇿"},
    {"name": "Nicaragua", "code": "NI", "alpha3_code": "NIC", "numeric_code": "558", "phone_code": "+505", "currency_code": "NIO", "currency_name": "Nicaraguan Córdoba", "flag_emoji": "🇳🇮"},
    {"name": "Niger", "code": "NE", "alpha3_code": "NER", "numeric_code": "562", "phone_code": "+227", "currency_code": "XOF", "currency_name": "West African CFA Franc", "flag_emoji": "🇳🇪"},
    {"name": "Nigeria", "code": "NG", "alpha3_code": "NGA", "numeric_code": "566", "phone_code": "+234", "currency_code": "NGN", "currency_name": "Nigerian Naira", "flag_emoji": "🇳🇬"},
    {"name": "North Korea", "code": "KP", "alpha3_code": "PRK", "numeric_code": "408", "phone_code": "+850", "currency_code": "KPW", "currency_name": "North Korean Won", "flag_emoji": "🇰🇵"},
    {"name": "North Macedonia", "code": "MK", "alpha3_code": "MKD", "numeric_code": "807", "phone_code": "+389", "currency_code": "MKD", "currency_name": "Macedonian Denar", "flag_emoji": "🇲🇰"},
    {"name": "Norway", "code": "NO", "alpha3_code": "NOR", "numeric_code": "578", "phone_code": "+47", "currency_code": "NOK", "currency_name": "Norwegian Krone", "flag_emoji": "🇳🇴"},
    {"name": "Oman", "code": "OM", "alpha3_code": "OMN", "numeric_code": "512", "phone_code": "+968", "currency_code": "OMR", "currency_name": "Omani Rial", "flag_emoji": "🇴🇲"},
    {"name": "Pakistan", "code": "PK", "alpha3_code": "PAK", "numeric_code": "586", "phone_code": "+92", "currency_code": "PKR", "currency_name": "Pakistani Rupee", "flag_emoji": "🇵🇰"},
    {"name": "Palau", "code": "PW", "alpha3_code": "PLW", "numeric_code": "585", "phone_code": "+680", "currency_code": "USD", "currency_name": "US Dollar", "flag_emoji": "🇵🇼"},
    {"name": "Panama", "code": "PA", "alpha3_code": "PAN", "numeric_code": "591", "phone_code": "+507", "currency_code": "PAB", "currency_name": "Panamanian Balboa", "flag_emoji": "🇵🇦"},
    {"name": "Papua New Guinea", "code": "PG", "alpha3_code": "PNG", "numeric_code": "598", "phone_code": "+675", "currency_code": "PGK", "currency_name": "Papua New Guinean Kina", "flag_emoji": "🇵🇬"},
    {"name": "Paraguay", "code": "PY", "alpha3_code": "PRY", "numeric_code": "600", "phone_code": "+595", "currency_code": "PYG", "currency_name": "Paraguayan Guaraní", "flag_emoji": "🇵🇾"},
    {"name": "Peru", "code": "PE", "alpha3_code": "PER", "numeric_code": "604", "phone_code": "+51", "currency_code": "PEN", "currency_name": "Peruvian Sol", "flag_emoji": "🇵🇪"},
    {"name": "Philippines", "code": "PH", "alpha3_code": "PHL", "numeric_code": "608", "phone_code": "+63", "currency_code": "PHP", "currency_name": "Philippine Peso", "flag_emoji": "🇵🇭"},
    {"name": "Poland", "code": "PL", "alpha3_code": "POL", "numeric_code": "616", "phone_code": "+48", "currency_code": "PLN", "currency_name": "Polish Złoty", "flag_emoji": "🇵🇱"},
    {"name": "Portugal", "code": "PT", "alpha3_code": "PRT", "numeric_code": "620", "phone_code": "+351", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇵🇹"},
    {"name": "Qatar", "code": "QA", "alpha3_code": "QAT", "numeric_code": "634", "phone_code": "+974", "currency_code": "QAR", "currency_name": "Qatari Riyal", "flag_emoji": "🇶🇦"},
    {"name": "Romania", "code": "RO", "alpha3_code": "ROU", "numeric_code": "642", "phone_code": "+40", "currency_code": "RON", "currency_name": "Romanian Leu", "flag_emoji": "🇷🇴"},
    {"name": "Russia", "code": "RU", "alpha3_code": "RUS", "numeric_code": "643", "phone_code": "+7", "currency_code": "RUB", "currency_name": "Russian Ruble", "flag_emoji": "🇷🇺"},
    {"name": "Rwanda", "code": "RW", "alpha3_code": "RWA", "numeric_code": "646", "phone_code": "+250", "currency_code": "RWF", "currency_name": "Rwandan Franc", "flag_emoji": "🇷🇼"},
    {"name": "Saint Kitts and Nevis", "code": "KN", "alpha3_code": "KNA", "numeric_code": "659", "phone_code": "+1", "currency_code": "XCD", "currency_name": "East Caribbean Dollar", "flag_emoji": "🇰🇳"},
    {"name": "Saint Lucia", "code": "LC", "alpha3_code": "LCA", "numeric_code": "662", "phone_code": "+1", "currency_code": "XCD", "currency_name": "East Caribbean Dollar", "flag_emoji": "🇱🇨"},
    {"name": "Saint Vincent and the Grenadines", "code": "VC", "alpha3_code": "VCT", "numeric_code": "670", "phone_code": "+1", "currency_code": "XCD", "currency_name": "East Caribbean Dollar", "flag_emoji": "🇻🇨"},
    {"name": "Samoa", "code": "WS", "alpha3_code": "WSM", "numeric_code": "882", "phone_code": "+685", "currency_code": "WST", "currency_name": "Samoan Tala", "flag_emoji": "🇼🇸"},
    {"name": "San Marino", "code": "SM", "alpha3_code": "SMR", "numeric_code": "674", "phone_code": "+378", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇸🇲"},
    {"name": "Sao Tome and Principe", "code": "ST", "alpha3_code": "STP", "numeric_code": "678", "phone_code": "+239", "currency_code": "STN", "currency_name": "São Tomé and Príncipe Dobra", "flag_emoji": "🇸🇹"},
    {"name": "Saudi Arabia", "code": "SA", "alpha3_code": "SAU", "numeric_code": "682", "phone_code": "+966", "currency_code": "SAR", "currency_name": "Saudi Riyal", "flag_emoji": "🇸🇦"},
    {"name": "Senegal", "code": "SN", "alpha3_code": "SEN", "numeric_code": "686", "phone_code": "+221", "currency_code": "XOF", "currency_name": "West African CFA Franc", "flag_emoji": "🇸🇳"},
    {"name": "Serbia", "code": "RS", "alpha3_code": "SRB", "numeric_code": "688", "phone_code": "+381", "currency_code": "RSD", "currency_name": "Serbian Dinar", "flag_emoji": "🇷🇸"},
    {"name": "Seychelles", "code": "SC", "alpha3_code": "SYC", "numeric_code": "690", "phone_code": "+248", "currency_code": "SCR", "currency_name": "Seychellois Rupee", "flag_emoji": "🇸🇨"},
    {"name": "Sierra Leone", "code": "SL", "alpha3_code": "SLE", "numeric_code": "694", "phone_code": "+232", "currency_code": "SLE", "currency_name": "Sierra Leonean Leone", "flag_emoji": "🇸🇱"},
    {"name": "Singapore", "code": "SG", "alpha3_code": "SGP", "numeric_code": "702", "phone_code": "+65", "currency_code": "SGD", "currency_name": "Singapore Dollar", "flag_emoji": "🇸🇬"},
    {"name": "Slovakia", "code": "SK", "alpha3_code": "SVK", "numeric_code": "703", "phone_code": "+421", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇸🇰"},
    {"name": "Slovenia", "code": "SI", "alpha3_code": "SVN", "numeric_code": "705", "phone_code": "+386", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇸🇮"},
    {"name": "Solomon Islands", "code": "SB", "alpha3_code": "SLB", "numeric_code": "090", "phone_code": "+677", "currency_code": "SBD", "currency_name": "Solomon Islands Dollar", "flag_emoji": "🇸🇧"},
    {"name": "Somalia", "code": "SO", "alpha3_code": "SOM", "numeric_code": "706", "phone_code": "+252", "currency_code": "SOS", "currency_name": "Somali Shilling", "flag_emoji": "🇸🇴"},
    {"name": "South Africa", "code": "ZA", "alpha3_code": "ZAF", "numeric_code": "710", "phone_code": "+27", "currency_code": "ZAR", "currency_name": "South African Rand", "flag_emoji": "🇿🇦"},
    {"name": "South Korea", "code": "KR", "alpha3_code": "KOR", "numeric_code": "410", "phone_code": "+82", "currency_code": "KRW", "currency_name": "South Korean Won", "flag_emoji": "🇰🇷"},
    {"name": "South Sudan", "code": "SS", "alpha3_code": "SSD", "numeric_code": "728", "phone_code": "+211", "currency_code": "SSP", "currency_name": "South Sudanese Pound", "flag_emoji": "🇸🇸"},
    {"name": "Spain", "code": "ES", "alpha3_code": "ESP", "numeric_code": "724", "phone_code": "+34", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇪🇸"},
    {"name": "Sri Lanka", "code": "LK", "alpha3_code": "LKA", "numeric_code": "144", "phone_code": "+94", "currency_code": "LKR", "currency_name": "Sri Lankan Rupee", "flag_emoji": "🇱🇰"},
    {"name": "Sudan", "code": "SD", "alpha3_code": "SDN", "numeric_code": "729", "phone_code": "+249", "currency_code": "SDG", "currency_name": "Sudanese Pound", "flag_emoji": "🇸🇩"},
    {"name": "Suriname", "code": "SR", "alpha3_code": "SUR", "numeric_code": "740", "phone_code": "+597", "currency_code": "SRD", "currency_name": "Surinamese Dollar", "flag_emoji": "🇸🇷"},
    {"name": "Sweden", "code": "SE", "alpha3_code": "SWE", "numeric_code": "752", "phone_code": "+46", "currency_code": "SEK", "currency_name": "Swedish Krona", "flag_emoji": "🇸🇪"},
    {"name": "Switzerland", "code": "CH", "alpha3_code": "CHE", "numeric_code": "756", "phone_code": "+41", "currency_code": "CHF", "currency_name": "Swiss Franc", "flag_emoji": "🇨🇭"},
    {"name": "Syria", "code": "SY", "alpha3_code": "SYR", "numeric_code": "760", "phone_code": "+963", "currency_code": "SYP", "currency_name": "Syrian Pound", "flag_emoji": "🇸🇾"},
    {"name": "Taiwan", "code": "TW", "alpha3_code": "TWN", "numeric_code": "158", "phone_code": "+886", "currency_code": "TWD", "currency_name": "New Taiwan Dollar", "flag_emoji": "🇹🇼"},
    {"name": "Tajikistan", "code": "TJ", "alpha3_code": "TJK", "numeric_code": "762", "phone_code": "+992", "currency_code": "TJS", "currency_name": "Tajikistani Somoni", "flag_emoji": "🇹🇯"},
    {"name": "Tanzania", "code": "TZ", "alpha3_code": "TZA", "numeric_code": "834", "phone_code": "+255", "currency_code": "TZS", "currency_name": "Tanzanian Shilling", "flag_emoji": "🇹🇿"},
    {"name": "Thailand", "code": "TH", "alpha3_code": "THA", "numeric_code": "764", "phone_code": "+66", "currency_code": "THB", "currency_name": "Thai Baht", "flag_emoji": "🇹🇭"},
    {"name": "Timor-Leste", "code": "TL", "alpha3_code": "TLS", "numeric_code": "626", "phone_code": "+670", "currency_code": "USD", "currency_name": "US Dollar", "flag_emoji": "🇹🇱"},
    {"name": "Togo", "code": "TG", "alpha3_code": "TGO", "numeric_code": "768", "phone_code": "+228", "currency_code": "XOF", "currency_name": "West African CFA Franc", "flag_emoji": "🇹🇬"},
    {"name": "Tonga", "code": "TO", "alpha3_code": "TON", "numeric_code": "776", "phone_code": "+676", "currency_code": "TOP", "currency_name": "Tongan Paʻanga", "flag_emoji": "🇹🇴"},
    {"name": "Trinidad and Tobago", "code": "TT", "alpha3_code": "TTO", "numeric_code": "780", "phone_code": "+1", "currency_code": "TTD", "currency_name": "Trinidad and Tobago Dollar", "flag_emoji": "🇹🇹"},
    {"name": "Tunisia", "code": "TN", "alpha3_code": "TUN", "numeric_code": "788", "phone_code": "+216", "currency_code": "TND", "currency_name": "Tunisian Dinar", "flag_emoji": "🇹🇳"},
    {"name": "Turkey", "code": "TR", "alpha3_code": "TUR", "numeric_code": "792", "phone_code": "+90", "currency_code": "TRY", "currency_name": "Turkish Lira", "flag_emoji": "🇹🇷"},
    {"name": "Turkmenistan", "code": "TM", "alpha3_code": "TKM", "numeric_code": "795", "phone_code": "+993", "currency_code": "TMT", "currency_name": "Turkmenistani Manat", "flag_emoji": "🇹🇲"},
    {"name": "Tuvalu", "code": "TV", "alpha3_code": "TUV", "numeric_code": "798", "phone_code": "+688", "currency_code": "AUD", "currency_name": "Australian Dollar", "flag_emoji": "🇹🇻"},
    {"name": "Uganda", "code": "UG", "alpha3_code": "UGA", "numeric_code": "800", "phone_code": "+256", "currency_code": "UGX", "currency_name": "Ugandan Shilling", "flag_emoji": "🇺🇬"},
    {"name": "Ukraine", "code": "UA", "alpha3_code": "UKR", "numeric_code": "804", "phone_code": "+380", "currency_code": "UAH", "currency_name": "Ukrainian Hryvnia", "flag_emoji": "🇺🇦"},
    {"name": "United Arab Emirates", "code": "AE", "alpha3_code": "ARE", "numeric_code": "784", "phone_code": "+971", "currency_code": "AED", "currency_name": "UAE Dirham", "flag_emoji": "🇦🇪"},
    {"name": "United Kingdom", "code": "GB", "alpha3_code": "GBR", "numeric_code": "826", "phone_code": "+44", "currency_code": "GBP", "currency_name": "British Pound Sterling", "flag_emoji": "🇬🇧"},
    {"name": "United States", "code": "US", "alpha3_code": "USA", "numeric_code": "840", "phone_code": "+1", "currency_code": "USD", "currency_name": "US Dollar", "flag_emoji": "🇺🇸"},
    {"name": "Uruguay", "code": "UY", "alpha3_code": "URY", "numeric_code": "858", "phone_code": "+598", "currency_code": "UYU", "currency_name": "Uruguayan Peso", "flag_emoji": "🇺🇾"},
    {"name": "Uzbekistan", "code": "UZ", "alpha3_code": "UZB", "numeric_code": "860", "phone_code": "+998", "currency_code": "UZS", "currency_name": "Uzbekistani Som", "flag_emoji": "🇺🇿"},
    {"name": "Vanuatu", "code": "VU", "alpha3_code": "VUT", "numeric_code": "548", "phone_code": "+678", "currency_code": "VUV", "currency_name": "Vanuatu Vatu", "flag_emoji": "🇻🇺"},
    {"name": "Vatican City", "code": "VA", "alpha3_code": "VAT", "numeric_code": "336", "phone_code": "+379", "currency_code": "EUR", "currency_name": "Euro", "flag_emoji": "🇻🇦"},
    {"name": "Venezuela", "code": "VE", "alpha3_code": "VEN", "numeric_code": "862", "phone_code": "+58", "currency_code": "VES", "currency_name": "Venezuelan Bolívar Soberano", "flag_emoji": "🇻🇪"},
    {"name": "Vietnam", "code": "VN", "alpha3_code": "VNM", "numeric_code": "704", "phone_code": "+84", "currency_code": "VND", "currency_name": "Vietnamese Dong", "flag_emoji": "🇻🇳"},
    {"name": "Yemen", "code": "YE", "alpha3_code": "YEM", "numeric_code": "887", "phone_code": "+967", "currency_code": "YER", "currency_name": "Yemeni Rial", "flag_emoji": "🇾🇪"},
    {"name": "Zambia", "code": "ZM", "alpha3_code": "ZMB", "numeric_code": "894", "phone_code": "+260", "currency_code": "ZMW", "currency_name": "Zambian Kwacha", "flag_emoji": "🇿🇲"},
    {"name": "Zimbabwe", "code": "ZW", "alpha3_code": "ZWE", "numeric_code": "716", "phone_code": "+263", "currency_code": "ZWL", "currency_name": "Zimbabwean Dollar", "flag_emoji": "🇿🇼"},
]


async def seed_countries():
    """Seed countries data into the database using direct SQL"""
    print("🌍 Starting to seed countries data...")
    
    # Create async engine
    engine = create_async_engine(DATABASE_URL)
    
    async with engine.begin() as conn:
        try:
            # Check if countries already exist
            result = await conn.execute(text("SELECT COUNT(*) FROM countries"))
            existing_count = result.scalar()
            
            if existing_count > 0:
                print(f"⚠️  Countries table already has {existing_count} records. Skipping seed...")
                return
            
            # Prepare bulk insert data
            print(f"📝 Inserting {len(COUNTRIES_DATA)} countries...")
            
            # Create insert statement
            insert_query = """
                INSERT INTO countries (name, code, alpha3_code, numeric_code, phone_code, currency_code, currency_name, flag_emoji, is_active, created_at)
                VALUES (:name, :code, :alpha3_code, :numeric_code, :phone_code, :currency_code, :currency_name, :flag_emoji, true, NOW())
            """
            
            # Execute bulk insert
            await conn.execute(text(insert_query), COUNTRIES_DATA)
            
            print(f"✅ Successfully created {len(COUNTRIES_DATA)} countries!")
            
            # Check final count
            result = await conn.execute(text("SELECT COUNT(*) FROM countries WHERE is_active = true"))
            active_count = result.scalar()
            
            result = await conn.execute(text("SELECT COUNT(*) FROM countries"))
            total_count = result.scalar()
            
            print(f"📊 Database now contains:")
            print(f"   • Total countries: {total_count}")
            print(f"   • Active countries: {active_count}")
            print(f"   • Inactive countries: {total_count - active_count}")
            
        except Exception as e:
            print(f"❌ Error seeding countries: {str(e)}")
            raise
    
    await engine.dispose()


async def main():
    """Main function to run the seeding"""
    await seed_countries()
    print("🎉 Countries seeding completed!")


if __name__ == "__main__":
    asyncio.run(main())
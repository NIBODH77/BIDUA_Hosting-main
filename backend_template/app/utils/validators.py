import re
from typing import Optional, Tuple
from decimal import Decimal
from datetime import datetime
import phonenumbers
from email_validator import validate_email, EmailNotValidError

class Validators:
    @staticmethod
    async def validate_email(email: str) -> Tuple[bool, Optional[str]]:
        """
        Validate email address format and domain
        """
        try:
            # Validate the email
            valid = validate_email(email)
            email = valid.email  # Normalized email
            return True, email
        except EmailNotValidError as e:
            return False, str(e)

    @staticmethod
    async def validate_phone_number(phone: str, country_code: str = "IN") -> Tuple[bool, Optional[str]]:
        """
        Validate phone number format for specified country
        """
        try:
            parsed_number = phonenumbers.parse(phone, country_code)
            if phonenumbers.is_valid_number(parsed_number):
                return True, phonenumbers.format_number(parsed_number, phonenumbers.PhoneNumberFormat.E164)
            else:
                return False, "Invalid phone number"
        except phonenumbers.NumberParseException:
            return False, "Invalid phone number format"

    @staticmethod
    async def validate_password_strength(password: str) -> Tuple[bool, Optional[str]]:
        """
        Validate password strength
        Requirements:
        - At least 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        """
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not re.search(r"[A-Z]", password):
            return False, "Password must contain at least one uppercase letter"
        
        if not re.search(r"[a-z]", password):
            return False, "Password must contain at least one lowercase letter"
        
        if not re.search(r"\d", password):
            return False, "Password must contain at least one digit"
        
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return False, "Password must contain at least one special character"
        
        return True, None

    @staticmethod
    async def validate_domain(domain: str) -> Tuple[bool, Optional[str]]:
        """
        Validate domain name format
        """
        domain_regex = r'^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$'
        
        if not re.match(domain_regex, domain.lower()):
            return False, "Invalid domain name format"
        
        return True, None

    @staticmethod
    async def validate_ip_address(ip: str) -> Tuple[bool, Optional[str]]:
        """
        Validate IPv4 address format
        """
        ipv4_regex = r'^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
        
        if not re.match(ipv4_regex, ip):
            return False, "Invalid IPv4 address format"
        
        return True, None

    @staticmethod
    async def validate_amount(amount: Decimal, min_amount: Decimal = Decimal('0.01')) -> Tuple[bool, Optional[str]]:
        """
        Validate monetary amount
        """
        if amount < min_amount:
            return False, f"Amount must be at least {min_amount}"
        
        if amount.as_tuple().exponent < -2:
            return False, "Amount can have maximum 2 decimal places"
        
        return True, None

    @staticmethod
    async def validate_billing_cycle(cycle: str) -> Tuple[bool, Optional[str]]:
        """
        Validate billing cycle
        """
        valid_cycles = ['monthly', 'quarterly', 'semi_annual', 'annual', 'biennial', 'triennial']
        
        if cycle not in valid_cycles:
            return False, f"Billing cycle must be one of: {', '.join(valid_cycles)}"
        
        return True, None

    @staticmethod
    async def validate_server_specs(vcpu: int, ram_gb: int, storage_gb: int, bandwidth_gb: int) -> Tuple[bool, Optional[str]]:
        """
        Validate server specifications
        """
        if vcpu < 1 or vcpu > 64:
            return False, "vCPU must be between 1 and 64"
        
        if ram_gb < 1 or ram_gb > 512:
            return False, "RAM must be between 1GB and 512GB"
        
        if storage_gb < 10 or storage_gb > 10000:
            return False, "Storage must be between 10GB and 10TB"
        
        if bandwidth_gb < 10 or bandwidth_gb > 10000:
            return False, "Bandwidth must be between 10GB and 10TB"
        
        return True, None

    @staticmethod
    async def validate_referral_code(code: str) -> Tuple[bool, Optional[str]]:
        """
        Validate referral code format
        """
        if len(code) < 6 or len(code) > 12:
            return False, "Referral code must be between 6 and 12 characters"
        
        if not re.match(r'^[A-Z0-9]+$', code):
            return False, "Referral code can only contain uppercase letters and numbers"
        
        return True, None

    @staticmethod
    async def validate_tax_id(tax_id: str, country: str = "IN") -> Tuple[bool, Optional[str]]:
        """
        Validate tax ID format (GST for India)
        """
        if country.upper() == "IN":
            # GST format: 07AABCU9603R1ZM
            gst_regex = r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
            if not re.match(gst_regex, tax_id.upper()):
                return False, "Invalid GST number format"
        
        return True, None

    @staticmethod
    async def validate_bank_account(account_number: str, ifsc_code: str) -> Tuple[bool, Optional[str]]:
        """
        Validate bank account details
        """
        # Validate account number (9-18 digits)
        if not re.match(r'^\d{9,18}$', account_number):
            return False, "Account number must contain 9-18 digits"
        
        # Validate IFSC code format
        ifsc_regex = r'^[A-Z]{4}0[A-Z0-9]{6}$'
        if not re.match(ifsc_regex, ifsc_code.upper()):
            return False, "Invalid IFSC code format"
        
        return True, None

    @staticmethod
    async def validate_credit_card(number: str, expiry_month: int, expiry_year: int) -> Tuple[bool, Optional[str]]:
        """
        Validate credit card details using Luhn algorithm
        """
        # Remove spaces and dashes
        number = number.replace(" ", "").replace("-", "")
        
        # Check if all characters are digits
        if not number.isdigit():
            return False, "Card number must contain only digits"
        
        # Luhn algorithm
        def luhn_check(card_number):
            def digits_of(n):
                return [int(d) for d in str(n)]
            digits = digits_of(card_number)
            odd_digits = digits[-1::-2]
            even_digits = digits[-2::-2]
            checksum = sum(odd_digits)
            for d in even_digits:
                checksum += sum(digits_of(d*2))
            return checksum % 10 == 0
        
        if not luhn_check(number):
            return False, "Invalid credit card number"
        
        # Validate expiry date
        current_year = datetime.now().year
        current_month = datetime.now().month
        
        if expiry_year < current_year or (expiry_year == current_year and expiry_month < current_month):
            return False, "Card has expired"
        
        return True, None
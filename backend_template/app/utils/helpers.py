import secrets
import string
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from decimal import Decimal
import hashlib
import json
from urllib.parse import urlencode
import re

class Helpers:
    @staticmethod
    async def generate_random_string(length: int = 8, include_digits: bool = True) -> str:
        """
        Generate a random string of specified length
        """
        characters = string.ascii_uppercase
        if include_digits:
            characters += string.digits
        
        return ''.join(secrets.choice(characters) for _ in range(length))

    @staticmethod
    async def generate_api_key() -> str:
        """
        Generate a secure API key
        """
        return secrets.token_urlsafe(32)

    @staticmethod
    async def generate_secure_token() -> str:
        """
        Generate a secure token for password reset, etc.
        """
        return secrets.token_urlsafe(64)

    @staticmethod
    async def format_currency(amount: Decimal, currency: str = "INR") -> str:
        """
        Format currency amount with proper symbols
        """
        currency_symbols = {
            "INR": "₹",
            "USD": "$",
            "EUR": "€",
            "GBP": "£"
        }
        
        symbol = currency_symbols.get(currency, "")
        return f"{symbol}{amount:,.2f}"

    @staticmethod
    async def format_file_size(size_bytes: int) -> str:
        """
        Format file size in human-readable format
        """
        if size_bytes == 0:
            return "0 B"
        
        size_names = ["B", "KB", "MB", "GB", "TB"]
        i = 0
        while size_bytes >= 1024 and i < len(size_names) - 1:
            size_bytes /= 1024.0
            i += 1
        
        return f"{size_bytes:.2f} {size_names[i]}"

    @staticmethod
    async def calculate_discount_percentage(original_price: Decimal, discounted_price: Decimal) -> float:
        """
        Calculate discount percentage
        """
        if original_price <= 0:
            return 0.0
        
        discount = ((original_price - discounted_price) / original_price) * 100
        return round(discount, 1)

    @staticmethod
    async def calculate_tax_amount(amount: Decimal, tax_rate: float) -> Decimal:
        """
        Calculate tax amount
        """
        tax_amount = amount * Decimal(str(tax_rate / 100))
        return tax_amount.quantize(Decimal('0.01'))

    @staticmethod
    async def generate_invoice_items(description: str, unit_price: Decimal, quantity: int = 1) -> List[Dict[str, Any]]:
        """
        Generate standardized invoice items
        """
        total_amount = unit_price * quantity
        
        return [{
            "description": description,
            "quantity": quantity,
            "unit_price": float(unit_price),
            "amount": float(total_amount)
        }]

    @staticmethod
    async def calculate_server_cost(vcpu: int, ram_gb: int, storage_gb: int, bandwidth_gb: int) -> Decimal:
        """
        Calculate server cost based on specifications
        """
        base_cost = Decimal('500.00')  # Base monthly cost
        vcpu_cost = Decimal(str(vcpu)) * Decimal('100.00')
        ram_cost = Decimal(str(ram_gb)) * Decimal('50.00')
        storage_cost = Decimal(str(storage_gb)) * Decimal('0.50')
        bandwidth_cost = Decimal(str(bandwidth_gb)) * Decimal('0.10')
        
        total_cost = base_cost + vcpu_cost + ram_cost + storage_cost + bandwidth_cost
        return total_cost.quantize(Decimal('0.01'))

    @staticmethod
    async def generate_server_hostname(server_name: str, domain: str = "bidua.cloud") -> str:
        """
        Generate server hostname from server name
        """
        # Convert to lowercase and replace spaces with hyphens
        hostname = server_name.lower().replace(' ', '-')
        # Remove special characters
        hostname = ''.join(c for c in hostname if c.isalnum() or c == '-')
        # Remove consecutive hyphens
        hostname = re.sub(r'-+', '-', hostname)
        # Remove leading and trailing hyphens
        hostname = hostname.strip('-')
        
        return f"{hostname}.{domain}"

    @staticmethod
    async def calculate_bandwidth_usage(days: int, average_usage_gb: Decimal = Decimal('80.0')) -> Decimal:
        """
        Calculate estimated bandwidth usage
        """
        return (average_usage_gb * Decimal(str(days))).quantize(Decimal('0.01'))

    @staticmethod
    async def generate_payment_link(amount: Decimal, order_id: str, description: str) -> str:
        """
        Generate mock payment link (in real scenario, integrate with payment gateway)
        """
        base_url = "https://payment.bidua.com/pay"
        params = {
            "amount": float(amount),
            "order_id": order_id,
            "description": description,
            "currency": "INR"
        }
        
        return f"{base_url}?{urlencode(params)}"

    @staticmethod
    async def format_timestamp(timestamp: datetime, format_type: str = "full") -> str:
        """
        Format timestamp in different formats
        """
        formats = {
            "full": "%Y-%m-%d %H:%M:%S",
            "date": "%Y-%m-%d",
            "time": "%H:%M:%S",
            "human": "%b %d, %Y at %I:%M %p",
            "relative": None  # Will be handled separately
        }
        
        if format_type == "relative":
            return await Helpers.get_relative_time(timestamp)
        
        return timestamp.strftime(formats.get(format_type, formats["full"]))

    @staticmethod
    async def get_relative_time(timestamp: datetime) -> str:
        """
        Get relative time (e.g., "2 hours ago")
        """
        now = datetime.now()
        diff = now - timestamp
        
        if diff.days > 365:
            years = diff.days // 365
            return f"{years} year{'s' if years > 1 else ''} ago"
        elif diff.days > 30:
            months = diff.days // 30
            return f"{months} month{'s' if months > 1 else ''} ago"
        elif diff.days > 0:
            return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return "just now"

    @staticmethod
    async def generate_qr_code_data(data: str) -> Dict[str, Any]:
        """
        Generate QR code data structure (for UPI payments, etc.)
        """
        return {
            "type": "upi",
            "data": data,
            "format": "text",
            "timestamp": datetime.now().isoformat()
        }

    @staticmethod
    async def calculate_referral_commission(order_amount: Decimal, level: int, is_long_term: bool = False) -> Decimal:
        """
        Calculate referral commission based on level and plan type
        """
        if is_long_term:
            rates = {
                1: Decimal('0.15'),  # 15% for level 1
                2: Decimal('0.03'),  # 3% for level 2
                3: Decimal('0.02')   # 2% for level 3
            }
        else:
            rates = {
                1: Decimal('0.05'),  # 5% for level 1
                2: Decimal('0.01'),  # 1% for level 2
                3: Decimal('0.01')   # 1% for level 3
            }
        
        rate = rates.get(level, Decimal('0.00'))
        commission = order_amount * rate
        return commission.quantize(Decimal('0.01'))

    @staticmethod
    async def generate_server_specs_summary(vcpu: int, ram_gb: int, storage_gb: int, bandwidth_gb: int) -> str:
        """
        Generate human-readable server specs summary
        """
        return f"{vcpu} vCPU, {ram_gb}GB RAM, {storage_gb}GB Storage, {bandwidth_gb}GB Bandwidth"

    @staticmethod
    async def mask_sensitive_data(data: str, visible_chars: int = 4) -> str:
        """
        Mask sensitive data like credit card numbers, etc.
        """
        if len(data) <= visible_chars * 2:
            return data
        
        visible_start = data[:visible_chars]
        visible_end = data[-visible_chars:]
        masked_length = len(data) - (visible_chars * 2)
        
        return f"{visible_start}{'*' * masked_length}{visible_end}"

    @staticmethod
    async def generate_audit_log(action: str, user_id: int, resource_type: str, resource_id: int, details: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate standardized audit log entry
        """
        return {
            "timestamp": datetime.now().isoformat(),
            "action": action,
            "user_id": user_id,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "details": details,
            "ip_address": "0.0.0.0"  # Would be populated from request in real scenario
        }
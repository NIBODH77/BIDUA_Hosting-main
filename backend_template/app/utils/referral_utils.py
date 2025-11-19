from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from decimal import Decimal
import secrets
import string
import re

class ReferralUtils:
    @staticmethod
    async def generate_referral_code(length: int = 8) -> str:
        """
        Generate a unique referral code
        """
        characters = string.ascii_uppercase + string.digits
        return ''.join(secrets.choice(characters) for _ in range(length))

    @staticmethod
    async def calculate_commission_amount(order_amount: Decimal, level: int, billing_cycle: str) -> Decimal:
        """
        Calculate commission amount based on order amount, referral level, and billing cycle
        """
        # Determine if it's a long-term plan
        long_term_plans = ['annual', 'biennial', 'triennial']
        is_long_term = billing_cycle in long_term_plans
        
        # Commission rates
        if is_long_term:
            rates = {
                1: Decimal('0.15'),  # 15% for level 1 (direct)
                2: Decimal('0.03'),  # 3% for level 2
                3: Decimal('0.02')   # 2% for level 3
            }
        else:
            rates = {
                1: Decimal('0.05'),  # 5% for level 1 (direct)
                2: Decimal('0.01'),  # 1% for level 2
                3: Decimal('0.01')   # 1% for level 3
            }
        
        rate = rates.get(level, Decimal('0.00'))
        commission = order_amount * rate
        return commission.quantize(Decimal('0.01'))

    @staticmethod
    async def calculate_payout_amount(gross_amount: Decimal) -> Dict[str, Decimal]:
        """
        Calculate payout amounts after deductions
        """
        tds_rate = Decimal('0.10')  # 10% TDS
        service_tax_rate = Decimal('0.18')  # 18% GST
        
        tds_amount = gross_amount * tds_rate
        service_tax_amount = gross_amount * service_tax_rate
        net_amount = gross_amount - tds_amount - service_tax_amount
        
        return {
            "gross_amount": gross_amount.quantize(Decimal('0.01')),
            "tds_amount": tds_amount.quantize(Decimal('0.01')),
            "service_tax_amount": service_tax_amount.quantize(Decimal('0.01')),
            "net_amount": net_amount.quantize(Decimal('0.01'))
        }

    @staticmethod
    async def is_payout_eligible(available_balance: Decimal, min_payout: Decimal = Decimal('500.00')) -> bool:
        """
        Check if user is eligible for payout
        """
        return available_balance >= min_payout

    @staticmethod
    async def generate_payout_summary(payouts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate summary of payout statistics
        """
        total_payouts = len(payouts)
        total_amount = Decimal('0.00')
        approved_amount = Decimal('0.00')
        pending_amount = Decimal('0.00')
        
        for payout in payouts:
            total_amount += payout.get('net_amount', Decimal('0.00'))
            if payout.get('status') == 'approved':
                approved_amount += payout.get('net_amount', Decimal('0.00'))
            elif payout.get('status') == 'requested':
                pending_amount += payout.get('net_amount', Decimal('0.00'))
        
        return {
            "total_payouts": total_payouts,
            "total_amount": total_amount.quantize(Decimal('0.01')),
            "approved_amount": approved_amount.quantize(Decimal('0.01')),
            "pending_amount": pending_amount.quantize(Decimal('0.01'))
        }

    @staticmethod
    async def calculate_referral_levels(referrer_id: int, max_level: int = 3) -> Dict[int, List[int]]:
        """
        Calculate referral hierarchy levels (mock implementation)
        In real scenario, this would query the database
        """
        # This is a simplified mock implementation
        # In production, you'd recursively query the database to build the hierarchy
        levels = {}
        
        # Level 1 - Direct referrals
        levels[1] = [1001, 1002, 1003]  # Mock user IDs
        
        # Level 2 - Referrals of referrals
        if max_level >= 2:
            levels[2] = [2001, 2002]
        
        # Level 3 - Third level referrals
        if max_level >= 3:
            levels[3] = [3001]
        
        return levels

    @staticmethod
    async def generate_referral_link(referral_code: str, base_url: str = "https://bidua.com/signup") -> str:
        """
        Generate referral link
        """
        return f"{base_url}?ref={referral_code}"

    @staticmethod
    async def get_referral_stats_summary(referrals_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate comprehensive referral statistics summary
        """
        total_referrals = len(referrals_data)
        active_referrals = 0
        total_earnings = Decimal('0.00')
        level_breakdown = {1: 0, 2: 0, 3: 0}
        
        for referral in referrals_data:
            if referral.get('status') == 'active':
                active_referrals += 1
            
            total_earnings += referral.get('earnings', Decimal('0.00'))
            
            level = referral.get('level', 1)
            level_breakdown[level] = level_breakdown.get(level, 0) + 1
        
        return {
            "total_referrals": total_referrals,
            "active_referrals": active_referrals,
            "inactive_referrals": total_referrals - active_referrals,
            "total_earnings": total_earnings.quantize(Decimal('0.01')),
            "level_breakdown": level_breakdown,
            "conversion_rate": round((active_referrals / total_referrals * 100), 2) if total_referrals > 0 else 0
        }

    @staticmethod
    async def validate_payout_request(available_balance: Decimal, requested_amount: Decimal, 
                                    min_payout: Decimal = Decimal('500.00'),
                                    max_payout: Decimal = Decimal('50000.00')) -> Dict[str, Any]:
        """
        Validate payout request parameters
        """
        errors = []
        
        # Import Helpers locally to avoid circular import
        from .helpers import Helpers
        
        if requested_amount < min_payout:
            errors.append(f"Minimum payout amount is {await Helpers.format_currency(min_payout)}")
        
        if requested_amount > max_payout:
            errors.append(f"Maximum payout amount is {await Helpers.format_currency(max_payout)}")
        
        if requested_amount > available_balance:
            errors.append("Requested amount exceeds available balance")
        
        is_valid = len(errors) == 0
        
        return {
            "is_valid": is_valid,
            "errors": errors,
            "can_proceed": is_valid and requested_amount <= available_balance
        }

    @staticmethod
    async def generate_referral_commission_structure() -> Dict[str, Any]:
        """
        Get referral commission structure
        """
        return {
            "recurring_plans": {
                "level_1": {
                    "rate": "5%",
                    "description": "Direct referrals on monthly/quarterly plans"
                },
                "level_2": {
                    "rate": "1%",
                    "description": "Second level referrals"
                },
                "level_3": {
                    "rate": "1%",
                    "description": "Third level referrals"
                }
            },
            "long_term_plans": {
                "level_1": {
                    "rate": "15%",
                    "description": "Direct referrals on annual+ plans"
                },
                "level_2": {
                    "rate": "3%",
                    "description": "Second level referrals"
                },
                "level_3": {
                    "rate": "2%",
                    "description": "Third level referrals"
                }
            },
            "payout_policy": {
                "minimum_payout": "₹500",
                "processing_time": "7-10 business days",
                "tax_deductions": {
                    "tds": "10%",
                    "gst": "18%"
                }
            }
        }

    @staticmethod
    async def calculate_estimated_earnings(estimated_referrals: int, average_order_value: Decimal, 
                                         conversion_rate: float = 0.1) -> Dict[str, Any]:
        """
        Calculate estimated earnings based on projections
        """
        potential_customers = estimated_referrals
        expected_conversions = int(potential_customers * conversion_rate)
        
        # Assume 70% recurring plans, 30% long-term plans
        recurring_customers = int(expected_conversions * 0.7)
        long_term_customers = expected_conversions - recurring_customers
        
        # Calculate earnings
        recurring_earnings = recurring_customers * average_order_value * Decimal('0.05')  # 5% level 1
        long_term_earnings = long_term_customers * average_order_value * Decimal('0.15')  # 15% level 1
        
        total_earnings = recurring_earnings + long_term_earnings
        
        return {
            "potential_customers": potential_customers,
            "expected_conversions": expected_conversions,
            "recurring_customers": recurring_customers,
            "long_term_customers": long_term_customers,
            "estimated_earnings": total_earnings.quantize(Decimal('0.01')),
            "conversion_rate": f"{conversion_rate * 100}%"
        }

    @staticmethod
    async def generate_referral_performance_report(referrals: List[Dict[str, Any]], 
                                                 start_date: datetime, 
                                                 end_date: datetime) -> Dict[str, Any]:
        """
        Generate referral performance report for a date range
        """
        period_referrals = [
            ref for ref in referrals 
            if start_date <= ref.get('joined_date', datetime.now()) <= end_date
        ]
        
        total_commission = Decimal('0.00')
        successful_referrals = 0
        
        for referral in period_referrals:
            if referral.get('has_ordered', False):
                successful_referrals += 1
                total_commission += referral.get('commission_earned', Decimal('0.00'))
        
        total_referrals = len(period_referrals)
        conversion_rate = (successful_referrals / total_referrals * 100) if total_referrals > 0 else 0
        
        return {
            "period": {
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": end_date.strftime("%Y-%m-%d")
            },
            "total_referrals": total_referrals,
            "successful_referrals": successful_referrals,
            "conversion_rate": round(conversion_rate, 2),
            "total_commission": total_commission.quantize(Decimal('0.01')),
            "average_commission": (total_commission / successful_referrals).quantize(Decimal('0.01')) if successful_referrals > 0 else Decimal('0.00')
        }

    @staticmethod
    async def calculate_referral_bonus(total_referrals: int, active_referrals: int) -> Dict[str, Any]:
        """
        Calculate referral bonus based on performance tiers
        """
        bonus_tiers = {
            10: Decimal('100.00'),   # ₹100 for 10 referrals
            25: Decimal('300.00'),   # ₹300 for 25 referrals
            50: Decimal('750.00'),   # ₹750 for 50 referrals
            100: Decimal('2000.00'), # ₹2000 for 100 referrals
        }
        
        current_bonus = Decimal('0.00')
        next_tier = None
        referrals_needed = 0
        
        # Find current bonus and next tier
        for tier_threshold, bonus_amount in sorted(bonus_tiers.items()):
            if total_referrals >= tier_threshold:
                current_bonus = bonus_amount
            else:
                next_tier = {
                    "threshold": tier_threshold,
                    "bonus_amount": bonus_amount,
                    "referrals_needed": tier_threshold - total_referrals
                }
                break
        
        return {
            "current_bonus": current_bonus,
            "next_tier": next_tier,
            "total_referrals": total_referrals,
            "active_referrals": active_referrals,
            "completion_rate": round((active_referrals / total_referrals * 100), 2) if total_referrals > 0 else 0
        }

    @staticmethod
    async def generate_referral_leaderboard(users_data: List[Dict[str, Any]], top_n: int = 10) -> List[Dict[str, Any]]:
        """
        Generate referral leaderboard
        """
        # Sort users by total earnings in descending order
        sorted_users = sorted(
            users_data, 
            key=lambda x: x.get('total_earnings', Decimal('0.00')), 
            reverse=True
        )
        
        leaderboard = []
        for rank, user in enumerate(sorted_users[:top_n], 1):
            leaderboard.append({
                "rank": rank,
                "user_id": user.get('user_id'),
                "user_name": user.get('user_name'),
                "total_earnings": user.get('total_earnings', Decimal('0.00')),
                "total_referrals": user.get('total_referrals', 0),
                "active_referrals": user.get('active_referrals', 0)
            })
        
        return leaderboard

    @staticmethod
    async def validate_referral_code_format(code: str) -> bool:
        """
        Validate referral code format
        """
        if len(code) < 6 or len(code) > 12:
            return False
        
        # Only uppercase letters and numbers allowed
        if not re.match(r'^[A-Z0-9]+$', code):
            return False
        
        return True

    @staticmethod
    async def calculate_referral_effectiveness(referrals_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate referral program effectiveness metrics
        """
        total_referrals = len(referrals_data)
        active_referrals = sum(1 for ref in referrals_data if ref.get('status') == 'active')
        paying_referrals = sum(1 for ref in referrals_data if ref.get('has_ordered', False))
        total_revenue = sum(ref.get('revenue_generated', Decimal('0.00')) for ref in referrals_data)
        
        conversion_rate = (paying_referrals / total_referrals * 100) if total_referrals > 0 else 0
        activation_rate = (active_referrals / total_referrals * 100) if total_referrals > 0 else 0
        average_revenue_per_referral = (total_revenue / total_referrals) if total_referrals > 0 else Decimal('0.00')
        
        return {
            "total_referrals": total_referrals,
            "active_referrals": active_referrals,
            "paying_referrals": paying_referrals,
            "total_revenue": total_revenue.quantize(Decimal('0.01')),
            "conversion_rate": round(conversion_rate, 2),
            "activation_rate": round(activation_rate, 2),
            "average_revenue_per_referral": average_revenue_per_referral.quantize(Decimal('0.01'))
        }

    @staticmethod
    async def generate_referral_marketing_materials(referral_code: str, user_name: str) -> Dict[str, str]:
        """
        Generate referral marketing materials and messages
        """
        base_url = "https://bidua.com"
        referral_link = f"{base_url}/signup?ref={referral_code}"
        
        messages = {
            "email_subject": f"Join me on BIDUA Hosting - Get started with {user_name}'s referral",
            "email_body": f"""
Hi there!

I've been using BIDUA Hosting for my servers and I'm really impressed with their service. 
I thought you might be interested in trying them out too.

Use my referral code {referral_code} to get started:
{referral_link}

Benefits you'll get:
- Reliable server hosting
- 24/7 customer support
- Competitive pricing
- Scalable resources

Let me know if you have any questions!

Best regards,
{user_name}
            """,
            "social_media": f"""
🚀 Amazing hosting experience with BIDUA Hosting! 

I've been using their services and highly recommend them. 
Use my referral code {referral_code} to get started:

{referral_link}

#Hosting #WebServices #Referral
            """,
            "sms": f"Try BIDUA Hosting! Use my code {referral_code} at {referral_link} for great hosting services."
        }
        
        return messages

    @staticmethod
    async def calculate_referral_program_roi(total_investment: Decimal, total_earnings: Decimal) -> Dict[str, Any]:
        """
        Calculate ROI for referral program
        """
        if total_investment == Decimal('0.00'):
            return {
                "roi_percentage": 0.0,
                "net_profit": Decimal('0.00'),
                "roi_ratio": 0.0
            }
        
        net_profit = total_earnings - total_investment
        roi_percentage = (net_profit / total_investment) * 100
        roi_ratio = total_earnings / total_investment
        
        return {
            "total_investment": total_investment.quantize(Decimal('0.01')),
            "total_earnings": total_earnings.quantize(Decimal('0.01')),
            "net_profit": net_profit.quantize(Decimal('0.01')),
            "roi_percentage": round(float(roi_percentage), 2),
            "roi_ratio": round(float(roi_ratio), 2),
            "is_profitable": net_profit > Decimal('0.00')
        }
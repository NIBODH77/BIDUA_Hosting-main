# # from fastapi import APIRouter, Depends, HTTPException
# # from sqlalchemy.ext.asyncio import AsyncSession
# # from typing import List

# # from app.core.database import get_db
# # from app.core.security import get_current_user, get_current_admin_user
# # from app.services.invoice_service import InvoiceService
# # from app.schemas.invoice import Invoice, InvoiceWithUser
# # from app.schemas.users import User

# # router = APIRouter()

# # @router.get("/", response_model=List[Invoice])
# # async def get_invoices(
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     invoice_service: InvoiceService = Depends()
# # ):
# #     """
# #     Get user's invoices
# #     """
# #     return invoice_service.get_user_invoices(db, current_user.id)

# # @router.get("/admin", response_model=List[InvoiceWithUser])
# # async def get_all_invoices(
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_admin_user),
# #     invoice_service: InvoiceService = Depends()
# # ):
# #     """
# #     Get all invoices (Admin only)
# #     """
# #     return invoice_service.get_all_invoices(db)

# # @router.get("/{invoice_id}", response_model=Invoice)
# # async def get_invoice(
# #     invoice_id: int,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     invoice_service: InvoiceService = Depends()
# # ):
# #     """
# #     Get invoice by ID
# #     """
# #     invoice = invoice_service.get_user_invoice(db, current_user.id, invoice_id)
# #     if not invoice:
# #         raise HTTPException(status_code=404, detail="Invoice not found")
# #     return invoice

# # @router.get("/{invoice_id}/download")
# # async def download_invoice(
# #     invoice_id: int,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     invoice_service: InvoiceService = Depends()
# # ):
# #     """
# #     Download invoice as PDF
# #     """
# #     invoice = invoice_service.get_user_invoice(db, current_user.id, invoice_id)
# #     if not invoice:
# #         raise HTTPException(status_code=404, detail="Invoice not found")
    
# #     # Generate PDF (mock implementation)
# #     pdf_content = f"Invoice {invoice.invoice_number} for {invoice.total_amount}"
    
# #     return {
# #         "filename": f"invoice_{invoice.invoice_number}.pdf",
# #         "content": pdf_content,
# #         "content_type": "application/pdf"
# #     }

# # @router.post("/{invoice_id}/pay")
# # async def pay_invoice(
# #     invoice_id: int,
# #     payment_method: str,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     invoice_service: InvoiceService = Depends()
# # ):
# #     """
# #     Pay invoice
# #     """
# #     success = invoice_service.pay_invoice(db, current_user.id, invoice_id, payment_method)
# #     if not success:
# #         raise HTTPException(status_code=404, detail="Invoice not found or already paid")
# #     return {"message": "Invoice paid successfully"}

# # @router.get("/current/balance")
# # async def get_current_balance(
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     invoice_service: InvoiceService = Depends()
# # ):
# #     """
# #     Get current balance
# #     """
# #     balance = invoice_service.get_user_current_balance(db, current_user.id)
# #     return {"balance": float(balance), "currency": "INR"}

# # @router.get("/stats/summary")
# # async def get_invoice_stats(
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_admin_user),
# #     invoice_service: InvoiceService = Depends()
# # ):
# #     """
# #     Get invoice statistics (Admin only)
# #     """
# #     return invoice_service.get_invoice_stats(db)







# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List

# from app.core.database import get_db
# from app.core.security import get_current_user, get_current_admin_user
# from app.services.invoice_service import InvoiceService
# from app.schemas.invoice import Invoice, InvoiceWithUser
# from app.schemas.users import User

# router = APIRouter()

# # ---------------- USER INVOICES ----------------

# @router.get("/", response_model=List[Invoice])
# async def get_invoices(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     invoice_service: InvoiceService = Depends()
# ):
#     """Get user's invoices"""
#     return await invoice_service.get_user_invoices(db, current_user.id)


# # ---------------- ADMIN INVOICES ----------------

# @router.get("/admin", response_model=List[InvoiceWithUser])
# async def get_all_invoices(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     invoice_service: InvoiceService = Depends()
# ):
#     """Get all invoices (Admin only)"""
#     return await invoice_service.get_all_invoices(db)


# # ---------------- SINGLE INVOICE ----------------

# @router.get("/{invoice_id}", response_model=Invoice)
# async def get_invoice(
#     invoice_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     invoice_service: InvoiceService = Depends()
# ):
#     """Get invoice by ID"""
#     invoice = await invoice_service.get_user_invoice(db, current_user.id, invoice_id)
#     if not invoice:
#         raise HTTPException(status_code=404, detail="Invoice not found")
#     return invoice


# @router.get("/{invoice_id}/download")
# async def download_invoice(
#     invoice_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     invoice_service: InvoiceService = Depends()
# ):
#     """Download invoice as PDF"""
#     invoice = await invoice_service.get_user_invoice(db, current_user.id, invoice_id)
#     if not invoice:
#         raise HTTPException(status_code=404, detail="Invoice not found")

#     # Example PDF generation (replace with real PDF builder)
#     pdf_content = f"Invoice {invoice.invoice_number} for {invoice.total_amount}"

#     return {
#         "filename": f"invoice_{invoice.invoice_number}.pdf",
#         "content": pdf_content,
#         "content_type": "application/pdf"
#     }


# # ---------------- PAYMENT ----------------

# @router.post("/{invoice_id}/pay")
# async def pay_invoice(
#     invoice_id: int,
#     payment_method: str,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     invoice_service: InvoiceService = Depends()
# ):
#     """Pay invoice"""
#     success = await invoice_service.pay_invoice(db, current_user.id, invoice_id, payment_method)
#     if not success:
#         raise HTTPException(status_code=404, detail="Invoice not found or already paid")
#     return {"message": "Invoice paid successfully"}


# # ---------------- BALANCE ----------------

# @router.get("/current/balance")
# async def get_current_balance(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     invoice_service: InvoiceService = Depends()
# ):
#     """Get current balance"""
#     balance = await invoice_service.get_user_current_balance(db, current_user.id)
#     return {"balance": float(balance), "currency": "INR"}


# # ---------------- STATS ----------------

# @router.get("/stats/summary")
# async def get_invoice_stats(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     invoice_service: InvoiceService = Depends()
# ):
#     """Get invoice statistics (Admin only)"""
#     return await invoice_service.get_invoice_stats(db)





from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from sqlalchemy import select
import logging

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.services.invoice_service import InvoiceService
from app.schemas.invoice import Invoice, InvoiceWithUser
from app.schemas.users import User
from app.models.invoice import Invoice as InvoiceModel

logger = logging.getLogger(__name__)

router = APIRouter()

# ---------------- USER INVOICES ----------------

@router.get("/", response_model=List[Invoice])
async def get_invoices(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    invoice_service: InvoiceService = Depends()
):
    """Get user's invoices"""
    return await invoice_service.get_user_invoices(db, current_user.id)


# ---------------- ADMIN INVOICES ----------------

@router.get("/admin", response_model=List[InvoiceWithUser])
async def get_all_invoices(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    invoice_service: InvoiceService = Depends()
):
    """Get all invoices (Admin only)"""
    return await invoice_service.get_all_invoices(db)


# ---------------- SINGLE INVOICE ----------------

@router.get("/{invoice_id}", response_model=Invoice)
async def get_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    invoice_service: InvoiceService = Depends()
):
    """Get invoice by ID"""
    invoice = await invoice_service.get_user_invoice(db, current_user.id, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.get("/{invoice_id}/download")
async def download_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    invoice_service: InvoiceService = Depends()
):
    """Download invoice as HTML"""
    try:
        logger.info(f"Download invoice request - Invoice ID: {invoice_id}, User ID: {current_user.id}")
        
        invoice = await invoice_service.get_user_invoice(db, current_user.id, invoice_id)
        if not invoice:
            logger.error(f"Invoice not found - Invoice ID: {invoice_id}, User ID: {current_user.id}")
            raise HTTPException(status_code=404, detail="Invoice not found")

        logger.info(f"Invoice found - Number: {invoice.invoice_number}, Status: {invoice.payment_status}")

        # Generate simple HTML invoice
        html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice {invoice.invoice_number}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; }}
        .header {{ text-align: center; margin-bottom: 30px; }}
        .company {{ font-size: 24px; font-weight: bold; color: #0891b2; }}
        .invoice-details {{ margin: 20px 0; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
        th {{ background-color: #0891b2; color: white; }}
        .total {{ font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; }}
        .status {{ display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }}
        .status.paid {{ background-color: #10b981; color: white; }}
        .status.pending {{ background-color: #f59e0b; color: white; }}
    </style>
</head>
<body>
    <div class="header">
        <div class="company">BIDUA INDUSTRIES PVT LTD</div>
        <p>Office 201, B 158, Sector 63, Noida, UP 201301, India</p>
        <p>Email: support@bidua.com | Phone: +91 120 416 8464</p>
    </div>
    
    <h2>INVOICE</h2>
    
    <div class="invoice-details">
        <p><strong>Invoice Number:</strong> {invoice.invoice_number}</p>
        <p><strong>Invoice Date:</strong> {invoice.invoice_date.strftime('%d-%m-%Y')}</p>
        <p><strong>Due Date:</strong> {invoice.due_date.strftime('%d-%m-%Y')}</p>
        <p><strong>Status:</strong> <span class="status {invoice.payment_status}">{invoice.payment_status.upper()}</span></p>
    </div>
    
    <h3>Invoice Items</h3>
    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>"""
        
        # Add invoice items
        if invoice.items:
            for item in invoice.items:
                html_content += f"""
            <tr>
                <td>{item.get('description', 'N/A')}</td>
                <td>{item.get('quantity', 1)}</td>
                <td>₹{float(item.get('unit_price', 0)):,.2f}</td>
                <td>₹{float(item.get('amount', 0)):,.2f}</td>
            </tr>"""
        
        html_content += f"""
        </tbody>
    </table>
    
    <div style="text-align: right; margin-top: 30px;">
        <p><strong>Subtotal:</strong> ₹{float(invoice.subtotal):,.2f}</p>
        <p><strong>Tax (GST 18%):</strong> ₹{float(invoice.tax_amount):,.2f}</p>
        <p class="total">Total Amount: ₹{float(invoice.total_amount):,.2f}</p>"""
        
        if invoice.payment_status == 'paid':
            html_content += f"""
        <p style="color: #10b981;"><strong>Amount Paid:</strong> ₹{float(invoice.amount_paid):,.2f}</p>
        <p style="color: #10b981;"><strong>Payment Date:</strong> {invoice.payment_date.strftime('%d-%m-%Y %H:%M') if invoice.payment_date else 'N/A'}</p>
        <p style="color: #10b981;"><strong>Payment Method:</strong> {invoice.payment_method or 'Razorpay'}</p>"""
        else:
            html_content += f"""
        <p style="color: #f59e0b;"><strong>Balance Due:</strong> ₹{float(invoice.balance_due):,.2f}</p>"""
        
        html_content += """
    </div>
    
    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
        <p>Thank you for your business!</p>
        <p style="font-size: 12px;">This is a computer-generated invoice and requires no signature.</p>
    </div>
</body>
</html>"""
        
        logger.info(f"Generated HTML invoice - Size: {len(html_content)} bytes")
        
        # Return HTML response
        return HTMLResponse(
            content=html_content,
            headers={
                "Content-Disposition": f"attachment; filename=Invoice_{invoice.invoice_number}.html"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating invoice download: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate invoice: {str(e)}")


# ---------------- PAYMENT ----------------

@router.post("/{invoice_id}/pay")
async def pay_invoice(
    invoice_id: int,
    payment_method: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    invoice_service: InvoiceService = Depends()
):
    """Pay invoice"""
    success = await invoice_service.pay_invoice(db, current_user.id, invoice_id, payment_method)
    if not success:
        raise HTTPException(status_code=404, detail="Invoice not found or already paid")
    return {"message": "Invoice paid successfully"}


# ---------------- BALANCE ----------------

@router.get("/current/balance")
async def get_current_balance(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    invoice_service: InvoiceService = Depends()
):
    """Get current balance"""
    balance = await invoice_service.get_user_current_balance(db, current_user.id)
    return {"balance": float(balance), "currency": "INR"}


# ---------------- STATS ----------------

@router.get("/stats/summary")
async def get_invoice_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    invoice_service: InvoiceService = Depends()
):
    """Get invoice statistics (Admin only)"""
    return await invoice_service.get_invoice_stats(db)


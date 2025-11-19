# # # # from fastapi import APIRouter, Depends, HTTPException, Query
# # # # # from sqlalchemy.orm import Session
# # # # from typing import List, Optional
# # # # from sqlalchemy.ext.asyncio import AsyncSession

# # # # from app.core.database import get_db
# # # # from app.core.security import get_current_user, get_current_admin_user
# # # # from app.services.order_service import OrderService
# # # # from app.schemas.order import Order, OrderCreate, OrderUpdate, OrderWithPlan
# # # # from app.schemas.users import User

# # # # router = APIRouter()



# # # # # @router.get("/", response_model=List[Order])
# # # # # async def get_orders(
# # # # #     skip: int = 0,
# # # # #     limit: int = 100,
# # # # #     status: Optional[str] = None,
# # # # #     db: AsyncSession = Depends(get_db),
# # # # #     current_user: User = Depends(get_current_user),
# # # # #     order_service: OrderService = Depends()
# # # # # ):
# # # # #     """
# # # # #     Get orders
# # # # #     """
# # # # #     if current_user.role in ["admin", "super_admin"]:
# # # # #         return order_service.get_all_orders(db, skip=skip, limit=limit, status=status)
# # # # #     else:
# # # # #         return order_service.get_user_orders(db, current_user.id, skip=skip, limit=limit, status=status)



# # # # @router.get("/", response_model=List[Order])
# # # # async def get_orders(
# # # #     skip: int = 0,
# # # #     limit: int = 100,
# # # #     status: Optional[str] = None,
# # # #     db: AsyncSession = Depends(get_db),
# # # #     current_user: User = Depends(get_current_user),
# # # #     order_service: OrderService = Depends()
# # # # ):
# # # #     """
# # # #     Get orders
# # # #     """
# # # #     if current_user.role in ["admin", "super_admin"]:
# # # #         orders = await order_service.get_all_orders(db, skip=skip, limit=limit, status=status)
# # # #         return orders
# # # #     else:
# # # #         orders = await order_service.get_user_orders(db, current_user.id, skip=skip, limit=limit, status=status)
# # # #         return orders

# # # # # @router.get("/admin", response_model=List[OrderWithPlan])
# # # # # async def get_orders_admin(
# # # # #     skip: int = 0,
# # # # #     limit: int = 100,
# # # # #     status: Optional[str] = None,
# # # # #     payment_status: Optional[str] = None,
# # # # #     db: AsyncSession = Depends(get_db),
# # # # #     current_user: User = Depends(get_current_admin_user),
# # # # #     order_service: OrderService = Depends()
# # # # # ):
# # # # #     """
# # # # #     Get all orders with plan details (Admin only)
# # # # #     """
# # # # #     return order_service.get_orders_with_plan(db, skip=skip, limit=limit, status=status, payment_status=payment_status)

# # # # @router.get("/admin")
# # # # async def get_orders_admin(
# # # #     skip: int = 0,
# # # #     limit: int = 100,
# # # #     status: Optional[str] = None,
# # # #     payment_status: Optional[str] = None,
# # # #     db: AsyncSession = Depends(get_db),
# # # #     current_admin = Depends(get_current_admin_user),
# # # # ):
# # # #     service = OrderService()
# # # #     orders = await service.get_orders_with_plan(db, skip, limit, status, payment_status)  # ✅ add await
# # # #     return orders


# # # # # @router.get("/{order_id}", response_model=Order)
# # # # # async def get_order(
# # # # #     order_id: int,
# # # # #     db: AsyncSession = Depends(get_db),
# # # # #     current_user: User = Depends(get_current_user),
# # # # #     order_service: OrderService = Depends()
# # # # # ):
# # # # #     """
# # # # #     Get order by ID
# # # # #     """
# # # # #     if current_user.role in ["admin", "super_admin"]:
# # # # #         order = order_service.get_order_by_id(db, order_id)
# # # # #     else:
# # # # #         order = order_service.get_user_order(db, current_user.id, order_id)
    
# # # # #     if not order:
# # # # #         raise HTTPException(status_code=404, detail="Order not found")
# # # # #     return order

# # # # @router.get("/{order_id}", response_model=Order)
# # # # async def get_order(
# # # #     order_id: int,
# # # #     db: AsyncSession = Depends(get_db),
# # # #     current_user: User = Depends(get_current_user),
# # # #     order_service: OrderService = Depends()
# # # # ):
# # # #     """
# # # #     Get order by ID
# # # #     """
# # # #     if current_user.role in ["admin", "super_admin"]:
# # # #         order = await order_service.get_order_by_id(db, order_id)   # ✅ added await
# # # #     else:
# # # #         order = await order_service.get_user_order(db, current_user.id, order_id)  # ✅ added await
    
# # # #     if not order:
# # # #         raise HTTPException(status_code=404, detail="Order not found")
# # # #     return order


# # # # # @router.post("/", response_model=Order)
# # # # # async def create_order(
# # # # #     order_data: OrderCreate,
# # # # #     db: AsyncSession = Depends(get_db),
# # # # #     current_user: User = Depends(get_current_user),
# # # # #     order_service: OrderService = Depends()
# # # # # ):
# # # # #     """
# # # # #     Create new order
# # # # #     """
# # # # #     return order_service.create_order(db, current_user.id, order_data)


# # # # @router.post("/", response_model=Order)
# # # # async def create_order(
# # # #     order_data: OrderCreate,
# # # #     db: AsyncSession = Depends(get_db),
# # # #     current_user: User = Depends(get_current_user),
# # # # ):
# # # #     from app.services.order_service import OrderService
# # # #     service = OrderService()

# # # #     # ✅ MUST await the async function
# # # #     created_order = await service.create_order(db, current_user.id, order_data)

# # # #     return created_order



# # # # @router.put("/{order_id}", response_model=Order)
# # # # async def update_order(
# # # #     order_id: int,
# # # #     order_update: OrderUpdate,
# # # #     db: AsyncSession = Depends(get_db),
# # # #     current_user: User = Depends(get_current_admin_user),
# # # #     order_service: OrderService = Depends()
# # # # ):
# # # #     """
# # # #     Update order (Admin only)
# # # #     """
# # # #     order = order_service.update_order(db, order_id, order_update)
# # # #     if not order:
# # # #         raise HTTPException(status_code=404, detail="Order not found")
# # # #     return order


# # # # # @router.post("/{order_id}/cancel")
# # # # # async def cancel_order(
# # # # #     order_id: int,
# # # # #     db: AsyncSession = Depends(get_db),
# # # # #     current_user: User = Depends(get_current_user),
# # # # #     order_service: OrderService = Depends()
# # # # # ):
# # # # #     """
# # # # #     Cancel order
# # # # #     """
# # # # #     if current_user.role in ["admin", "super_admin"]:
# # # # #         success = order_service.cancel_order(db, order_id)
# # # # #     else:
# # # # #         success = order_service.cancel_user_order(db, current_user.id, order_id)
    
# # # # #     if not success:
# # # # #         raise HTTPException(status_code=404, detail="Order not found or cannot be cancelled")
# # # # #     return {"message": "Order cancelled successfully"}

# # # # # @router.post("/{order_id}/complete")
# # # # # async def complete_order(
# # # # #     order_id: int,
# # # # #     db: AsyncSession = Depends(get_db),
# # # # #     current_user: User = Depends(get_current_admin_user),
# # # # #     order_service: OrderService = Depends()
# # # # # ):
# # # # #     """
# # # # #     Mark order as completed (Admin only)
# # # # #     """
# # # # #     success = order_service.complete_order(db, order_id)
# # # # #     if not success:
# # # # #         raise HTTPException(status_code=404, detail="Order not found")
# # # # #     return {"message": "Order completed successfully"}

# # # # @router.post("/{order_id}/cancel")
# # # # async def cancel_order(
# # # #     order_id: int,
# # # #     db: AsyncSession = Depends(get_db),
# # # #     current_user: User = Depends(get_current_user),
# # # #     order_service: OrderService = Depends()
# # # # ):
# # # #     """
# # # #     Cancel order
# # # #     """
# # # #     if current_user.role in ["admin", "super_admin"]:
# # # #         success = await order_service.cancel_order(db, order_id)
# # # #     else:
# # # #         success = await order_service.cancel_user_order(db, current_user.id, order_id)
    
# # # #     if not success:
# # # #         raise HTTPException(status_code=404, detail="Order not found or cannot be cancelled")
# # # #     return {"message": "Order cancelled successfully"}


# # # # @router.post("/{order_id}/complete")
# # # # async def complete_order(
# # # #     order_id: int,
# # # #     db: AsyncSession = Depends(get_db),
# # # #     current_user: User = Depends(get_current_admin_user),
# # # #     order_service: OrderService = Depends()
# # # # ):
# # # #     """
# # # #     Mark order as completed (Admin only)
# # # #     """
# # # #     success = await order_service.complete_order(db, order_id)
# # # #     if not success:
# # # #         raise HTTPException(status_code=404, detail="Order not found")
# # # #     return {"message": "Order completed successfully"}


# # # # # @router.get("/stats/summary")
# # # # # async def get_order_stats(
# # # # #     db: AsyncSession = Depends(get_db),
# # # # #     current_user: User = Depends(get_current_admin_user),
# # # # #     order_service: OrderService = Depends()
# # # # # ):
# # # # #     """
# # # # #     Get order statistics (Admin only)
# # # # #     """
# # # # #     return order_service.get_order_stats(db)




# # # # @router.get("/stats/summary")
# # # # async def get_order_stats(
# # # #     db: AsyncSession = Depends(get_db),
# # # #     current_user: User = Depends(get_current_admin_user),
# # # #     order_service: OrderService = Depends()
# # # # ):
# # # #     """
# # # #     Get order statistics (Admin only)
# # # #     """
# # # #     result = await order_service.get_order_stats(db)
# # # #     return result





# # # from fastapi import APIRouter, Depends, HTTPException
# # # from typing import List, Optional
# # # from sqlalchemy.ext.asyncio import AsyncSession

# # # from app.core.database import get_db
# # # from app.core.security import get_current_user, get_current_admin_user
# # # from app.services.order_service import OrderService
# # # from app.schemas.order import (
# # #     Order,
# # #     OrderCreate,
# # #     OrderUpdate,
# # #     OrderWithPlan,
# # #     OrderWithInvoiceResponse
# # # )
# # # from app.schemas.users import User

# # # router = APIRouter()


# # # # ---------------------- USER & ADMIN ORDERS ----------------------

# # # @router.get("/", response_model=List[Order])
# # # async def get_orders(
# # #     skip: int = 0,
# # #     limit: int = 100,
# # #     status: Optional[str] = None,
# # #     db: AsyncSession = Depends(get_db),
# # #     current_user: User = Depends(get_current_user),
# # # ):
# # #     """
# # #     Get orders (User gets their own, Admins get all)
# # #     """
# # #     service = OrderService()
# # #     if current_user.role in ["admin", "super_admin"]:
# # #         return await service.get_all_orders(db, skip=skip, limit=limit, status=status)
# # #     return await service.get_user_orders(db, current_user.id, skip=skip, limit=limit, status=status)


# # # @router.get("/admin", response_model=List[OrderWithPlan])
# # # async def get_orders_admin(
# # #     skip: int = 0,
# # #     limit: int = 100,
# # #     status: Optional[str] = None,
# # #     payment_status: Optional[str] = None,
# # #     db: AsyncSession = Depends(get_db),
# # #     current_user: User = Depends(get_current_admin_user),
# # # ):
# # #     """
# # #     Get all orders with plan details (Admin only)
# # #     """
# # #     service = OrderService()
# # #     return await service.get_orders_with_plan(db, skip, limit, status, payment_status)


# # # # ---------------------- ORDER DETAILS ----------------------

# # # @router.get("/{order_id}", response_model=Order)
# # # async def get_order(
# # #     order_id: int,
# # #     db: AsyncSession = Depends(get_db),
# # #     current_user: User = Depends(get_current_user),
# # # ):
# # #     """
# # #     Get order by ID
# # #     """
# # #     service = OrderService()

# # #     if current_user.role in ["admin", "super_admin"]:
# # #         order = await service.get_order_by_id(db, order_id)
# # #     else:
# # #         order = await service.get_user_order(db, current_user.id, order_id)

# # #     if not order:
# # #         raise HTTPException(status_code=404, detail="Order not found")
# # #     return order


# # # # ---------------------- CREATE ORDER + INVOICE ----------------------

# # # @router.post("/", response_model=OrderWithInvoiceResponse)
# # # async def create_order(
# # #     order_data: OrderCreate,
# # #     db: AsyncSession = Depends(get_db),
# # #     current_user: User = Depends(get_current_user),
# # # ):
# # #     """
# # #     Create a new order and auto-generate its invoice
# # #     """
# # #     service = OrderService()
# # #     result = await service.create_order(db, current_user.id, order_data)

# # #     if not result:
# # #         raise HTTPException(status_code=400, detail="Order creation failed")

# # #     return result  # { "order": order, "invoice": invoice }


# # # # ---------------------- UPDATE ORDER ----------------------

# # # @router.put("/{order_id}", response_model=Order)
# # # async def update_order(
# # #     order_id: int,
# # #     order_update: OrderUpdate,
# # #     db: AsyncSession = Depends(get_db),
# # #     current_user: User = Depends(get_current_admin_user),
# # # ):
# # #     """
# # #     Update order (Admin only)
# # #     """
# # #     service = OrderService()
# # #     order = await service.update_order(db, order_id, order_update)

# # #     if not order:
# # #         raise HTTPException(status_code=404, detail="Order not found")

# # #     return order


# # # # ---------------------- CANCEL ORDER ----------------------

# # # @router.post("/{order_id}/cancel")
# # # async def cancel_order(
# # #     order_id: int,
# # #     db: AsyncSession = Depends(get_db),
# # #     current_user: User = Depends(get_current_user),
# # # ):
# # #     """
# # #     Cancel an order (User can cancel their own, Admin can cancel any)
# # #     """
# # #     service = OrderService()

# # #     if current_user.role in ["admin", "super_admin"]:
# # #         success = await service.cancel_order(db, order_id)
# # #     else:
# # #         success = await service.cancel_user_order(db, current_user.id, order_id)

# # #     if not success:
# # #         raise HTTPException(status_code=404, detail="Order not found or cannot be cancelled")

# # #     return {"message": "Order cancelled successfully"}


# # # # ---------------------- COMPLETE ORDER ----------------------

# # # @router.post("/{order_id}/complete")
# # # async def complete_order(
# # #     order_id: int,
# # #     db: AsyncSession = Depends(get_db),
# # #     current_user: User = Depends(get_current_admin_user),
# # # ):
# # #     """
# # #     Mark order as completed (Admin only)
# # #     """
# # #     service = OrderService()
# # #     success = await service.complete_order(db, order_id)

# # #     if not success:
# # #         raise HTTPException(status_code=404, detail="Order not found")

# # #     return {"message": "Order completed successfully"}


# # # # ---------------------- ORDER STATS ----------------------

# # # @router.get("/stats/summary")
# # # async def get_order_stats(
# # #     db: AsyncSession = Depends(get_db),
# # #     current_user: User = Depends(get_current_admin_user),
# # # ):
# # #     """
# # #     Get overall order statistics (Admin only)
# # #     """
# # #     service = OrderService()
# # #     return await service.get_order_stats(db)





# # from fastapi import APIRouter, Depends, HTTPException, status
# # from typing import List, Optional
# # from sqlalchemy.ext.asyncio import AsyncSession
# # from decimal import Decimal

# # from app.core.database import get_db
# # from app.core.security import get_current_user, get_current_admin_user
# # from app.services.order_service import OrderService
# # from app.schemas.order import (
# #     Order,
# #     OrderCreate,
# #     OrderUpdate,
# #     OrderWithPlan,
# #     OrderWithInvoiceResponse
# # )
# # from app.schemas.users import User

# # router = APIRouter()


# # # ---------------------- USER & ADMIN ORDERS ----------------------

# # @router.get("/", response_model=List[Order])
# # async def get_orders(
# #     skip: int = 0,
# #     limit: int = 100,
# #     status: Optional[str] = None,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# # ):
# #     """
# #     Get orders (User gets their own, Admins get all)
# #     """
# #     try:
# #         service = OrderService()
# #         if current_user.role in ["admin", "super_admin"]:
# #             orders = await service.get_all_orders(db, skip=skip, limit=limit, status=status)
# #         else:
# #             orders = await service.get_user_orders(db, current_user.id, skip=skip, limit=limit, status=status)
        
# #         if not orders:
# #             return []
# #         return orders
# #     except Exception as e:
# #         raise HTTPException(
# #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #             detail=f"Error fetching orders: {str(e)}"
# #         )


# # @router.get("/admin", response_model=List[OrderWithPlan])
# # async def get_orders_admin(
# #     skip: int = 0,
# #     limit: int = 100,
# #     status: Optional[str] = None,
# #     payment_status: Optional[str] = None,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_admin_user),
# # ):
# #     """
# #     Get all orders with plan details (Admin only)
# #     """
# #     try:
# #         service = OrderService()
# #         orders = await service.get_orders_with_plan(db, skip, limit, status, payment_status)
        
# #         if not orders:
# #             return []
# #         return orders
# #     except Exception as e:
# #         raise HTTPException(
# #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #             detail=f"Error fetching admin orders: {str(e)}"
# #         )


# # # ---------------------- ORDER DETAILS ----------------------

# # @router.get("/{order_id}", response_model=Order)
# # async def get_order(
# #     order_id: int,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# # ):
# #     """
# #     Get order by ID
# #     """
# #     try:
# #         service = OrderService()

# #         if current_user.role in ["admin", "super_admin"]:
# #             order = await service.get_order_by_id(db, order_id)
# #         else:
# #             order = await service.get_user_order(db, current_user.id, order_id)

# #         if not order:
# #             raise HTTPException(
# #                 status_code=status.HTTP_404_NOT_FOUND,
# #                 detail="Order not found"
# #             )
# #         return order
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         raise HTTPException(
# #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #             detail=f"Error fetching order: {str(e)}"
# #         )


# # # ---------------------- CREATE ORDER + INVOICE ----------------------

# # @router.post("/", response_model=OrderWithInvoiceResponse)
# # async def create_order(
# #     order_data: OrderCreate,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# # ):
# #     """
# #     Create a new order and auto-generate its invoice
# #     """
# #     try:
# #         service = OrderService()
# #         result = await service.create_order(db, current_user.id, order_data)

# #         if not result:
# #             raise HTTPException(
# #                 status_code=status.HTTP_400_BAD_REQUEST,
# #                 detail="Order creation failed"
# #             )

# #         return result
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         raise HTTPException(
# #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #             detail=f"Error creating order: {str(e)}"
# #         )


# # # ---------------------- UPDATE ORDER ----------------------

# # @router.put("/{order_id}", response_model=Order)
# # async def update_order(
# #     order_id: int,
# #     order_update: OrderUpdate,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_admin_user),
# # ):
# #     """
# #     Update order (Admin only)
# #     """
# #     try:
# #         service = OrderService()
# #         order = await service.update_order(db, order_id, order_update)

# #         if not order:
# #             raise HTTPException(
# #                 status_code=status.HTTP_404_NOT_FOUND,
# #                 detail="Order not found"
# #             )

# #         return order
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         raise HTTPException(
# #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #             detail=f"Error updating order: {str(e)}"
# #         )


# # # ---------------------- CANCEL ORDER ----------------------

# # @router.post("/{order_id}/cancel")
# # async def cancel_order(
# #     order_id: int,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# # ):
# #     """
# #     Cancel an order (User can cancel their own, Admin can cancel any)
# #     """
# #     try:
# #         service = OrderService()

# #         if current_user.role in ["admin", "super_admin"]:
# #             success = await service.cancel_order(db, order_id)
# #         else:
# #             success = await service.cancel_user_order(db, current_user.id, order_id)

# #         if not success:
# #             raise HTTPException(
# #                 status_code=status.HTTP_404_NOT_FOUND,
# #                 detail="Order not found or cannot be cancelled"
# #             )

# #         return {"message": "Order cancelled successfully"}
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         raise HTTPException(
# #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #             detail=f"Error cancelling order: {str(e)}"
# #         )


# # # ---------------------- COMPLETE ORDER ----------------------

# # @router.post("/{order_id}/complete")
# # async def complete_order(
# #     order_id: int,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_admin_user),
# # ):
# #     """
# #     Mark order as completed (Admin only)
# #     """
# #     try:
# #         service = OrderService()
# #         success = await service.complete_order(db, order_id)

# #         if not success:
# #             raise HTTPException(
# #                 status_code=status.HTTP_404_NOT_FOUND,
# #                 detail="Order not found"
# #             )

# #         return {"message": "Order completed successfully"}
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         raise HTTPException(
# #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #             detail=f"Error completing order: {str(e)}"
# #         )


# # # ---------------------- ORDER STATS ----------------------

# # @router.get("/stats/summary")
# # async def get_order_stats(
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_admin_user),
# # ):
# #     """
# #     Get overall order statistics (Admin only)
# #     """
# #     try:
# #         service = OrderService()
# #         stats = await service.get_order_stats(db)
# #         return stats
# #     except Exception as e:
# #         raise HTTPException(
# #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #             detail=f"Error fetching order stats: {str(e)}"
# #         )


# # # ---------------------- HEALTH CHECK ----------------------

# # @router.get("/health/check")
# # async def health_check():
# #     """
# #     Health check for orders endpoint
# #     """
# #     return {
# #         "status": "healthy",
# #         "message": "Orders endpoint is working correctly",
# #         "timestamp": "2024-01-01T00:00:00Z"  # You can use datetime.now().isoformat()
# #     }





# # from app.core.database import get_db
# # from app.core.security import get_current_admin_user
# # from app.models.invoice import Invoice
# # from app.schemas.users import User
# # import logging
# # from sqlalchemy import select

# # logger = logging.getLogger(__name__)

# # @router.post("/migrate/invoice-items")
# # async def migrate_invoice_items(
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_admin_user)
# # ):
# #     """
# #     Migrate invoice items from old to new field names (Admin only)
# #     """
# #     try:
# #         # Get all invoices
# #         result = await db.execute(select(Invoice))
# #         invoices = result.scalars().all()
        
# #         migrated_count = 0
# #         errors = []
        
# #         for invoice in invoices:
# #             try:
# #                 if invoice.items and isinstance(invoice.items, list):
# #                     new_items = []
                    
# #                     for item in invoice.items:
# #                         if isinstance(item, dict):
# #                             # Handle old field names
# #                             new_item = {
# #                                 "description": str(item.get("item_name", item.get("description", ""))),
# #                                 "quantity": float(item.get("qty", item.get("quantity", 1))),
# #                                 "unit_price": float(item.get("price", item.get("unit_price", 0.0))),
# #                                 "amount": float(item.get("amount", 0.0))
# #                             }
                            
# #                             # Calculate amount if not provided
# #                             if new_item["amount"] == 0.0:
# #                                 new_item["amount"] = new_item["quantity"] * new_item["unit_price"]
                                
# #                             new_items.append(new_item)
                    
# #                     # Update invoice with new items structure
# #                     invoice.items = new_items
# #                     migrated_count += 1
                    
# #             except Exception as item_error:
# #                 error_msg = f"Error migrating invoice {invoice.id}: {str(item_error)}"
# #                 errors.append(error_msg)
# #                 logger.error(error_msg)
# #                 continue
        
# #         # Commit all changes
# #         await db.commit()
        
# #         response = {
# #             "message": "Invoice items migration completed!",
# #             "migrated_invoices": migrated_count,
# #             "total_invoices": len(invoices),
# #             "successful": migrated_count,
# #             "failed": len(errors)
# #         }
        
# #         if errors:
# #             response["errors"] = errors[:10]  # Return first 10 errors to avoid huge response
# #             response["error_count"] = len(errors)
            
# #         return response
        
# #     except Exception as e:
# #         await db.rollback()
# #         logger.error(f"Migration failed: {str(e)}")
# #         raise HTTPException(
# #             status_code=500, 
# #             detail=f"Migration failed: {str(e)}"
# #         )







# from fastapi import APIRouter, Depends, HTTPException, status
# from typing import List, Optional
# from sqlalchemy.ext.asyncio import AsyncSession

# from app.core.database import get_db
# from app.core.security import get_current_user, get_current_admin_user
# from app.services.order_service import OrderService
# from app.schemas.order import (
#     Order,
#     OrderCreate,
#     OrderUpdate,
#     OrderWithPlan,
#     OrderWithInvoiceResponse
# )
# from app.schemas.users import User

# router = APIRouter()


# # ---------------------- USER & ADMIN ORDERS ----------------------

# @router.get("/", response_model=List[Order])
# async def get_orders(
#     skip: int = 0,
#     limit: int = 100,
#     status: Optional[str] = None,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     """
#     Get orders (User gets their own, Admins get all)
#     """
#     try:
#         service = OrderService()
#         if current_user.role in ["admin", "super_admin"]:
#             orders = await service.get_all_orders(db, skip=skip, limit=limit, status=status)
#         else:
#             orders = await service.get_user_orders(db, current_user.id, skip=skip, limit=limit, status=status)
        
#         if not orders:
#             return []
#         return orders
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error fetching orders: {str(e)}"
#         )


# @router.get("/admin", response_model=List[OrderWithPlan])
# async def get_orders_admin(
#     skip: int = 0,
#     limit: int = 100,
#     status: Optional[str] = None,
#     payment_status: Optional[str] = None,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
# ):
#     """
#     Get all orders with plan details (Admin only)
#     """
#     try:
#         service = OrderService()
#         orders = await service.get_orders_with_plan(db, skip, limit, status, payment_status)
        
#         if not orders:
#             return []
#         return orders
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error fetching admin orders: {str(e)}"
#         )


# # ---------------------- ORDER DETAILS ----------------------

# @router.get("/{order_id}", response_model=Order)
# async def get_order(
#     order_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     """
#     Get order by ID
#     """
#     try:
#         service = OrderService()

#         if current_user.role in ["admin", "super_admin"]:
#             order = await service.get_order_by_id(db, order_id)
#         else:
#             order = await service.get_user_order(db, current_user.id, order_id)

#         if not order:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Order not found"
#             )
#         return order
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error fetching order: {str(e)}"
#         )


# # ---------------------- CREATE ORDER + INVOICE ----------------------

# @router.post("/", response_model=OrderWithInvoiceResponse)
# async def create_order(
#     order_data: OrderCreate,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     """
#     Create a new order and auto-generate its invoice
#     """
#     try:
#         service = OrderService()
#         result = await service.create_order(db, current_user.id, order_data)

#         if not result:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Order creation failed"
#             )

#         return result
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error creating order: {str(e)}"
#         )


# # ---------------------- UPDATE ORDER ----------------------

# @router.put("/{order_id}", response_model=Order)
# async def update_order(
#     order_id: int,
#     order_update: OrderUpdate,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
# ):
#     """
#     Update order (Admin only)
#     """
#     try:
#         service = OrderService()
#         order = await service.update_order(db, order_id, order_update)

#         if not order:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Order not found"
#             )

#         return order
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error updating order: {str(e)}"
#         )


# # ---------------------- CANCEL ORDER ----------------------

# @router.post("/{order_id}/cancel")
# async def cancel_order(
#     order_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     """
#     Cancel an order (User can cancel their own, Admin can cancel any)
#     """
#     try:
#         service = OrderService()

#         if current_user.role in ["admin", "super_admin"]:
#             success = await service.cancel_order(db, order_id)
#         else:
#             success = await service.cancel_user_order(db, current_user.id, order_id)

#         if not success:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Order not found or cannot be cancelled"
#             )

#         return {"message": "Order cancelled successfully"}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error cancelling order: {str(e)}"
#         )


# # ---------------------- COMPLETE ORDER ----------------------

# @router.post("/{order_id}/complete")
# async def complete_order(
#     order_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
# ):
#     """
#     Mark order as completed (Admin only)
#     """
#     try:
#         service = OrderService()
#         success = await service.complete_order(db, order_id)

#         if not success:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Order not found"
#             )

#         return {"message": "Order completed successfully"}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error completing order: {str(e)}"
#         )


# # ---------------------- ORDER STATS ----------------------

# @router.get("/stats/summary")
# async def get_order_stats(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
# ):
#     """
#     Get overall order statistics (Admin only)
#     """
#     try:
#         service = OrderService()
#         stats = await service.get_order_stats(db)
#         return stats
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error fetching order stats: {str(e)}"
#         )


# # ---------------------- HEALTH CHECK ----------------------

# @router.get("/health/check")
# async def health_check():
#     """
#     Health check for orders endpoint
#     """
#     from datetime import datetime
#     return {
#         "status": "healthy",
#         "message": "Orders endpoint is working correctly",
#         "timestamp": datetime.utcnow().isoformat()
#     }




from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.services.order_service import OrderService
from app.schemas.order import (
    Order,
    OrderCreate,
    OrderUpdate,
    OrderWithPlan,
    OrderWithInvoiceResponse
)
from app.schemas.users import User
from sqlalchemy import func
from app.services.referral_service import ReferralService


from sqlalchemy import select




router = APIRouter()

order_service = OrderService()
referral_service = ReferralService()  # ✅ create instanc



# ---------------------- USER & ADMIN ORDERS ----------------------

@router.get("/", response_model=List[Order])
async def get_orders(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get orders (User gets their own, Admins get all)
    """
    try:
        service = OrderService()
        if current_user.role in ["admin", "super_admin"]:
            orders = await service.get_all_orders(db, skip=skip, limit=limit, status=status)
        else:
            orders = await service.get_user_orders(db, current_user.id, skip=skip, limit=limit, status=status)
        
        if not orders:
            return []
        return orders
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching orders: {str(e)}"
        )


@router.get("/admin", response_model=List[OrderWithPlan])
async def get_orders_admin(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    payment_status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Get all orders with plan details (Admin only)
    """
    try:
        service = OrderService()
        orders = await service.get_orders_with_plan(db, skip, limit, status, payment_status)
        
        if not orders:
            return []
        return orders
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching admin orders: {str(e)}"
        )


# ---------------------- ORDER DETAILS ----------------------

@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get order by ID
    """
    try:
        service = OrderService()

        if current_user.role in ["admin", "super_admin"]:
            order = await service.get_order_by_id(db, order_id)
        else:
            order = await service.get_user_order(db, current_user.id, order_id)

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        return order
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching order: {str(e)}"
        )


# ---------------------- CREATE ORDER + INVOICE ----------------------

@router.post("/", response_model=OrderWithInvoiceResponse)
async def create_order(
    order_data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new order and auto-generate its invoice
    """
    try:
        service = OrderService()
        result = await service.create_order(db, current_user.id, order_data)

        if not result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order creation failed"
            )

        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating order: {str(e)}"
        )


# ---------------------- UPDATE ORDER ----------------------

@router.put("/{order_id}", response_model=Order)
async def update_order(
    order_id: int,
    order_update: OrderUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Update order (Admin only)
    """
    try:
        service = OrderService()
        order = await service.update_order(db, order_id, order_update)

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )

        return order
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating order: {str(e)}"
        )


# ---------------------- CANCEL ORDER ----------------------

@router.post("/{order_id}/cancel")
async def cancel_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Cancel an order (User can cancel their own, Admin can cancel any)
    """
    try:
        service = OrderService()

        if current_user.role in ["admin", "super_admin"]:
            success = await service.cancel_order(db, order_id)
        else:
            success = await service.cancel_user_order(db, current_user.id, order_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found or cannot be cancelled"
            )

        return {"message": "Order cancelled successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error cancelling order: {str(e)}"
        )


# ---------------------- COMPLETE ORDER ----------------------

# @router.post("/{order_id}/complete")
# async def complete_order(
#     order_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
# ):
#     """
#     Mark order as completed (Admin only)
#     """
#     try:
#         service = OrderService()
#         success = await service.complete_order(db, order_id)

#         if not success:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Order not found"
#             )

#         return {"message": "Order completed successfully"}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error completing order: {str(e)}"
#         )



# ---------------------- COMPLETE ORDER ----------------------
@router.post("/{order_id}/complete")
async def complete_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Mark order as completed (Admin only)
    """
    try:
        service = OrderService()
        success = await service.complete_order(db, order_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )

        # 🆕 Track affiliate commissions and activate subscription
        try:
            from app.services.affiliate_service import AffiliateService
            from app.models.order import Order
            from sqlalchemy import select
            
            # Get order details
            result = await db.execute(select(Order).where(Order.id == order_id))
            order = result.scalar_one_or_none()
            
            if order:
                affiliate_service = AffiliateService()
                
                # Auto-activate affiliate subscription (free with server purchase)
                await affiliate_service.check_and_activate_from_server_purchase(db, order.user_id)
                
                # Calculate and record commissions
                await affiliate_service.calculate_and_record_commissions(
                    db, order.id, order.user_id, order.total_amount, 'server'
                )
                
                # Mark referral as converted (first purchase)
                await affiliate_service.mark_referral_converted(
                    db, order.user_id, order.id, order.total_amount
                )
        except Exception as aff_error:
            # Log error but don't fail the order completion
            import traceback
            print(f"⚠️ Affiliate tracking error: {str(aff_error)}")
            traceback.print_exc()

        return {"message": "Order completed successfully"}

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()  # 🟡 This will show full traceback in your terminal
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error completing order: {str(e)}"
        )




# ---------------------- ORDER STATS ----------------------

@router.get("/stats/summary")
async def get_order_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Get overall order statistics (Admin only)
    """
    try:
        service = OrderService()
        stats = await service.get_order_stats(db)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching order stats: {str(e)}"
        )


# ---------------------- HEALTH CHECK ----------------------

@router.get("/health/check")
async def health_check():
    """
    Health check for orders endpoint
    """
    from datetime import datetime
    return {
        "status": "healthy",
        "message": "Orders endpoint is working correctly",
        "timestamp": datetime.utcnow().isoformat()
    }
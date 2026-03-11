# B5 Orders Module — Design Spec

**Date:** 2026-03-11
**Status:** Approved

## Endpoints

| # | Method | Path | Access | Description |
|---|--------|------|--------|-------------|
| 1 | POST | `/outlets/:id/orders` | owner+staff | Create order (multi-item) |
| 2 | GET | `/outlets/:id/orders` | owner+staff | List orders (filter, search, pagination) |
| 3 | GET | `/outlets/:id/orders/:orderId` | owner+staff | Detail + items + status history |
| 4 | PATCH | `/outlets/:id/orders/:orderId` | owner+staff | Edit order (before completed) |
| 5 | PATCH | `/outlets/:id/orders/:orderId/status` | owner+staff | Update status + history |
| 6 | PATCH | `/outlets/:id/orders/:orderId/payment` | owner+staff | Update payment |
| 7 | DELETE | `/outlets/:id/orders/:orderId` | owner | Cancel order |
| 8 | GET | `/outlets/:id/orders/:orderId/nota` | owner+staff | Nota data for print |

## File Structure

```
backend/src/orders/
  orders.module.ts
  orders.controller.ts
  orders.service.ts
  guards/outlet-access.guard.ts
  dto/
    create-order.dto.ts
    update-order.dto.ts
    update-order-status.dto.ts
    update-order-payment.dto.ts
    query-orders.dto.ts
    cancel-order.dto.ts
```

## Business Logic

### Order Number
- Atomic increment via `order_sequences` table
- Format: `ORD-XXXX` (zero-padded 4 digits)
- Upsert sequence + create order in single Prisma transaction

### Create Order
- Validate customer exists (if provided)
- Validate all service IDs exist & active
- Snapshot service_name, price_per_unit, unit to order_items
- Calculate subtotal per item = quantity × price_per_unit
- Calculate order subtotal = sum of items, total_amount = subtotal - discount
- Create initial order_status_history (null → pending)
- Set estimated_done_at from max estimated_hours
- Set created_by + created_by_type from AuthUser

### Status Flow
- Linear: pending → processing → ready → completed
- Cancel: from any status except completed
- Each transition creates order_status_history entry

### Payment Update
- Update paid_amount, auto-calculate payment_status
- unpaid (paid=0), partial (0 < paid < total), paid (paid >= total)

### Edit Restrictions
- Cannot edit completed or cancelled orders

### Delete/Cancel
- Soft cancel with cancel_reason + cancelled_at
- Create status history entry

### Nota
- Return full order data + outlet info for frontend rendering

## Query Parameters (GET /orders)

- **Filter:** status, paymentStatus, startDate, endDate, serviceId
- **Search:** customer name or order_number (case-insensitive)
- **Sort:** createdAt (default desc), orderNumber, totalAmount
- **Pagination:** page (default 1), limit (default 20)

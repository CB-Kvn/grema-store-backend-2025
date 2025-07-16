import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function getPeriodRange(period: 'month' | 'quarter' | 'semester' | 'year', year: number) {
  const now = new Date();
  let start: Date, end: Date;
  switch (period) {
    case 'month':
      start = new Date(year, now.getMonth(), 1);
      end = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(year, quarter * 3, 1);
      end = new Date(year, quarter * 3 + 3, 0, 23, 59, 59);
      break;
    case 'semester':
      const semester = now.getMonth() < 6 ? 0 : 6;
      start = new Date(year, semester, 1);
      end = new Date(year, semester + 6, 0, 23, 59, 59);
      break;
    case 'year':
    default:
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31, 23, 59, 59);
      break;
  }
  return { start, end };
}

export class ReportService {


  // Reporte global por periodo
  static async getOverview(period: 'month' | 'quarter' | 'semester' | 'year') {
    const now = new Date();
    const currentYear = now.getFullYear();
    const { start, end } = getPeriodRange(period, currentYear);

    // Unidades y monto total en inventario (al momento actual)
    const items = await prisma.warehouseItem.findMany({
      select: { quantity: true, price: true, status: true }
    });

    const totalUnits = items.reduce((acc, i) => acc + i.quantity, 0);
    const totalInventoryValue = items.reduce((acc, i) => acc + (i.quantity * i.price!), 0);
    const lowStock = items.filter(i => i.status === 'LOW_STOCK').length;

    // Cantidad de órdenes pendientes y finalizadas en el periodo
    const [pendingOrders, finishedOrders] = await Promise.all([
      prisma.purchaseOrder.count({
        where: {
          status: 'PENDING',
          orderDate: { gte: start, lte: end }
        }
      }),
      prisma.purchaseOrder.count({
        where: {
          status: 'DELIVERED',
          orderDate: { gte: start, lte: end }
        }
      })
    ]);

    // Cantidad de bodegas en uso (status: ACTIVE)
    const warehousesInUse = await prisma.warehouse.count({
      where: { status: 'ACTIVE' }
    });

    // Cantidad de descuentos activos en el periodo
    const discounts = await prisma.discount.count({
      where: {
        isActive: true,
        startDate: { lte: end },
        OR: [
          { endDate: null },
          { endDate: { gte: start } }
        ]
      }
    });

    // Ventas totales en monto (suma de órdenes DELIVERED en el periodo)
    const totalSales = await prisma.purchaseOrder.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: 'DELIVERED',
        orderDate: { gte: start, lte: end }
      }
    });

    // Gastos en el periodo
    const expenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        date: { gte: start, lte: end },
        state: true
      }
    });

    return {
      period,
      year: currentYear,
      startDate: start,
      endDate: end,
      totalUnits,
      totalInventoryValue,
      pendingOrders,
      finishedOrders,
      warehousesInUse,
      discounts,
      lowStock,
      totalSales: totalSales._sum.totalAmount || 0,
      expenses: expenses._sum.amount || 0,
      // Cálculo de ganancias netas
      netProfit: (totalSales._sum.totalAmount || 0) - (expenses._sum.amount || 0)
    };
  }

  static async getSummary(year?: number) {
    const now = new Date();
    const currentYear = year || now.getFullYear();
    const start = new Date(currentYear, 0, 1, 0, 0, 0); // 1 de enero del año
    const end = now; // Fecha y hora actual

    // Todos los gastos desde inicio de año hasta hoy
    const expenses = await prisma.expense.findMany({
      where: { date: { gte: start, lte: end }, state: true }
    });

    // Todas las órdenes finalizadas (DELIVERED) desde inicio de año hasta hoy
    const entries = await prisma.purchaseOrder.findMany({
      where: { status: 'DELIVERED', orderDate: { gte: start, lte: end } }
    });

    return {
      expenses,
      entries,
      from: start,
      to: end
    };
  }

  static async getOrderAmountsByCategory(year?: number) {
    const now = new Date();
    const currentYear = year || now.getFullYear();
    const start = new Date(currentYear, 0, 1, 0, 0, 0);
    const end = now;

    // Busca todas las órdenes finalizadas en el año y suma por categoría de producto
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: { status: 'DELIVERED', orderDate: { gte: start, lte: end } }
      },
      include: { product: true }
    });

    // Agrupa y suma por categoría
    const result: { [category: string]: number } = {};
    for (const item of orderItems) {
      const category = item.product?.category || 'Sin categoría';
      result[category] = (result[category] || 0) + item.totalPrice;
    }

    return result;
  }
}
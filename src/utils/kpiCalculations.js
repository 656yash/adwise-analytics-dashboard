export const calculateKPIs = (events, orders) => {
  // Aggregate Metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Native Marketing Metrics
  const adImpressions = events.filter(e => e.eventType === 'ad_impression');
  const adClicks = events.filter(e => e.eventType === 'ad_click');
  
  const totalImpressions = adImpressions.length;
  const totalClicks = adClicks.length;
  
  // "Promo Value Equivalent": Assume each click generated from internal promos is worth ₹15
  const PROMO_CLICK_VALUE = 15;
  const promoValueEquivalent = totalClicks * PROMO_CLICK_VALUE;

  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  // cpc/roas/roi are no longer applicable in the same way, but we will return promoValue equivalent
  const cpc = PROMO_CLICK_VALUE;
  const roas = promoValueEquivalent > 0 ? totalRevenue / promoValueEquivalent : 0;
  const roi = promoValueEquivalent > 0 ? ((totalRevenue - promoValueEquivalent) / promoValueEquivalent) * 100 : 0;

  // Conversion Metrics
  const totalVisitors = events.filter(e => e.eventType === 'page_view').length;
  const purchases = orders.length;
  const conversionRate = totalVisitors > 0 ? (purchases / totalVisitors) * 100 : 0;

  return {
    totalRevenue,
    totalOrders,
    aov,
    totalImpressions,
    totalClicks,
    promoValueEquivalent,
    ctr,
    cpc,
    roas,
    roi,
    totalVisitors,
    conversionRate
  };
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-IN', {
    notation: "compact",
    compactDisplay: "short"
  }).format(value);
};

import { splitTenderError, splitShiftTotals } from '../src/utils/settlement.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { buildReport, paymentBreakdown, tradingDay } from '../src/utils/reportData.ts';
import { csvEscape, monthlySales, reportableOrders, salesSummary } from '../src/utils/reporting.ts';
import { elapsedLabel, kitchenQueue, matchesKitchenLine } from '../src/utils/kitchen.ts';
import { kitchenTicketData } from '../src/utils/kitchenTicket.ts';

const line = (extra={}) => ({ id:'line', menuItemId:'momo', name:'Momo', quantity:2, price:100, station:'momo', ticketType:'KOT', ...extra });
const order = (extra={}) => ({ id:'order', orderNumber:8, orderType:'dine-in', tableId:'table', items:[line()], status:'new', createdAt:'2026-03-31T18:30:00Z', updatedAt:'2026-09-17T08:00:00Z', subtotal:200, discount:20, tax:23.4, taxableAmount:180, tip:0, total:203.4, paymentStatus:'paid', paymentMethod:'cash', ...extra });
const menu = [{id:'momo', name:'Momo', category:'momo', cost:50, stockQuantity:4, inStock:true}];
const end = new Date('2026-09-30T23:59:59+05:45');

test('station and stream filters must match the same line', () => {
  const mixed=order({items:[line(),line({id:'tea',station:'coffee',ticketType:'BOT'})]});
  assert.equal(kitchenQueue([mixed],'momo','BOT').length,0);
  assert.equal(kitchenQueue([mixed],'coffee','BOT').length,1);
  assert.equal(matchesKitchenLine(line(),'momo','KOT'),true);
});
test('kitchen is oldest first, excludes terminal orders, and does not mutate source', () => {
  const orders=[order({id:'later',createdAt:'2026-04-02T12:00:00Z'}),order({id:'earlier'}),order({id:'served',status:'served'}),order({id:'cancelled',status:'cancelled'})];
  assert.deepEqual(kitchenQueue(orders,'all','all').map(row=>row.id),['earlier','later']);
  assert.equal(orders[0].id,'later');
});
test('elapsed duration is calm, compact, and guards invalid or future times', () => {
  const now=Date.parse('2026-04-01T02:00:00Z');
  assert.deepEqual(elapsedLabel('2026-04-01T00:30:00Z',now),{text:'1h 30m',overdue:true});
  assert.deepEqual(elapsedLabel('2026-04-01T03:00:00Z',now),{text:'0 min',overdue:false});
  assert.equal(elapsedLabel('bad',now).overdue,false);
});
test('KOT uses actual table, creation time and notes without sample fallback', () => {
  const data=kitchenTicketData(order({notes:'No chilli'}),[{id:'table',label:'Garden 2'}]);
  assert.equal(data.tableLabel,'Garden 2'); assert.equal(data.notes,'No chilli');
  assert.match(data.timeStr,/01 Apr/); assert.equal(data.serverName,'Unassigned');
  assert.equal(kitchenTicketData(order(),[]).notes,undefined);
});
test('sales dates use creation date in Kathmandu, not kitchen edits', () => {
  assert.equal(tradingDay(order().createdAt),'2026-04-01');
  assert.equal(reportableOrders([order()],new Date('2026-09-01'),end).length,0);
  assert.equal(buildReport('daily',[order()],menu,end).rows[0][0],'2026-04-01');
});
test('split payment separates tenders and deducts cash change exactly once', () => {
  const split=order({paymentMethod:'split',total:300,splitDetails:{tenders:[{method:'cash',amount:200},{method:'esewa',amount:150}],changeReturned:50}});
  assert.deepEqual(paymentBreakdown([split]),[{method:'cash',total:150},{method:'esewa',total:150}]);
  assert.equal(paymentBreakdown([order({status:'cancelled'}),order({paymentStatus:'unpaid'})]).length,0);
  assert.equal(paymentBreakdown([order({paymentMethod:'split',total:300,splitDetails:{tenders:[{method:'cash',amount:250}],changeReturned:0}})]).find(row=>row.method==='Unallocated / variance').total,50);
});
test('reports show their specific data and distinguish estimates from statements', () => {
  const sale=buildReport('sales',[order()],menu,end); assert.equal(sale.rows[0][3],180);
  assert.equal(buildReport('open-bills',[order(),order({paymentStatus:'unpaid'})],menu,end).rows.length,1);
  assert.equal(buildReport('discounts',[order()],menu,end).rows[0][1],20);
  assert.equal(buildReport('categories',[order()],menu,end).rows[0][1],2);
  assert.match(buildReport('items',[order()],menu,end).basis,/not net profit/);
  assert.match(buildReport('vat',[order()],menu,end).basis,/not VAT payable/);
  assert.equal(buildReport('stock',[],menu,end).rows[0][5],200);
});
test('CSV neutralizes spreadsheet formulas and preserves embedded quotes', () => {
  assert.equal(csvEscape('=SUM(A1)'),`"'=SUM(A1)"`);
  assert.equal(csvEscape('  @attack'),`"'  @attack"`);
  assert.equal(csvEscape('Momo "hot"'),'"Momo ""hot"""');
  assert.equal(csvEscape(-10),'"-10"');
});
test('12 calendar months reconcile 1,200 seeded randomized orders including cancellations', () => {
  let seed=8;
  const random=()=>{ seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/2**32; };
  const orders=Array.from({length:1200},(_,i)=>{
    const monthIndex=Math.floor(i/100); const year=monthIndex<3?2025:2026; const month=monthIndex<3?monthIndex+10:monthIndex-2;
    const date=`${year}-${String(month).padStart(2,'0')}-${String(1+Math.floor(random()*28)).padStart(2,'0')}T12:00:00+05:45`;
    const quantity=1+Math.floor(random()*5); const subtotal=100*quantity; const discount=random()<0.2?20:0; const taxableAmount=subtotal-discount;
    const tax=+(taxableAmount*0.13).toFixed(2); const tip=random()<0.3?20:0;
    return order({id:'synthetic-'+i,orderNumber:1000+i,createdAt:date,items:[line({quantity})],subtotal,discount,taxableAmount,tax,tip,total:taxableAmount+tax+tip,paymentStatus:random()<0.8?'paid':'unpaid',status:random()<0.05?'cancelled':'completed'});
  });
  const valid=reportableOrders(orders,new Date('2025-10-01T00:00:00+05:45'),end);
  const months=monthlySales(valid,end); const summary=salesSummary(valid);
  assert.equal(months.length,12); assert.equal(months[0].key,'2025-10'); assert.equal(months.at(-1).key,'2026-09');
  assert.equal(months.reduce((n,row)=>n+row.orders,0),valid.length);
  const cents=value=>Math.round(value*100);
  assert.equal(cents(months.reduce((n,row)=>n+row.billed,0)),cents(summary.grossBilled));
  assert.equal(cents(months.reduce((n,row)=>n+row.collected,0)),cents(summary.collected));
  assert.equal(cents(summary.collected+summary.outstanding),cents(summary.grossBilled));
  const daily=buildReport('daily',valid,menu,end);
  assert.equal(cents(daily.rows.reduce((n,row)=>n+row[5],0)),cents(summary.grossBilled));
  writeFileSync('design-system/restro8/year-sales-validation.json',JSON.stringify({synthetic:true,description:'Automated fixture data only; never inserted into restaurant storage.',period:'2025-10-01 through 2026-09-30 Kathmandu',generatedOrders:orders.length,cancelled:orders.length-valid.length,summary,months},null,2));
});

test('split settlements validate net payment and shift cash excludes returned change', () => {
  const details={tenders:[{method:'cash',amount:200},{method:'card',amount:150}],changeReturned:50};
  assert.equal(splitTenderError(details,300),null);
  assert.deepEqual(splitShiftTotals(details),{cash:150,digital:150});
  assert.match(splitTenderError(details,350),/equal the bill/);
  assert.match(splitTenderError({...details,changeReturned:300},50),/exceed the cash/);
  assert.match(splitTenderError({tenders:[{method:'cash',amount:NaN}]},0),/valid/);
});

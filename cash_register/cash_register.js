var line_items = [
    {description: "aardvark", price: 425, qty: -1},
    {description: "PruNe", price: 1.99, qty: 1},
    {description: "potato", price: .79, qty: -10},
    {description: "zebra", price: 525.25, qty: 1},
    {description: "SpinAch", price: 2.99, qty: 1},
    {description: "zepplin", price: 20000, qty: 1},
    {description: "PetUnia", price: 1.25, qty: 12},
    {description: "squash", price: 2.35, qty: 3}
];

// let's fix capitalization for line items
myUtils.myEach(line_items, function(item, i){
  item.description = item.description.toLowerCase();
});

var coupons = [
    {description: "Zebra", discount: 100, limit: 1},
    {description: "squash", discount: 1.00, limit: 2},
    {description: "mouse", discount: 2.00, limit: 10}
];

// and go ahead and fix capitalization in coupons
myUtils.myEach(coupons, function(item, i) {
  item.description = item.description.toLowerCase();
});

var $entries,
  $subTotal;

$(document).ready(function() {

  $entries = $("#entries");
  $subTotal = $('#subtotal');
  $salesTax = $('#salestax');
  $total = $('#total');
  $refund = $('#refund');

  // add items to html for receipt (also sorts)
  updateReceiptItems();

  updateReceiptVals(); // <- renamed updateSubTotal

  percentDiscount("zepplin", 10);

  applyAllCoupons();
});

/*******************************************
Adding an item to the receipt display
********************************************/

/* old addItem
function addItem(price, title, quantity) {
  // YUCK! Let's refactor this!
  var html_string = (
        "<tr>" +
          "<td>" +  title + "</td>" +
          "<td>" + quantity + "</td>" +
          "<td>" + price + "</td>" +
        "</tr>"
  );
  $entries.append(html_string);
}
*/

function addItem(price, title, quantity) {
  price = myUtils.toCurrencyString(price, "$");
  // if we hadn't fixed capitalization already:
  // title = title.toLowerCase();
  var innerTDs = [myUtils.buildElement("td", title), " ",
    myUtils.buildElement("td", quantity), " ",
    myUtils.buildElement("td", price)
  ];
  // after building the tds, put them in their own tr (row) 
  // within the tbody (which has id entries)
  // note I've updated buildElement to take an id as a 3rd arg
  // so that I can give each tr the item's description as an id                 
  // and use it later to change color
  $entries.append(myUtils.buildElement("tr", innerTDs, {
    "id": title
  }));
}

/*******************************************
Calculating Totals & Updating Receipt Display
********************************************/

function updateReceiptItems() {
  // redoes the receipt item list, in sorted description order
  // remove all old entries
  $entries.html("");
  // sort line items
  line_items.sort(compareLineItems);
  // add all items to html
  myUtils.myEach(line_items, function(item, i) {
    addItem(item.price, item.description, item.qty);
    // if we haven't fixed capitalization, need to
    // use item.description.toLowerCase() above
  });
}

function updateReceiptVals() { // replaces updateSubTotal
  // updates the subtotal, sales tax, and total
  // DOES take into account the quantity of items;

  var subTotalPrice = myUtils.myReduce(line_items, function(val, item) {
    // since we're using reduce, val will be updated for each item
    // (to whatever val was plus the current item's price*quantity)
    return val + myUtils.toDollarAmount(item.price) * item.qty;
  });
  $subTotal.text(myUtils.toCurrencyString(subTotalPrice, "$"));

  var salesTaxAmount = subTotalPrice * (0.0725);
  $salesTax.text(myUtils.toCurrencyString(salesTaxAmount, "$"));

  var totalAmount = subTotalPrice + salesTaxAmount;
  $total.text(myUtils.toCurrencyString(totalAmount, "$"));

  updateRefund();
}

function updateRefund() {
  myUtils.myEach(line_items, function(item) {
    if (item.qty < 0) {
      $refund.text("** contains refund(s) **");
      // change the color of the whole row for the refund item
      // (remember it has the description as its id)
      $("#" + item.description).addClass("return");
    }
  })
}

/*******************************************
Sorting Line Items
********************************************/

function compareLineItems(a, b) {
  // custom compare callback to sort line_items
  // based on sort spec, a and b are elements of line_items
  // note: if we don't fix capitalization at start,
  // would need to use a.description.toLowerCase() 
  if (a.description < b.description) {
    return -1;
  } else if (a.description > b.description) {
    return 1;
  }
  // a must be equal to b or we would have returned
  return 0;

}

/*******************************************
Discounts
********************************************/

function percentDiscount(desc, percentage) {
  // in both line_items (model) and the displayed html (view):
  // reduces the price for the item with description (model) or id (view)
  // equal to desc by percentage percent
  desc = desc.toLowerCase();

  // filter line_items for item matching description desc
  matchingItem = line_items.filter(function(item, i) {
    return item.description === desc;
  });

  if (matchingItem == true) {
    // we have a match!
    // note: no two items should have same description, so 
    // there are either 1 or 0 matching items
    // define item to be just the one matching item itself
    item = matchingItem[0];
    item.price = item.price * (1 - percentage / 100);
    // now that we have price updated in line_items,
    // update the displayed price
    // start by getting all the trs
    $priceElement = $("tr")
      // filter down to the one with the id we want
      .filter("#" + desc)
      // inside it, find the price th
      .find(':contains("$")')
      // update the text
      .text(myUtils.toCurrencyString(item.price, "$"));
    // finally, fix subtotals, sales tax, total
    updateReceiptVals();
  }
}

/*******************************************
Coupons
********************************************/

function applyAllCoupons() {
  // for each line item, look for matching coupons
  // callback uses applySingleCoupon to handle each coupon
  myUtils.myEach(line_items, function(item, index) {
    for (var i = 0; i < coupons.length; i++) {
      if (item.description === coupons[i].description) {
        applySingleCoupon(item, index, coupons[i], i);
      }
    }
  });
  updateReceiptItems();
  updateReceiptVals();
}

function applySingleCoupon(item, itemIndex, coupon, couponIndex) {
  // applies the coupon to the item, up to the coupon quantity limit
  // changes the quantity of the item (unless it's negative - can't get a discount on return)
  // adds a coupon version of the item to the receipt
  if (item.qty >= coupon.limit && coupon.limit > 0) {
    item.qty = item.qty - coupon.limit;
    line_items.push({
      description: item.description + "(coupon)",
      price: item.price - coupon.discount,
      qty: coupon.limit
    });
    coupons.splice(couponIndex, 1);
    if (item.qty === 0) {
      line_items.splice(itemIndex, 1);
    }
  }
}

/*******************************************
Adding items to line_items with Form (Incomplete)
********************************************/
function addLineItem(name, price, quantity){
// adds the item to the receipt (model)
// then calls updater functions to add it to display
// if an item with the same name is already on the receipt,
  // overwrites that item's info
  name = name.toLowerCase();

  // filter line_items for item.description matching name
  matchingItem = line_items.filter(function(item, i) {
    return item.description === name;
  });

  if (matchingItem == true) {
    // we have a match! replace its info!
    item = matchingItem[0];
    item.price = price;
    item.qty = quantity;
  } else {
    newItem = {};
    newItem["description"] = name;
    newItem["price"] = price;
    newItem["qty"] = quantity;
    line_items.push(newItem);
    updateReceiptItems();
    updateReceiptVals(); 
  }
}

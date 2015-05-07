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
    {description: "squash", discount: 1.00, limit: 1},
    {description: "mouse", discount: 2.00, limit: 10}
];

// and go ahead and fix capitalization in coupons
myUtils.myEach(coupons, function(item, i){
  item.description = item.description.toLowerCase();
});

var $entries, 
    $subTotal;

$(document).ready(function(){

  $entries = $("#entries");
  $subTotal = $('#subtotal');
  $salesTax = $('#salestax');
  $total = $('#total');
  $refund = $('#refund');

  line_items.sort(compareLineItems);

  myUtils.myEach(line_items, function(item,i){
    addItem(item.price, item.description, item.qty);
    // if we haven't fixed capitalization, need to
    // use item.description.toLowerCase() above
  })

  updateReceiptVals(); // <- renamed updateSubTotal

});

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


function addItem(price, title, quantity) {
    price = myUtils.toCurrencyString(price, "$");
    // if we hadn't fixed capitalization already:
    // title = title.toLowerCase();
    var innerTDs = [myUtils.buildElement("td", title), " ",
                   myUtils.buildElement("td", quantity), " ",
                   myUtils.buildElement("td", price)].join(""); 
    $entries.append(myUtils.buildElement("tr", innerTDs, title));
}

function updateReceiptVals() {
  // updates the subtotal, sales tax, and total
  // DOES take into account the quantity of items;
  var subTotalPrice = myUtils.myReduce(line_items, function (val, item){
    return val + myUtils.toDollarAmount(item.price)*item.qty;
  });
  $subTotal.text(myUtils.toCurrencyString(subTotalPrice, "$"));
  
  var salesTaxAmount = subTotalPrice*(0.0725);
  $salesTax.text(myUtils.toCurrencyString(salesTaxAmount, "$"));
  
  var totalAmount = subTotalPrice+salesTaxAmount;
  $total.text(myUtils.toCurrencyString(totalAmount, "$"));

  updateRefund();
}

function updateRefund(){
  myUtils.myEach(line_items, function(item){
    if (item.qty < 0){
      $refund.text("** contains refund(s) **");
      $("#"+item.description).addClass("return");
    }
  })
}


// custom compare to sort line items
function compareLineItems(a, b) {
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

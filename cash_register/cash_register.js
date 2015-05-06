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


// let's fix the wonky capitalization
myUtils.myEach(line_items, function(item, i){
  console.log(item.description);
  item.description.toLowerCase();
});


var coupons = [
    {description: "Zebra", discount: 100, limit: 1},
    {description: "squash", discount: 1.00, limit: 1},
    {description: "mouse", discount: 2.00, limit: 10}
];

var $entries, 
    $subTotal;

$(document).ready(function(){

  $entries = $("#entries");
  $subTotal = $('#subtotal');
  $salesTax = $('#salestax');
  $total = $('#total');

  myUtils.myEach(line_items, function(item,i){
    addItem(item.price, item.description);
  })

  updateSubTotal();


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


function addItem(price, title) {
    price = myUtils.toCurrencyString(price, "$");
   // title = title.toLowerCase();
    var innerTDs = myUtils.buildElement("td", title) + " " +
                   myUtils.buildElement("td", price); 
    $entries.append(myUtils.buildElement("tr", innerTDs));
}

function updateSubTotal() {
  var subTotalPrice = myUtils.myReduce(line_items, function (val, item, i, arr){
    return val + myUtils.toDollarAmount(item.price);
  });
  $subTotal.text(myUtils.toCurrencyString(subTotalPrice, "$"));
  
  var salesTaxAmount = subTotalPrice*(0.0725);
  $salesTax.text(myUtils.toCurrencyString(salesTaxAmount, "$"));
  
  var totalAmount = subTotalPrice+salesTaxAmount;
  $total.text(myUtils.toCurrencyString(totalAmount, "$"));
}

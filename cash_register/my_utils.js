// THIS IS YOUR CUSTOM JAVASCRIPT UTILITY LIBRARY
// This file is already included in you project!
// Make use of your utility functions, and create some new ones!

(function(){

    this.myUtils = {}

    myUtils = {}


    myUtils.myEach = function myEach(arr, cb){
        var len = arr.length;
        for(var i=0; i<len; i++){
            var cbresult = cb(arr[i], i, arr);
            // let's end early if our cb returns false
            // to match the jQuery .each behavior
            if (cbresult === false){
              break;
            }
        }
    }

    myUtils.myMap = function myMap(arr, cb){
      var len = arr.length;
      var newArr = [];
      for(var i=0; i<len; i++){
         newArr[i] = cb(arr[i], i, arr);
      }
      return newArr;
    }


    myUtils.myReduce = function myReduce(arr, cb, val){
      var len = arr.length;
      val = val || 0;
      for(var i=0; i<len; i++){
         val = cb(val, arr[i], i, arr)
      }
      return val;
    }


  
    myUtils.buildElement = function buildElement(tagType, innerStr, attrs){
    //  takes in an HTML tag type and an inner HTML string 
    //  update! and a JavaScript object containing any additional attributes
    //  and outputs an HTML element as a string

      // htmlString is actually an array we build up and then join
      // start with the beginning of the opening tag
      var htmlString = ["<", tagType];

      // add htmlString fragments for each attribute in attrs
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          htmlString.push(" ", key, "=", attrs[key]);
        }
      }

      // add the end of the opening tag, the inner HTML string, 
      // and the close tag
      htmlString.push(">", innerStr, "</", tagType, ">");

      // join everything up with empty separator and return
      return htmlString.join("");
    }

    myUtils.toDollarAmount = function toDollarAmount(num){
    // takes in a float and returns a currency amount
    // (removes extra decimal places)
        return (Math.round(num*100))/100;

    }

    myUtils.toCurrencyString = function toCurrencyString(num, symbol){
    // takes in a float and a currency symbol 
    // and returns a correctly formatted currency string
        num = myUtils.toDollarAmount(num);
        var currStr = num.toString();
        var dotIndex = currStr.indexOf('.');
        if (dotIndex === -1){
            currStr = currStr + ".00";
        } else if (dotIndex === currStr.length - 2){
            currStr = currStr + "0";
        } else {
            currStr = currStr.substring(0, dotIndex+3); 
        }
        return symbol+currStr;
    }


}.call(this))

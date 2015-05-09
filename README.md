# Iterator Challenge - Sample Solution (partial)

This branch contains sample solutions for all but the SUPER BONUS form part.

### Instructions

Take a look at `my_utils.js`. Right now it only has a `myEach` function. Add the other iterators you built during the lecture: i.e. `myMap`, `myReduce`. The goal of this exercise is for you to 1) use the utilities you've already built to solve the problems in this exercise, 2) build and extend the myUtils library with additional helper functions. You also get to practice jQuery!

###Workflow & Submission
* Fork this repository.
* Clone the `iterators_hmwk` repo from *your* gitHub account onto your computer.
* Open `cash_register\cash_register.html` in your browser to see the current version of our site.
* Make changes to the files in the `cash_register` subdirectory of your local repo:
  * Write your new helper functions in `my_utils.js`.
  * Add to `cash_register.js` to meet the goals below. Use the functions from your library!
* `git add` and `git commit` your changes as you go.  Remember to say what you did in your commit messages!
* `git push` to update the repo on your gitHub account.
* Submit the link to the `iterators_hmwk` repo on your gitHub account.

###Goals

* Use the iterators you've already built. Build new helper functions using your library (see below)!
* By the end of this homework you should have used: `myReduce`, `myMap`, and `myEach` at a minimum!


**Calucations**

1. Set SUBTOTAL to the sum of the prices.
2. Bonus: SALES TAX is 7.25%.
3. Bonus: TOTAL should reflect SUBTOTAL + SALES TAX.

**Formatting**

4. Sort(!) the receipt alphabetically.
5. Fix the random capitalization in titles.
6. If any line items is a refund, print "Contains Refund" somewhere on the receipt.
7. Returns / Refunds: If a number is negative, turn it red!

**Bonuses**

8. Zepplins are on sale! Filter(!) for "Zepplin" in the title and discount them 10%.
9. Coupons! Check to see if any of the coupons apply to the line items.
10. Super Bonus: Take a look at `cash_register.html`. See the commented out form element? Add it back in. Can you dynamically add items to the receipt?

### Helper Functions
Write your new helper functions in `cash_register/myUtils.js`.

* Create a helper function which takes in an HTML tag type and an inner HTML string and outputs an HTML element as a string.
    ```
        myUtils.buildElement("p", "Words words words")
        // "<p>Words words words</p>"
    ```

* Create a helper function which takes in a float and returns a currency amount (remove extra decimal places).
    ```
        myUtils.toDollarAmount(12.971)
        // 12.97
    ```

* Create a helper function which takes in a float and a currency symbol and returns a correctly formatted currency string.
    ```
        myUtils.toCurrencyString(12.971, "$")
        // $12.97

        myUtils.toCurrencyString(.97, "$")
        // $0.97
    ```

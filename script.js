$(function () {


    var budgetController = (function () {

        var x = 23;

        function add(a) {
            return a + x;
        }
        return {
            calculate: function (b) {
                console.log(add(b));
            }
        }

    })();

    var UIController = (function () {



    })();

    var AppController = (function (budgetCtrl, UICtrl) {

            //Some Code

    })(budgetController, UIControllers);

});

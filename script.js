$(function () {

    //Budget Controller
    var budgetController = (function () {

        var Expense = function (id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        };
        var Income = function (id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        };


        var data = {
            allItems: {
                exp: [],
                inc: []
            },
            totals: {
                exp: 0,
                inc: 0
            }
        }

        return {
            addItem: function (type, desc, value) {
                var newItem, ID;

                //Create new ID
                if (data.allItems[type].length == 0) {
                    ID = 0;
                } else {
                    ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                }
                //Create new Item base on 'inc' or 'exp' type
                if (type === 'exp') {
                    newItem = new Expense(ID, desc, value);
                } else if (type === 'inc') {
                    newItem = new Income(ID, desc, value);
                }

                //Push it into data structure
                data.allItems[type].push(newItem);

                //Return The elements
                return {
                    type: type,
                    object: newItem
                };
            }
        }
    })();


    //UI Controller
    var UIController = (function () {

        var DOMStrings = {
            inputType: $(".add__type"),
            inputDesc: $(".add__description"),
            inputValue: $(".add__value"),
            addBtn: $(".add__button"),
            incomeTable: $(".income__list"),
            expenseTable: $(".expense__list")
        }




        return {
            getInputs: function () {
                return {
                    desc: DOMStrings.inputDesc.val(),
                    type: DOMStrings.inputType.val(),
                    value: DOMStrings.inputValue.val()
                };
            },
            getDOMStrings: DOMStrings,

            setUI: function (newItem) {
                var itemDom, obj, type;
                obj = newItem.object;
                type = newItem.type;

                if (type === 'inc') {
                    itemDom = $('   <div class="item" id="income-1">  <div class="item__description">' + obj.description + '</div> <div class="right"> <div class="item__value">+' + obj.value + '</div> <div class="item__delete"> <button class="item__delete-btn"><i class="far fa-times-circle fa-lg"></i></button></div></div></div>');
                    DOMStrings.incomeTable.append(itemDom);
                } else if (type === 'exp') {

                    itemDom = $('<div class="item" id="expense-0"><div class="item__description">' + obj.description + '</div><div class="right"> <div class="item__value">-' + obj.value + '</div><div class="item__percentage">10%</div> <div class="item__delete"><button class="item__delete-btn"><i class="far fa-times-circle fa-lg"></i></button> </div> </div> </div>');
                    DOMStrings.expenseTable.append(itemDom);
                }
            }

        }


    })();


    //Global Controller
    var controller = (function (budgetCtrl, UICtrl) {

        var setUpEventListeners = function () {
            //Adding using click and enter event
            UICtrl.getDOMStrings.addBtn.click(ctrlAddItems);

            $(window).keypress(function (event) {

                if (event.keyCode == 13 || event.which == 13) {

                    ctrlAddItems();
                }

            });

        };

        var ctrlAddItems = function () {

            var input = UICtrl.getInputs();
            var newObject = budgetCtrl.addItem(input.type, input.desc, input.value);
            UICtrl.setUI(newObject);
        };


        return {

            init: function () {
                console.log("The appliction has started");

                setUpEventListeners();
            }

        }

    })(budgetController, UIController);


    controller.init();

});

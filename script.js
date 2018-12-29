$(function () {

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

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


        calculateTotal = function (type) {
            var sum = 0;

            data.allItems[type].forEach(function (current) {
                sum += current.value;
            });
            data.totals[type] = sum;

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
                /*      return {
                          type: type,
                          object: newItem
                      };
                */
                return newItem;
            },
            calculateBudget: function () {

                //calculate total income and expenses
              
                    calculateTotal('inc');
                    calculateTotal('exp');
                
                //calculate the budget inc-exp
                data.budget = data.totals.inc - data.totals.exp;

                //calculate the %ge of inc that we have spent
                if (data.totals.inc > 0) {
                    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                }

            },


            getBudget: function () {
                return {
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage
                }
            },
            deleteItem: function (type, id,val) {


                console.log(data.allItems);

                
                //Horrible mistakeXXXXX

              /*  if (type === 'inc') {
                    data.totals["inc"] = data.totals["inc"] - val;
                } else {
                    data.totals["exp"] = data.totals["exp"] - val;
                }*/
                
                //splice(position,number of items);
                
                data.allItems[type].forEach(function(current,index){
                    if(current.value == val){
                        data.allItems[type].splice(index,1);
                    }
                });
                
                console.log(data.allItems);
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
            expenseTable: $(".expense__list"),
            income: $('.budget__income--value'),
            expense: $('.budget__expenses--value'),
            budget: $('.budget__value'),
            percentage: $('.budget__expenses--percentage'),
            container: $('.container')
        }



        

        return {
            getInputs: function () {
                return {
                    desc: DOMStrings.inputDesc.val(),
                    type: DOMStrings.inputType.val(),
                    value: parseFloat(DOMStrings.inputValue.val())
                };
            },
            getDOMStrings: DOMStrings,

            setUI: function (newItem) {
                var itemDom, obj, type;
                obj = newItem.object;
                type = newItem.type;


            },

            addListItem: function (obj, type) {
                var itemDom, element;
                if (type === 'inc') {
                    element = DOMStrings.incomeTable;
                    itemDom = '   <div class="item" id="inc-%id%">  <div class="item__description">%description%</div> <div class="right"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete-btn"><i class="far fa-times-circle fa-lg"></i></button></div></div></div>';
                    //                    DOMStrings.incomeTable.append(itemDom);
                } else if (type === 'exp') {
                    element = DOMStrings.expenseTable;
                    itemDom = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div><div class="right"> <div class="item__value">%value%</div><div class="item__percentage">10%</div> <div class="item__delete"><button class="item__delete-btn"><i class="far fa-times-circle fa-lg"></i></button> </div> </div> </div>';
                    //                    DOMStrings.expenseTable.append(itemDom);
                }
                var newHtml = itemDom.replace("%id%", obj.id);
                newHtml = newHtml.replace("%description%", obj.description);
                newHtml = newHtml.replace("%value%", obj.value);
                element.append($(newHtml));
            },
            clearFieds: function () {
                DOMStrings.inputDesc.val("");
                DOMStrings.inputValue.val("");
                DOMStrings.inputDesc.focus();
            },
            dipalyBudget: function (budget) {
                DOMStrings.income.text("Rs. " + budget.totalInc);
                DOMStrings.budget.text("Rs. " + budget.budget);
                DOMStrings.expense.text("Rs. " + budget.totalExp);
                if (budget.percentage > 0 && budget.totalInc > budget.totalExp) {
                    DOMStrings.percentage.text(budget.percentage + "% ");
                } else {
                    DOMStrings.percentage.text("---");
                }
            },


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

            UICtrl.getDOMStrings.container.click(ctrlDeleteItems);
        };

        var updateBudget = function () {

            //calcuate Budget
            budgetCtrl.calculateBudget();

            //return the budget
            var budget = budgetCtrl.getBudget();

            //Display the budget to UI
            UICtrl.dipalyBudget(budget);
            // console.log(budget);
        };

        var ctrlAddItems = function () {
            //Get the input field data
            var input = UICtrl.getInputs();
            if (input.desc !== "" && input.value > 0) {

                //Add it to bdget controller
                var newObject = budgetCtrl.addItem(input.type, input.desc, input.value);

                //Add it to UI
                UICtrl.addListItem(newObject, input.type);

                //Clearing the input fields
                UICtrl.clearFieds();

                //Calculate and update budget
                updateBudget();
            }

        };

        var ctrlDeleteItems = function (event) {
            var itemId;
            itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if (itemId) {
                var type, id, val;
                type = itemId.split('-')[0];
                id = itemId.split('-')[1];
                val = parseFloat(event.target.parentNode.parentNode.parentNode.childNodes[1].innerHTML);
                //Delete from the data structure
                budgetCtrl.deleteItem(type,id,val);

                //Update the UI
                $("#" + itemId).remove();

                //Update the budget
                updateBudget();

            }
        }


        return {

            init: function () {
                console.log("The appliction has started");
                UICtrl.dipalyBudget({
                    budget: "00",
                    totalInc: "00",
                    totalExp: "00",
                    percentage: "---"
                });

                setUpEventListeners();
            }

        }

    })(budgetController, UIController);


    controller.init();


});

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
            this.percentage = -1;
        };

        Expense.prototype.calcPercentage = function (totalIncome) {
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            } else {
                this.percentage = -1;
            }
        };

        Expense.prototype.getPercentage = function () {

            return this.percentage;

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

            calculatePercentages: function () {
                /*  expense a = 10, b = 23, c = 45
                  totalIncome = 1000
                  percentagee a = 10/1000,b=23/1000....*/
                data.allItems.exp.forEach(function (current) {
                    current.calcPercentage(data.totals.inc);
                });

            },
            getpercentages: function () {
                var allpercentages = data.allItems.exp.map(function (cur) {
                    return cur.getPercentage();
                })

                return allpercentages;
            },
            getBudget: function () {
                return {
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage
                }
            },
            deleteItem: function (type, id, val) {

                //Horrible mistakeXXXXX

                /*  if (type === 'inc') {
                      data.totals["inc"] = data.totals["inc"] - val;
                  } else {
                      data.totals["exp"] = data.totals["exp"] - val;
                  }*/

                //splice(position,number of items);

                data.allItems[type].forEach(function (current, index) {
                    if (current.value == val) {
                        data.allItems[type].splice(index, 1);
                    }
                });

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
            container: $('.container'),
            expensesPercentages: $('.item__percentage'),
            month: $('.budget__title-month')
        }


        function formatNumbers(num, type) {
            var numSplit, integer, dec;
            //2310.645 = + 2,310.64
            num = Math.abs(num);
            num = num.toFixed(2);
            numSplit = num.split(".");
            integer = numSplit[0];
            dec = numSplit[1];
            if (integer.length > 3) {
                integer = integer.substr(0, integer.length - 3) + ',' + integer.substr(integer.length - 3, 3);
            }
            return (type === 'inc' ? '+' : "-") + " " + integer + '.' + dec;
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
                newHtml = newHtml.replace("%value%", formatNumbers(obj.value,type));
                element.append($(newHtml));
            },
            clearFieds: function () {
                DOMStrings.inputDesc.val("");
                DOMStrings.inputValue.val("");
                DOMStrings.inputDesc.focus();
            },
            dipalyBudget: function (budget) {
                
                var type;
                budget.budget > 0 ? type = "inc" : type = 'exp';
                DOMStrings.income.text("Rs. " + formatNumbers(budget.totalInc,"inc"));
                DOMStrings.budget.text("Rs. " + formatNumbers(budget.budget,type));
                DOMStrings.expense.text("Rs. " +formatNumbers(budget.totalExp,"exp"));
                
                if (budget.percentage > 0 && budget.totalInc > budget.totalExp) {
                    DOMStrings.percentage.text(budget.percentage + "% ");
                } else {
                    DOMStrings.percentage.text("---");
                }
                 
            },

            displayPercentages: function (percentages) {
                $('.item__percentage').each(function (i, obj) {
                    obj.innerHTML = percentages[i] + '%';
                });
            },
            displayMonth: function(){
                var now,year,month;
                now = new Date();
                year = now.getFullYear();
                DOMStrings.month.text(year);
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

        var updatepercentage = function () {
            // 1.Calculate the percentage

            budgetCtrl.calculatePercentages();

            // 2. Read the percenage from budget controller
            var percentages = budgetCtrl.getpercentages();

            // 3. Update the UI with new percentage
            UICtrl.displayPercentages(percentages);

        }
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

                //Calculate and update percentages
                updatepercentage();
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
                budgetCtrl.deleteItem(type, id, val);

                //Update the UI
                $("#" + itemId).remove();

                //Update the budget
                updateBudget();

                //Calculate and update percentages
                updatepercentage();
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
                
                UICtrl.displayMonth();
            }

        }

    })(budgetController, UIController);


    controller.init();


});

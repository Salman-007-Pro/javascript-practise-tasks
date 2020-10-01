let budgetController = (() => {
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    Expense.prototype.calPercent = function (totalInc) {
        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.percentage = -1;
        }
    }
    Expense.prototype.getPercent = function () {
        return this.percentage;
    }

    let calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach((current) => {
            sum += current.value;
        })
        data.totals[type] = sum;
    };
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    }
    return {
        addItem: (type, description, value) => {
            let newItem, Id;

            // creating unique Id here [1,2,3,6,8] next will be 9;
            if (data.allItems[type].length > 0) {
                Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                Id = 0;
            }

            if (type === "exp") {
                newItem = new Expense(Id, description, value);
            } else {
                newItem = new Income(Id, description, value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: () => {
            // calculate the Total income and Expense
            calculateTotal("exp");
            calculateTotal("inc");

            // calculate the total budget
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage income spend on a item
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },
        calPercentage: () => {
            data.allItems.exp.forEach((cur) => {
                cur.calPercent(data.totals.inc);
            });
        },
        getPercent: () => {
            let percent;
            percent = data.allItems.exp.map((cur) => {
                return cur.percentage;
            })
            return percent;
        },
        delItem: (type, id) => {
            let Ids;
            Ids = data.allItems[type].map((current) => {
                return current.id;
            })
            index = Ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        getBudget: () => {
            return {
                budget: data.budget,
                percentage: data.percentage,
                tInc: data.totals.inc,
                tExp: data.totals.exp,
            }
        },
        publicTest: () => {
            console.log(data);
        }
    }

})();
let UIController = (() => {
    let DomString = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        totalBudget: ".budget__value",
        totalIncome: ".budget__income--value",
        totalExpense: ".budget__expenses--value",
        totalPercentage: ".budget__expenses--percentage",
        budgetMonth: ".budget__title--month",
        expensePercentageLabel: ".item__percentage",
    };
    let numberFormatting = (num, type)=> {
        let dec, splitNum, int,i,str,k=1;
        num = Math.abs(num);
        num = num.toFixed(2);
        splitNum = num.split(".");
        int = splitNum[0];
        dec = splitNum[1];
        str = int.split("") //1,234,567
        if (int.length > 3) {
            for (i = int.length - 1; i >= 0; i--) {
                if (k % 3 == 0 && i!=0) {
                    str.splice(i, 0, ",");
                    k = 1;
                } else {
                    k++;
                }
            }
        }
        int=str;
        str="";
        for(i=0;i<int.length;i++){
            str+=int[i];
        }
        int=str;
        str="";
        return (type==="exp" ? "- " : "+ ") + int + "." + dec;
    }
    return {

        getInput: () => {
            return {
                type: $(DomString.inputType).val(), //get either exp or inc
                description: $(DomString.inputDescription).val(),
                value: parseFloat($(DomString.inputValue).val()),
            };
        },

        addlistItem: (obj, type) => {
            //creating components either of income or exp;
            if (type == "exp") {
                element = DomString.expenseContainer;
                html = `<div class="item clearfix" id="exp-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${numberFormatting(obj.value,type)}</div>
                    <div class="item__percentage">%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
                // ${Math.round((obj.value/allBudget.tInc)*100)+"%"}
            } else {
                element = DomString.incomeContainer;
                html = `<div class="item clearfix" id="inc-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${numberFormatting(obj.value,type)}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
            }
            $(element).append(html);
        },
        removeitem: (id) => {
            $("#" + id).remove();
            // let r=document.querySelector("#"+id);
            // r.parentNode.removeChild(r);
        },
        clearField: () => {
            // $(DomString.inputDescription+","+DomString.inputValue).val("");
            // $(DomString.inputDescription).focus();
            let clear = document.querySelectorAll(DomString.inputDescription + "," + DomString.inputValue);
            clear = Array.prototype.slice.call(clear);
            clear.forEach((current, index) => {
                current.value = "";
            });
        },

        addBudgetUI: (obj) => {
            if (obj.budget > 0) {
                $(DomString.totalBudget).html(numberFormatting(obj.budget,"inc"));
            } else {
                $(DomString.totalBudget).html(numberFormatting(obj.budget,"exp"));
            }
            $(DomString.totalIncome).html(numberFormatting(obj.tInc,"inc"));
            $(DomString.totalExpense).html(numberFormatting(obj.tExp,"exp"));
            if (obj.percentage > 0) {
                $(DomString.totalPercentage).html(obj.percentage + "%");
            } else {
                $(DomString.totalPercentage).html("---");
            }

        },
        updatePercentage: (percent) => {
            $(DomString.expensePercentageLabel).toArray().forEach((cur, index) => {
                if (percent[index] > 0) {
                    cur.textContent = percent[index] + "%";
                } else {
                    cur.textContent = "---";
                }
            });
            // arr.forEach((cur,index)=>{
            //     if(percent[index]>0){
            //         cur.textContent=percent[index]+"%";
            //     }else{
            //         cur.textContent="---";
            //     }
            // })
        },
        publicTest: () => {
            // numberFormatting(1234567.12, "");
            console.log("love you");
        },
        displayData: () => {
            let Months, data, mon, year;
            Months = {
                1: "January",
                2: "February",
                3: "March",
                4: "April",
                5: "May",
                6: "June",
                7: "July",
                8: "August",
                9: "September",
                10: "October",
                11: "November",
                12: "December",
            }
            data = new Date();
            mon = Months[data.getMonth() + 1];
            year = data.getFullYear();
            $(DomString.budgetMonth).html(mon + " " + year);
        },
        changeType:()=>{
            $(DomString.inputType+","+DomString.inputDescription+","+DomString.inputValue).toggleClass("red-focus");
            $(DomString.inputBtn).toggleClass("red");
        },
        getDomString: () => DomString,
    }
})();

let controller = ((budgetCtrl, UICtrl) => {

    let setupEventListener = () => {

        let Dom = UICtrl.getDomString();

        $(Dom.inputBtn).click(ctrlAddItem);
        $(Dom.inputType).change(UICtrl.changeType);

        $("html").keypress((e) => {
            if (e.keycode === 13 || e.which === 13) ctrlAddItem();
        });
        $(".container").click(ctrlDelItem);
    }
    let updateBudget = () => {
        let budget;
        // 1. Calculate the budget.
        budgetCtrl.calculateBudget();

        // 2. Return the budget.
        budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI.
        UICtrl.addBudgetUI(budget);
    }
    let updatePercentage = () => {
        let percentages;

        // 1. calculate the percentage
        budgetCtrl.calPercentage();

        // 2. get the percentage
        percentages = budgetCtrl.getPercent();

        // 3. display the percentage in UI
        UICtrl.updatePercentage(percentages);

    }
    let ctrlAddItem = () => {
        let input, newItem;
        // 1. get the field input data.
        input = UICtrl.getInput();
        if (input.description !== "" && input.value > 0 && !isNaN(input.value)) {
            // 2. add the item in the budgetController.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. add the item in the UIController.
            UICtrl.addlistItem(newItem, input.type);

            // 4. clean field
            UICtrl.clearField();

            // 5. Calculate and update budget.
            updateBudget();

            // 6. update the percentage of expenses
            updatePercentage();
        }

    }
    let ctrlDelItem = (event) => {
        let itemId, id, type, splitId;
        //identify the id
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split("-");
            type = splitId[0];
            id = parseInt(splitId[1]);
            // 1. delete the item from data structure
            budgetCtrl.delItem(type, id);

            // 2. delete the item from UI
            UICtrl.removeitem(itemId);

            // 3. update the budget
            updateBudget();

            //4. update the percentage of expenses
            updatePercentage();
        }
    }
    return {
        init: () => {
            console.log("Application has Started");
            setupEventListener();
            UICtrl.displayData();
            UICtrl.addBudgetUI({
                budget: 0,
                percentage: 0,
                tInc: 0,
                tExp: 0,
            });
        }
    }
})(budgetController, UIController);
controller.init(); // this is Starting a Applications
document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('keypress', event => {
        const key = event.key.toLowerCase();
        console.log(event.keyCode);
    });
});
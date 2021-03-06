$(document).ready(function (){

	var loans = [];

    
    var SECOND = 1000;
    var MINUITE = SECOND * 60;
    var HOUR = MINUITE * 60;
    var DAY = HOUR * 24;
    var WEEK = DAY * 7;
    var MONTH = DAY * 30;
    var YEAR = DAY * 365;

    var startTime = new Date().getTime();

    var moneyHistory = [];
    var creditHistory = [];

    var money = 0;
    var creditScore = 0;
    var moneyMulti = 1;
    var creditMulti = 1;

    var ASSETS = $('.assets');
    var TASKS = $('.tasks');
    var LOANS = $('.loans-table');

    moneyHistory.push({time: 0, money: money});
    creditHistory.push({time: 0, credit: creditScore});

    
    
    load();
    
    function load() {
       if (Cookies.get('money')) {
          money = parseInt(Cookies.get('money'));
          $("#balance").html("$"+money.toFixed(2));
       }
       else {
          addMoney(5000);

       }
    }
     addCredit(710);
     
    function save() {
       Cookies.remove('money');
       Cookies.set('money', money, { expires: 7 });
    }
    
   function bankrupt() {
        var temp;
        temp = loans.pop();
            while(temp) {
                temp.balance = 0;
                temp.payment = 0;
                temp.numPayments = 0;
                temp.makePayment();
                temp = loans.pop();
            }
        addCredit(-400);
        addMoney(-money);
   }

    function addMoney(delta) {
         
        money += delta * moneyMulti;
        $("#balance").html("$"+money.toFixed(2));
        var time = new Date().getTime() - startTime / 1000;
        moneyHistory.push({time: time, money: money});
        plotGraph(time);
        save();
    }
    function addCredit(delta) {
        creditScore += delta * creditMulti;
        if (creditScore > 850) creditScore = 849;
        if (creditScore < 300) creditScore = 301;
        $("#credit").html(creditScore.toFixed(2));
        var time = new Date().getTime() - startTime / 1000;
        creditHistory.push({time: time, creditScore: creditScore});
    }

    function moneyString(num){
        return "$" + num.toFixed(2);
    }
    function moneyHtml(num){
        return num.toFixed(2);
        //return "<p class='money'>$" + num.toFixed(2) + "</p>";
    }
    var totalLoans = 0;
    function getLoan(scale) {
       if (totalLoans >= creditScore/100.0) {
          
          
          return alert("Need better credit for more loans.");
       }
          
        var loanNames = ["Car", "House", "Food", "School"];
        totalLoans++;
        var name = loanNames[Math.floor(Math.random() * loanNames.length)];
        var dpr = 0.6 * ((1100-creditScore) / 1200) * Math.random();
        var amount = Math.ceil(Math.random() * scale + scale);

        var length = Math.floor(Math.random() * (MINUITE * 5) + MINUITE * 5);
        var numPayments = Math.floor(Math.random() * 20 + 5);
		addCredit(-30);
        var loan = new Loan(name, amount, length * numPayments, dpr, numPayments);

        return loan;
    }

    function getFormattedTime(input) {
        var seconds = Math.floor((input / SECOND) % 60);
        var minutes = Math.floor((input / MINUITE) % 60);
        var hours = Math.floor((input / HOUR) % 24);

        var days = Math.floor((input / DAY) % 7);
        var weeks = Math.floor((input / WEEK));

        var str = "";
        if (weeks > 0) {
            str += (weeks < 10 ? "0" : "") + weeks + ":";
        }
        if (days > 0 || weeks > 0) {
            str += (days < 10 ? "0" : "") + days + ":";
        }
        return str +=  (hours + ":" + (minutes < 10 ? "0" : "" ) + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);

    }

    function Loan(name, amount, length, dpr, numPayments, payment) {
        this.name = name + " #" + Math.round(Math.random()*100); // name of loan eg: "car loan"
        this.amount = amount;
        this.balance = amount;
        this.payment = payment = payment | 0;

        this.length = length;
        this.numPayments = numPayments;
        this.period = length / numPayments;
        this.dpr = dpr;

        this.draw = function(){
            if (!this.dom) {
                this.dom = $(" <div class='loan'>" +
                        "Loan " + this.name + " - Balance: <b class='balance'>$" + this.balance.toFixed(2) + "</b>"+
                        "<br>Payment amount: <b class='payment'>$" + this.payment.toFixed(2) + "</b>" +
                        "<br>APR: <b class='aprbitch'>" + (this.dpr*100).toFixed(3) + "</b>% - Payments left: <b class='paymentsLeft'>" + this.numPayments + "</b>"+
                        "<br>Time left until next payment: <h4 class='time-left'></h4>"+
                        "<button class='btn btn-inverse'>Make Payment</button></div>");


                this.button = this.dom.find('button');
                this.paymentDom = this.dom.find('.payment');
                this.balanceDom = this.dom.find('.balance');
                this.paymentsLeftDom = this.dom.find('.paymentsLeft');
                this.arpDom = this.dom.find('.aprbitch');
                this.countdown = this.dom.find('.time-left');

                this.button.click(this, function (me) {
                    me.data.makePayment.call(me.data);
                });

                this.domParent.prepend(this.dom);

                this.countdown.html(getFormattedTime(this.period));

            } else {
                this.paymentDom.html(this.payment.toFixed(2));
                this.balanceDom.html(this.balance.toFixed(2));
                this.paymentsLeftDom.html(this.numPayments);
                this.arpDom.html((this.dpr*100).toFixed(3));

            }
            var timeLeft = this.period;

            var interval = setInterval(function (me) {
                timeLeft -= SECOND;
                if (timeLeft <= 0)
                    timeLeft = 0;
                seconds = Math.floor((timeLeft / SECOND) % 60);
                minutes = Math.floor((timeLeft / MINUITE) % 60);
                hours = Math.floor((timeLeft / HOUR));

                me.countdown.html(getFormattedTime(timeLeft));

                if (timeLeft <= 0) {
                    clearInterval(interval);
                }
            }, SECOND, this);


        };

        this.destroy = function () {
            totalLoans--;
            this.done = true;
        };

        this.makePayment = function() {
            if (this.payment !== 0) {
                addMoney(-1 * this.payment);
                this.balance -= this.payment;
                this.payment = 0;
                this.paymentDom.html(Math.floor(this.payment));
                this.balanceDom.html(Math.floor(this.balance));

                this.button.addClass('disabled');
                addCredit( this.numPayments * 2 );
            }
            if (this.numPayments <= 1) {
                this.dom.remove();
                this.destroy.call(this);
            }
        };

        this.endOfPeriod = function () {
            if (this.payment !== 0) {
                this.balance += 1 + this.payment * this.dpr * this.period / DAY;

                addCredit(-1 * 50); //TODO ACTUALLY EFFECT SCORE

            }




            if (this.numPayments <= 1) {
                this.payment = this.balance;
            } else {
                this.payment = this.balance/ --this.numPayments;
            }
            this.nextPaymentDate = this.nextPaymentDate + this.period;

            this.draw.call(this);
            this.button.removeClass('disabled');

            setTimeout(function (me) {
                if (!me.done)
                    me.endOfPeriod.call(me);
            }, this.period, this); //TODO: change this to period

        };


        this.init = function (nextPaymentDate, domParent = LOANS) {
            this.nextPaymentDate = nextPaymentDate;
            this.domParent = domParent;

            addMoney(this.amount);
            addCredit(Math.random() * 50);
            //this.draw.call(this);
            //this.button.removeClass('disabled');
            //this.domParent.prepend(this.dom);

            //setTimeout(function (me) {
            //    me.endOfPeriod.call(me);
            //}, nextPaymentDate - (new Date()).getTime(), this);
            loans.push(this);

            this.endOfPeriod.call(this);

        };
    }


    function Task(name, time, rewardMoney, rewardCS, cost = 0,oneTime = false, skillReq = 0){
        this.name = name;
        this.skillReq = skillReq;
        this.oneTime = oneTime;

        this.time = time;

        this.rewardMoney = rewardMoney;
        this.rewardCS = rewardCS;

        this.running = false;
        this.isKill = false;
    }

    var initTask = function (domParent) {
        this.domParent = domParent;

        drawTask.call(this);
    };

    var destroyTask = function() {
        this.running = false;
        this.kill = true;
        this.dom.remove();
    };

    var completeTask = function() {
        this.running = false;
        addMoney(this.rewardMoney);
        addCredit(this.rewardCS);

        if (this.oneTime) {
            destroyTask.call(this);
        }
        this.button.removeClass('disabled');
    };

    var startTask = function() {
        if (!this.running) {
            var timeLeft = this.time;
            this.running = true;

            setTimeout(function(me) {
                completeTask.call(me);
            }, this.time, this);

            var countdown = this.countdown;

            var interval = setInterval(function (totalTime) {
                timeLeft -= 1000;
                var percent = 100*(totalTime - timeLeft)/totalTime;
                countdown.html(getFormattedTime(timeLeft) + "<br><div class=\"progress\">" +
                        "<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\""+ percent +"\"" +
                        "aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:"+ percent +"%\">    " +
                        "</div>" +
                        "</div>");
                timeLeft <= 0 && clearInterval(interval);
            }, 1000, this.time);

        }
        this.button.addClass('disabled');
    };

    var drawTask = function(){


        this.dom = $("<div class='task'>" +
                "<h3>" + this.name + "</h3>"+
                "<br>Time: <b class='completion-time'>" + getFormattedTime(this.time) + "</b>" +
                "<br>Profits: " + moneyHtml(this.rewardMoney) + 
                "<br>Time left: <h4 class='time-left'>"+getFormattedTime(this.time) +"</h4>"+
                "<button class='btn btn-inverse start-task'>Start</button></div>");

        this.button = this.dom.find('button');

        this.countdown = this.dom.find('.time-left');

        this.button.click(this, function (me) {
            startTask.call(me.data);
        });

        this.domParent.append(this.dom);
    };

    var inputDeductor = 0;

    var Asset = function (name, image, tasks, baseValue, minimumCredit, buffs) {
        this.name = name;
        this.image = image;
        this.tasks = tasks;
        this.baseValue = baseValue;
        this.minimumCredit = minimumCredit;
        this.inputDeductor = inputDeductor;
        this.buffs = buffs;
        this.price = baseValue + (baseValue * (0.1 - 0.1*(creditScore/850)));
    };

    var initAsset = function(storeAsset, parentDom, infoDom) {
        this.parentDom = parentDom;
        this.infoDom = infoDom;
        this.storeAsset = storeAsset;

        if (!this.storeAsset) {
            for (var i = 0; i < this.tasks.length; i++) {
                var task = this.tasks[i];
                initTask.call(task, $('.task-table'));
            }
        }
        drawAsset.call(this);
    };

    var sellAsset = function(parentSellDom) {
        if (!this.storeAsset) {
            for (var i = 0; i < this.tasks.length; i ++) {
                var task = this.tasks[i];
                destroyTask.call(task);
            }
            moneyMulti -= .05;
            creditMulti -= .02;
            addMoney(this.baseValue);
            addCredit(-10 * Math.random());

            this.dom.remove();
            initAsset.call(this, true, parentSellDom, this.infoDom);
        }
    };
    var buyAsset = function(parentBuyDom) {
        if (this.price > money) return alert("not enough money");
        if (creditScore < this.minimumCredit) return alert("not enough credit");
        if (this.storeAsset) {
            addMoney(-this.price);
            moneyMulti += .05;
            creditMulti += .02;
            // TODO INCREMENT THE CREDIT FUCKING SCORE
            addCredit(10 * Math.random());
            this.dom.remove();

            initAsset.call(this, false, parentBuyDom, this.infoDom);
        }
    };

    var lastDom;
    var drawAsset = function(){
        var tasksString = "";

        for (var i = 0; i < this.tasks.length; i++) {
            var task = this.tasks[i];
            tasksString += task.name + " ";
        }

        this.dom = $("<li><div class='asset'><div class='row'>" +
                "<h3>" + this.name + "</h3>" +
                "<button class='btn btn-inverse'>" + (this.storeAsset ?"Buy $":"Sell $") + moneyHtml(this.price)+ "</button>" +
                "</div></div></li>");

        this.dataDom = $("<div class='asset-information'><div class='row'>" +
                "<h2>" + this.name + "</h2>" +
                "<br><img class='assetImg' src = '" + this.image + "'>" + 
                "<br>Base Price: " + this.baseValue + 
                "<br>Activities: " + (tasksString ? tasksString : "None")+
                "</div></div>");

        this.button = this.dom.find('button');

        if (this.storeAsset) {
            this.button.click(this, function (me) {
                buyAsset.call(me.data, $('.owned-assets'));
            });
        } else {
            this.button.click(this, function (me) {
                sellAsset.call(me.data, $('.store-assets'));
            });
        }
        this.dom.click(this, function (me) {
            if (lastDom) lastDom.css("backgroundColor", "");
            me.data.dom.find('.asset').css("backgroundColor", "#c2c2c2");
            lastDom = me.data.dom.find('.asset');
            me.data.infoDom.empty();
            me.data.infoDom.append(me.data.dataDom);
        });

        this.parentDom.append(this.dom);
    };

    var ALL_TASKS = {
        basic: (function() {return new Task("Do chores", 5* MINUITE, 20, 0)}),

        petDog: (function() {return new Task("Pet the dog", MINUITE, 20, 0)}),
        petCat: (function() {return new Task("Pet the cat", YEAR, 20, 0)}),

        bnbApartment: (function() {return new Task("Air BNB Apartment", WEEK, 1000, 0)}),
        bnbHouse: (function() {return new Task("Air BNB Apartment", WEEK, 5000, 0)}),
        bnbMansion: (function() {return new Task("Air BNB Apartment", WEEK, 20000, 0)}),

        uber: (function() {return new Task("Uber", DAY, 200, 0)}),
        getMarried: (function() {return new Task("Uber", DAY, 200, 0)}),


        engineering: (function() {return new Task("Study Engineering", DAY, 200, 50,20000,true)}),
        construction: (function() {return new Task("Study Construction", DAY, 200, 50,10000,true)}),

    };

    // POPULATE ITEMS
    var ALL_ITEMS = [
        new Asset("Apartment", "./images/apartment.jpg", [ALL_TASKS.bnbApartment()], 30000, {}),
        new Asset("House", "./images/house.jpg", [ALL_TASKS.bnbHouse()], 150000, {}, 20),
        new Asset("Mansion", "./images/mansion.jpg", [ALL_TASKS.bnbMansion()], 150000, {}),

        new Asset("Bike", "./images/scooter.jpg", [], 60, {}),
        new Asset("Scooter", "./images/bike.jpg", [], 30, {}),
        new Asset("Car", "./images/car.jpg", [ALL_TASKS.uber()], 17000, {}),
        new Asset("Truck", "./images/truck.jpg", [ALL_TASKS.uber()], 15000, {}),

        new Asset("Propeller Plane", "./images/prop.jpg", [], 150000, {}),
        new Asset("747", "./images/plane.png", [], 30000000, {}),

        new Asset("Cat", "./images/cat.jpg", [ALL_TASKS.petCat()], 139, {}),
        new Asset("Dog", "./images/dog.jpg", [ALL_TASKS.petDog()], 340, {}, 10),

        new Asset("Computer", "./images/computer.jpg", [], 150000, {}, 5),

        new Asset("Wedding Ring", "./images/ring.jpg", [ALL_TASKS.getMarried()], 150000, {}, Math.random()*100 - 50),

        new Asset("Engineering Book", "./images/book.jpg", [ALL_TASKS.engineering()], 150000, {}),
        new Asset("Construction Book", "./images/book2.jpg", [ALL_TASKS.construction()], 150000, {}),


        new Asset("Stock A", "./images/stockA.png", [], 1000000, {}, 30),
        new Asset("Stock B", "./images/stockB.png", [], 2000000, {}, 30),
        new Asset("Stock C", "./images/stockC.png", [], 3000000, {}, 30),
        ];

    for (var i = 0; i < ALL_ITEMS.length; i ++) {
        var asset = ALL_ITEMS[i];
        initAsset.call(asset, 1, $('.store-assets'), $('.asset-info'));
    }

    var SELECTED_TASKS = [ALL_TASKS.basic()];

    for (var i = 0; i < SELECTED_TASKS.length; i ++) {
        var task = SELECTED_TASKS[i];
        initTask.call(task, $('.task-table'));
    }
    var go = function(score, type, action) {

        var data = [];
        data["score"] = score;
        data["event"] = [];
        data["event"][type] = action;

        if (0 == 0){
            $.ajax({
                dataType: "json",
                contentType: "application/json",
                url: "http://ec2-52-53-177-180.us-west-1.compute.amazonaws.com/score-simulator/scoresim/simulateScore",
                type: "POST",
                data,
                success: function(res) { console.log(res.score);  },
                error:   function(res) { console.warn(res); }
            });
        }
        else
            credit += 0;
    };

    $('#tabs').tab();
    $(".apply-small").click(function() {
        var loan = getLoan(10);
        loan.init.call(loan, (new Date()).getTime() + 1000, $(".loans-table"));
    });
    $(".apply-medium").click(function() {
        var loan = getLoan(100);
        loan.init.call(loan, (new Date()).getTime() + 1000, $(".loans-table"));
    });
    $(".apply-large").click(function() {
        var loan = getLoan(1000);
        loan.init.call(loan, (new Date()).getTime() + 1000, $(".loans-table"));
    });
    $(".apply-x-large").click(function() {
        var loan = getLoan(10000);
        loan.init.call(loan, (new Date()).getTime() + 1000, $(".loans-table"));
    });
    $(".apply-danger").click(function() {
        bankrupt();
    });
});

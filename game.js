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

var money = 5000;
var creditScore = 500;

var ASSETS = $('.assets');
var TASKS = $('.tasks');
var LOANS = $('.loans');

moneyHistory.push({time: 0, money: money});
creditHistory.push({time: 0, credit: creditScore});


function updateStats() {
    $(".money").html(money.toFixed(2));
    $(".credit").html(creditScore.toFixed(2));

    var time = new Date().getTime() - startTime / 10000;
    moneyHistory.push({time: time, money: money});
    creditHistory.push({time: time, credit: creditScore});
}


function addMoney(delta) {
    money += delta;
    $(".money").html(money.toFixed(2));
    var time = new Date().getTime() - startTime / 10000;
    moneyHistory.push({time: time, money: money});
}
function addCredit(delta) {
    credit += delta;
    $(".credit").html(credit.toFixed(2));
    var time = new Date().getTime() - startTime / 10000;
    creditHistory.push({time: time, credit: credit});
}

function moneyString(num){
    return "$" + num.toFixed(2);
}
function moneyHtml(num){
    return "<p class='money'>$" + num.toFixed(2) + "</p>";
}

function getLoan(scale) {
    var loanNames = ["Car", "House", "Food", "School"];

    var name = loanNames[Math.floor(Math.random() * loanNames.length)];
    var dpr = 0.4 * ((1000-creditScore) / 1000) * Math.random();
    var amount = Math.ceil(Math.random() * scale + scale);

    var length = Math.floor(Math.random() * (MINUITE * 5) + SECOND * 5);
    var numPayments = Math.floor(Math.random() * 20 + 5);

    var loan = new Loan(name, amount, length, dpr, numPayments);
    console.log(loan);

    return loan;
}

function Occupation() {

}


function Loan(name, amount, length, dpr, numPayments, payment) {
    console.log("[LOAN] creating loan");
    money += amount;

    this.name = name; // name of loan eg: "car loan"
    this.amount = amount;
    this.balance = amount;
    this.payment = payment = payment | 0;

    this.length = length;
    this.numPayments = numPayments;
    this.period = length / numPayments;
    this.dpr = dpr;

    this.draw = function(){
        this.dom = $(" <div class='loan'>" +
                "Loan " + this.name + " - Balance: <b class='balance'>" + this.balance + "</b>"+
                "<br>Payment amount: <b class='payment'>" + Math.floor(this.payment) + "</b>" +
                "<br>APR: " + (this.dpr*100).toFixed(3) + "% - Payments left: " + this.numPayments +
                "<br>Time left until next payment: <h4 class='time-left'></h4>"+
                "<button class='btn btn-inverse'>Make Payment</button></div>" +
                "");

        this.button = this.dom.find('button');
        this.paymentDom = this.dom.find('.payment');
        this.balanceDom = this.dom.find('.balance');

        var timeLeft = this.period;
        var countdown = this.dom.find('.time-left');
		var seconds = Math.floor((timeLeft / SECOND) % 60);
        var minutes = Math.floor((timeLeft / MINUITE) % 60);
        var hours = Math.floor((timeLeft / HOUR) % 24);

        countdown.html(hours + ":" + (minutes < 10 ? "0" : "" ) + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
        var interval = setInterval(function () {
			timeLeft -= SECOND;
			if (timeLeft <= 0)
				timeLeft = 0;
            seconds = Math.floor((timeLeft / SECOND) % 60);
            minutes = Math.floor((timeLeft / MINUITE) % 60);
            hours = Math.floor((timeLeft / HOUR) % 24);

            countdown.html(hours + ":" + (minutes < 10 ? "0" : "" ) + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
            
            if (timeLeft <= 0) {
				
				clearInterval(interval);
				
			}
        }, SECOND);


        this.button.click(this, function (me) {
            me.data.makePayment.call(me.data);
        });

    };

    this.destroy = function () {
        console.log("[LOAN] destroying loan " + this.name);
        this.done = true;
    };

    this.makePayment = function() {
        if (this.payment !== 0) {
            money -= this.payment;
            updateStats();
            this.balance -= this.payment;
            this.payment = 0;
            this.paymentDom.html(Math.floor(this.payment));
            this.balanceDom.html(Math.floor(this.balance));

            this.button.addClass('disabled');
        }
        if (this.numPayments <= 1) {
            this.dom.remove();
            this.destroy.call(this);
        }
    };

    this.endOfPeriod = function () {
        if (this.payment !== 0) {
            this.balance += this.payment * this.dpr * this.period / DAY;
            addCredit( -100); //TODO ACTUALLY EFFECT SCORE
            updateStats();
        }

        if (this.numPayments <= 1) {
            this.payment = this.balance;
        } else {
            this.payment = this.balance/ --this.numPayments;
        }
		console.log("here");
        this.nextPaymentDate = this.nextPaymentDate + this.period;

        if (this.dom)
            this.dom.remove();
        this.draw.call(this);
        this.button.removeClass('disabled');
        this.domParent.prepend(this.dom);

        setTimeout(function (me) {
            if (!me.done)
                me.endOfPeriod.call(me);
        }, this.period, this); //TODO: change this to period

    };


    this.init = function (nextPaymentDate, domParent = LOANS) {
        this.nextPaymentDate = nextPaymentDate;
        this.domParent = domParent;

        //this.draw.call(this);
        //this.button.removeClass('disabled');
        //this.domParent.prepend(this.dom);

        //setTimeout(function (me) {
        //    me.endOfPeriod.call(me);
        //}, nextPaymentDate - (new Date()).getTime(), this);
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
}

var initTask = function (nextPaymentDate, domParent = TASKS) {
    this.nextPaymentDate = nextPaymentDate;
    this.domParent = domParent;
};


var destroyTask = function() {
    this.complete = true;
    this.dom.remove();
};

var completeTask = function() {
    this.running = false;
    addMoney(this.rewardMoney);
    addCredit(this.rewardCS);

    if (oneTime) {
        this.destroyTask();
    }
};

var startTask = function() {
    if (!this.running) {
        var timeLeft = this.time;
        this.running = true;

        setTimeout(function(me) {
            me.completeTask.call(me);
        }, this.time, this);

        var interval = setInterval(function () {
            var seconds = Math.floor((timeLeft / SECOND) % 60);
            var minutes = Math.floor((timeLeft / MINUITE) % 60);
            var hours = Math.floor((timeLeft / HOUR) % 24);

            this.countdown.html(hours + ":" + minutes + ":" + seconds);
            timeLeft -= 10;
            timeLeft <= 0 && clearInterval(interval);
        }, 1000);

    } else {
        this.disableButton.call(this);
    }
};


var drawTask = function(){
    this.dom = $(" <div class='task'>" +
            "<h3>" + this.name + "</h3>"+
            "<br>Time: <b class='completion-time'>" + Math.floor(this.time) + "</b>" +
            "<br>Profits: " + moneyHtml(this.rewardMoney) + 
            "<br>Time left: <h4 class='time-left'></h4>"+
            "<button class='btn btn-inverse start-task'>Start</button></div>" +
            "");

    this.button = this.dom.find('button');

    this.countdown = this.dom.find('.time-left');

    this.button.click(this, function (me) {
        me.data.startTask.call(me.data);
    });

    this.disableButton = function () {
        this.button.addClass('disabled');
    };
    this.enableButton = function () {
        this.button.removeClass('disabled');
    };
};

var inputDeductor = 0;

var Asset = function (name, image, tasks, baseValue, minimumCredit, buffs) {
    this.name = name;
    this.image = image;
    this.tasks = tasks;
    this.baseValue = baseValue;
    this.minimumCredit = minimumCredit;
    this.inputDeductor = inputDeductor;

    this.price = baseValue + (baseValue * (0.1 - 0.1*(creditScore/850)));
};

function initAsset(storeAsset, parentDom, infoDom) {
    this.parentDom = parentDom;
    this.infoDom = infoDom;

    if (!storeAsset) {
        for (var task in this.tasks) {
            initTask.call(task);
        }
    }
    drawAsset.call(this);

}

function destroyAsset() {
    for (var task in this.tasks) {
        destroyTask.call(task);
    }
    addMoney(this.value);
}


var drawAsset = function(){
    var tasksString = "";
    for (var task in this.tasks) {
        tasksString += task.name + " ";
    }
    console.log("tasks String" + this.price);

    this.dom = $("<li><div class='asset'><div class='row'>" +
            "<h3>" + this.name + "</h3><br>" +
            "<br>Created Tasks: <p class='tasks'>" + tasksString + "</b><br>" +
            "<br>Liquidation Price: <h4 class='time-left'></h4>"+
            "<button class='btn btn-inverse'>Liquidate " + moneyHtml(this.price)+ "</button>" +
            "</div></div></li>");

    this.dataDom = $("<div class='asset'><div class='row'>" +
            "<h3>" + this.name + "</h3><br>" +
            "<br>Created Tasks: <p class='tasks'>" + tasksString + "</b><br>" +
            "<br>Liquidation Price: <h4 class='time-left'></h4>"+
            "<button class='btn btn-inverse'>Liquidate " + moneyHtml(this.price)+ "</button>" +
            "</div></div>");

    this.button = this.dom.find('button');

    this.button.click(this, function (me) {
        me.data.destroyAsset.call(me.data);
    });
    this.dom.click(this, function (me) {
        console.log("CLICKED");
        me.data.infoDom.empty();
        me.data.infoDom.append(me.data.dataDom);
    });

    this.parentDom.append(this.dom);
};

var ALL_TASKS = {

	basic: new Task("Do chores", DAY, 20, 0),

    bnbApartment: new Task("Air BNB Apartment", WEEK, 1000, 0),
    bnbHouse: new Task("Air BNB House", WEEK, 5000, 0), 
    bnbMansion: new Task("Air BNB Mansion", WEEK, 20000, 0), 

    uber: new Task("Uber", DAY, 200, 0), 

    getMarried: new Task("Get Married", YEAR, 0, 0, 1000),  //TODO adjust credit
};

// POPULATE ITEMS
var ALL_ITEMS = [
    new Asset("Apartment", "./apartment.jpg", [ALL_TASKS.bnbApartment], 30000, {}),
    new Asset("House", "./house.jpg", [ALL_TASKS.bnbHouse], 150000, {}),
    new Asset("Mansion", "./mansion.jpg", [ALL_TASKS.bnbMansion], 150000, {}),

    new Asset("Bike", "./mansion.jpg", [], 150000, {}),
    new Asset("Scooter", "./mansion.jpg", [], 150000, {}),
    new Asset("Car", "./mansion.jpg", [ALL_TASKS.uber], 150000, {}),
    new Asset("Truck", "./mansion.jpg", [ALL_TASKS.uber], 150000, {}),

    new Asset("Propeller Plane", "./mansion.jpg", [], 150000, {}),
    new Asset("747", "./mansion.jpg", [], 150000, {}),

    new Asset("Cat", "./mansion.jpg", [], 150000, {}),
    new Asset("Dog", "./mansion.jpg", [], 150000, {}),

    new Asset("Computer", "./mansion.jpg", [], 150000, {}),

    new Asset("Wedding Ring", "./mansion.jpg", [ALL_TASKS.getMarried], 150000, {}),

    new Asset("Engineering Book", "./mansion.jpg", [], 150000, {}),
    new Asset("Construction Book", "./mansion.jpg", [], 150000, {}),

    new Asset("Mic", "./mansion.jpg", [], 150000, {}),
    ];

for (var i = 0; i < ALL_ITEMS.length; i ++) {
    var asset = ALL_ITEMS[i];
    initAsset.call(asset, 1, $('.store'), $('.asset-info-filler'));
}

updateStats();


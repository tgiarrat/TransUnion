var SECOND = 1000;
var MINUITE = SECOND * 60;
var HOUR = MINUITE * 60;
var DAY = HOUR * 24;

var startTime = new Date().getTime();

var moneyHistory = [];
var creditHistory = [];

var money = 5000;
var creditScore = 500;


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

    var length = Math.floor(Math.random() * (DAY * 5) + DAY);
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
        this.dom = $("<li><div class='loan'><div class='row'><div class='col-xs-8'>" +
                "Loan " + this.name + " - Balance: <b class='balance'>" + this.balance + "</b>"+
                "<br>Payment amount: <b class='payment'>" + Math.floor(this.payment) + "</b>" +
                "<br>APR: " + (this.dpr*100).toFixed(3) + "% - Payments left: " + this.numPayments +
                "<br>Time left until next payment: <h4 class='time-left'></h4>"+
                "</div><div class='col-xs-4'><button class='btn btn-inverse'>Make Payment</button>" +
                "</div></div></div></li>");

        this.button = this.dom.find('button');
        this.paymentDom = this.dom.find('.payment');
        this.balanceDom = this.dom.find('.balance');

        var timeLeft = this.period;
        var countdown = this.dom.find('.time-left');

        var interval = setInterval(function () {
            var seconds = Math.floor((timeLeft / SECOND) % 60);
            var minutes = Math.floor((timeLeft / MINUITE) % 60);
            var hours = Math.floor((timeLeft / HOUR) % 24);

            countdown.html(hours + ":" + minutes + ":" + seconds);
            timeLeft -= 10;
            timeLeft <= 0 && clearInterval(interval);
        }, 11);


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
            this.balance += this.payment * this.dpr * this.period / 1000;
            creditScore -= 100; //TODO ACTUALLY EFFECT SCORE
            updateStats();
        }

        if (this.numPayments <= 1) {
            this.payment = this.balance;
        } else {
            this.payment = this.balance/ --this.numPayments;
        }

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


    this.init = function (nextPaymentDate, domParent) {
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


function Task(time, rewardMoney, rewardCS, cost = 0,oneTime = false, skillReq = 0){
    this.skillReq = skillReq;
    this.oneTime = oneTime;

    this.time = time;

    this.rewardMoney = rewardMoney;
    this.rewardCS = rewardCS;

    this.running = false;
}

var initTask = function (nextPaymentDate, domParent) {
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
        }, 11);

    } else {
        this.disableButton.call(this);
    }
};


var drawTask = function(){
    this.dom = $("<li><div class='task'><div class='row'>" +
            "<h3>" + this.name + "</h3><br>" +
            "Payout: <b class='reward'>" + Math.floor(this.reward) + "</b><br>" +
            "Comletion time: <b class='completion-time'> " + Math.floor(this.time) + "</b><br>"+
            "<br>Time left until next payment: <h4 class='time-left'></h4>"+
            "<button class='btn btn-inverse'>Make Payment</button>" +
            "</div></div></li>");

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

function Asset(name, tasks, value, buffs) {
    this.name = name;
    this.tasks = tasks;
    this.value = value;
    this.inputDeductor = inputDeductor;

}

function initAsset(parentDom) {
    this.parentDom = parentDom;

    for (var task in this.tasks) {
        initTask.call(task);
    }
}

function destroyAsset() {
    for (var task in this.tasks) {
        destroyTask.call(task);
    }
    addMoney(this.value);
}


var drawAsset = function(){
    var tasksString = "";
    for (var task in tasks) {
        taskString += task.name + " ";
    }

    this.dom = $("<li><div class='asset'><div class='row'>" +
            "<h3>" + this.name + "</h3><br>" +
            "<br>Created Tasks: <p class='tasks'>" + taskString + "</b><br>" +
            "<br>Liquidation Price: <h4 class='time-left'></h4>"+
            "<button class='btn btn-inverse'>Liquidate " +moneyHtml(this.value)+ "</button>" +
            "</div></div></li>");

    this.button = this.dom.find('button');

    this.button.click(this, function (me) {
        me.data.destroyAsset.call(me.data);
    });
};

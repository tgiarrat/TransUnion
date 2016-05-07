var SECOND = 1000;
var MINUITE = SECOND * 60;
var HOUR = MINUITE * 60;
var DAY = HOUR * 24;

var money = 5000;
var creditScore = 500;

//getPossibleLoans();


function getLoan() {
    var loanNames = ["Car", "House", "Food", "School"];

    var name = loanNames[Math.floor(Math.random() * loanNames.length)];
    var dpr = 0.4 * ((1000-creditScore) / 1000) * Math.random();
    var amount = Math.ceil(Math.pow(10, Math.random() * 6 + 2) * Math.random());

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

    this.init = function (nextPaymentDate, domParent) {
        this.nextPaymentDate = nextPaymentDate;
        this.domParent = domParent;


        this.draw.call(this);
        this.domParent.append(this.dom);

        setTimeout(function (me) {
            me.endOfPeriod.call(me);
        }, nextPaymentDate - (new Date()).getTime(), this);

        updateStats();
    };

    this.draw = function(){
        var d = new Date(this.nextPaymentDate);
        var month = d.getMonth()+1;
        var date = d.getDate()+"-"+month+"-"+d.getFullYear();
        this.dom = $("<li><div class='loan'><div class='row'><div class='col-md-8'>" +
                "Loan " + this.name + " - Balance: " + this.balance +
                "<br>Payment amount: " + this.payment + " - Due: " + date +
                "<br>APR: " + (this.dpr*100).toFixed(3) + "% - Payments left: " + this.numPayments +
                "<br></div><div class='col-md-4'><button class='btn btn-primary'>Make Payment</button>" +
                "</div></div></div></li>");

    };

    this.destroy = function () {
        console.log("[LOAN] destroying loan " + this.name);
    };

    this.makePayment = function() {
        if (payment !== 0 && money >= payment) {
            money -= payment;
            balance -= payment;
            payment = 0;
        } else {
            alert("already payed for this cycle");
        }
    };

    this.endOfPeriod = function () {
        if (this.payment !== 0) {
            this.balance += this.payment * this.dpr * this.period / 1000; // TODO: convert to days
            // hurt their credit score
        }

        if (this.numPayments <= 1) {
            this.payment = this.balance;
        } else {
            this.payment = this.balance/ --this.numPayments;
        }

        this.nextPaymentDate = this.nextPaymentDate + this.period;

        this.draw.call(this);

        setTimeout(function (me) {
            me.endOfPeriod.call(me);
        }, 1000, this);

    };
}


function Task(parentDom, time, rewardMoney, rewardCS, cost = 0,oneTime = false, skillReq = 0){
    this.parentDom = parentDom;
    this.skillReq = skillReq;
    this.oneTime = oneTime;
    this.time = time;
    this.rewardMoney = rewardMoney;
    this.rewardCS = rewardCS;
    this.running = false;

    this.init = function (nextPaymentDate, domParent) {
        this.nextPaymentDate = nextPaymentDate;
        this.domParent = domParent;

        this.dom = $("<li><div>name:"+this.name+" amount: "+ this.amount+ "</div></li>");

        this.domParent.append(this.dom);


        setTimeout(function (me) {
            me.endOfPeriod.call(me);
        }, nextPaymentDate - (new Date()).getTime(), this);
    };

    this.init = function() {
        //show self
    };

    this.start = function() {
        if (!this.running) {
            money -= this.cost;
            this.running = true;
            setTimeout(this.time, this.end);
        }
    };

    this.end = function(){
        money += rewardMoney();
        rewardCS.go();
        if (oneTime)
        {
            //hide myself
        }

        this.running = false;
    };
}


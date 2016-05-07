function Loan(name, amount, length, dpr, numPayments, payment) {
    console.log("[LOAN] creating loan");

    this.name = name; // name of loan eg: "car loan"
    this.amount = amount;
    this.balance = amount;
    this.payment = payment = payment | 0;

    this.length = length;
    this.numPayments = numPayments;
    this.period = length / numPayments;
    this.dpr = dpr;
    
    this.draw = function(){
        this.dom = $("<li><div>" +
                             "Loan " + name + " - Balance: " + balance +
                             "<br>Payment amount: " + payment + " - Due: " + endTime +
                             "<br>APR: " + dpr + " - Payments left: " + numPayments +
                             "<br><button onclick=\"makePayment();\">Make Payment<button>" +
                             "</div></li>");
    }
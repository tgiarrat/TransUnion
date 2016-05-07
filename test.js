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
    
<<<<<<< HEAD
    this.draw = function(){
        this.dom = $("<li><div>" +
                             "Loan " + name + " - Balance: " + balance +
                             "<br>Payment amount: " + payment + " - Due: " + endTime +
                             "<br>APR: " + dpr + " - Payments left: " + numPayments +
                             "<br><button onclick=\"makePayment();\">Make Payment<button>" +
                             "</div></li>");
    }
=======
    this.go = function() {
        if (creditDelta == 0){
            $.ajax({
                dataType: "json",
                contentType: "application/json",
                url: "http://ec2-52-53-177-180.us-west-1.compute.amazonaws.com/score-simulator/scoresim/simulateScore",
                type: "POST",
                data: {
                    "score": score,
                    "event": {
                        this.type : this.action
                    }
                },
                success: function(res) { score = res.score;  },
                error:   function(res) { console.warn(res); }
            });
        }
        else
            credit += creditDelta;
    }
}
>>>>>>> 962d00eb67d97945e8fcf6a0b6002aab5db38b95

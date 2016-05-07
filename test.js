function Task(parentDom, time, rewardMoney, rewardCS, cost = 0,oneTime = false, skillReq = 0){
    this.parentDom = parentDom;
    this.skillReq = skillReq;
    this.oneTime = oneTime;
    this.time = time;
    this.rewardMoney = rewardMoney;
    this.rewardCS = rewardCS;
    this.running = false;
    
    this.init = function() {
        //show self
    }
    
    this.start = function() {
        if (!this.running) {
            money -= this.cost;
            this.running = true;
            setTimeout(this.time, this.end);
        }
    }
    this.end = function(){
        money += rewardMoney();
        rewardCS.go();
        if (oneTime)
        {
            //hide myself
        }
        
        this.running = false;
    }
}

function creditUpdate(type, action, creditDelta = 0)
{
    this.type = type;
    this.action = action;
    
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

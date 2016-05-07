

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
}
go(700, "bankruptcy", "BANKRUPT");
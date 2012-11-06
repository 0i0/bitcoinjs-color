//order based input merge by output


function orderBasedInputMergeByOutput(tx){
	var orderedTx = {out:[]}
  	, apetite = 0
    , tasted = 0
    , eaten = 0

  for (var j = 0, n = tx.out.length; i < n ; ++ i){
    apetite = tx.out[j].amount
    eaten = 0;
    var out = 
    	{toAddr : tx.out[j].toAddr
			,value : apetite
			,prev_inputs : []
    	}
    while (eaten < apetite && tasted < tx.in.length){
      eaten += tx.in[tasted].amount;
      out.prev_inputs.push(tx.in[tasted]);
      ++tasted;
    }
  }
	return orderedTx;
}

function getColor(input){
	color = getByDefenition(prev_tx,sourceAddr);
	if (color != 'unknown')
		return color;
	orderedTx = colorTx(prev_tx);
	while(orderedTx.out.length>0){
		out = orderedTx.out.shift();
		if (out.toAddr == sourceAddr){
			color = out.color;
			break;
		}
	}
	return color;
}

function getColors(inputs){
	for (var i = inputs.length - 1; i >= 0; i--) {
		inputs[i].color = getColor(inputs[i]);
	}
}

function mixColors(colors){
	outColor = 'undefined';
	do{
		color = colors.shift();
		if (color != outColor && outColor != 'undefined'){
			color = 'mixed';
			break;
		}
		outColor = prevInputColor;
	} while (colors.length > 0);
	return outColor;
}

function getTx(txId){
	xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3333/json/tx/'+txId, true);
  xhr.onreadystatechange = function(e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
    	debugger;
      var data = JSON.parse(xhr.responseText);
      return data;
    }
  }
  };
  xhr.send(null);
}

function colorTx(txId){
	var tx = getTx(txId);
	var orderedTx = orderBasedInputMergeByOutput(tx);
	for (var i in orderedTx.out.length){
		var inputcolors = getColors(orderedTx.out[i].prev_inputs);
		var color = mixColors(inputcolors);
		orderedTx.out[i].color = color;
	}
	return orderedTx;
}

var colored = colorTx('d10d7127366229b341a559ddf83b53b9ac6c1b2ca792cb2e81edaf7a595d763b');
console.log(colored);
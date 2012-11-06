//order based input merge by output

function getByDefenition(prev_tx, sourceAddr){
	if (
	prev_tx == "81a39c41ca946d72e8b5de8ba61bbba085252a2b10f075dc1ca8d4118df4981e"
  && sourceAddr == "1GPwJvMpB4vJPuMwHs9JDAZm9Lh66Y2qnS"
	)
		return 'g'
	else
		return 'unknown'
}

function orderBasedInputMergeByOutput(tx,callback){
	var orderedTx = {out:[]}
  	, apetite = 0
    , tasted = 0
    , eaten = 0
    , err = 'none'

  for (var j = 0, n = tx.out.length; j < n ; ++ j){
    apetite = parseFloat(tx.out[j].value)
    eaten = 0;
    var out = 
    	{toAddr : tx.out[j].toAddr
			,value : apetite
			,prev_inputs : []
    	}
    while (eaten < apetite && tasted < tx.in.length){
      eaten += parseFloat(tx.in[tasted].value);
      out.prev_inputs.push(tx.in[tasted]);
      ++tasted;
    }
    orderedTx.out.push(out)
  }
	callback(err, orderedTx);
}

function getColor(input){
	if (input.type == 'coinBase') 
		return 'default'
	color = getByDefenition(input.prev_tx,input.sourceAddr);
	if (color != 'unknown')
	console.log('coloring tx: ' + input.prev_tx)
	orderedTx = colorTx(input.prev_tx);
	while(orderedTx.out.length>0){
		debugger;
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

function getTx(txId,callback){
	xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3333/json/tx/'+txId, true);
  xhr.onreadystatechange = function(e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      var err = "none"
      console.log('grabbed: ' + data.hash)
      return callback(err,data);
    }
  }
  };
  xhr.send(null);
}

function colorTx(txId){
	return getTx(txId,
		function(err, tx){
			return orderBasedInputMergeByOutput(tx,function(err,orderedTx){
				for (var i = 0 , n = orderedTx.out.length; i < n; i++){
					var inputcolors = getColors(orderedTx.out[i].prev_inputs);
					var color = mixColors(inputcolors);
					orderedTx.out[i].color = color;
				}
				return orderedTx;
			})
		}
	)
}

var colored = colorTx('bf2bd6aefa3263988ac27fc1dc5be0e646143363031dc0976f971a73f7a64931');
console.log(colored);
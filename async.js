//order based input merge by output
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function mixColors(colors){
	console.log('14: mixColors starting [colors]', colors);
  
  outColor = 'undefined';
	do{
		color = colors.shift();
		if (color != outColor && outColor != 'undefined'){
			color = 'mixed';
			break;
		}
    // outColor = prevInputColor;
		outColor = color;
	} while (colors.length > 0);
	
  console.log('14: mixColors result [outColor]', outColor);
  return outColor;
}

function getByDefinition(prev_tx, sourceAddr){
  // console.log('12: getByDefinition [prev_tx], [sourceAddr]', prev_tx, sourceAddr);
  // testing 81a39c41ca946d72e8b5de8ba61bbba085252a2b10f075dc1ca8d4118df4981e as color definition for d10d7127366229b341a559ddf83b53b9ac6c1b2ca792cb2e81edaf7a595d763b tx
	if (
	  prev_tx == "81a39c41ca946d72e8b5de8ba61bbba085252a2b10f075dc1ca8d4118df4981e"
    && sourceAddr == "1GPwJvMpB4vJPuMwHs9JDAZm9Lh66Y2qnS"
	)
		return 'g';
	else
		return 'unknown';
}

function getColor(input){
  // console.log('11: getColor [input]', input);
  if (input.type == 'coinBase') 
		return 'default';
	
    console.log('13: getColor [color]', input);
  color = getByDefinition(input.prev_tx,input.sourceAddr);
  console.log('13: getColor [color]', color);
	
  if (color != 'unknown') {
    // console.log('coloring tx: ' + input.prev_tx);
	  console.log('13: coloring tx: ' + input.prev_tx);
    orderedTx = colorTx(input.prev_tx);
	  console.log('13: [orderedTx]: ', orderedTx);
	      // 
	     //     while(orderedTx.out.length>0){
	     //      debugger;
	     //      out = orderedTx.out.shift();
	     //      if (out.toAddr == sourceAddr){
	     //        color = out.color;
	     //        break;
	     //      }
	     // }
  }
  return color;
}

function getColors(inputs){
  var inputs_colors = [];
  
	for (var i = inputs.length - 1; i >= 0; i--) {
    // console.log('10: getColors [input i]:', i);
    inputs[i].color = getColor(inputs[i]);
    inputs_colors.push(inputs[i].color);
    // console.log('10: inputs[i].color:', inputs[i].color);
	}
	return inputs_colors;
}

function setOrderedTxColors(err,orderedTx){
  // console.log('8: setOrderedTxColors [begin]:', orderedTx);
	for (var i = 0 , n = orderedTx.out.length; i < n; i++){
    // console.log('9: setOrderedTxColors [orderedTx.out[i].prev_inputs]:', orderedTx.out[i].prev_inputs);
    // do we color if prev_inputs == []?
    var inputcolors = getColors(orderedTx.out[i].prev_inputs);
    var color = mixColors(inputcolors);
		orderedTx.out[i].color = color;
	}
	console.log('15: setOrderedTxColors [end]:', orderedTx);
	return orderedTx;
}

function orderBasedInputMergeByOutput(tx,callback){
  // console.log('5: orderBasedInputMergeByOutput [begin]:', tx);
  
	var orderedTx = {out:[]}
  	, appetite = 0
    , tasted = 0
    , eaten = 0
    , err = 'none'

  // console.log('6: orderBasedInputMergeByOutput [tx.out]:', tx.out);
  
  for (var j = 0, n = tx.out.length; j < n; ++j){
    appetite = parseFloat(tx.out[j].value)
    eaten = 0;
    var out = 
    	{toAddr : tx.out[j].toAddr
			,value : appetite
			,prev_inputs : []
    	}
    while (eaten < appetite && tasted < tx.in.length){
      eaten += parseFloat(tx.in[tasted].value);
      out.prev_inputs.push(tx.in[tasted]);
      ++tasted;
    }
    orderedTx.out.push(out)
  }
  // console.log('7: orderBasedInputMergeByOutput [orderedTx.out]:', orderedTx.out);
  callback(err, orderedTx);
}

function getTx(txId,callback){
  // console.log('2: getTx [begin]: ' + txId);
  
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3333/json/tx/'+txId, true);
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // console.log('3: getTx [json response]: ' + xhr.responseText);
        var data = JSON.parse(xhr.responseText);
        var err = "none";
        // console.log('4: getTx [grabbed]: ' + data.hash);
        return callback(err,data);
      }
    }
  };
  xhr.send(null);
}

function colorTx(txId){
  console.log('1: colorTx: ' + txId);
  
	return getTx(txId,
		function(err, tx){
			return orderBasedInputMergeByOutput(tx,setOrderedTxColors)
		}
	)
}

var txTest = 'd10d7127366229b341a559ddf83b53b9ac6c1b2ca792cb2e81edaf7a595d763b';
var colored = colorTx(txTest);

console.log('16: colored:',colored);
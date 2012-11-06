var unspent = {"result":
	[
		{"txid":"577a123e7c34f401431659f66857b54bdf648ad8f508d3fc0a5b264f5ca19dca"
	 	,"vout":0
	 	,"scriptPubKey":"76a914b8f53423003b16a88430215e8aae5b97910a7b8d88ac"
	 	,"amount":0.02000000
	 	,"confirmations":21612
	 	}
	 	,
	 	{"txid":"eb5fdac5227d3ee32919932bf8e63a2b3aa3045dbb5fb2bfa8644fa5d544e00c"
	 	,"vout":1
	 	,"scriptPubKey":"76a91439359b758fc1d04ab3e426f2b12762ea0f44bb0288ac"
	 	,"amount":48.99000000
	 	,"confirmations":69873
	 	}
	 ]
,"error":null
,"id":"t"
}

function getTx(prev_tx){

}
function getcoloringInputs(tx,output){

}
returnColor(input){
	prev_tx_id = input.prev_tx
	toAddr = input.sourceAddr
	prev_tx = getTx(prev_tx_id)
	while (prev_tx.out.length > 0){
		output = prev_tx.out.shift()
		if (output.toAddr == toAddr){
			coloringInputs = getcoloringInputs(output)
			color = 'undefined'
			do{
				prevInput = coloringInputs.shift()
				var prevInputColor = returnColor(prevInput)
				if (prevInputColor != color && color != 'undefined'){
					color = 'mixed'
					break
				}
				color = prevInputColor
			} while (coloringInputs.length > 0){
			return color
		}
	}
} 


[ in: [{
			sourceAddr: "16v13Fa9cPmfFzpm9mmbWwAkXY4gyY6uh4",
			value: "0.03",
			prev_tx: "f9e8d65db8d0b7934db6cff97c131d6048ebbfae52608b6b9795ef9db51bd7aa"
		},
		{
		sourceAddr: "1GPwJvMpB4vJPuMwHs9JDAZm9Lh66Y2qnS",
		value: "2.00",
		prev_tx: "eae9c2a9770cb7c61244f96e5a1c8e4ef43e7cd077fbcee52f4a8803251bcd05"
		},
		{
		sourceAddr: "1GPwJvMpB4vJPuMwHs9JDAZm9Lh66Y2qnS",
		value: "34.00",
		prev_tx: "81a39c41ca946d72e8b5de8ba61bbba085252a2b10f075dc1ca8d4118df4981e"
		}
]
, out: [
		{
		toAddr: "129Y2z4gFA9ZzujNvnKoRiKWTHeSq8ZdYn",
		value: "36.00"
		},
		{
		toAddr: "1GPwJvMpB4vJPuMwHs9JDAZm9Lh66Y2qnS",
		value: "0.03"
	}
]

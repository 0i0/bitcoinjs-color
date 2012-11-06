function  colorOutputs(inputs, outputs) {
  var apetite = 0
    , tasted = 0
    , eaten = 0

  for (var i = 0, n = inputs.length; i < n ; ++ i){
    apetite = inputs[i].amount
    eaten = 0;
    while (eaten < apetite && tasted < outputs.length){
      outputs[tasted].color = inputs[i].color
      console.log(outputs[tasted].color)
      eaten += outputs[tasted].amount
      ++tasted
    }
  }
}

function mergeColorInputs(inputs){
  var mergeInputs = []
    , i=0
    , color = inputs[0].color
    , amount = 0
    , input

  while (inputs.length > 0){
    input = inputs.shift()
    if (input.color == color){
       amount += input.amount
    } else {
      mergeInputs.push(
        { amount : amount
        , color : color
        }
      )
      amount = input.amount
      color = input.color
    }
  }
  mergeInputs.push(
    { amount : amount
    , color : color
    }
  )
  return mergeInputs
}

var inputs =  [{color: 'c1', amount:0.1}
              ,{color: 'c1', amount:0.2}
              ,{color: 'c2', amount:0.2}
              ,{color: 'c3', amount:0.3}
              ]

var outputs = [{color: '', amount: 0.1}
              ,{color: '', amount: 0.1}
              ,{color: '', amount: 0.1}
              ,{color: '', amount: 0.1}
              ,{color: '', amount: 0.1}
              ,{color: '', amount: 0.1}
              ,{color: '', amount: 0.2}
              ]

inputs = mergeColorInputs(inputs)
colorOutputs(inputs, outputs);
console.log(outputs);
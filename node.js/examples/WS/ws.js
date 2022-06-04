const moment = require('moment');
const WebSocket = require('ws');
const pako = require('pako');
const Crypto = require ('crypto-js')


const WS_URL = 'wss://wbs.mexc.com/raw/ws';

// 修改您的accessKey 和 secretKey
const config = {
    API_KEY: "XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXX",
    SECRET_KEY: "XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXX",
    REQ_TIME: Date.now()
}

/**
 * infor
 * @param ws
 */
 function infor(ws) {
    var data ={
        'op':"sub.symbol", 
        'symbol':"VDS_USDT"      

    }
    ws.send(JSON.stringify(data));

}

/**
 * kline
 * @param ws
 */
function kline(ws) {
    var data ={
        'op':"sub.kline",
        'symbol':"VDS_USDT",
        'interval':"Min30"
    }
    ws.send(JSON.stringify(data));

}

/**
 * depth
 * @param ws
 */
 function depth(ws) {
    var data ={
        'op':"sub.limit.depth",

        'symbol':"EOS_USDT",   //交易对
      
        "depth": 5
    }

    ws.send(JSON.stringify(data));

}

/**
 * overview
 * @param ws
 */
 function overview(ws) {
    var data ={
        "op": "sub.overview"
    }

    ws.send(JSON.stringify(data));

}

/**
 * cny
 * @param ws
 */
 function cny(ws) {
    var data ={
        "op": "sub.cny"
    }

    ws.send(JSON.stringify(data));

}

/**
 * Subscribe to incremental depth
 * @param ws
 */
 function Subdepth(ws) {
    var data ={
        "op":"sub.depth",
        "symbol": "BTC_USDT"
    }

    ws.send(JSON.stringify(data));

}


/*private channel*/


/**
 * 签名
 */
 function sign(REQ_TIME,API_KEY,SECRET_KEY,OP){
  let param = new Map();
  param.set('api_key',API_KEY);
  param.set('req_time',REQ_TIME);
  param.set('op',OP)
  param.set('sign',build_mexc_sign(param,SECRET_KEY));
  return param.get('sign');
}

function build_mexc_sign(paramMap,secret_key){
  const hash = crypto.createHash('md5');
  let keys = paramMap.keys();
  let keyArr = new Array();
  for (const key of keys) {
      keyArr.push(key);
  }
  let sortedKeys = keyArr.sort();
  let signStr = "";
  for (const key of sortedKeys) {
      signStr += key+"="+paramMap.get(key)+"&";
  }
  signStr += "api_secret="+secret_key;
  hash.update(signStr,'utf-8');
  return hash.digest('hex');
}


/**
 * Get account order status push
 * @param ws
 */
function personal(ws){
    var data ={
        'op':"sub.personal",  // sub key

        'api_key': "api_key",	//API Key
      
        'sign': sign,
      
        'req_time': "current timestamp"	//当前时间的时间戳 current timestamp 
    }
}

/**
 * deals
 * @param ws
 */
 function deals(ws){
    var data ={
        'op':"sub.personal.deals",  // sub key

        'api_key': "api_key",	//API Key
      
        'sign': sign,
      
        'req_time': "current timestamp"	//当前时间的时间戳 current timestamp 
    }
}




function init() {
    var ws = new WebSocket(WS_URL);
    ws.on('open', () => {
        console.log('open');
        kline(ws);
    });
    ws.on('message', (data) => {
        let text = pako.inflate(data, {
            to: 'string'
        });
        let msg = JSON.parse(text);
            console.log(msg)
        }

    );
    ws.on('close', () => {
        // websocket连接关闭处理
        console.log('close');
        init();
    });

    ws.on('error', err => {
        // websocket连接关闭处理
        console.log('error', err);
        init();
    });
}

init();

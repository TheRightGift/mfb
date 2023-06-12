const router = require('express').Router(); 
const axios = require('axios');

router.get('/', function(req, res){
    res.render('index');  
    
    // axios
    // .get(`http://localhost:8000/api/v1/user/all`, )
    // .then(resp => {
    //     console.log(resp.data);
    //     res.status(200).json({msg: resp.data });
    // })
    // .catch(err => {
    //     console.log(err)
    // })

    // axios
    // // .delete(`${process.env.BLOCKCYPHER_BITCOIN_MAIN}wallets/goziechukwu@gmail.com?token=e8aa113d6335418d8e849b495771bc3d`)
    // .get(`${process.env.BLOCKCYPHER_DASH_MAIN}wallets?token=e8aa113d6335418d8e849b495771bc3d`)
    // .get('https://api.blockcypher.com/v1/btc/main/addrs/1Nwq8xxtpA8JNXPb1KPtDgdjZF3459VBkm')
    // .then(resp => {
    //     res.status(200).json({msg: resp.data });
    // })
    // .catch(err => {
    //     res.status(200).json({msg: err });
    // })

    // var data = {"address": "Bv29UN982H8Hh8eRKsj9MtA2nZHw587jUa", "amount": 100000}
    // axios
    // .post(`${process.env.BLOCKCYPHER_BLOCKCYPHER_TEST}faucet?token=${process.env.BLOCKCYPHER_API_TOKEN}`, data)
    // .then(resp => {
    //     console.log(resp.data);
    // })
    // .catch(err => {
    //     console.log(err)
    // })

    // cr8 new test address
    // TEST ADRESS CREATED: C1ehEjVNdnvVgGFj4Rd26BKVwyJKQvskX9
    // axios
    // .post(`${process.env.BLOCKCYPHER_BLOCKCYPHER_TEST}addrs?token=${process.env.BLOCKCYPHER_API_TOKEN}`)
    // .then(resp => {
    //     console.log(resp.data);
    //     res.status(200).json({msg: resp.data });
    // })
    // .catch(err => {
    //     console.log(err)
    // })

    // Get address balance
    // axios
    // .get(`${process.env.BLOCKCYPHER_BLOCKCYPHER_TEST}addrs/C1ehEjVNdnvVgGFj4Rd26BKVwyJKQvskX9/balance`)
    // .then(resp => {
    //     console.log(resp.data);
    //     res.status(200).json({msg: resp.data });
    // })
    // .catch(err => {
    //     console.log(err)
    // })
    
    // let assetArr = [
    //     {url: process.env.BLOCKCYPHER_BITCOIN_TESTNET, name: 'BTCtestnet3'},
    //     {url: process.env.BLOCKCYPHER_BITCOIN_MAIN, name: 'BTCmain'},
    //     {url: process.env.BLOCKCYPHER_ETHEREUM_MAIN, name: 'ETHmain'},
    //     {url: process.env.BLOCKCYPHER_DASH_MAIN, name: 'DASHmain'},
    //     {url: process.env.BLOCKCYPHER_DOGE_MAIN, name: 'DOGEmain'},
    //     {url: process.env.BLOCKCYPHER_LITECOIN_MAIN, name: 'LITEmain'},
    //     {url: process.env.BLOCKCYPHER_BLOCKCYPHER_TEST, name: 'BCYtest'},
    // ]
    
    // assetArr.forEach((asset) => {
    //     // await sleep(1000)
    //     // createWallets(regUser, asset.url, asset.name, i, assetArrLen);

    //     axios
    //     .delete(`${asset.url}wallets/goziechukwu@gmail.com?token=${process.env.BLOCKCYPHER_API_TOKEN}`)
    //     .then(resp => {
    //         console.log(resp.data);
    //     })
    //     .catch(err => {

    //     })
    // });    
    
});


module.exports = router;
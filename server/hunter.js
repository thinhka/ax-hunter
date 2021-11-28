const Web3 = require('web3');
var moment = require('moment');
var CronJob = require('cron').CronJob;
const TelegramBot = require('node-telegram-bot-api');
const { json } = require('body-parser');
const { type } = require('os');
const token = '2125295221:AAHsHhtG942Mcr6kI4FABVVLvuN_yvsV9eo';
const bot = new TelegramBot(token, {
  polling: true
});

const channelChatId = '2045766841';

var pusheds = [];
var detailMetamaskUrl = 'https://marketplace.axieinfinity.com/axie/';
var detailWebUrl = 'https://itam.games/markets/lime-odyssey/';




module.exports = {
  async run() {
    var that = this;
    new CronJob('*/10 * * * * *', async function() {
      var aquaRequest = {"operationName":"GetAxieBriefList","variables":{"from":0,"size":10,"sort":"PriceAsc","auctionType":"Sale","owner":null,"criteria":{"region":null,"parts":["eyes-mavis","ears-nimo","tail-nimo","back-anemone","horn-anemone","mouth-lam","ears-inkling","eyes-gero"],"bodyShapes":null,"classes":["Aquatic"],"stages":null,"numMystic":null,"pureness":null,"title":null,"breedable":null,"breedCount":null,"hp":[],"skill":[],"speed":[],"morale":[]},"filterStuckAuctions":true},"query":"query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String, $filterStuckAuctions: Boolean) {\n  axies(\n    auctionType: $auctionType\n    criteria: $criteria\n    from: $from\n    sort: $sort\n    size: $size\n    owner: $owner\n    filterStuckAuctions: $filterStuckAuctions\n  ) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  id\n  name\n  stage\n  class\n  breedCount\n  image\n  title\n  battleInfo {\n    banned\n    __typename\n  }\n  auction {\n    currentPrice\n    currentPriceUSD\n    __typename\n  }\n  parts {\n    id\n    name\n    class\n    type\n    specialGenes\n    __typename\n  }\n  __typename\n}\n"};
      var birdRequest = {"operationName":"GetAxieBriefList","variables":{"from":0,"size":10,"sort":"PriceAsc","auctionType":"Sale","owner":null,"criteria":{"region":null,"parts":["eyes-mavis","ears-owl","back-pigeon-post","mouth-little-owl","horn-eggshell","tail-post-fight"],"bodyShapes":null,"classes":["Bird"],"stages":null,"numMystic":null,"pureness":null,"title":null,"breedable":null,"breedCount":null,"hp":[],"skill":[],"speed":[],"morale":[]},"filterStuckAuctions":true},"query":"query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String, $filterStuckAuctions: Boolean) {\n  axies(\n    auctionType: $auctionType\n    criteria: $criteria\n    from: $from\n    sort: $sort\n    size: $size\n    owner: $owner\n    filterStuckAuctions: $filterStuckAuctions\n  ) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  id\n  name\n  stage\n  class\n  breedCount\n  image\n  title\n  battleInfo {\n    banned\n    __typename\n  }\n  auction {\n    currentPrice\n    currentPriceUSD\n    __typename\n  }\n  parts {\n    id\n    name\n    class\n    type\n    specialGenes\n    __typename\n  }\n  __typename\n}\n"};
      that.fetch(aquaRequest, 240);
      that.fetch(birdRequest, 300);
    }, null, true).start();
  },

  async fetch(requestData, lowPrice) {  
    var that = this;
    var request = require('request');
    
    request({
        url: "https://graphql-gateway.axieinfinity.com/graphql",
        method: "POST",
        json: true,
        body: requestData
    }, function (error, response, body){
      try{
        var results = body.data.axies.results;
        results.forEach(p => {
          var axieName = p.class;
          var breedCount = p.breedCount;
          var tokenId = p.id;
          var currentPrice = p.auction.currentPrice.substring(0,3);;
          var currentPriceUSD = p.auction.currentPriceUSD;

          if(!pusheds.includes(tokenId)){
            if(pusheds.length > 30){ 
              pusheds.splice(0,10);
            }            

            if(p.auction.currentPriceUSD <= lowPrice){
              that.postTeleMessage(axieName, breedCount, currentPrice, currentPriceUSD, tokenId);
              pusheds.push(tokenId);
            }
          }
        });
      } catch (error) {
        console.error(error);
      }    
    });
  },

  postTeleMessage(nftTypeName, breedCount, price, priceUsd, tokenId) {
    console.error(tokenId);
    price = price/10000;
    var str_balance = `<b>${nftTypeName}</b> - Breed count: ${breedCount}\n`;
    str_balance += `Price: ${price} -  $${priceUsd}\n`;
    str_balance += `<a>${detailMetamaskUrl}${tokenId}</a> \n`;          
    bot.sendMessage(channelChatId, str_balance, {
      disable_web_page_preview: true,
      disable_notification: false,
      parse_mode: "HTML"
    });
  },

}

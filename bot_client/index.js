
const axios = require('axios'); // Import the axios library
const cheerio = require('cheerio'); // Import the cheerio library
const puppeteer = require('puppeteer');
const SteamUser = require('steam-user');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const https = require('https');
const client = new SteamUser();

//Starting declarations for the skins themselves and their specific conditions

const item_data = {
    'Graphic Design Collection': {
        'Input Items': {
            'SG 553 | Berry Gel Coat (Field-Tested)': 'https://steamcommunity.com/market/listings/730/SG%20553%20%7C%20Berry%20Gel%20Coat%20%28Field-Tested%29?count=15&currency=USD',
            'SCAR-20 | Wild Berry (Field-Tested)': 'https://steamcommunity.com/market/listings/730/SCAR-20%20%7C%20Wild%20Berry%20%28Field-Tested%29?count=15&currency=USD',
            'XM1014 | Halftone Shift (Field-Tested)': 'https://steamcommunity.com/market/listings/730/XM1014%20%7C%20Halftone%20Shift%20%28Field-Tested%29?count=15&currency=USD',
        },
        'Output Items': {
            'P90 | Attack Vector (Factory New)': 'https://steamcommunity.com/market/listings/730/P90%20%7C%20Attack%20Vector%20%28Factory%20New%29?count=5&currency=USD',
            'CZ75-Auto | Slalom (Factory New)': 'https://steamcommunity.com/market/listings/730/CZ75-Auto%20%7C%20Slalom%20%28Factory%20New%29?count=5&currency=USD',
            'M4A4 | Polysoup (Factory New)': 'https://steamcommunity.com/market/listings/730/M4A4%20%7C%20Polysoup%20%28Factory%20New%29?count=5&currency=USD',
        }
    },
    'Train Collection': {
        'Input Items': {
            'Sawed-Off | Amber Fade (Factory New)': 'https://steamcommunity.com/market/listings/730/Sawed-Off%20%7C%20Amber%20Fade%20%28Factory%20New%29?count=15&currency=USD',
            'Desert Eagle | Urban Rubble (Factory New)': 'https://steamcommunity.com/market/listings/730/Desert%20Eagle%20%7C%20Urban%20Rubble%20%28Factory%20New%29?count=15&currency=USD',
        },
        'Output Items': {
            'Tec-9 | Red Quartz (Factory New)' : 'https://steamcommunity.com/market/listings/730/Tec-9%20%7C%20Red%20Quartz%20%28Factory%20New%29?count=15&currency=USD'
        }
    },
    'Lake Collection': {
        'Input Items': {
            'USP-S | Night Ops (Factory New)': 'https://steamcommunity.com/market/listings/730/USP-S%20%7C%20Night%20Ops%20%28Factory%20New%29?count=15&currency=USD',
            'P90 | Teardown (Factory New)': 'https://steamcommunity.com/market/listings/730/P90%20%7C%20Teardown%20%28Factory%20New%29?count=15&currency=USD',
            'SG 553 | Anodized Navy (Factory New)': 'https://steamcommunity.com/market/listings/730/SG%20553%20%7C%20Anodized%20Navy%20%28Factory%20New%29?count=50&currency=USD',
        },
        'Output Items': {
            'Dual Berettas | Cobalt Quartz (Factory New)': 'https://steamcommunity.com/market/listings/730/Dual%20Berettas%20%7C%20Cobalt%20Quartz%20%28Factory%20New%29?count=5?currency=USD'
        }
    },
    'Italy Collection': {
        'Input Items': {
            'MP7 | Anodized Navy (Factory New)': 'https://steamcommunity.com/market/listings/730/MP7%20%7C%20Anodized%20Navy%20%28Factory%20New%29?count=50&currency=USD',
            'Sawed-Off | Full Stop': 'https://steamcommunity.com/market/listings/730/Sawed-Off%20%7C%20Full%20Stop%20%28Factory%20New%29?query=?count=15&currency=USD',
        },
        'Output Items': {
            'AWP | Pit Viper (Minimal Wear)': 'https://steamcommunity.com/market/listings/730/AWP%20%7C%20Pit%20Viper%20%28Minimal%20Wear%29?count=5?currency=USD'
        }
    },
    'Safehouse Collection': {
        'Input Items': {
            'FAMAS | Teardown (Factory New)': 'https://steamcommunity.com/market/listings/730/FAMAS%20%7C%20Teardown%20%28Factory%20New%29?query=?count=15&currency=USD',
        },
        'Output Items': {
            'M4A1-S | Nitro (Minimal Wear)': 'https://steamcommunity.com/market/listings/730/M4A1-S%20%7C%20Nitro%20%28Minimal%20Wear%29?count=5?currency=USD'
        }
    },
    'Overpass 2024 Collection': {
        'Input Items': {
            'Nova | Wurst Hölle (Field-Tested)': 'https://steamcommunity.com/market/listings/730/Nova%20%7C%20Wurst%20H%C3%B6lle%20%28Field-Tested%29?count=15&currency=USD',
            'Galil AR | Metallic Squeezer (Field-Tested)': 'https://steamcommunity.com/market/listings/730/Galil%20AR%20%7C%20Metallic%20Squeezer%20%28Field-Tested%29?count=15&currency=USD',
            'Glock-18 | Teal Graf (Field-Tested)': 'https://steamcommunity.com/market/listings/730/Glock-18%20%7C%20Teal%20Graf%20%28Field-Tested%29?count=15&currency=USD',
            'MAC-10 | Pipsqueak (Field-Tested)': 'https://steamcommunity.com/market/listings/730/MAC-10%20%7C%20Pipsqueak%20%28Field-Tested%29?count=15&currency=USD',
        },
        'Output Items': {
            'AUG | Eye of Zapems (Factory New)': 'https://steamcommunity.com/market/listings/730/AUG%20%7C%20Eye%20of%20Zapems%20%28Factory%20New%29?count=5?currency=USD',
            'Dual Berettas | Sweet Little Angels (Factory New)': 'https://steamcommunity.com/market/listings/730/Dual%20Berettas%20%7C%20Sweet%20Little%20Angels%20%28Factory%20New%29?count=5?currency=USD',
            'XM1014 | Monster Melt (Factory New)': 'https://steamcommunity.com/market/listings/730/XM1014%20%7C%20Monster%20Melt%20%28Factory%20New%29?count=5?currency=USD',
        }
    }
};


let session_cookies = [];

let is_logged_in = false;
let check_items_okay = false;

let final_contract_info = {

    'target_input_amount' : 0,
    'filler_input_amount' : 0,

    'filler_collection_amount' : 0,

    'filler_output_amount' : 0,
    'target_output_amount' : 0, //Unused in code but useful to display

    'total_output_amount' : 0,

    'included collections' : [


    ],

    'target collection inputs' : {
        // name : link
    },
    'filler collection inputs' : {
        // name : link
    },
    'target collection outputs' : {//Keep consistent with filler
        // name : {
        // link : link,
        //amount : amount
        // }
    },
    'filler collection outputs' : { //keep price individal so we can individually add up filler ouptuts from different collections
        // name : link
    },

};

let average_filler_float;
let minimum_filler_float;
let average_target_float;
let fillersToAverage;
let targetsToAverage;

//USER DEFINED METRICS -------------------------------------------------------------------------------------

const buy_steam_items = true; //For debugging, will only simulate buying items if set to false

let buyFillerItems = false; //Set to false to prevent buying filler items

const chromePath = 'C:/Users/Luca/.cache/puppeteer/chrome/win64-130.0.6723.58/chrome-win64/chrome.exe';

const database_URL = 'http://104.32.171.196:80';

let  minimum_profitability_ratio = 1.25; //Minimum acceptable profit ratio

let max_max_profitability_ratio = 1.4; //We will maintain this profit ratio even if we can achieve higher

let filler_items_to_check = 50; //How many items to check
let target_items_to_check = 15;

setupOverpass2024Collection();

//\\USER DEFINED METRICS-----------------------------------------------------------------------------------

let average_filler_price;
let average_target_price;

let current_trade_up_ID = 0;
let all_trade_up_data = [];

let current_outcome_items = {};

let total_bought_filler_items = 0;
let total_bought_desired_items = 0;

let current_browser = null; //Universal browser
let current_page = null; //Universal page
let current_HTML_data = null; //Universal HTML data for current item

let isItemDataInitialized= false; //First iteration should just be gathering item data

let isWaiting = false; // Global flag to track if the function is waiting
let okayToReupdateOutcomes = true;
let isProcessing = false;
let isWaitingForSelector = false;

function setupGraphicDesignCollection(){
    addTargetCollectionInfo('Graphic Design Collection', 5);
    manuallySetFillerInfo(5,1);
    addSpecificInputItem('SG 553 | Anodized Navy (Factory New)', 'Lake Collection', 5);
    addSpecificInputItem('MP7 | Anodized Navy (Factory New)', 'Italy Collection', 5);
    minimum_filler_float = 0.021;
    fillersToAverage = 8;
    targetsToAverage = 5;
    average_filler_float = 0.0275; //Average float for filler items
    average_target_float = 0.19;
}

function setupOverpass2024Collection(){
    manuallySetFillerInfo(6,1);
    addTargetCollectionInfo('Overpass 2024 Collection', 4);
    addSpecificInputItem('SG 553 | Anodized Navy (Factory New)', 'Lake Collection', 6);
    addSpecificInputItem('MP7 | Anodized Navy (Factory New)', 'Italy Collection', 6);
    minimum_filler_float = 0;
    fillersToAverage = 8;
    targetsToAverage = 8;
    average_filler_float = 0.017; //Average float for filler items
    average_target_float = 0.178;
}


function printUserData(){

    console.log("Bot will maintain a minimum profitability ratio of " + minimum_profitability_ratio);
    console.log("Bot will not ensure a profitability ratio of more than " + max_max_profitability_ratio + "\n\n");
    console.log("Maximum average target float set to " + average_target_float);
    console.log("Maximum average filler float set to " + average_filler_float);
    console.log("Bot will be passing up filler items with floats less than " + minimum_filler_float);
}

function addTargetCollectionInfo(targetCollection, inputsForThisCollection) {
    const output_amt = Object.keys(item_data[targetCollection]['Output Items']).length;

    for (const [skin, link] of Object.entries(item_data[targetCollection]['Input Items'])) {
        final_contract_info['target collection inputs'][skin] = link;
    }
    for (const [skin, link] of Object.entries(item_data[targetCollection]['Output Items'])) {
        // Initialize the nested object if it doesn't exist
        if (!final_contract_info['target collection outputs'][skin]) {
            final_contract_info['target collection outputs'][skin] = {};
        }
        final_contract_info['target collection outputs'][skin]['link'] = link;
        final_contract_info['target collection outputs'][skin]['amount'] = inputsForThisCollection;

        final_contract_info['target_output_amount'] += inputsForThisCollection;
    }

    final_contract_info['target_input_amount'] += inputsForThisCollection;
    final_contract_info['total_output_amount'] += (output_amt * inputsForThisCollection);

    final_contract_info['included collections'].push(targetCollection);
}



function addFillerCollectionInfo(fillerCollection, inputsForThisCollection) {
    const output_amt = Object.keys(item_data[fillerCollection]['Output Items']).length;

    for (const [skin, link] of Object.entries(item_data[fillerCollection]['Input Items'])) {
        final_contract_info['filler collection inputs'][skin] = link;
    }
    for (const [skin, link] of Object.entries(item_data[fillerCollection]['Output Items'])) {
        if (!final_contract_info['filler collection outputs'][skin]) {
            final_contract_info['filler collection outputs'][skin] = {};
        }
        final_contract_info['filler collection outputs'][skin]['link'] = link;
    }

    final_contract_info['filler_input_amount'] += inputsForThisCollection;
    final_contract_info['total_output_amount'] += (output_amt * inputsForThisCollection);

    final_contract_info['filler_collection_amount'] = 1;
    final_contract_info['filler_output_amount'] = output_amt * inputsForThisCollection;

    final_contract_info['included collections'].push(fillerCollection);

}


//Adds a specific item as an input. AllFillerItemAmount specifies the amount of output items correspond to this filler. ALL FILLER ITEMS MUST MUST MUST HAVE THE SAME AMOUNT OF OUTPUTS!
function addSpecificInputItem(itemName, collection, allFillerItemAmount) {
    const output_amt = Object.keys(item_data[collection]['Output Items']).length;

    final_contract_info['filler collection inputs'][itemName] = item_data[collection]['Input Items'][itemName];
    for (const [skin, link] of Object.entries(item_data[collection]['Output Items'])) {
        if (!final_contract_info['filler collection outputs'][skin]) {
            final_contract_info['filler collection outputs'][skin] = {};
        }
        final_contract_info['filler collection outputs'][skin]['link'] = link;
    }

    if(!final_contract_info['included collections'].includes(collection)) {
        final_contract_info['included collections'].push(collection);
        final_contract_info['filler_collection_amount'] += 1;
    }
}

function manuallySetFillerInfo(fillerAmount, outputsPerFiller){
    final_contract_info['filler_input_amount'] = fillerAmount; //Manually set filler amount since we'll have multiple skins from different filler collections
    final_contract_info['total_output_amount'] += fillerAmount * outputsPerFiller;
    final_contract_info['filler_output_amount'] = fillerAmount * outputsPerFiller;
}

function checkContractInfo(){
    if(final_contract_info['target_input_amount'] + final_contract_info['filler_input_amount'] !== 10){
        console.log("There are " + final_contract_info['filler_input_amount'] + " fillers and " + final_contract_info['target_input_amount'] + " targets for this contract, they must add up to 10!");
        throw new Error("Not enough input items!");
    }

    console.log("Setting bot to buy for contract: ");
    console.log(final_contract_info);
}


function setTotalFillerItemAmount(inputAmount){

}

function createTradeUpFromSkinData(item){
    const num_filler = item.name in final_contract_info['filler collection inputs'] ? 1 : 0;
    const num_desired = 1 - num_filler;

    let fillerFloat = 0;
    let desiredFloat = 0;

    if(num_filler === 1){
        fillerFloat = item.float;
        desiredFloat = 0;
    }
    else{
        fillerFloat = 0;
        desiredFloat = item.float;
    }
    const new_trade_up = {
        'total_price' : 0,
        'items_bought' : 0,
        'average_price' : 0,
        'average_float' : 0,
        'average_filler_float' : fillerFloat,
        'average_desired_float' : desiredFloat,
        'num_filler_items' : num_filler,
        'num_desired_items' : num_desired,
        'trade_up_ID' : current_trade_up_ID++, //Increment the trade up ID
    }

    console.log("Creating new trade up from existing item with ID " + new_trade_up['trade_up_ID']);

    all_trade_up_data.push(new_trade_up);

    return new_trade_up['trade_up_ID'];
}

function createNewEmptyTradeUp(){
    const new_trade_up = {
        'total_price' : 0,
        'items_bought' : 0,
        'average_price' : 0,
        'average_float' : 0,
        'average_filler_float' : 0,
        'average_desired_float' : 0,
        'num_filler_items' : 0,
        'num_desired_items' : 0,
        'trade_up_ID' : current_trade_up_ID++, //Increment the trade up ID
    }

    console.log("Creating new trade up with ID " + new_trade_up['trade_up_ID']);

    all_trade_up_data.push(new_trade_up);

    return new_trade_up['trade_up_ID'];
}


function canBuyItemAtThisPrice(item, tradeUp, max_price_average){

    let returnObject = false;

    if(item.price > max_price_average * 1.035){
        item.valid_for_tradeup = item.valid_for_tradeup.filter(element => element !== tradeUp.trade_up_ID); //Remove
        return false; //Always reject items greater than 1.125 * price
    }

    if(item.price < max_price_average){
        item.valid_for_tradeup.push(tradeUp.trade_up_ID);
        returnObject = item;
    }

    else {
        const new_price_average = (tradeUp.total_price + item.price) / (tradeUp.items_bought + 1);
        if (tradeUp.items_bought !== 0) { //Do some checks to see if we can buy higher than average float only if we have bought items before
            const relativeDifference = getRelativeDifference(max_price_average, tradeUp.average_price, new_price_average);

            if (relativeDifference < 0.6) { //Accept a maximum shift of 60% towards the average
                item.valid_for_tradeup.push(tradeUp.trade_up_ID);
                returnObject = item;
            }
        }
    }

    if(returnObject !== false){
        //Reject item from this trade up if we have already bought 5 of this item type
        const isFiller = item.name in final_contract_info['filler collection inputs'];
        if((isFiller && tradeUp.num_filler_items  >= final_contract_info['fillter_input_amount']) || (isFiller && tradeUp.num_desired_items >= final_contract_info['target_input_amount'])){
            item.valid_for_tradeup = item.valid_for_tradeup.filter(element => element !== tradeUp.trade_up_ID); //Remove
            returnObject = false; //Need to reject this one because we have already bought 5 of this item type
            if(tradeUp.trade_up_ID === current_trade_up_ID){ //Create new trade up if we don't have any more trade ups to check
                createTradeUpFromSkinData(item);
                item.valid_for_tradeup.push(all_trade_up_data[all_trade_up_data.length - 1].trade_up_ID); //Make sure item is valid for our new trade up
            }
        }
    }
    return returnObject;
}

function canBuyItemAtThisFloat(item, tradeUp, max_float_average) {
    const isFiller = item.item_name in final_contract_info['filler collection inputs'];
    const maxItems = isFiller ? final_contract_info['filler_input_amount'] : final_contract_info['target_input_amount'];
    const numItems = isFiller ? tradeUp.num_filler_items : tradeUp.num_desired_items;
    const avgFloat = isFiller ? tradeUp.average_filler_float : tradeUp.average_desired_float;
    const itemTypeID = isFiller ? "filler" : "desired";

    if(isFiller && buyFillerItems === false){
        item.valid_for_tradeup = item.valid_for_tradeup.filter(element => element !== tradeUp.trade_up_ID); //Remove
        return false;
    }

    //Let someone with more sensitive trade ups get lower float items
    if(isFiller && item.float < minimum_filler_float){
        item.valid_for_tradeup = item.valid_for_tradeup.filter(element => element !== tradeUp.trade_up_ID); //Remove
        return false;
    }

    if(isFiller && (total_bought_filler_items - total_bought_desired_items) >= 10){ //Prevent from buying too many more filler items than desired items unless they have particularly good floats
        if(item.float > avgFloat * 0.6){
            item.valid_for_tradeup = item.valid_for_tradeup.filter(element => element !== tradeUp.trade_up_ID); //Remove
            return false;
        }
    }

    // Reject if item limit for this type is reached and it’s not the last trade-up in data
    if (numItems >= maxItems) {
        if(all_trade_up_data.indexOf(tradeUp) !== all_trade_up_data.length - 1){
            item.valid_for_tradeup = item.valid_for_tradeup.filter(element => element !== tradeUp.trade_up_ID); //Remove
            return false;
        }
        else{
            createTradeUpFromSkinData(item);
        }
    }

    // Add to new trade-up if the item float is under max and limit is reached
    if (item.float < max_float_average && numItems >= maxItems) {
        item.valid_for_tradeup = createNewEmptyTradeUp();
        return item;
    }

    // Reject item if float exceeds upper threshold
    if (item.float > 1.16 * max_float_average) {
        item.valid_for_tradeup = item.valid_for_tradeup.filter(element => element !== tradeUp.trade_up_ID); //Remove
        return false;
    }

    // Pass item if its float is below max
    if (item.float < max_float_average) {
        console.log(`Passing ${itemTypeID} item at float ${item.float} because it's below max float average ${max_float_average}`);
        return item;
    }

    // Conditional float check for fewer items
    if ((isFiller ? tradeUp.num_filler_items : tradeUp.num_desired_items) <= 2 && item.float < (isFiller ? 1.17 : 1.111) * max_float_average) {
        console.log(`Passing ${itemTypeID} item at float ${item.float} due to low number of items`);
        return item;
    }

    // Calculate new average and check relative difference if applicable
    const newAverage = (numItems * avgFloat + item.float) / (numItems + 1);
    const relativeDifference = getRelativeDifference(max_float_average, tradeUp.average_float, newAverage);
    if (tradeUp.items_bought !== 0 && avgFloat < max_float_average && relativeDifference < 0.7) {
        console.log(`Passing item with float ${item.float} due to favorable average shift; Relative difference: ${relativeDifference}`);
        return item;
    }
    item.valid_for_tradeup = item.valid_for_tradeup.filter(element => element !== tradeUp.trade_up_ID); //Remove
    return false;
}

function getRelativeDifference(maxValue, currentAverage, newAverage){
    const newDistance = (maxValue - newAverage);
    const currentDistance = (maxValue - currentAverage);

    return 1 - (newDistance / currentDistance);
}

const askQuestion = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, answer => {
        rl.close();
        resolve(answer);
    }));
};



async function steamLogin() {
    try {
        const username = await askQuestion('Enter Steam username: ');
        const password = await askQuestion('Enter Steam password: ');

        // Log on to Steam
        client.logOn({
            accountName: username,
            password: password
        });

        client.on('loggedOn', () => {
            console.log('Login successful!');
        });

        // Handle Steam Guard
        client.on('steamGuard', async (domain, callback) => {
            const twoFactorCode = await askQuestion('Enter Steam Guard code: ');
            callback(twoFactorCode); // Submit the Steam Guard code
        });

        // Retrieve session cookies when fully logged in
        client.on('webSession', (sessionID, cookies) => {
            console.log('Session ID:', sessionID);

            // Parse and format the cookies
            session_cookies = parseSessionCookies(cookies);

            console.log("Session cookies:");
            console.log(session_cookies);

            // Mark as logged in
            is_logged_in = true;

            // Now you can use session_cookies with setCookies in Puppeteer or elsewhere
        });

        client.on('error', (err) => {
            console.error('Login failed:', err.message);
        });
    } catch (error) {
        console.error('Error during login:', error);
    }
}

//Parse the strange cookie array provided by steam-community and convert it into a usable cookies object
function parseSessionCookies(cookieArray) {
    // Define base cookie structure with default values
    const baseCookies = [
        {
            name: "steamLoginSecure",
            value: "",
            domain: "steamcommunity.com",
            path: "/",
            expires: 1887927271,
            httpOnly: false,
            secure: true
        },
        {
            name: "sessionid",
            value: "",
            domain: "steamcommunity.com",
            path: "/",
            expires: 0,
            httpOnly: false,
            secure: true
        },
        {
            name: "clientsessionid",
            value: "",
            domain: "steamcommunity.com",
            path: "/",
            expires: 0,
            httpOnly: false,
            secure: true
        },
        {
            name: "steamCountry",
            value: "US%7Ca29019b4459ef176bad6f6ab8a9aff11",
            domain: "steamcommunity.com",
            path: "/",
            expires: 0,
            httpOnly: false,
            secure: true
        }
    ];

    // Create a dictionary of base cookies for easy lookup
    const baseCookieMap = Object.fromEntries(baseCookies.map(cookie => [cookie.name, cookie]));

    // Populate base cookies with values from the input array
    cookieArray.forEach(cookieString => {
        const [name, value] = cookieString.split('=');

        // Update the value if the cookie is in the base structure
        if (baseCookieMap[name]) {
            baseCookieMap[name].value = decodeURIComponent(value);
        }
    });

    // Return array of populated cookie objects
    return Object.values(baseCookieMap);
}

async function waitForSelectorWithTimeout(page, selector, timeout) {
    if (isWaitingForSelector) {
        throw new Error("Already waiting for a selector.");
    }

    isWaitingForSelector = true; // Set the waiting flag

    try {
        await page.waitForSelector(selector, { timeout });
    } catch (error) {
        if (error.name === 'TimeoutError') {
            console.error(`Timeout waiting for selector: ${selector}`);
            throw new Error(`TimeoutError: ${selector}`);
        }
        // Rethrow other errors
        throw error;
    } finally {
        isWaitingForSelector = false; // Reset the waiting flag
    }
}


async function purchaseSteamItem(browser, page, M, A) {
    console.log("Buying item with M: " + M + " and A: " + A);

    if (!browser) {
        console.error("Browser not open in purchase function!");
        return false;
    }

    try {
        await waitForSelectorWithTimeout(page, '#searchResultsRows', 7000);

        // Attempt to execute the BuyMarketListing function on the page
        const result = await page.evaluate((M, A) => {
            try {
                return BuyMarketListing('listing', M, 730, '2', A);
            } catch (e) {
                console.error("BuyMarketListing injection failed:", e);
                return null;  // Return null if there's an error in the injection
            }
        }, M, A);

        const dialogueSelector = '.newmodal.market_modal_dialog';
        await waitForSelectorWithTimeout(page, dialogueSelector, 7000);

        // Check for the checkbox and click it if found
        const checkboxSelector = '#market_buynow_dialog_accept_ssa';
        const checkbox = await page.$(checkboxSelector);
        if (!checkbox) {
            console.error("Checkbox not found");
            return false;
        }
        await checkbox.evaluate(c => !c.checked && c.click());

        // Locate and click the purchase button
        const purchaseButtonSelector = '#market_buynow_dialog_purchase';
        let purchaseButton = await page.$(purchaseButtonSelector);
        if (!purchaseButton) {
            console.error("Purchase button not found");
            return false;
        }

        // Scroll the purchase button into view and wait a moment to ensure it's interactable
        await page.evaluate(button => button.scrollIntoView(), purchaseButton);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Re-fetch and click the button to avoid stale element issues
        purchaseButton = await page.$(purchaseButtonSelector);
        if (!purchaseButton) {
            console.error("Purchase button not found after scrolling");
            return false;
        }

        await purchaseButton.click();

        // Small delay to ensure click has taken effect
        await new Promise(resolve => setTimeout(resolve, 250));

        // Check quickly if an error message appears
        const errorSelector = '#market_buynow_dialog_error_text';
        await page.waitForSelector(errorSelector, { timeout: 250 });
            // If the error element is found, retrieve and log its content
        const errorMessage = await page.$eval(errorSelector, el => el.textContent);

        if(errorMessage !== ""){
            console.log("Error detected: " + errorMessage);
        }

        return true;
    } catch (error) {
        console.error("Error in purchaseSteamItem:", error);
        return false;
    }
}

async function openBrowser(cookies){
    // Close the current browser if one is open
    if(current_browser !== null){
        await closeBrowser();
    }

    // Launch the new browser
    current_browser = await puppeteer.launch({
        headless: true,
        executablePath: chromePath,
        userDataDir: './tmp/user_data',
        args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--allow-insecure-localhost',
            '--disable-blink-features=PerformanceManager',
            '--disable-setuid-sandbox',
            '--aggressive-cache-discard',
            '--disable-cache',
            '--disable-application-cache',
            '--disable-offline-load-stale-cache',
            '--disable-gpu-shader-disk-cache',
            '--media-cache-size=0',
            '--disk-cache-size=0',
        ]
    });

    // Open a new page
    current_page = await current_browser.newPage();

    // Set cookies in the browser before loading any pages
    if (cookies && cookies.length > 0) {
        await current_page.setCookie(...cookies);
    }
}

async function closeBrowser() {
    if (current_browser !== null) {
        await current_browser.close();
        current_browser = null;
        current_page = null;
    }
}

async function loadSteamPage(url) {
    try {
        // Navigate to the provided URL using the existing page instance
        await current_page.goto(url, { waitUntil: 'networkidle2' });

        // Retrieve the HTML content of the page and set it to the global variable
        current_HTML_data = await current_page.content();

        if(!current_HTML_data){
            console.error("No HTML data found in loadSteamPage");
            return false;
        }
    } catch (error) {
        console.error("Error loading the page:", error);
    }
    return true;
}

// Define the URL to fetch data from
function convertSteamUrl(m, a, d) {
    return `${database_URL}?m=${m}&a=${a}&d=${d}`;
}

async function fetchFloatInfoForItems(items) {
    const results = [];

    for (const item of items) {
        try {
            const response = await axios.get(convertSteamUrl(item.M, item.A, item.D));
            const data = response.data;

            const skin_info = {
                item_name: item.name,
                float: data.iteminfo.floatvalue,
                price: item.price,
                valid_for_tradeup: item.valid_for_tradeup,
                M: item.M,
                A: item.A,
                D: item.D,
            };

            results.push(skin_info); // Store the result for this skin
        } catch (error) {
            console.error(`Error fetching data for ${item.name}:`, error.message);
            results.push(null); // Store null in case of an error
        }
    }
    return results;
}


async function getSteamMarketData(browser, numItems) {
    try {
        // Check if current_HTML_data has the HTML data from the previous Axios request
        if (!current_HTML_data) {
            console.error("No HTML data available. Please ensure getHTML has populated current_HTML_data.");
            return false;
        }

        const marketHtml = current_HTML_data;

        // Ensure the browser is opened if not already done
        if (!current_browser) {
            await openBrowser(session_cookies); // Opens an empty browser and an empty page
        }

        // Wait for the page to load elements (assuming page has been navigated to URL already)
        await waitForSelectorWithTimeout(current_page, '#searchResultsRows', 10000);

        // Get the HTML content of the Puppeteer page
        const html = await current_page.content();
        const $ = cheerio.load(html);
        const results = [];

        // Scrape market data from HTML
        $('.market_listing_row').each((index, element) => {
            if (index < numItems) {
                const listingID = $(element).attr('id');
                const M = listingID ? listingID.split('_')[1] : null;
                const buyButton = $(element).find('a.item_market_action_button');
                const href = buyButton.attr('href');
                const A = href ? href.match(/, '(\d+)'[)]$/)?.[1] : null;
                const priceElement = $(element).find('.market_listing_price_with_fee');
                const priceText = priceElement.text().trim();
                const priceValue = parseFloat(priceText.replace(/[$,]/g, '').trim());
                const price = !isNaN(priceValue) ? `$${priceValue.toFixed(2)}` : 'Unknown';

                if (M && A) {
                    results.push({ M, A, price });
                }
            }
        });

        // Parse g_rgAssets data from marketHtml
        const assetsMatch = marketHtml.match(/var g_rgAssets = (\{.*?\});/);
        if (!assetsMatch) {
            console.error("Could not find g_rgAssets data in the HTML.");
            return false;
        }

        const assetsData = JSON.parse(assetsMatch[1]);
        const appItems = assetsData['730']['2'];
        const dValues = [];

        // Extract asset details
        for (const itemId in appItems) {
            const item = appItems[itemId];
            const inspectLink = item.actions?.[0]?.link;
            const dValueMatch = inspectLink && inspectLink.match(/D(\d+)/);

            if (dValueMatch) {
                const dValue = dValueMatch[1];
                dValues.push({
                    name: item.market_name,
                    dValue
                });
            } else {
                console.log("No dValue found for item " + item.market_name);
            }

            if (dValues.length >= numItems) break;
        }

        // Combine listings and assets data
        const return_results = results.map((listing, index) => ({
            ...listing,
            D: dValues[index] ? dValues[index].dValue : null,
            name: dValues[index] ? dValues[index].name : null
        }));

        if (return_results.length === 0) {
            console.log("No results found for " + url + " in getSteamMarketData");
            return false;
        }

        return return_results;

    } catch (error) {
        if (error.response) {
            console.error("Error fetching Steam Market data:", error.message);
            console.error("Response code:", error.response.status);

            if (error.response.status === 429) {
                console.log("Rate limit exceeded. Pausing for 3 minutes...");
                await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000)); // Pause for 3 minutes
            }
        } else {
            console.error("Error:", error.message);
        }

        return false;
    }
}

async function buyItem(item) {
    const tradeUp = all_trade_up_data.find(tradeUp => tradeUp.trade_up_ID === item.valid_for_tradeup);

    let id;
    if (!tradeUp) {
        console.log("Couldn't find trade up matching ID " + item.trade_up_ID);
        id = createTradeUpFromSkinData(item);
        console.log("Creating new trade up with ID " + id);
    }

    const isFiller = item.item_name in final_contract_info['filler collection inputs'];

    if (buy_steam_items) {
        if (await purchaseSteamItem(current_browser, current_page, item.M, item.A)) {
            tradeUp.items_bought += 1;
            tradeUp.total_price += item.price;
            tradeUp.average_price = tradeUp.total_price / tradeUp.items_bought;

            tradeUp.average_float = (
                (tradeUp.average_float * (tradeUp.items_bought - 1)) + item.float
            ) / tradeUp.items_bought;

            if (isFiller) {
                tradeUp.average_filler_float = (
                    (tradeUp.num_filler_items * tradeUp.average_filler_float + item.float) /
                    (tradeUp.num_filler_items + 1)
                );
                tradeUp.num_filler_items += 1;
                total_bought_filler_items += 1;
            } else {
                tradeUp.average_desired_float = (
                    (tradeUp.num_desired_items * tradeUp.average_desired_float + item.float) /
                    (tradeUp.num_desired_items + 1)
                );
                tradeUp.num_desired_items += 1;
                total_bought_desired_items+=1;
            }

            console.log(`Bought item: ${item.item_name} for $${item.price.toFixed(2)}, with float ${item.float}`);

            // Prepare log file path and entry
            const today = new Date().toISOString().slice(0, 10);
            const logDir = path.join(__dirname, 'bought_items');
            const logFileName = `bought_items_${today}.txt`;
            const logFilePath = path.join(logDir, logFileName);
            const timestamp = new Date().toLocaleString();
            const logEntry = `Item: ${item.item_name}, Price: $${item.price.toFixed(2)}, Float: ${item.float}, Date/Time: ${timestamp}\n`;

            // Ensure 'bought_items' directory exists and append log entry
            if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
            fs.appendFile(logFilePath, logEntry, (err) => {
                if (err) console.error("Failed to log purchase:", err);
            });

            if (tradeUp.items_bought === 9) {
                console.log("Trade-up completed:", tradeUp);
                all_trade_up_data = all_trade_up_data.filter(t => t.trade_up_id !== tradeUp.trade_up_id);
            }
        } else {
            console.log("Purchase failed for item");
        }
    } else {
        console.log(`Bought item: ${item.item_name} for $${item.price.toFixed(2)}, with float ${item.float}`);
        console.log("Did not purchase item due to buy_steam_items flag being false");
    }
}

function convertPricesToDecimal(items) {
    return items.map(item => ({
        ...item,
        price: parseFloat(item.price.replace('$', ''))
    }));
}


async function getMarketItem(itemName){

    const isFiller = itemName in final_contract_info['filler collection inputs'];

    let itemsToCheck;
    let URL;

    if(isFiller){
        itemsToCheck = filler_items_to_check;
        URL = final_contract_info['filler collection inputs'][itemName];
    }
    else{
        itemsToCheck = target_items_to_check;
        URL = final_contract_info['target collection inputs'][itemName];
    }

    if(!URL){
        console.error("URL not found for " + itemName);
        return false;
    }

    try {
        let fetchedMarketItems = await getSteamMarketData(current_browser, itemsToCheck);
        if(!fetchedMarketItems){
            console.log("Failed to fetch market data for " + itemName);
            return false;
        }

        fetchedMarketItems.forEach(marketItem => {
            marketItem.valid_for_tradeup = []; //create empty array for trade ups that this item can work with
        });

        return convertPricesToDecimal(fetchedMarketItems);

    } catch (error) {
        console.error(`Failed to fetch market data for ${itemName}:`, error);
        return false;
    }
}

async function getMarketOutcomes() {

    if (isProcessing) return; // Exit if already processing
    isProcessing = true; // Lock mutex

    let cheapest_outcome_prices = {};

    // Loop through both 'target collection outputs' and 'filler collection outputs'
    const targetCollectionOutputs = final_contract_info['target collection outputs'];
    const fillerCollectionOutputs = final_contract_info['filler collection outputs'];

    // Combine both outputs into a single iterable object
    const allCollectionOutputs = { ...targetCollectionOutputs, ...fillerCollectionOutputs };

    check_items_okay = false;

    // Iterate over each output entry in the combined collection
    for (const [key, outputData] of Object.entries(allCollectionOutputs)) {
        const URL = outputData.link;

        if (!URL) {
            console.error(`URL not found for ${key}`);
            isProcessing = false;
            check_items_okay = false; //Set flag to check items okay to false

            return false;
        }

        // Attempt to navigate to URL and fetch data
        if(!await loadSteamPage(URL)){
            console.log("Failed to go to market page for " + key);
            isProcessing = false;
            check_items_okay = false; //Set flag to check items okay to false

            return false;
        }

        try {
            // Fetch market data for each item
            let fetchedMarketData = await getSteamMarketData(current_browser, 2);

            if (!fetchedMarketData) {
                console.log(`Failed to fetch market data for ${key}`);

                isProcessing = false;
                check_items_okay = false; //Set flag to check items okay to false

                return false;  // Exit early if fetching data fails
            }

            // Convert and store the price data
            cheapest_outcome_prices[key] = convertPricesToDecimal(fetchedMarketData);

        } catch (error) {
            console.error(`Failed to fetch ${key}:`, error);

            isProcessing = false;
            check_items_okay = false; //Set flag to check items okay to false

            return false;  // Exit early on error
        }

        // Wait for 12 seconds before checking the next URL
        await new Promise(resolve => setTimeout(resolve, 1000 * 7));
    }

    // If loop completes without issues, set check_items_okay to true
    isProcessing = false;
    check_items_okay = true;
    return cheapest_outcome_prices;
}


function calculateRequiredPriceAverages(inputItems) {

    let expected_value = 0;
    let total_filler_outcome_value = 0;

    // Loop through each item in current_outcome_items
    for (const [key, marketData] of Object.entries(current_outcome_items)) {
        // Find the item in 'target collection outputs' or 'filler collection outputs'
        const targetOutput = final_contract_info['target collection outputs'][key];
        const fillerOutput = final_contract_info['filler collection outputs'][key];
        const itemData = targetOutput || fillerOutput;

        // If item is found, proceed to calculate price per unit
        if (itemData) {
            const amount = itemData.amount;
            const price = marketData[0]?.price || 0; // Use first item price or 0 if unavailable
            const name = marketData[0]?.name || null; //Name of market item

            if(name in final_contract_info['filler collection outputs']){
                total_filler_outcome_value += price; //Add price to filler price
            }

            else{
                const pricePerUnit = amount * price / final_contract_info['total_output_amount'];
                // Add to totalOutcomePricePerUnit
                expected_value += pricePerUnit;
            }

        } else {
            console.warn(`Amount not found for ${key} in final_contract_info.`);
        }
    }

    const average_filler_outcome_price = total_filler_outcome_value / final_contract_info['filler_collection_amount']; //Average value of filler items
    expected_value += final_contract_info['filler_output_amount'] * average_filler_outcome_price / final_contract_info['total_output_amount']; //Add average value of fillers


    const fillerCollectionFromInput = [];
    const desiredCollectionFromInput = [];

    const targetInputs = final_contract_info['target collection inputs'];
    const fillerInputs = final_contract_info['filler collection inputs'];

    for (const [name, items] of Object.entries(inputItems)) {
        for (const item of items) {
            if (name in targetInputs) {
                desiredCollectionFromInput.push(item);
            } else if (name in fillerInputs) {
                fillerCollectionFromInput.push(item);
            }
        }
    }

    // Sort by price to find the lowest items
    fillerCollectionFromInput.sort((a, b) => a.price - b.price);
    desiredCollectionFromInput.sort((a, b) => a.price - b.price);

    const lowest_custom_fillers = fillerCollectionFromInput.slice(0, fillersToAverage);
    const lowest_custom_desireds = desiredCollectionFromInput.slice(0, targetsToAverage);

    // Calculate the averages
    let lowest_custom_filler_average = lowest_custom_fillers.reduce((acc, item) => acc + item.price, 0) / fillersToAverage;
    let lowest_custom_desired_average = lowest_custom_desireds.reduce((acc, item) => acc + item.price, 0) / targetsToAverage;

    const tradeup_price_to_maintain_profitability = (expected_value / minimum_profitability_ratio);

    console.log("Trade up Expected Value: " + expected_value + ', must keep price below ' + tradeup_price_to_maintain_profitability + " to maintain profitability");

    const desired_per_tradeup = final_contract_info['target_input_amount'];
    const filler_per_tradeup = final_contract_info['filler_input_amount'];

    // Check profitability
    if ((lowest_custom_desired_average * desired_per_tradeup) + (lowest_custom_filler_average * filler_per_tradeup) > tradeup_price_to_maintain_profitability) {
        average_target_price = (tradeup_price_to_maintain_profitability - (filler_per_tradeup * lowest_custom_filler_average)) / desired_per_tradeup;
        average_filler_price = lowest_custom_filler_average;

        console.log("Trade up is not profitable with current prices. Target desired collection price set to " + average_target_price);
        return false;
    } else {

        average_filler_price = lowest_custom_filler_average + 0.01;
        let max_average_target_price = (tradeup_price_to_maintain_profitability - (filler_per_tradeup * average_filler_price)) / desired_per_tradeup;

        if((max_average_target_price * 0.95) > lowest_custom_desired_average){
                average_target_price = lowest_custom_desired_average + 0.025;
        }
        else{
                average_target_price = max_average_target_price;
        }

        const tradeup_profitability_ratio = expected_value / (average_filler_price * filler_per_tradeup + average_target_price * desired_per_tradeup);
        console.log("Best attainable profitability ratio is " + tradeup_profitability_ratio);

        if(tradeup_profitability_ratio > max_max_profitability_ratio){
            average_target_price = ((expected_value / max_max_profitability_ratio) - (average_filler_price * final_contract_info['filler_input_amount'])) / final_contract_info['target_input_amount'] - 0.015;
            average_filler_price+=0.015; //Give some headroom mostly for anodized navies
        }
        const used_profitability_ratio = expected_value / ((average_filler_price * final_contract_info['filler_input_amount']) + (average_target_price * final_contract_info['target_input_amount']));
        console.log("Setting target profitability ratio to: " + used_profitability_ratio + ", with maximum average filler price: " + average_filler_price + ", and maximum average target price: " + average_target_price);
    }
}


function filterItemsByPrice(skinsData, max_price_average) {
    const purchasableItems = [];

    for (let tradeUp of all_trade_up_data) {
        // Loop backward to safely remove items while iterating
        for (let i = skinsData.length - 1; i >= 0; i--) {
            const item = skinsData[i];

            // Assuming canBuyItemAtThisPrice function checks if the item meets criteria
            const result = canBuyItemAtThisPrice(item, tradeUp, max_price_average);
            if (result) {
                purchasableItems.push(result);
                skinsData.splice(i, 1); // Remove the item from the original array
            }
        }
    }

    return purchasableItems;
}

async function processInputs() {
    if (isProcessing) return; // Exit if already processing
    isProcessing = true; // Lock mutex

    okayToReupdateOutcomes = false;
    let all_unprocessed_items = {};

    const fillerInputInfo = final_contract_info['filler collection inputs'];
    const targetInputInfo = final_contract_info['target collection inputs'];

    for (const [key, url] of Object.entries(targetInputInfo)) {
        if (!await loadSteamPage(url)) {
            await new Promise(resolve => setTimeout(resolve, 6500)); // Delay for 10 seconds
            isProcessing = false;
            return false; // Go to the URL failed
        }

        await new Promise(resolve => setTimeout(resolve, 6500)); // Delay for 8 seconds

        const raw_market_info = await getMarketItem(key); // Get all market data for the item

        if (!raw_market_info || !Array.isArray(raw_market_info) || raw_market_info.length === 0) {
            console.error(`Failed to retrieve valid data for ${key}. Retrying...`);
            isProcessing = false;
            check_items_okay = true;

            return false; // Back out of function so we can restart
        } else {
            all_unprocessed_items[key] = [...raw_market_info]; // Ensure deep copy if necessary

            if (isItemDataInitialized) {
                let price_filtered_items = filterItemsByPrice([...raw_market_info], average_target_price);
                let float_filtered_items = await fetchFloatInfoForItems(price_filtered_items);
                await filterItemsByFloatAndBuy(float_filtered_items, average_target_float);
            }
        }
    }

    for (const [key, url] of Object.entries(fillerInputInfo)) {
        if (!await loadSteamPage(url)) {
            await new Promise(resolve => setTimeout(resolve, 6500)); // Delay for 10 seconds
            isProcessing = false;
            return false; // Go to the URL failed
        }

        await new Promise(resolve => setTimeout(resolve, 6500)); // Delay for 8 seconds

        const raw_market_info = await getMarketItem(key);

        if (!raw_market_info || !Array.isArray(raw_market_info) || raw_market_info.length === 0) {
            console.error(`Failed to retrieve valid data for ${key}. Retrying...`);
            isProcessing = false;
            await new Promise(resolve => setTimeout(resolve, 6500)); // Delay for 9 seconds
            return false; // Back out of function so we can restart
        } else {
            all_unprocessed_items[key] = [...raw_market_info];

            if (isItemDataInitialized) {
                let price_filtered_items = filterItemsByPrice([...raw_market_info], average_filler_price);
                let float_filtered_items = await fetchFloatInfoForItems(price_filtered_items);
                await filterItemsByFloatAndBuy(float_filtered_items, average_filler_float);
            }
        }
    }

    isItemDataInitialized = true;
    for (let skinName of Object.keys(all_unprocessed_items)) {
        if (!all_unprocessed_items[skinName] || all_unprocessed_items[skinName].length === 0) {
            console.error(`No items found for ${skinName}`);
            console.log(all_unprocessed_items[skinName]);
            isProcessing = false;
            return false;
        }
    }

    calculateRequiredPriceAverages(all_unprocessed_items);

    await closeBrowser();
    await openBrowser(session_cookies);

    isProcessing = false;
}


async function filterItemsByFloatAndBuy(itemData, max_float_average) {
    try {
        for (let tradeUp of all_trade_up_data) {

            // Loop backward to safely remove items while iterating
            for (let i = itemData.length - 1; i >= 0; i--) {
                const item = itemData[i];
                try {
                    let result = canBuyItemAtThisFloat(item, tradeUp, max_float_average);
                    if (result) {
                        item.valid_for_tradeup = tradeUp.trade_up_ID; // Set the valid trade-up ID
                        console.log(`Buying item with Name ${item.item_name} for trade-up ID ${tradeUp.trade_up_ID}`);

                        // Use buyItem, which will call purchaseSteamItem with the browser management in place

                        await buyItem(item);

                        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second

                        itemData.splice(i, 1); // Remove the item from the original array if purchased
                    }
                } catch (error) {
                    if (!item) {
                        console.log("Item data null! Check connection to database server!");
                    }
                    console.error(`Error processing item ${item.item_name}:`, error);
                }
            }
        }
    } catch (error) {
        console.error("An error occurred in filterItemsByFloatAndBuy:", error);
    }
}

// Synchronous-like wait function using intervals
async function waitForLogin() {
    while (!is_logged_in) {
        await new Promise(resolve => setTimeout(resolve, 100));  // Wait 100ms before checking again
    }
}

async function main() {
    createNewEmptyTradeUp();

    await new Promise(resolve => setTimeout(resolve, 1000)); //Delay for 1 second

    console.clear(); //Remove error for some package BS
    console.log("Written by Luca Lizaranzu in November 2024");
    console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");
    console.log("Welcome to the tradeup sniper client: \n" +
        "If you wish to change the contract parameters, please see the USER DEFINED METRICS section at the top of index.js. You have selected the following contract ")
    console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

    await new Promise(resolve => setTimeout(resolve, 5000)); //Delay for 1 second

    checkContractInfo();
    printUserData();

    console.log("\n\nPlease review the selected contract. enter 'y' if you wish to proceed: ");
    const proceed = await askQuestion('');

    if(!(proceed === 'y' || proceed === 'Y' || proceed === 'yes')){
        console.log("Aborting...");
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); //Delay for 1 second

    console.log("Contract accepted\n");

    console.log("Waiting for login...");
    await steamLogin();
    await waitForLogin();
    console.log("Logged in successfully ------- \n\n");


    isProcessing = false; // Mutex flag to prevent simultaneous execution

    let updateFlag = false;

    await openBrowser(session_cookies);

    async function updateMarketOutcomes() {
        current_outcome_items = await getMarketOutcomes();
        if(!current_outcome_items){
            console.log("Failed to update market outcomes");

            isProcessing = false;
            check_items_okay = false;
            updateFlag = true;

            return false;
        }
        console.log("Updated market outcomes, check items OK");
        updateFlag = false;
    }

    // Function to set the update flag to true every 10 minutes
    setInterval(() => {
        updateFlag = true;
    }, 600000); // 10 minutes in milliseconds

    // Initial market outcome update
    await updateMarketOutcomes();

    while (true) {
        try {
            // Check if it's time to update market outcomes
            if (updateFlag) {
                if(await updateMarketOutcomes()){
                    updateFlag = false;
                }
            }

            // Do a bunch of checks for outcomes
            for (const [key, item] of Object.entries(current_outcome_items)) { // Check if market items are valid
                if (item.price === null || item.price === 0) {
                    console.log("Null outcome price detected, reupdating market outcomes");

                    updateFlag = true; //Set flag to update market items
                    check_items_okay = false; //Set flag to check items okay to false
                    break; // Optional: stop the loop as soon as a null price is found
                }
            }


            //processInputs has internal checking
            if(check_items_okay) {
                await processInputs();
            }

        } catch (error) {
            console.error("Error fetching market data:", error);
            check_items_okay = false;

            console.log("Reupdating market outcome prices after error");
            await new Promise(resolve => setTimeout(resolve, 8000));
            updateFlag = true;
            isProcessing = false;
        }
    }
}

main().then(r => console.log("Finished!"));
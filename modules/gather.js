//updated
MODULES["gather"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["gather"].minTraps = 5;
MODULES["gather"].minScienceAmount = 100;
MODULES["gather"].minScienceSeconds = 60;

//OLD: "Auto Gather/Build"
function manualLabor2() {
    if (getPageSetting('ManualGather2')==0) return;
    //vars
    var breedingTrimps = game.resources.trimps.owned - game.resources.trimps.employed;
    var lowOnTraps = game.buildings.Trap.owned < 5;
    var notFullPop = game.resources.trimps.owned < game.resources.trimps.realMax();
    var trapTrimpsOK = getPageSetting('TrapTrimps');
    var targetBreed = getPageSetting('GeneticistTimer');
    var trapperTrapUntilFull = game.global.challengeActive == "Trapper" && notFullPop;
    var hasTurkimp = game.talents.turkimp4.purchased || game.global.turkimpTimer > 0;

    //FRESH GAME NO HELIUM CODE.
    if (game.global.world <=3 && game.global.totalHeliumEarned<=5000) {
        if (game.global.buildingsQueue.length == 0 && (game.global.playerGathering != 'trimps' || game.buildings.Trap.owned == 0)){
            if (!game.triggers.wood.done || game.resources.food.owned < 10 || Math.floor(game.resources.food.owned) < Math.floor(game.resources.wood.owned))
                setGather('food');
            else
                setGather('wood');
        }
    }

    if(trapTrimpsOK && (breedingTrimps < 5 || trapperTrapUntilFull) && game.buildings.Trap.owned == 0 && canAffordBuilding('Trap')) {
        //safeBuyBuilding returns false if item is already in queue
        if(!safeBuyBuilding('Trap'))
            setGather('buildings');
    }
    else if (trapTrimpsOK && (breedingTrimps < 5 || trapperTrapUntilFull) && game.buildings.Trap.owned > 0) {
        setGather('trimps');
        if (trapperTrapUntilFull && (game.global.buildingsQueue.length == 0 || game.buildings.Trap.owned == 1) && !game.global.trapBuildAllowed  && canAffordBuilding('Trap'))
            safeBuyBuilding('Trap'); //get ahead on trap building since it is always needed for Trapper
    }
    else if (getPageSetting('ManualGather2') != 2 && game.resources.science.owned < MODULES["gather"].minScienceAmount && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden')
        setGather('science');
    //if we have more than 2 buildings in queue, or (our modifier is fast (Scientist V equivalent or higher) and trapstorm is off), build
    else if (!game.talents.foreman.purchased && (game.global.buildingsQueue.length ? (game.global.buildingsQueue.length > 1 || game.global.autoCraftModifier == 0 || (getPlayerModifier() > 100 && game.global.buildingsQueue[0] != 'Trap.1')) : false)) {
        setGather('buildings');
    }
    //if trapstorm is off (likely we havent gotten it yet, the game is still early, buildings take a while to build ), then Prioritize Storage buildings when they hit the front of the queue (should really be happening anyway since the queue should be >2(fits the clause above this), but in case they are the only object in the queue.)
    else if (!game.global.trapBuildToggled && (game.global.buildingsQueue[0] == 'Barn.1' || game.global.buildingsQueue[0] == 'Shed.1' || game.global.buildingsQueue[0] == 'Forge.1')){
        setGather('buildings');
    }
    //if we have some upgrades sitting around which we don't have enough science for, gather science
    else if (game.resources.science.owned < scienceNeeded && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
        // debug('Science needed ' + scienceNeeded);
        if ((getPlayerModifier() < getPerSecBeforeManual('Scientist') && hasTurkimp)||getPageSetting('ManualGather2') == 2){
            //if manual is less than science production, switch on turkimp
            setGather('metal');
        }
        else if (getPageSetting('ManualGather2') != 2){
            setGather('science');
        }
    }
    else if (trapTrimpsOK && targetBreed < getBreedTime(true)){
        //combined to optimize code.
        if (game.buildings.Trap.owned < 5 && canAffordBuilding('Trap')) {
            safeBuyBuilding('Trap');
            setGather('buildings');
        }
        else if (game.buildings.Trap.owned > 0)
            setGather('trimps');
    }
    else {
        var manualResourceList = {
            'food': 'Farmer',
            'wood': 'Lumberjack',
            'metal': 'Miner',
        };
        var lowestResource = 'food';
        var lowestResourceRate = -1;
        var haveWorkers = true;
        for (var resource in manualResourceList) {
            var job = manualResourceList[resource];
            var currentRate = game.jobs[job].owned * game.jobs[job].modifier;
            // debug('Current rate for ' + resource + ' is ' + currentRate + ' is hidden? ' + (document.getElementById(resource).style.visibility == 'hidden'));
            if (document.getElementById(resource).style.visibility != 'hidden') {
                //find the lowest resource rate
                if (currentRate === 0) {
                    currentRate = game.resources[resource].owned;
                    // debug('Current rate for ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                    if ((haveWorkers) || (currentRate < lowestResourceRate)) {
                        // debug('New Lowest1 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
                        haveWorkers = false;
                        lowestResource = resource;
                        lowestResourceRate = currentRate;
                    }
                }
                if ((currentRate < lowestResourceRate || lowestResourceRate == -1) && haveWorkers) {
                    // debug('New Lowest2 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                    lowestResource = resource;
                    lowestResourceRate = currentRate;
                }
            }
         }
        if (game.global.playerGathering != lowestResource && !haveWorkers && !breedFire) {
            if (hasTurkimp)
                setGather('metal');
            else
                setGather(lowestResource);
        } else if (getPageSetting('ManualGather2') != 2 && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
            if (game.resources.science.owned < getPsString('science', true) * MODULES["gather"].minScienceSeconds && game.global.turkimpTimer < 1 && haveWorkers)
                setGather('science');
            else if (hasTurkimp)
                setGather('metal');
            else
                setGather(lowestResource);
        }
        //Build more traps if we have TrapTrimps on, and we own less than (100) traps.
        else if(trapTrimpsOK && game.global.trapBuildToggled == true && lowOnTraps)
            setGather('buildings');
        else
            setGather(lowestResource);
    }
}

function autogather3() {
if ((game.global.buildingsQueue.length <= 1 && getPageSetting('gathermetal') == false) || (getPageSetting('gathermetal') == true)) setGather('metal');
else setGather('buildings')
}

//RGather

function RmanualLabor2() {
    //Time
    var RDecimalBreed = Decimal.clone({precision: 30, rounding: 4});
    var RmissingTrimps = new RDecimalBreed(0);
    var Rtrimps = game.resources.trimps;
    var RtrimpsMax = Rtrimps.realMax();
    var RmaxBreedable = new RDecimalBreed(RtrimpsMax).minus(Rtrimps.employed);
    var RpotencyMod = new RDecimalBreed(Rtrimps.potency);
    if (game.upgrades.Potency.done > 0) RpotencyMod = RpotencyMod.mul(Math.pow(1.1, game.upgrades.Potency.done));
    if (game.buildings.Nursery.owned > 0) RpotencyMod = RpotencyMod.mul(Math.pow(1.01, game.buildings.Nursery.owned));
    if (game.unlocks.impCount.Venimp > 0) RpotencyMod = RpotencyMod.mul(Math.pow(1.003, game.unlocks.impCount.Venimp));
    if (game.global.brokenPlanet) RpotencyMod = RpotencyMod.div(10);
    RpotencyMod = RpotencyMod.mul(1+ (game.portal.Pheromones.level * game.portal.Pheromones.modifier));
    if (game.singleRunBonuses.quickTrimps.owned) RpotencyMod = RpotencyMod.mul(2);
    if (game.global.challengeActive == "Daily"){
	if (typeof game.global.dailyChallenge.dysfunctional !== 'undefined') {
            RpotencyMod = RpotencyMod.mul(dailyModifiers.dysfunctional.getMult(game.global.dailyChallenge.dysfunctional.strength));
	}
	if (typeof game.global.dailyChallenge.toxic !== 'undefined') {
            RpotencyMod = RpotencyMod.mul(dailyModifiers.toxic.getMult(game.global.dailyChallenge.toxic.strength, game.global.dailyChallenge.toxic.stacks));
	}
    }
    if (game.global.challengeActive == "Toxicity" && game.challenges.Toxicity.stacks > 0) {
	RpotencyMod = RpotencyMod.mul(Math.pow(game.challenges.Toxicity.stackMult, game.challenges.Toxicity.stacks));
    }
    if (game.global.voidBuff == "slowBreed"){
	RpotencyMod = RpotencyMod.mul(0.2);
    }
    RpotencyMod = calcHeirloomBonusDecimal("Shield", "breedSpeed", RpotencyMod);
    if (game.jobs.Geneticist.owned > 0) RpotencyMod = RpotencyMod.mul(Math.pow(.98, game.jobs.Geneticist.owned));
	RpotencyMod = RpotencyMod.div(10).add(1);
    var RdecimalOwned = RmissingTrimps.add(Rtrimps.owned);
    var RtimeRemaining = RDecimalBreed.log10(RmaxBreedable.div(RdecimalOwned.minus(Rtrimps.employed))).div(RDecimalBreed.log10(RpotencyMod)).div(10);
	
    //Vars
    var lowOnTraps = game.buildings.Trap.owned < 5;
    var trapTrimpsOK = getPageSetting('RTrapTrimps');
    var hasTurkimp = game.talents.turkimp4.purchased || game.global.turkimpTimer > 0;

    //FRESH GAME NO RADON CODE.
    if (game.global.world <=3 && game.global.totalRadonEarned<=5000) {
        if (game.global.buildingsQueue.length == 0 && (game.global.playerGathering != 'trimps' || game.buildings.Trap.owned == 0)){
            if (!game.triggers.wood.done || game.resources.food.owned < 10 || Math.floor(game.resources.food.owned) < Math.floor(game.resources.wood.owned))
                setGather('food');
            else
                setGather('wood');
        }
	return;
    }

    if (trapTrimpsOK && RtimeRemaining < 1 && game.buildings.Trap.owned == 0 && canAffordBuilding('Trap')) {
        if (!safeBuyBuilding('Trap'))
            setGather('buildings');
    }
    else if (trapTrimpsOK && RtimeRemaining < 1 && game.buildings.Trap.owned > 0) {
             setGather('trimps');
    }
    else if (getPageSetting('RManualGather2') != 2 && game.resources.science.owned < MODULES["gather"].minScienceAmount && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
             setGather('science');
    }
    else if (!game.talents.foreman.purchased && (game.global.buildingsQueue.length ? (game.global.buildingsQueue.length > 1 || game.global.autoCraftModifier == 0 || (getPlayerModifier() > 100 && game.global.buildingsQueue[0] != 'Trap.1')) : false)) {
             setGather('buildings');
    }
    else if (!game.global.trapBuildToggled && (game.global.buildingsQueue[0] == 'Barn.1' || game.global.buildingsQueue[0] == 'Shed.1' || game.global.buildingsQueue[0] == 'Forge.1')){
             setGather('buildings');
    }
    else if (game.resources.science.owned < scienceNeeded && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
        if ((getPlayerModifier() < getPerSecBeforeManual('Scientist') && hasTurkimp)||getPageSetting('RManualGather2') == 2){
            setGather('metal');
        }
        else if (getPageSetting('RManualGather2') != 2){
                 setGather('science');
        }
    }
    else if (trapTrimpsOK){
        if (game.buildings.Trap.owned < 5 && canAffordBuilding('Trap')) {
            safeBuyBuilding('Trap');
            setGather('buildings');
        }
        else if (game.buildings.Trap.owned > 0)
                 setGather('trimps');
    }
    else {
        var manualResourceList = {
            'food': 'Farmer',
            'wood': 'Lumberjack',
            'metal': 'Miner',
        };
        var lowestResource = 'food';
        var lowestResourceRate = -1;
        var haveWorkers = true;
        for (var resource in manualResourceList) {
             var job = manualResourceList[resource];
             var currentRate = game.jobs[job].owned * game.jobs[job].modifier;
             if (document.getElementById(resource).style.visibility != 'hidden') {
                 if (currentRate === 0) {
                     currentRate = game.resources[resource].owned;
                     if ((haveWorkers) || (currentRate < lowestResourceRate)) {
                         haveWorkers = false;
                         lowestResource = resource;
                         lowestResourceRate = currentRate;
                     }
                }
                if ((currentRate < lowestResourceRate || lowestResourceRate == -1) && haveWorkers) {
                    lowestResource = resource;
                    lowestResourceRate = currentRate;
                }
            }
         }
        if (game.global.playerGathering != lowestResource && !haveWorkers && !breedFire) {
            if (hasTurkimp)
                setGather('metal');
            else
                setGather(lowestResource);
        } else if (getPageSetting('RManualGather2') != 2 && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
            if (game.resources.science.owned < getPsString('science', true) * MODULES["gather"].minScienceSeconds && game.global.turkimpTimer < 1 && haveWorkers)
                setGather('science');
            else if (hasTurkimp)
                     setGather('metal');
            else
                setGather(lowestResource);
        }
        else if(trapTrimpsOK && game.global.trapBuildToggled == true && lowOnTraps)
            setGather('buildings');
        else
            setGather(lowestResource);
    }
}

(function(a,b){a.performance={},a.performance.isAFK=!1,a.performance.updateLabels=b.updateLabels,a.performance.$wrapper=document.getElementById("wrapper"),document.head.appendChild(document.createElement("style")).innerHTML=`
	.at-afk-overlay
	{
		position: absolute;
		left: 0px;
		top: 0px;
		width: 100vw;
		height: 100vh;
		background-color: black;
		color: white;
		z-index: 9001;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
		-webkit-flex-wrap: nowrap;
		-ms-flex-wrap: nowrap;
		flex-wrap: nowrap;
		-webkit-justify-content: center;
		-ms-flex-pack: center;
		justify-content: center;
		-webkit-align-content: stretch;
		-ms-flex-line-pack: stretch;
		align-content: stretch;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.at-afk-overlay-disabled
	{
		display: none !important;
	}

	.at-afk-overlay-title
	{
		font-size: 24pt;
	}

	.at-afk-zone, .at-afk-helium, .at-afk-status
	{
		font-size: 20pt;
	}

	.at-afk-overlay-disable-btn
	{
		width: 250px;
		height: 60px;
		background-color: #e74c3c;
		color: white;
		border: 2px solid white;
		text-align: center;
		line-height: 60px;
		font-size: 20pt;
		margin-top: 25px;
	}

	.at-afk-overlay-disable-btn:hover
	{
		cursor: pointer;
		background-color: #c0392b;
		transition: all 300ms linear;
	}`,a.performance.AFKOverlay=document.createElement("div"),a.performance.AFKOverlay.className="at-afk-overlay at-afk-overlay-disabled";var c=document.createElement("p");c.innerText="TRIMPS - AFK",c.className="at-afk-overlay-title",a.performance.AFKOverlayZone=document.createElement("p"),a.performance.AFKOverlayZone.innerText="Current zone: -",a.performance.AFKOverlayZone.className="at-afk-zone",a.performance.AFKOverlayHelium=document.createElement("p"),a.performance.AFKOverlayHelium.innerText="Current helium: -",a.performance.AFKOverlayHelium.className="at-afk-helium",a.performance.AFKOverlayStatus=document.createElement("p"),a.performance.AFKOverlayStatus.innerText="Status: -",a.performance.AFKOverlayStatus.className="at-afk-status",a.performance.AFKOverlayDisable=document.createElement("div"),a.performance.AFKOverlayDisable.innerText="I'm Back",a.performance.AFKOverlayDisable.className="at-afk-overlay-disable-btn",a.performance.AFKOverlayDisable.addEventListener("click",function(){a.performance.DisableAFKMode()}),a.performance.AFKOverlay.appendChild(c),a.performance.AFKOverlay.appendChild(a.performance.AFKOverlayZone),a.performance.AFKOverlay.appendChild(a.performance.AFKOverlayHelium),a.performance.AFKOverlay.appendChild(a.performance.AFKOverlayStatus),a.performance.AFKOverlay.appendChild(a.performance.AFKOverlayDisable),document.body.appendChild(a.performance.AFKOverlay),a.performance.EnableAFKMode=function(){a.performance.isAFK=!0,a.performance.AFKOverlay.classList.remove("at-afk-overlay-disabled"),a.performance.$wrapper.style.display="none",b.updateLabels=function(){},enableDebug=!1},a.performance.DisableAFKMode=function(){a.performance.isAFK=!1,a.performance.$wrapper.style.display="block",a.performance.AFKOverlay.classList.add("at-afk-overlay-disabled"),b.updateLabels=a.performance.updateLabels,enableDebug=!0},a.performance.UpdateAFKOverlay=function(){a.performance.AFKOverlayZone.innerText="Current Zone: "+game.global.world,a.performance.AFKOverlayHelium.innerText="Current Helium: "+prettify(Math.floor(game.resources.helium.owned)),a.performance.AFKOverlayStatus.innerHTML="Current Status: "+updateAutoMapsStatus(!0)[0]}})(MODULES,window);

// ==UserScript==
// @name         AutoTrimps-ZekBeta
// @version      1.0-Zek
// @namespace    https://cassfantastic.github.io/ZT
// @updateURL    https://cassfantastic.github.io/ZT/.user.js
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, Ishkaru, genBTC, Zeker0
// @include      *trimps.github.io*
// @connect      *cassfantastic.github.io/ZT*
// @connect      *trimps.github.io*
// @connect      self
// @grant        none
// ==/UserScript==

var script = document.createElement('script');
script.id = 'AutoTrimps-ZekBeta';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://cassfantastic.github.io/ZT/AutoTrimps2.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);

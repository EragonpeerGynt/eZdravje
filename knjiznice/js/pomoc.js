
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";
var imena =[/*"9df2f984-57d0-48a6-ab9b-ba791462b351"*/"26bc67dd-88d4-4f2f-8a57-10328b3abfd3", "a28c3421-d0fe-47ab-bd72-b52ad3f22316", "49b8e430-bc67-404b-8a17-7551d4f86505"];

var prviZagon = 1;


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function kreirajUporabnikID() {
	sessionId = getSessionId();

	var ime = $("#trenutnoIme").val();
	var priimek = $("#trenutniPriimek").val();
	var datumRojstva = $("#datumRojstva").val();

	if (!ime || !priimek || !datumRojstva || ime.trim().length == 0 ||
      priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
		$("#kreirajSporocilo").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        var ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            dateOfBirth: datumRojstva,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                    $("#kreirajSporocilo").html("<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno kreiran EHR '" +
                          ehrId + "'.</span>");
		                    $("#preberiEHRid").val(ehrId);
		                }
		            },
		            error: function(err) {
		            	$("#kreirajSporocilo").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
		});
	}
	if (ime == "Gaben" && priimek == "Newell"){
		
		$("#easterEgg").html('<button type="button" class="btn btn-primary btn-xs" onclick="actionTurn()">Preberi osnovne podatke o bolniku</button><span id="preberiSporocilo"></span>');
		console.log("Doom adventure has started.\nIf you want to continue type !start into field for checking person's info. If you want to go back to basic page enter !end")
		
	}
	
	if (ime == "Linus" && priimek == "Torvalds"){
		
		window.open("http://wallpaperus.org/wallpapers/05/189/linux-tux-1440x900-wallpaper-963933.jpg");
		console.log("Penguin for the WIN!!!")
	}
	
	//window.location.reload();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function preglejUporabnika() {
	sessionId = getSessionId();

	var ehrId = $("#preberiUporabnika").val();
	if (ehrId == "D20") {
		
		var roll = Math.floor((Math.random() * 20)+1);
		console.log("DnD, roll out!");
		document.querySelector('#preberiUporabnika').value = roll;
		return;
		
	}
	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#preberiSporocilo").html("<span class='obvestilo label " +
          "label-success fade-in'>Uporabnik '" + party.firstNames + " " +
          party.lastNames + "', ki se je rodil '" + party.dateOfBirth +
          "'.</span>");
			},
			error: function(err) {
				$("#preberiSporocilo").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
			}
		});
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function dodajMeritve() {
	sessionId = getSessionId();

	var ehrId = $("#dodajAktivnostEhrID").val();
	var datumInUra = $("#zabeleziUro").val();
	var telesnaVisina = $("#dodajVisina").val();
	var telesnaTeza = $("#dodajTeza").val();
	var trajanjeTelovadbe = $("#dodajMinAktivnosti").val();//var sistolicniKrvniTlak = $("#dodajVitalnoKrvniTlakSistolicni").val();
	var zauzitaVoda = $("#dodajVoda").val();//var diastolicniKrvniTlak = $("#dodajVitalnoKrvniTlakDiastolicni").val();
	var merilec = "uporabnik";

	if (!ehrId || ehrId.trim().length == 0) {
		$("#dodajMeritveSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "ctx/time": datumInUra,
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		    "vital_signs/blood_pressure/any_event/systolic": trajanjeTelovadbe,
		    "vital_signs/blood_pressure/any_event/diastolic": zauzitaVoda,
		};
		var parametriZahteve = {
		    ehrId: ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		    committer: merilec
		};
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		        $("#dodajMeritveSporocilo").html(
              "<span class='obvestilo label label-success fade-in'>" +
              res.meta.href + ".</span>");
		    },
		    error: function(err) {
		    	$("#dodajMeritveSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
	var bmi = telesnaVisina*telesnaVisina;
	bmi = telesnaTeza/bmi;
	
	if (bmi > 25) {
		alaremPomoc();
		$("#alarmantniUspeh").html(
            "<span class='obvestilo label label-danger fade-in'>Vaša telesna masa je presegla priporočljive vrednosti! Pomagajte si z zemljevidom spodaj. ");
              
	}
	
	
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function analizaPodatkov() {
	
	sessionId = getSessionId();
	
	/*setTimeout(function () {
		window.location.reload();
	}, 5000);*/
    
	var ehrId = $("#meritveVitalnihZnakovEHRid").val();
	var tip = $("#preberiTipZaIzpisPodatkov").val();

	if (!ehrId || ehrId.trim().length == 0 || !tip || tip.trim().length == 0) {
		$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		
		var a = izrisiPolje();
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#meritveRezultati").html("<br/><span>Pridobivanje " +
          "podatkov za <b>'" + tip + "'</b> bolnika <b>'" + party.firstNames +
          " " + party.lastNames + "'</b>.</span><br/><br/>");
				if (tip == "Teza") {
					
					$.ajax({
  					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
					    		var dolzina = 7;
					    		if(res.length < 7) {
					    			dolzina = res.length;
					    		}
					    		
					    		
					    		
					    		var rezultati = [];
					    		var datumi = [];
						    	
						        for (var i = 0; i < dolzina; i++) {
						            
                          		var temp = res[i].time.split(/T/);
                          		datumi[7 - i - 1] = temp[0];
                          		rezultati[7 - i - 1] = res[i].weight;
						        }
						        narisiGraf(rezultati, datumi);
						        /*google.charts.load('current', {'packages':['corechart']});
						        console.log("nalaganje chart");
							      google.charts.setOnLoadCallback(drawChart);
							      function drawChart() {
							        var data = google.visualization.arrayToDataTable([
							          ['Datum', 'Teža'],
							          [datumi[0],  rezultati[0]],
							          [datumi[1],  rezultati[1]],
							          [datumi[2],  rezultati[2]],
							          [datumi[3],  rezultati[3]],
							          [datumi[4],  rezultati[4]],
							          [datumi[5],  rezultati[5]],
							          [datumi[6],  rezultati[6]]
							        ]);
							
							        var options = {
							          title: 'Teža',
							          hAxis: {title: 'Datum',  titleTextStyle: {color: '#333'}},
							          vAxis: {minValue: 0}
							        };
							
							        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
							        chart.draw(data, options);
      								}
      								console.log("vse je nareto pametnjakovič");*/
      								
					    	} else {
					    		$("#meritveRezultati").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#meritveRezultati").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				} else if (tip == "Aktivnost") {
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
					    		var dolzina = 7;
					    		if (res.length < 7) {
					    			dolzina = res.length
					    		}
					    		
					    		
						    	
                    			var rezultati = [];
					    		var datumi = [];
                    			
						        for (var i = 0; i < dolzina; i++) {
						            
                          		var temp = res[i].time.split(/T/);
                          		datumi[7 - i - 1] = temp[0];
                          		rezultati[7 - i - 1] = res[i].systolic;
						        }
						        narisiGraf(rezultati, datumi);
						        /*google.charts.load('current', {'packages':['corechart']});
						        console.log("nalaganje chart");
							      google.charts.setOnLoadCallback(drawChart);
							      function drawChart() {
							        var data = google.visualization.arrayToDataTable([
							          ['Datum', 'Trajanje aktivnosti [min]'],
							          [datumi[0],  rezultati[0]],
							          [datumi[1],  rezultati[1]],
							          [datumi[2],  rezultati[2]],
							          [datumi[3],  rezultati[3]],
							          [datumi[4],  rezultati[4]],
							          [datumi[5],  rezultati[5]],
							          [datumi[6],  rezultati[6]]
							        ]);
							
							        var options = {
							          title: 'Trajanje aktivnosti',
							          hAxis: {title: 'Datum',  titleTextStyle: {color: '#333'}},
							          vAxis: {minValue: 0}
							        };
							
							        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
							        chart.draw(data, options);
      								}
      								console.log("vse je nareto pametnjakovič");*/
						        
					    	} else {
					    		$("#meritveRezultati").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#meritveRezultati").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				}
				////////////////////////////////////////////////////////////
				else if (tip == "ITM z dolzino aktivnosti in zauzito vodo") {
					var nadaljuj = true;
					var ITM = [];
					var trajanjeAktivnosti = [];
					var pijancevanje = [];
					var datumi = [];
					$.ajax({
  					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
					    		var dolzina = 7;
					    		if(res.length < 7) {
					    			dolzina = res.length;
					    		}
						    	
						        for (var i = 0; i < dolzina; i++) {
						            
                          		var temp = res[i].time.split(/T/);
                          		datumi[7 - i - 1] = temp[0];
                          		ITM[7 - i - 1] = res[i].weight;
						        }
						        
						        
      								
					    	} else {
					    		$("#meritveRezultati").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
                    		nadaljuj = false;
					    	}
					    },
					    error: function() {
					    	$("#meritveRezultati").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
                  		nadaljuj = false;
					    }
					});
					if (nadaljuj) {
						$.ajax({
	  					    url: baseUrl + "/view/" + ehrId + "/" + "height",
						    type: 'GET',
						    headers: {"Ehr-Session": sessionId},
						    success: function (res) {
						    	if (res.length > 0) {
						    		var dolzina = 7;
						    		if(res.length < 7) {
						    			dolzina = res.length;
						    		}
							    	
							        for (var i = 0; i < dolzina; i++) {
							        var temp =   res[i].height;
							        temp = temp * temp;
							        temp = ITM[7 - i - 1]/temp;
	                          		ITM[7 - i - 1] = temp;
	                          		
							        }
							        
							        
	      								
						    	} else {
						    		$("#meritveRezultati").html(
	                    "<span class='obvestilo label label-warning fade-in'>" +
	                    "Ni podatkov!</span>");
	                    nadaljuj = false;
						    	}
						    },
						    error: function() {
						    	$("#meritveRezultati").html(
	                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
	                  JSON.parse(err.responseText).userMessage + "'!");
	                  nadaljuj = false;
						    }
						});
						
						if (nadaljuj) {
							$.ajax({
		  					    url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
							    type: 'GET',
							    headers: {"Ehr-Session": sessionId},
							    success: function (res) {
							    	if (res.length > 0) {
							    		var dolzina = 7;
							    		if(res.length < 7) {
							    			dolzina = res.length;
							    		}
							    		
							    		
								    	
								        for (var i = 0; i < dolzina; i++) {
								            
		                          		trajanjeAktivnosti[7 - i - 1] = res[i].systolic;
		                          		pijancevanje[7 - i - 1] = res[i].diastolic;
		                          		
								        }
								        
								        vlkGraf(ITM, datumi, trajanjeAktivnosti, pijancevanje);
								        /*google.charts.load('current', {'packages':['corechart']});
								        console.log("nalaganje chart");
									      google.charts.setOnLoadCallback(drawChart);
									      console.log("nalaganje chart2");
									      function drawChart() {
									        var data = google.visualization.arrayToDataTable([
									          ['Datum', 'Indeks Telesne Mase', 'Trajanje aktivnosti', 'Količina zaužite vode'],
									          [datumi[0],  ITM[0], trajanjeAktivnosti[0], pijancevanje[0]],
									          [datumi[1],  ITM[1], trajanjeAktivnosti[1], pijancevanje[1]],
									          [datumi[2],  ITM[2], trajanjeAktivnosti[2], pijancevanje[2]],
									          [datumi[3],  ITM[3], trajanjeAktivnosti[3], pijancevanje[3]],
									          [datumi[4],  ITM[4], trajanjeAktivnosti[4], pijancevanje[4]],
									          [datumi[5],  ITM[5], trajanjeAktivnosti[5], pijancevanje[5]],
									          [datumi[6],  ITM[6], trajanjeAktivnosti[6], pijancevanje[6]]
									        ]);
									
									        var options = {
									          title: 'Trajanje aktivnosti',
									          hAxis: {title: 'Datum',  titleTextStyle: {color: '#333'}},
									          vAxis: {minValue: 0}
									        };
									
									        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
									        chart.draw(data, options);
		      								}
		      								console.log("vse je nareto pametnjakovič");*/
		      								
							    	} else {
							    		$("#meritveRezultati").html(
		                    "<span class='obvestilo label label-warning fade-in'>" +
		                    "Ni podatkov!</span>");
		                    nadaljuj = false;
							    	}
							    },
							    error: function() {
							    	$("#meritveRezultati").html(
		                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
		                  JSON.parse(err.responseText).userMessage + "'!");
		                  nadaljuj = false;
						    }
						});
				
					}
				
					}	
				}
	    	},
	    	error: function(err) {
	    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
	}
	
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function aktivacija() {
	

  //prepripravljeni uporabniki
  
    $('#preberiPredlogoBolnika').change(function() {
        $("#kreirajSporocilo").html("");
        var podatki = $(this).val().split(",");
        $("#trenutnoIme").val(podatki[0]);
        $("#trenutniPriimek").val(podatki[1]);
        $("#datumRojstva").val(podatki[2]);
    });
  
    $('#preberiObstojeciEHR').change(function() {
		$("#preberiSporocilo").html("");
		var podatki = $(this).val().split(",");
		$("#preberiUporabnika").val(podatki[0]);
    });
    
    $('#preberiObstojeciVitalniZnak').change(function() {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("");
		var podatki = $(this).val().split("|");
		$("#dodajAktivnostEhrID").val(podatki[0]);
		$("#zabeleziUro").val(podatki[1]);
		$("#dodajVisina").val(podatki[2]);
		$("#dodajTeza").val(podatki[3]);
		$("#dodajMinAktivnosti").val(podatki[4]);
		$("#dodajVoda").val(podatki[5]);
	});
	
	$('#preberiEhrIdZaVitalneZnake').change(function() {
		$("#preberiMeritveVitalnihZnakovSporocilo").html("");
		$("#rezultatMeritveVitalnihZnakov").html("");
		$("#meritveVitalnihZnakovEHRid").val($(this).val());
	});
	
}

$(document).ready(function () {

	/*console.log("Klic se je zgodil");
  //prepripravljeni uporabniki
  
    $('#preberiPredlogoBolnika').change(function() {
        $("#kreirajSporocilo").html("");
        var podatki = $(this).val().split(",");
        $("#trenutnoIme").val(podatki[0]);
        $("#trenutniPriimek").val(podatki[1]);
        $("#datumRojstva").val(podatki[2]);
    });
  
    $('#preberiObstojeciEHR').change(function() {
    	console.log("Gremo not");
		$("#preberiSporocilo").html("");
		console.log("Končan prvi korak");
		var podatki = $(this).val().split(",");
		console.log("Splitano");
		$("#preberiUporabnika").val(podatki[0]);
		console.log("Izpisano");
    });
    
    $('#preberiObstojeciVitalniZnak').change(function() {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("");
		var podatki = $(this).val().split("|");
		$("#dodajAktivnostEhrID").val(podatki[0]);
		$("#zabeleziUro").val(podatki[1]);
		$("#dodajVisina").val(podatki[2]);
		$("#dodajTeza").val(podatki[3]);
		$("#dodajMinAktivnosti").val(podatki[4]);
		$("#dodajVoda").val(podatki[5]);
	});
	
	$('#preberiEhrIdZaVitalneZnake').change(function() {
		$("#preberiMeritveVitalnihZnakovSporocilo").html("");
		$("#rezultatMeritveVitalnihZnakov").html("");
		$("#meritveVitalnihZnakovEHRid").val($(this).val());
	});*/
	
	aktivacija();
  
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function alaremPomoc() {
	
	console.log("debeluh se meri");
	duckyGo();
	
	
}

function duckyGo() {
	
		var w = window.innerWidth;
		w = w/2 - 100;
	
		$("#zemljevid").html('<iframe width="'+w+'" height="'+w/4*3+'" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyC83FUj1XIsyHQh5QudwsPT0wUrtY9T8VA &q=fitness" allowfullscreen> </iframe>');
	
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function narisiGraf(rezultati, datumi) {
								if (prviZagon == 1) {
									google.charts.load('current', {'packages':['corechart']});
								}
						        console.log("nalaganje chart");
							      google.charts.setOnLoadCallback(drawChart);
							      function drawChart() {
							        var data = google.visualization.arrayToDataTable([
							          ['Datum', 'Teža'],
							          [datumi[0],  rezultati[0]],
							          [datumi[1],  rezultati[1]],
							          [datumi[2],  rezultati[2]],
							          [datumi[3],  rezultati[3]],
							          [datumi[4],  rezultati[4]],
							          [datumi[5],  rezultati[5]],
							          [datumi[6],  rezultati[6]]
							        ]);
							
							        var options = {
							          title: 'Teža',
							          hAxis: {title: 'Datum',  titleTextStyle: {color: '#333'}},
							          vAxis: {minValue: 0}
							        };
							
							        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
							        chart.draw(data, options);
      								}
      								console.log("vse je nareto pametnjakovič");
      								prviZagon = 0;
	
}

function vlkGraf(ITM, datumi, trajanjeAktivnosti, pijancevanje) {
									if (prviZagon == 1) {
										google.charts.load('current', {'packages':['corechart']});
									}
								        console.log("nalaganje chart");
									      google.charts.setOnLoadCallback(drawChart);
									      function drawChart() {
									        var data = google.visualization.arrayToDataTable([
									          ['Datum', 'Indeks Telesne Mase', 'Trajanje aktivnosti', 'Količina zaužite vode'],
									          [datumi[0],  ITM[0], trajanjeAktivnosti[0], pijancevanje[0]],
									          [datumi[1],  ITM[1], trajanjeAktivnosti[1], pijancevanje[1]],
									          [datumi[2],  ITM[2], trajanjeAktivnosti[2], pijancevanje[2]],
									          [datumi[3],  ITM[3], trajanjeAktivnosti[3], pijancevanje[3]],
									          [datumi[4],  ITM[4], trajanjeAktivnosti[4], pijancevanje[4]],
									          [datumi[5],  ITM[5], trajanjeAktivnosti[5], pijancevanje[5]],
									          [datumi[6],  ITM[6], trajanjeAktivnosti[6], pijancevanje[6]]
									        ]);
									
									        var options = {
									          title: 'Trajanje aktivnosti',
									          hAxis: {title: 'Datum',  titleTextStyle: {color: '#333'}},
									          vAxis: {minValue: 0}
									        };
									
									        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
									        chart.draw(data, options);
		      								}
		      								console.log("vse je nareto pametnjakovič");
		      								prviZagon = 0;
	
}

function izrisiPolje() {
		
		var w = window.innerWidth;
		w = w/2 - 100;
		$("#grafiti").html('<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script><div id="chart_div" style="width: '+w+'px; height: 500px;"></div>');

}

/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generirajPodatke() {
  console.log("začetek generiranja");
  for(var i = 0; i < 3; i++) {
  	ustvariOsebo(i);
  	
  }
	
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ustvariOsebo(stevilka) {
	var ehrIdentifikacija = "";
	sessionId = getSessionId();
	var ehrId = ""
	var ime = "Pacient_ime_z_številko_"+stevilka;
	var priimek = "Pacient_priimek_z_številko_"+stevilka;
	var datumRojstva = "19"+Math.floor((Math.random() * 100)) +"-"+Math.floor((Math.random() * 12)+1)+"-"+Math.floor((Math.random() * 28)+1)+"T"+Math.floor((Math.random() * 24))+":"+Math.floor((Math.random() * 60));
	
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        	ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            dateOfBirth: datumRojstva,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                    imena[stevilka] = ehrId;
		                    
							console.log("kreiran je bil pacient z EHR id = "+ehrId);
							if (stevilka == 2) {
								
								podatkovnica();
								
							}
		                }
		            },
		            error: function(err) {
		            	$("#kreirajSporocilo").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
		});
		
}
	///////////////////////////
function podatkovnica() {
	$("#izpisnik").html('<div class="col-lg-4 col-md-4 col-sm-4"><select class="form-control input-sm" id="preberiObstojeciEHR"><option value=""></option><option value="'+imena[0]+'">Uporabnik 1</option><option value="'+imena[1]+'">Uporabnik 2</option><option value="'+imena[2]+'">Uporabnik 3</option></select></div>');
	$("#podatkovnik").html('<div class="col-lg-4 col-md-4 col-sm-4"><select class="form-control input-sm" id="preberiObstojeciVitalniZnak"><option value=""></option><option value="'+imena[0]+'|2016-06-02T15:36Z|1.78|75|45|2.5">Uporabnik 1</option><option value="'+imena[1]+'|2016-06-01T17:16Z|1.63|69|111|4">Uporabnik 2</option><option value="'+imena[2]+'|2016-06-02T08:15Z|1.81|89|20|2">Uporabnik 3</option></select></div>');
	$("#grafik").html('<div class="col-lg-3 col-md-3 col-sm-3"><select class="form-control input-sm" id="preberiEhrIdZaVitalneZnake"><option value=""></option><option value="'+imena[0]+'">Uporabnik 1</option><option value="'+imena[1]+'">Uporabnik 2</option><option value="'+imena[2]+'">Uporabnik 3</option></select></div>');
	aktivacija();
	 
for (var pac = 0; pac < 3; pac++) {
	
	for (var i = 0; i < 7; i ++) {
	sessionId = getSessionId();
	var ehridus = imena[pac];
	var datumInUra = "2016" +"-07"+"-"+Math.floor((Math.random() * 28)+1)+"T"+Math.floor((Math.random() * 24))+":"+ (Math.floor((Math.random() * 60)))+"Z";
	console.log(datumInUra);
	var telesnaVisina = (1.70+(Math.random() * 0.21));
	console.log(telesnaVisina);
	var telesnaTeza = 60+Math.floor((Math.random() * 15));
	console.log(telesnaTeza);
	var trajanjeTelovadbe = 30+Math.floor((Math.random() * 91));//var sistolicniKrvniTlak = $("#dodajVitalnoKrvniTlakSistolicni").val();
	console.log(trajanjeTelovadbe);
	var zauzitaVoda = 1+(Math.floor((Math.random() * 5))/2);//var diastolicniKrvniTlak = $("#dodajVitalnoKrvniTlakDiastolicni").val();
	console.log(zauzitaVoda);
	var merilec = "uporabnik";
	console.log("uspeh vnosa");
	
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "ctx/time": datumInUra,
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		    "vital_signs/blood_pressure/any_event/systolic": trajanjeTelovadbe,
		    "vital_signs/blood_pressure/any_event/diastolic": zauzitaVoda,
		};
		var parametriZahteve = {
		    ehrId: ehridus,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		    committer: merilec
		};
		console.log("začetek zapisa");
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		        console.log(pac+" ima opravljeno "+i+" meritev");
		    },
		    error: function(err) {
		    	$("#dodajMeritveSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	
	}
	
}
	
}
	////////////////////////////
	//window.location.reload();
	
////////////////////////////



// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija

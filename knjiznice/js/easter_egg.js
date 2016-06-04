var start = 1;
var life = 100;
var nacrt = [["You can see 4 bodies of your fallen comrades. Trough window in the west you can see wast empty space with pool of green looking goo. You can see an exit that leads to west to stairs and another one that leads north","N",2,"O","","W",1,"O","",0,0],["You are now in the room with stairs. On the top of the stairs is a window. Trough it you can see bare landscape of Phobos. Only exit you can see leads to east","O","","E",0,"O","","O","",0,0],["You are in L shapped corridor filled with strange clonky noises. You can see remenants of your fallen commander holding to his trusty gun. Exits lead to east and south.","O","","E",3,"O","","S",0,0,0],["This room is some sort of controll room for this part of the base. you can see bodies of the last 2 marines from your unit. Consoles are making strange noises and you can smell something acid in the air. One exit leads to west and the other one is hidden behind a fake wall in on east side of room","O","","E",4,"W",2,"O","",3,0],["You find yourself in another L shapped room This one has exits on the east side and on the south side. Room itself has narrow path in the middle while toxic junk is flowing on each side of it.","O","","O","","W",3,"S",5,3,1],["You are in a short but wide room. You start to fell a bit tired, but you know, that you have to finish this or else, everybody will die. You can go north to room with toxic waste. Another exit leads south.","N",4,"O","","O","","S",6,0,1],["It is time for you to prepare for new battle. Forces of evil have just started their invasion.","","","","","","","","",0,0]];
var room = 0;



function actionTurn() {
    var ukaz = $("#preberiUporabnika").val();
    var zaporedje = ukaz.split(/\s/);
    
    
    if (zaporedje[0] == "!end") {
        
        $("#easterEgg").html('<button type="button" class="btn btn-primary btn-xs" onclick="preglejUporabnika()">Preberi osnovne podatke o bolniku</button><span id="preberiSporocilo"></span>');
        console.log("Thank you for playing");
        
    }
    
    else if (zaporedje[0] == "!start" && start == 1) {
        
        pomocnik();
        console.log("You find yourself in hangar. All around you you can see dead bodies of your comrades.\nIt looks like something tore them appart.\nYou can see window on the east side of room. Exits lead to north and west.");
        start = 0;
        
    }
    
    
    else if (zaporedje[0] == "!help") {
        
        pomocnik();
        
    }
    
    
    else if (zaporedje[0] == "!stats") {
        
        console.log("You have "+life+" life points.");
        
    }
    
    //////////////////////////premikanje///////////////////////////////////////
    else if (zaporedje[0] == "look" && start == 0) {
        
        preglej();
        
        
    }
    else if ((zaporedje[0] == "north"||zaporedje[0] == "N") && start == 0 && nacrt[room][9] == 0 && nacrt[room][10] == 0) {
        
        if (nacrt[room][1] == "N") {
            
            room = nacrt[room][2];
            console.log("You quickly move to northern exit\n");
            preglej();
            
        }
        else {
            
            console.log("You cannot go that way");
            
        }
        
    }
    else if ((zaporedje[0] == "east"||zaporedje[0] == "E") && start == 0 && nacrt[room][9] == 0 && nacrt[room][10] == 0) {
        
        if (nacrt[room][3] == "E") {
            
            room = nacrt[room][4];
            console.log("You quickly move to eastern exit\n");
            preglej();
            
        }
        else {
            
            console.log("You cannot go that way");
            
        }
        
    }
    else if ((zaporedje[0] == "west"||zaporedje[0] == "W") && start == 0 && nacrt[room][9] == 0 && nacrt[room][10] == 0) {
        
        if (nacrt[room][5] == "W") {
            
            room = nacrt[room][6];
            console.log("You quickly move to western exit\n");
            preglej();
            
        }
        else {
            
            console.log("You cannot go that way");
            
        }
        
    }
    else if ((zaporedje[0] == "south"||zaporedje[0] == "S") && start == 0 && nacrt[room][9] == 0 && nacrt[room][10] == 0) {
        
        if (nacrt[room][7] == "S") {
            
            room = nacrt[room][8];
            console.log("You quickly move to southern exit\n");
            preglej();
            
        }
        else {
            
            console.log("You cannot go that way");
            
        }
        
    }
    
    ///////////////////////////////////////streljanje//////////////////////////////////////////////////////
    else if (zaporedje[0] == "shoot") {
        var dmg1 = Math.floor((Math.random() * 5)+1);
        var dmg2 = Math.floor((Math.random() * 5)+1);
        dmg2 += 10;
        var dmg = dmg1 * nacrt[room][9] + dmg2 * nacrt[room][10];
        console.log("You have taken "+dmg+" points of damage.");
        life -= dmg
        if (zaporedje[1] == "zombie") {
            
            if (nacrt[room][9] > 0) {
                
                nacrt[room][9] --;
                console.log("You have killed a zombie marine");
                
            }
            
            else {
                
                console.log("Are you drunk? Because I'm preatty sure there are no zombie marines here.")
                
            }
            
        }
        
        else if (zaporedje[1] == "imp") {
            
            if (nacrt[room][10] > 0) {
                
                nacrt[room][10] --;
                console.log("You have killed an imp");
                
            }
            
            else {
                
                console.log("STOP. EATING. SHROOMS!!!")
                
            }
            
        }
        
        else {
            
            console.log("You are a doom guy, but seriously....you cannot shoot that...")
            
        }
        
    }
    else {
        
        console.log("You cannot do that.")
        
    }
    
    if (life <= 0) {
        
        console.log("You have died!!!");
        winText();
        
    }
    if (room == 6) {
        
        winText();
        
    }
    
    document.querySelector('#preberiUporabnika').value = "";
    
}

function preglej() {
    
    console.log(nacrt[room][0]);
        if (nacrt[room][9] > 0) {
            
            console.log("You can also see "+nacrt[room][9]+" zombie marines in the room.");
            
        }
        if (nacrt[room][10] > 0) {
            
            console.log("You can also see "+nacrt[room][10]+" imps in the room.");
            
        }
    
}

function winText() {
    
    console.log('--------CONGRATULATIONS!!!--------\n You have just ended E1L1 from original DOOM.\nI hope you enjoyed thie "little" easter egg\nThanks for playing and sticking with bad narative.\n Eragon peerGynt\n\n\nAll credits for game idea and design go to owner of this game ID software and Bethesda.');
    $("#easterEgg").html('<button type="button" class="btn btn-primary btn-xs" onclick="preglejUporabnika()">Preberi osnovne podatke o bolniku</button><span id="preberiSporocilo"></span>');
    
}

function pomocnik() {
    
    console.log("!help  pomoč za ukaze\n!stats  izpis življenskih točk\nshoot <zombie/imp> ustreli izbranega sovražnika\nN    premakni se na sever\nnorth    premakni se na sever\nE    premakni se na vzhod\neast    premakni se na vzhod\nW    premakni se na zahod\nwest    premakni se na zahod\nS    premakni se na jug\nsouth    premakni se na jug");
    
}
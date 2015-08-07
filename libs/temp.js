var exec = require('child_process').exec;
var fs = require('fs');
var librepod = require('librepod');

var dirname = '/sys/bus/w1/devices/'

exports.event = function(o,callback){
    if(o.interval == undefined) return
    
    var id = {};
    
    Object.keys(o,function(key){
        if(key === "interval") return;
        
        id[o[key]] = key;
    });

    var config = librepod.config.list("temp");

    if(typeof config === "object"){
    	Object.keys(config,function(key){
		id[config[key]] = key;
    	});
    }
    
    exec("sudo modprobe w1-gpio",function(){
        exec("sudo modprobe w1-therm",function(){
            setInterval(function(){
                fs.readdir(dirname, function(err, subdir) {
                    if (err) throw err;
		    Object.keys(subdir).forEach(function(k){
                    	if(subdir[k].substring(0,2) != "28") return; 
                    	readTemp(id,subdir[k],callback);
		    });
                });
		
            },parseInt(o.interval));
               	            
        });
    });
    
    
}

function readTemp(id, sub, callback){
    fs.readFile(dirname+sub+'/w1_slave','utf-8',function(err,html){
        if (err) return;
        var temp =  parseFloat(html.toString().split("t=")[1])/1000.0;
        var header = sub.substring(3);
        
        if(id[header] == undefined){
            callback({header:header,temp:temp});
        }else{
            callback({header:id[header],temp:temp});
        }
    });
}

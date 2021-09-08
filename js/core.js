
var codesScanned = [];
var scanner;
var cameras;
var activeCode = false;


function giv (id) {
    return document.getElementById(id).value
}
function sih (id, html) {
    document.getElementById(id).innerText = html;
}
function hide(id) {
    document.getElementById(id).style.display = "none"
}
function show(id) {
    document.getElementById(id).style.display = "block"

}
function readDataFile(cb) { 
    fs.readFile('data.json', function (err, data) {
        if (err) { alert(err); return console.error(err) };
        var data = JSON.parse(data.toString());
        if (data) {
            cb(data)
        } else {
            cb(false)
        }
    });
}
function writeDataFile(data) {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) { alert(err); return console.error(err) };
    })
    sih("idDisplay","");
    sih("InDataDisplay","");
    sih("notes","");
    sih("rawDisplay","");
}

function setUserBoxDisplay(content) {
    console.log("RAW", content)
    if (content) {
        sih("idDisplay", content);
        activeCode = content;
        readDataFile(data => {
            if (data[activeCode]) {
                sih("rawDisplay", JSON.stringify(data[activeCode], null, 2))
                sih("notes", data[activeCode].notes)
                sih("InDataDisplay", `Status: ${data[activeCode].status} `);
            } else {
                sih("rawDisplay", "")
                sih("InDataDisplay", "NO");
                show("box-add");
            }
        })
    }
}

function newCodeAdd() {
    readDataFile(data => {
        data[activeCode] = {"status": giv('newCodeStatus'), "notes": giv('newCodeNotes'), createDate: Date.now() }
        writeDataFile(data);
        sih("InDataDisplay", "ADDED");
        hide("box-add")
    })
}

function markOut() {
    readDataFile(data => {
        if (data[activeCode]) {
            data[activeCode].status = "Out";
            data[activeCode].updateDate = Date.now();
        } else {
            data[activeCode] = {status: "Out", notes: "", createDate: Date.now() };
            hide("box-add")
        };
        writeDataFile(data);
    })
}

function markIn() {
    readDataFile(data => {
        if (data[activeCode]) {
            data[activeCode].status = "In";
            data[activeCode].updateDate = Date.now();
        } else {
            data[activeCode] = {"status": "In", "notes": "", createDate: Date.now() };
            hide("box-add")
        };
        writeDataFile(data);
    })
}


function liveScan() {

    navigator.mediaDevices.getUserMedia({ video: true })

    scanner = new Instascan.Scanner({ video: document.getElementById('VideoPreview') });

    scanner.addListener('scan', function (content) {
        setUserBoxDisplay(content);
    });
    Instascan.Camera.getCameras().then(function (cams) {
        cameras = cams;
        console.log(cameras)
        if (cameras.length > 0) {
            cameras.forEach((cam, i) => {
                console.log(cam)
                var option = document.createElement('option');
                option.value = i;
                option.text = cam.name;
                
                document.querySelector('select#videoSource').appendChild(option);
            })
        } else {
            console.error('Oh no, cameras found. Make sure you allow this site to use your camera');
        }
    }).catch(function (e) {
        console.error(e);
    });
}

document.getElementById("videoSource").addEventListener("change", () => {
    scanner.start(cameras[document.getElementById("videoSource").value]);
})



function startScan() {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        liveScan();
        hide("StartBtn")
    } else {
        alert("mediaDevices Not Available")
    }
}


fs.readFile('data.json', function (err, data) {
    if (err) { alert(err); return console.error(err); }
    var data = JSON.parse(data.toString());
    if (data) {
        console.log(data)
    }
});





  (function () {
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == 'object') {
                logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
            } else {
                logger.innerHTML += arguments[i] + '<br />';
            }
        }
    }
})();
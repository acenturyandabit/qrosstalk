var qrc;
$(() => {
    var scanner = new Instascan.Scanner({
        video: $("video")[0]
    });
    scanner.addListener('scan', function (content) {
        console.log(content);
        qrosstalk.update(content);
        $("#dataOut")[0].value = qrosstalk.msg;
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
    qrc = new QRCode(document.getElementById("transmit"), {
        text: "#hello#",
        width: window.innerHeight / 2,
        height: window.innerHeight / 2
    });
    //qrc.clear();
    setInterval(tx, 200);
})

function decode(s) {
    return s;
}

function _qrosstalk() {
    this.tpos = 0;
    this.toSend = `hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.hello this is a really really long test message! repeats a number of times too.`;
    this.msg = "";
    this.Rcv = 0;
    this.update = function (msg) {
        bits = msg.split("#");
        console.log(bits);
        j = bits.splice(3, bits.length);
        j = j.join("#");
        this.tpos = Number(bits[0]);
        if (Number(bits[1]) > this.Rcv) {
            //wait a bit. we lost the connection :/
        } else{
            this.msg = this.msg.slice(0, Number(bits[1]));
            this.msg += j;
            this.Rcv = Number(bits[1]) + j.length;
        }
        if (this.tpos == this.toSend.length && this.Rcv == Number(bits[2])) {
            $("textarea")[0].style.background = "green";
            return 1;
        }
        return 0;
    }
};
var qrosstalk = new _qrosstalk();

function tx() {
    qrc.clear();
    let msg = "";
    msg += qrosstalk.Rcv + "#";
    msg += qrosstalk.tpos + "#";
    msg += qrosstalk.toSend.length + "#";
    msg += qrosstalk.toSend.slice(qrosstalk.tpos, qrosstalk.tpos + 100);
    qrc.makeCode(msg);
}
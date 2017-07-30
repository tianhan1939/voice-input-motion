
// 兼容
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia;

var Recorder = function (stream) {
    // 创建一个音频环境对象
    AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = new AudioContext();

    // 设置缓存
    let buffer = [];

    // 将声音流绑定到这个对象
    let audioInput = audioCtx.createMediaStreamSource(stream);

    // 创建缓存节点
    let recorder = audioCtx.createScriptProcessor();

    // 开始录音
    this.start = function () {
        audioInput.connect(recorder);
        recorder.connect(audioCtx.destination);
    }

    // 保存rms
    this.rms = 0;

    // 结束录音
    this.stop = function () {
        recorder.disconnect();
    }

    this.play = function (audio) {
        audio.src = window.URL.createObjectURL();
    }

    this.drawOscillograph = function (domId) {
        let Omega = Math.PI / 50;
        let Phi = 0;

        // 开始绘制曲线
        var canvas = document.getElementById(domId);
        canvas.height = 400;
        canvas.width = 800;

        var ctx = canvas.getContext('2d');

        function calcAtten(x) {
            let rx = Math.abs(x - canvas.width / 2);
            return 1 / (1 + Math.pow(rx / 100, 2));
        }

        let loop = () => {
            Phi += .1;
            // 删除上一个波形
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.strokeStyle = '#02c3f4'; // 线色
            for (let i = 0; i < canvas.width; i++) {
                let x = i;
                let y = this.rms * calcAtten(x) * canvas.height / 2 * Math.sin(i * Omega / 2 + Phi) + canvas.height / 2;
                ctx.lineTo(x, y);
            }
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = '#FE3824';
            for (let i = 0; i < canvas.width; i++) {
                let x = i;
                let y = this.rms * calcAtten(x) * canvas.height * Math.sin(i * Omega + Phi) + canvas.height / 2;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            Phi = Phi > 360 ? 0 : Phi;
            requestAnimationFrame(loop);
        }
        loop();
    }

    recorder.onaudioprocess = (e) => {
        let data = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < data.length; i++){
            sum += Math.pow(data[i], 2);
        }
        this.rms = Math.sqrt(sum / data.length);
        // buffer.push(new Float32Array(data));
    }
}

Recorder.get = function (cb) {
    if (cb) {
        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                { audio: true }
                , function (stream) {
                    let recorder = new Recorder(stream);
                    cb(recorder);
                }
                , function (error) {

                }
            )
        }
    }
}

module.exports = Recorder;

<template>
    <div class="hello">
        <video ref="testVideo" id='test-video'></video>
        <button @click="startRecord">开始录音</button>
        <button @click="endRecord">结束录音</button>
        <button @click="playRecord">播放录音</button>
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
    import Recorder from './recorder';
    export default {
        mounted: function() {

        },
        data: function() {
            return {
                recorder: null,
            }
        },
        methods: {
            startRecord: function() {
                Recorder.get((rec) => {
                    this.recorder = rec;
                    this.recorder.start();
                    this.recorder.drawOscillograph('canvas');
                });
                // Recorder.drawOscillograph('canvas');
            },
            endRecord: function() {
                this.recorder &&
                    this.recorder.stop();
            },
            playRecord: function() {
                console.log("播放录音");
            }
        }
    }
</script>
